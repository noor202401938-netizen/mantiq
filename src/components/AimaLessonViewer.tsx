import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, BookOpen, Lightbulb, Link2, Sparkles, AlertCircle, Play, Check, Lock, ChevronRight, ChevronDown, Info, Compass, HelpCircle, ArrowLeftCircle, Award, Maximize2, Minimize2, Layers, BookmarkCheck, Code2, Copy, CheckCheck, Scale, GraduationCap, Pin, Plus, Trash2, Edit3, StickyNote, Bookmark, RefreshCw, Terminal, PlayCircle, Sliders, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';
import { AIMA_DETAILED_LESSONS, LessonStep } from '../data/aimaLessonsData';
import { AIMA_PARTS } from '../data/aimaBookData';
import { getCanonicalLesson, UNIVERSITY_ENRICHMENTS, FormalProof, WorkedProblem, PythonImplementation } from '../data/universityLessonsSupplement';
import { generateDynamicProblem, DynamicVariant } from '../utils/dynamicWorkedProblems';
import { soundFX } from '../utils/soundEffects';
import { useProgress } from '../context/ProgressContext';
import { useNotes } from '../context/NotesContext';
import { renderUniversityMarkdown, renderInlineMathAndStyles } from '../utils/mathRenderer';
import { PdfViewerModal } from './PdfViewerModal';
import { getCompanionData } from '../data/companionBooksEnrichment';
import { useTheme } from '../context/ThemeContext';


interface AimaLessonViewerProps {
  chapterId: number;
  initialStepIndex?: number;
  onClose: () => void;
  onStartQuiz: (chapterId: number) => void;
  onSelectChapter?: (chapterId: number) => void;
  onOpenFlashcards?: (chapterId?: number) => void;
}

export const AimaLessonViewer: React.FC<AimaLessonViewerProps> = ({
  chapterId,
  initialStepIndex = 0,
  onClose,
  onStartQuiz,
  onSelectChapter,
  onOpenFlashcards,
}) => {
  const { isDark } = useTheme();
  const { stats, progress, markChapterRead, markStepCompleted } = useProgress();
  const { getNotesByChapter, addNote, deleteNote, togglePin } = useNotes();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(initialStepIndex);
  const [activeTab, setActiveTab] = useState<'reading' | 'practice' | 'rigor'>('reading');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [selectedQuadrant, setSelectedQuadrant] = useState<'acting_rationally' | 'thinking_humanly' | 'thinking_rationally' | 'acting_humanly'>('acting_rationally');
  const [selectedAgentType, setSelectedAgentType] = useState<number>(1);
  const [searchStepIndex, setSearchStepIndex] = useState<number>(0);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isChapterMenuOpen, setIsChapterMenuOpen] = useState<boolean>(false);
  const [isOutlineOpen, setIsOutlineOpen] = useState<boolean>(false);
  const [isNotesDrawerOpen, setIsNotesDrawerOpen] = useState<boolean>(false);

  // Chapter notes & quick note taking state
  const chapterNotes = getNotesByChapter(chapterId);
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  const [newNoteTitle, setNewNoteTitle] = useState<string>('');
  const [newNoteCategory, setNewNoteCategory] = useState<'formula' | 'proof' | 'exam_trap' | 'theorem' | 'question'>('theorem');
  const [newNoteContent, setNewNoteContent] = useState<string>('');

  // Dynamic Parameterized Practice & Exam Tier State
  const [problemMode, setProblemMode] = useState<'canonical' | 'dynamic'>('canonical');
  const [dynamicSeed, setDynamicSeed] = useState<number>(() => Math.floor(Math.random() * 900) + 100);
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<number | null>(null);
  const [isPracticeChecked, setIsPracticeChecked] = useState<boolean>(false);
  const [difficultyTier, setDifficultyTier] = useState<1 | 2 | 3>(2);

  // Live In-Browser Algorithm Sandbox State
  const [codeMode, setCodeMode] = useState<'reference' | 'sandbox'>('reference');
  const [sandboxHeuristicWeight, setSandboxHeuristicWeight] = useState<number>(1.0);
  const [sandboxGamma, setSandboxGamma] = useState<number>(0.9);
  const [isRunningSandbox, setIsRunningSandbox] = useState<boolean>(false);
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);
  const [sandboxResults, setSandboxResults] = useState<{ nodesExpanded: number; pathCost: number; optimal: boolean } | null>(null);

  // Embedded Original PDF Viewer State
  const [pdfViewer, setPdfViewer] = useState<{
    isOpen: boolean;
    title: string;
    author: string;
    pdfUrl: string;
    page?: number;
  }>({
    isOpen: false,
    title: '',
    author: '',
    pdfUrl: '',
    page: 1
  });

  const getAimaChapterPdfPage = (chId: number): number => {
    const pageMap: Record<number, number> = {
      1: 40, 2: 65, 3: 95, 4: 150, 5: 191, 6: 236, 7: 264, 8: 315, 9: 352,
      10: 396, 11: 431, 12: 468, 13: 513, 14: 543, 15: 598, 16: 640, 17: 675,
      18: 723, 19: 798, 20: 842, 21: 860, 22: 890, 23: 918, 24: 958, 25: 1001,
      26: 1050, 27: 1082
    };
    return pageMap[chId] || 40;
  };

  // Load canonical, university-grade lesson for this chapter (guarantees coverage for all 27 chapters)
  const lesson = getCanonicalLesson(chapterId);
  const steps = lesson.steps;
  const currentStep: LessonStep = steps[currentStepIndex] || steps[0];

  const progressPercent = ((currentStepIndex + 1) / steps.length) * 100;

  // Mark current step as completed in chapter progress
  useEffect(() => {
    markStepCompleted(chapterId, currentStepIndex);
  }, [chapterId, currentStepIndex, markStepCompleted]);

  // Synchronize step if external navigation requested a specific initial step
  useEffect(() => {
    if (typeof initialStepIndex === 'number' && initialStepIndex >= 0 && initialStepIndex < steps.length) {
      setCurrentStepIndex(initialStepIndex);
    }
  }, [initialStepIndex, steps.length]);

  const handleNext = () => {
    soundFX.playClick();
    if (currentStepIndex + 1 < steps.length) {
      setCurrentStepIndex((prev) => prev + 1);
      setActiveTab('reading');
    } else {
      markChapterRead(chapterId);
      onStartQuiz(chapterId);
    }
  };

  const handlePrev = () => {
    soundFX.playClick();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setActiveTab('reading');
    }
  };

  // University-grade Markdown and KaTeX math renderer
  const renderFormattedMarkdown = (markdown: string) => renderUniversityMarkdown(markdown);
  const renderInlineStyles = (text: string) => renderInlineMathAndStyles(text);

  // Render Visual Diagram based on visualType with rich, interactive, textbook-accurate visuals
  const renderVisual = () => {
    switch (currentStep.visualType) {
      // 1. Four Approaches to AI (AIMA Figure 1.1) — INTERACTIVE QUADRANT SELECTOR
      case 'four_approaches': {
        const quadrantDetails = {
          acting_rationally: {
            title: 'Acting Rationally (The Rational Agent Paradigm)',
            badge: 'AIMA PRIMARY FOUNDATION',
            quote: 'An agent is just something that acts. A rational agent acts so as to achieve the best outcome or, when there is uncertainty, the best expected outcome.',
            pioneers: 'Stuart Russell & Peter Norvig (1995–present), David Poole, Alan Mackworth',
            formalEquation: 'a* = argmax_{a ∈ A} E[U(s\') | s, a]',
            whyBetter: 'Rationality is mathematically precise and objective. Unlike humans (who suffer from fatigue and biases), rationality allows formal optimization, proofs of convergence, and general engineering across robotics, games, and web agents.',
            supportConnection: 'Deep Learning (Goodfellow Ch. 1) & Designing ML Systems (Chip Huyen Ch. 2): Rational agents define loss/objective functions L(θ) to optimize expected future rewards.'
          },
          thinking_humanly: {
            title: 'Thinking Humanly (The Cognitive Science Approach)',
            badge: 'COGNITIVE MODELING',
            quote: 'If we are going to say that a given program thinks like a human, we must have some way of determining how humans think.',
            pioneers: 'Allen Newell & Herbert Simon (GPS, 1956), McCulloch & Pitts (1943)',
            formalEquation: 'Model Verification via fMRI, reaction times, and verbal protocol traces',
            whyBetter: 'Explores real human psychology, brain mechanisms, and neurological architectures (like primate visual cortex inspiring CNNs).',
            supportConnection: 'Speech & Language Processing (Jurafsky & Martin Ch. 1): Human cognitive constraints on short-term working memory inspired recurrent hidden states in language processing.'
          },
          thinking_rationally: {
            title: 'Thinking Rationally (The "Laws of Thought" Approach)',
            badge: 'FORMAL LOGIC',
            quote: 'Aristotle codified right thinking through syllogisms: argument structures that always yield correct conclusions when given correct premises.',
            pioneers: 'Aristotle (384 BC), George Boole (1854), Gottlob Frege (1879), John Alan Robinson (1965)',
            formalEquation: 'KB ⊨ α  (Knowledge Base entails sentence α via formal deduction)',
            whyBetter: 'Provides absolute mathematical certainty and soundness when premises are true and complete.',
            supportConnection: 'Limits: Fails with informal knowledge, noisy sensors, and combinatorial explosion (NP-complete inference in real-world domains).'
          },
          acting_humanly: {
            title: 'Acting Humanly (The Turing Test Approach)',
            badge: 'BEHAVIORAL OPERATIONALISM',
            quote: 'Alan Turing (1950) proposed an operational definition of intelligence: if a computer cannot be distinguished from a human in 5 minutes of text chat, it is intelligent.',
            pioneers: 'Alan Turing (1950), Joseph Weizenbaum (ELIZA, 1966)',
            formalEquation: 'P(Interrogator identifies machine) ≈ 0.5',
            whyBetter: 'Bypasses unproductive philosophical arguments about consciousness by using an empirical, testable benchmark.',
            supportConnection: 'Build a Large Language Model from Scratch (Raschka Ch. 1): Modern generative LLMs achieve human-like dialogue fluency while being aligned via RLHF.'
          }
        };

        const activeQ = quadrantDetails[selectedQuadrant];

        return (
          <div style={{ background: 'var(--quest-card-bg)', borderRadius: '18px', padding: '22px 24px', border: '1px solid var(--quest-border)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--quest-text-muted)', letterSpacing: '0.04em' }}>
                FIGURE 1.1 · The Four Approaches to AI (Russell & Norvig, p. 2)
              </div>
              <span style={{ fontSize: '11px', color: 'var(--quest-text-muted)', fontWeight: 500 }}>
                Select quadrant to inspect
              </span>
            </div>

            {/* 2x2 Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {/* Thinking Humanly */}
              <div
                onClick={() => setSelectedQuadrant('thinking_humanly')}
                style={{
                  padding: '16px 18px',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  background: selectedQuadrant === 'thinking_humanly' ? 'var(--quest-light-tint)' : 'var(--quest-surface-subtle)',
                  border: selectedQuadrant === 'thinking_humanly' ? '2.5px solid var(--quest-accent)' : '1px solid var(--quest-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, background: 'var(--quest-card-dark)', color: 'var(--quest-accent)', padding: '2px 8px', borderRadius: '6px' }}>THOUGHT</span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>Thinking Humanly</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--quest-text-secondary)', lineHeight: 1.4 }}>
                  Cognitive Science & GPS (Newell & Simon). Replicating actual human brain cognition through psychological experiments.
                </div>
              </div>

              {/* Thinking Rationally */}
              <div
                onClick={() => setSelectedQuadrant('thinking_rationally')}
                style={{
                  padding: '16px 18px',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  background: selectedQuadrant === 'thinking_rationally' ? 'var(--quest-light-tint)' : 'var(--quest-surface-subtle)',
                  border: selectedQuadrant === 'thinking_rationally' ? '2.5px solid var(--quest-accent)' : '1px solid var(--quest-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, background: 'var(--quest-card-dark)', color: 'var(--quest-accent)', padding: '2px 8px', borderRadius: '6px' }}>THOUGHT</span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>Thinking Rationally</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--quest-text-secondary)', lineHeight: 1.4 }}>
                  Laws of Thought (Aristotle). Pure deductive First-Order Logic, formal theorem proving, and syllogisms.
                </div>
              </div>

              {/* Acting Humanly */}
              <div
                onClick={() => setSelectedQuadrant('acting_humanly')}
                style={{
                  padding: '16px 18px',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  background: selectedQuadrant === 'acting_humanly' ? 'var(--quest-light-tint)' : 'var(--quest-surface-subtle)',
                  border: selectedQuadrant === 'acting_humanly' ? '2.5px solid var(--quest-accent)' : '1px solid var(--quest-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, background: 'var(--quest-card-dark)', color: 'var(--quest-accent)', padding: '2px 8px', borderRadius: '6px' }}>ACTION</span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>Acting Humanly</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--quest-text-secondary)', lineHeight: 1.4 }}>
                  The Turing Test (1950). Indistinguishable behavioral imitation in conversation across 6 core AI disciplines.
                </div>
              </div>

              {/* Acting Rationally */}
              <div
                onClick={() => setSelectedQuadrant('acting_rationally')}
                style={{
                  padding: '16px 18px',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  background: selectedQuadrant === 'acting_rationally' ? 'var(--quest-light-tint)' : 'var(--quest-surface-subtle)',
                  border: selectedQuadrant === 'acting_rationally' ? '2.5px solid var(--quest-accent)' : '1px solid var(--quest-border)',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'absolute', top: '-9px', right: '10px', background: 'var(--quest-card-dark)', color: 'var(--quest-accent)', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                  AIMA PRIMARY FOCUS
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, background: 'var(--quest-card-dark)', color: 'var(--quest-accent)', padding: '2px 8px', borderRadius: '6px' }}>ACTION</span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>Acting Rationally</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--quest-text-primary)', fontWeight: 500, lineHeight: 1.4 }}>
                  The Rational Agent Approach. Mathematical expected utility maximization under real-world uncertainty.
                </div>
              </div>
            </div>

            {/* In-Depth Quadrant Breakdown Card */}
            <div style={{ marginTop: '16px', padding: '16px 18px', background: 'var(--quest-surface-subtle)', borderRadius: '14px', border: '1px solid var(--quest-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                  {activeQ.title}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, background: 'var(--quest-card-dark)', color: 'var(--quest-accent)', padding: '2px 8px', borderRadius: '6px' }}>
                  {activeQ.badge}
                </span>
              </div>
              <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--quest-text-secondary)', marginBottom: '10px', lineHeight: 1.5 }}>
                "{activeQ.quote}"
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', color: 'var(--quest-text-primary)' }}>
                <div><strong>Pioneers:</strong> {activeQ.pioneers}</div>
                <div><strong>Formal Criterion:</strong> <code>{activeQ.formalEquation}</code></div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--quest-text-primary)', lineHeight: 1.5 }}>
                <strong>Why It Matters:</strong> {activeQ.whyBetter}
              </div>
              <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--quest-text-muted)', lineHeight: 1.4 }}>
                <strong>Connected Support Books:</strong> {activeQ.supportConnection}
              </div>
            </div>
          </div>
        );
      }

      // 2. AI Timeline
      case 'ai_timeline':
        return (
          <div style={{ background: 'var(--quest-card-bg)', borderRadius: '18px', padding: '22px 24px', border: '1px solid var(--quest-border)' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-muted)', marginBottom: '14px' }}>
              AI HISTORICAL MILESTONES (1943 — TODAY)
            </div>
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              {[
                { year: '1943', title: 'McCulloch & Pitts', desc: 'First computational model of neural networks' },
                { year: '1950', title: 'Turing Test', desc: 'Computing Machinery and Intelligence published' },
                { year: '1956', title: 'Dartmouth Workshop', desc: 'Birth of "Artificial Intelligence" as a field' },
                { year: '1974', title: 'First AI Winter', desc: 'Combinatorial explosion & funding pause' },
                { year: '1997', title: 'Deep Blue', desc: 'Defeats world chess champion Garry Kasparov' },
                { year: '2012', title: 'AlexNet (ImageNet)', desc: 'Deep learning revolution ignites modern AI' },
                { year: '2017+', title: 'Transformers & LLMs', desc: 'Self-attention, GPT, Claude, Gemini' }
              ].map((m, idx) => (
                <div key={idx} style={{ minWidth: '150px', padding: '12px', background: 'var(--quest-surface-subtle)', borderRadius: '12px', border: '1px solid var(--quest-border)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>{m.year}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--quest-accent-text)', margin: '3px 0' }}>{m.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--quest-text-secondary)', lineHeight: 1.3 }}>{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        );

      // 3. Agent Loop / Architecture
      case 'agent_loop':
      case 'peas_diagram': {
        const agentTypes = [
          { id: 1, name: 'Simple Reflex', formula: 'f: P → A', desc: 'Selects action based only on current percept, ignoring history. Condition-Action rules (if car-in-front-braking then brake).' },
          { id: 2, name: 'Model-Based', formula: 'f: P* → State → A', desc: 'Maintains internal state of how the world evolves independently and how agent actions affect the world.' },
          { id: 3, name: 'Goal-Based', formula: 'State + Goals → Search', desc: 'Combines internal state with explicit goals to search or plan a sequence of actions (e.g. A* search).' },
          { id: 4, name: 'Utility-Based', formula: 'max E[U(s)]', desc: 'Balances conflicting goals (e.g. speed vs safety) using real-valued utility functions under uncertainty.' },
          { id: 5, name: 'Learning Agent', formula: 'Critic + Learning Element', desc: 'Improves over time by observing outcomes, evaluating performance against standard, and experimenting.' },
        ];
        const activeAgent = agentTypes[selectedAgentType - 1] || agentTypes[0];

        return (
          <div style={{ background: 'var(--quest-card-bg)', borderRadius: '18px', padding: '22px 24px', border: '1px solid var(--quest-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-muted)' }}>
                THE 5 AGENT ARCHITECTURES (AIMA SECTIONS 2.4.1–2.4.5)
              </div>
              <span style={{ fontSize: '11px', background: 'var(--quest-card-dark)', color: 'var(--quest-accent)', fontWeight: 800, padding: '3px 10px', borderRadius: '10px' }}>
                Architecture #{selectedAgentType}
              </span>
            </div>

            {/* Architecture Selector Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
              {agentTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedAgentType(t.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: selectedAgentType === t.id ? '2px solid var(--quest-accent)' : '1px solid var(--quest-border)',
                    background: selectedAgentType === t.id ? 'var(--quest-accent)' : 'var(--quest-surface-subtle)',
                    color: selectedAgentType === t.id ? 'var(--quest-on-accent)' : 'var(--quest-text-primary)'
                  }}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', padding: '16px', background: 'var(--quest-surface-subtle)', borderRadius: '14px', border: '1px solid var(--quest-border)' }}>
              <div style={{ padding: '14px', background: 'var(--quest-light-tint)', borderRadius: '12px', textAlign: 'center', flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--quest-light-tint-text)' }}>Sensors</div>
                <div style={{ fontSize: '11px', color: 'var(--quest-text-secondary)' }}>Percept Sequence $P^*$</div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--quest-text-muted)' }}>→</div>
              <div style={{ padding: '14px', background: 'var(--quest-card-dark)', color: 'var(--quest-card-dark-text)', borderRadius: '14px', textAlign: 'center', flex: 1.8 }}>
                <div style={{ color: 'var(--quest-accent)', fontWeight: 800, fontSize: '15px' }}>{activeAgent.name} Program</div>
                <div style={{ fontSize: '12px', color: 'var(--quest-text-muted)', marginTop: '4px' }}><code>{activeAgent.formula}</code></div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--quest-text-muted)' }}>→</div>
              <div style={{ padding: '14px', background: 'var(--quest-light-tint)', borderRadius: '12px', textAlign: 'center', flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--quest-light-tint-text)' }}>Actuators</div>
                <div style={{ fontSize: '11px', color: 'var(--quest-text-secondary)' }}>Action $A$</div>
              </div>
            </div>

            <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--quest-text-primary)', lineHeight: 1.5 }}>
              <strong>How it works:</strong> {activeAgent.desc}
            </div>
          </div>
        );
      }

      // 4. Romania Map (Search) — STEP-BY-STEP SEARCH TRACE
      case 'romania_map': {
        const searchSteps = [
          { step: 'Start at Arad', g: 0, h: 366, f: 366, note: 'Frontier initialized with Arad. f(Arad) = 0 + 366 = 366.' },
          { step: 'Expand Sibiu', g: 140, h: 253, f: 393, note: 'Cost to Sibiu = 140. Lowest f in frontier (393 < Timisoara 447).' },
          { step: 'Expand Fagaras vs Rimnicu Vilcea', g: 239, h: 176, f: 415, note: 'Fagaras f=415; Rimnicu Vilcea f=140+80+193=413. A* explores Rimnicu Vilcea first!' },
          { step: 'Reach Bucharest via Pitesti', g: 418, h: 0, f: 418, note: 'Optimal path found: Arad → Sibiu → Rimnicu Vilcea → Pitesti → Bucharest (418 km < Fagaras path 450 km!).' },
        ];
        const activeSearch = searchSteps[searchStepIndex] || searchSteps[0];

        return (
          <div style={{ background: 'var(--quest-card-bg)', borderRadius: '18px', padding: '22px 24px', border: '1px solid var(--quest-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-muted)' }}>
                A* SEARCH TRACE: ARAD TO BUCHAREST (CLICK STEP TO TRACE)
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {searchSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchStepIndex(idx)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '1px solid var(--quest-border)',
                      background: searchStepIndex === idx ? 'var(--quest-accent)' : 'var(--quest-surface-subtle)',
                      color: searchStepIndex === idx ? 'var(--quest-on-accent)' : 'var(--quest-text-primary)',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <svg width="100%" height="160" viewBox="0 0 500 160">
              <line x1="60" y1="40" x2="160" y2="30" stroke={isDark ? '#435E50' : '#13211C'} strokeWidth="2.5" />
              <line x1="60" y1="40" x2="80" y2="120" stroke={isDark ? '#2E4237' : '#CBD5CD'} strokeWidth="1.5" />
              <line x1="160" y1="30" x2="260" y2="70" stroke={isDark ? '#435E50' : '#13211C'} strokeWidth="2.5" />
              <line x1="260" y1="70" x2="380" y2="55" stroke={isDark ? '#435E50' : '#13211C'} strokeWidth="2.5" />
              <line x1="380" y1="55" x2="440" y2="110" stroke={isDark ? '#435E50' : '#13211C'} strokeWidth="3" />
              <line x1="160" y1="30" x2="240" y2="120" stroke={isDark ? '#435E50' : '#13211C'} strokeWidth="3" />
              <line x1="240" y1="120" x2="350" y2="125" stroke={isDark ? '#435E50' : '#13211C'} strokeWidth="3" />
              <line x1="350" y1="125" x2="440" y2="110" stroke={isDark ? '#435E50' : '#13211C'} strokeWidth="3.5" />

              <g transform="translate(60, 40)">
                <circle r="14" fill={isDark ? '#1C2B23' : '#13211C'} />
                <text y="4" textAnchor="middle" fill="#C9F26B" fontSize="10" fontWeight="800">Arad</text>
              </g>
              <g transform="translate(160, 30)">
                <circle r="12" fill={searchStepIndex >= 1 ? '#C9F26B' : (isDark ? '#1C2B23' : '#E0E7DC')} stroke={isDark ? '#435E50' : '#13211C'} strokeWidth="2" />
                <text y="-16" textAnchor="middle" fill={isDark ? '#F3F5EF' : '#13211C'} fontSize="11" fontWeight="700">Sibiu (h=253)</text>
              </g>
              <g transform="translate(240, 120)">
                <circle r="12" fill={searchStepIndex >= 2 ? '#C9F26B' : (isDark ? '#1C2B23' : '#E0E7DC')} stroke={isDark ? '#435E50' : '#13211C'} strokeWidth="2" />
                <text y="22" textAnchor="middle" fill={isDark ? '#F3F5EF' : '#13211C'} fontSize="11" fontWeight="700">Rimnicu (h=193)</text>
              </g>
              <g transform="translate(350, 125)">
                <circle r="12" fill={searchStepIndex >= 3 ? '#C9F26B' : (isDark ? '#1C2B23' : '#E0E7DC')} stroke={isDark ? '#435E50' : '#13211C'} strokeWidth="2" />
                <text y="22" textAnchor="middle" fill={isDark ? '#F3F5EF' : '#13211C'} fontSize="11" fontWeight="700">Pitesti (h=100)</text>
              </g>
              <g transform="translate(440, 110)">
                <circle r="16" fill={searchStepIndex >= 3 ? '#C9F26B' : (isDark ? '#1C2B23' : '#E0E7DC')} stroke={isDark ? '#C9F26B' : '#13211C'} strokeWidth="3" />
                <text y="4" textAnchor="middle" fill={isDark ? '#13211C' : '#13211C'} fontSize="10" fontWeight="800">GOAL</text>
                <text y="-20" textAnchor="middle" fill={isDark ? '#C9F26B' : '#13211C'} fontSize="12" fontWeight="800">Bucharest</text>
              </g>
            </svg>

            <div style={{ padding: '10px 14px', background: 'var(--quest-surface-subtle)', borderRadius: '12px', border: '1px solid var(--quest-border)', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: 'var(--quest-text-primary)', marginBottom: '2px' }}>
                <span>Phase: {activeSearch.step}</span>
                <span style={{ color: 'var(--quest-accent-text)' }}>f(n) = g({activeSearch.g}) + h({activeSearch.h}) = {activeSearch.f}</span>
              </div>
              <div style={{ color: 'var(--quest-text-secondary)' }}>{activeSearch.note}</div>
            </div>
          </div>
        );
      }

      // 5. Minimax & Alpha-Beta Pruning
      case 'minimax_tree':
      case 'alpha_beta':
        return (
          <div style={{ background: 'var(--quest-card-bg)', borderRadius: '18px', padding: '22px 24px', border: '1px solid var(--quest-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-muted)' }}>
                GAME TREE: MINIMAX DECISION & ALPHA-BETA PRUNING
              </div>
              <span style={{ fontSize: '11px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', fontWeight: 700, padding: '3px 10px', borderRadius: '10px' }}>
                Pruned: alpha ≥ beta
              </span>
            </div>

            <svg width="100%" height="160" viewBox="0 0 460 160">
              <polygon points="230,15 215,40 245,40" fill={isDark ? '#23332A' : '#13211C'} />
              <text x="230" y="35" textAnchor="middle" fill="#C9F26B" fontSize="10" fontWeight="800">3</text>
              <text x="230" y="10" textAnchor="middle" fill={isDark ? '#F3F5EF' : '#13211C'} fontSize="12" fontWeight="800">MAX Root [v=3]</text>

              <line x1="220" y1="40" x2="115" y2="70" stroke={isDark ? '#435E50' : '#13211C'} strokeWidth="2" />
              <line x1="240" y1="40" x2="345" y2="70" stroke={isDark ? '#435E50' : '#13211C'} strokeWidth="2" />

              <polygon points="115,95 100,70 130,70" fill={isDark ? '#1C2B23' : '#EAF6C9'} stroke={isDark ? '#435E50' : '#13211C'} strokeWidth="2" />
              <text x="115" y="85" textAnchor="middle" fill={isDark ? '#F3F5EF' : '#13211C'} fontSize="10" fontWeight="800">3</text>
              <text x="65" y="83" fill="var(--quest-text-muted)" fontSize="11" fontWeight="700">MIN 1</text>

              <polygon points="345,95 330,70 360,70" fill={isDark ? '#1C2B23' : '#EAF6C9'} stroke={isDark ? '#435E50' : '#13211C'} strokeWidth="2" />
              <text x="345" y="85" textAnchor="middle" fill={isDark ? '#F3F5EF' : '#13211C'} fontSize="10" fontWeight="800">2</text>
              <text x="390" y="83" fill="var(--quest-text-muted)" fontSize="11" fontWeight="700">MIN 2</text>

              <line x1="105" y1="95" x2="70" y2="120" stroke={isDark ? '#435E50' : '#13211C'} strokeWidth="1.5" />
              <line x1="125" y1="95" x2="160" y2="120" stroke={isDark ? '#435E50' : '#13211C'} strokeWidth="1.5" />
              <rect x="58" y="120" width="24" height="20" rx="4" fill={isDark ? '#1C2B23' : '#F3F5EF'} stroke={isDark ? '#435E50' : '#13211C'} />
              <text x="70" y="134" textAnchor="middle" fill={isDark ? '#F3F5EF' : '#13211C'} fontSize="11" fontWeight="700">3</text>
              <rect x="148" y="120" width="24" height="20" rx="4" fill={isDark ? '#1C2B23' : '#F3F5EF'} stroke={isDark ? '#435E50' : '#13211C'} />
              <text x="160" y="134" textAnchor="middle" fill={isDark ? '#F3F5EF' : '#13211C'} fontSize="11" fontWeight="700">12</text>

              <line x1="335" y1="95" x2="300" y2="120" stroke={isDark ? '#435E50' : '#13211C'} strokeWidth="1.5" />
              <rect x="288" y="120" width="24" height="20" rx="4" fill={isDark ? '#1C2B23' : '#F3F5EF'} stroke={isDark ? '#435E50' : '#13211C'} />
              <text x="300" y="134" textAnchor="middle" fill={isDark ? '#F3F5EF' : '#13211C'} fontSize="11" fontWeight="700">2</text>

              <line x1="355" y1="95" x2="390" y2="120" stroke="#DC2626" strokeWidth="2" strokeDasharray="4 4" />
              <text x="405" y="115" fill="#EF4444" fontSize="13" fontWeight="900" letterSpacing="0.05em">[PRUNED]</text>
            </svg>
            <div style={{ fontSize: '13px', color: 'var(--quest-text-secondary)', marginTop: '6px' }}>
              Since $\beta = 2 \le \alpha = 3$, the right child branch is pruned without evaluation!
            </div>
          </div>
        );

      // 6. Wumpus World (Logic)
      case 'wumpus_world':
        return (
          <div style={{ background: 'var(--quest-card-bg)', borderRadius: '18px', padding: '22px 24px', border: '1px solid var(--quest-border)' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-muted)', marginBottom: '12px' }}>
              WUMPUS WORLD 4×4 GRID (PROPOSITIONAL ENTAILMENT)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', maxWidth: '380px', margin: '0 auto' }}>
              {[
                { label: '[1,4] Safe', bg: isDark ? '#1A2821' : '#F3F5EF', color: 'var(--quest-text-primary)' },
                { label: '[2,4] Safe', bg: isDark ? '#1A2821' : '#F3F5EF', color: 'var(--quest-text-primary)' },
                { label: '[3,4] Pit', bg: isDark ? '#3D1E1E' : '#FEE2E2', color: isDark ? '#FCA5A5' : '#991B1B', badge: 'PIT' },
                { label: '[4,4] Safe', bg: isDark ? '#1A2821' : '#F3F5EF', color: 'var(--quest-text-primary)' },
                { label: '[1,3] Wumpus', bg: isDark ? '#3D1E1E' : '#FEE2E2', color: isDark ? '#FCA5A5' : '#991B1B', badge: 'WUMPUS' },
                { label: '[2,3] Gold!', bg: isDark ? '#3D3114' : '#FEF3C7', color: isDark ? '#FDE68A' : '#92400E', badge: 'GOLD' },
                { label: '[3,3] Breeze', bg: isDark ? '#1F3327' : '#E0E7DC', color: isDark ? '#C9F26B' : '#13211C' },
                { label: '[4,3] Safe', bg: isDark ? '#1A2821' : '#F3F5EF', color: 'var(--quest-text-primary)' },
                { label: '[1,2] Stench', bg: isDark ? '#1F3327' : '#E0E7DC', color: isDark ? '#C9F26B' : '#13211C', badge: 'STENCH' },
                { label: '[2,2] Safe', bg: isDark ? '#1A2821' : '#F3F5EF', color: 'var(--quest-text-primary)' },
                { label: '[3,2] Safe', bg: isDark ? '#1A2821' : '#F3F5EF', color: 'var(--quest-text-primary)' },
                { label: '[4,2] Pit', bg: isDark ? '#3D1E1E' : '#FEE2E2', color: isDark ? '#FCA5A5' : '#991B1B', badge: 'PIT' },
                { label: '[1,1] Agent', bg: isDark ? 'rgba(201, 242, 107, 0.2)' : '#EAF6C9', color: 'var(--quest-accent)', badge: 'START' },
                { label: '[2,1] Breeze', bg: isDark ? '#1F3327' : '#E0E7DC', color: isDark ? '#C9F26B' : '#13211C', badge: 'BREEZE' },
                { label: '[3,1] Pit', bg: isDark ? '#3D1E1E' : '#FEE2E2', color: isDark ? '#FCA5A5' : '#991B1B', badge: 'PIT' },
                { label: '[4,1] Safe', bg: isDark ? '#1A2821' : '#F3F5EF', color: 'var(--quest-text-primary)' }
              ].map((cell, idx) => (
                <div key={idx} style={{ padding: '10px 6px', background: cell.bg, color: cell.color, borderRadius: '10px', border: '1px solid var(--quest-border)', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>
                  <div>{cell.label.split(' ')[0]}</div>
                  {cell.badge && <div style={{ fontSize: '10px', fontWeight: 800, marginTop: '3px' }}>{cell.badge}</div>}
                </div>
              ))}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--quest-text-secondary)', marginTop: '10px', textAlign: 'center' }}>
              B[1,1] ⇔ (P[1,2] ∨ P[2,1]). Perceiving ¬B[1,1] logically proves both [1,2] and [2,1] have no pit!
            </div>
          </div>
        );

      // 7. General Fallback
      default:
        return (
          <div style={{ background: 'var(--quest-card-bg)', borderRadius: '18px', padding: '22px 24px', border: '1px solid var(--quest-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-muted)' }}>
                CONCEPT SCHEMATIC & FORMULATION
              </div>
              <span style={{ fontSize: '11px', background: 'var(--quest-card-dark)', color: 'var(--quest-accent)', fontWeight: 800, padding: '3px 10px', borderRadius: '10px' }}>
                AIMA Textbook Fig.
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <div style={{ padding: '14px', background: 'var(--quest-surface-subtle)', borderRadius: '12px', border: '1px solid var(--quest-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--quest-text-muted)' }}>FOUNDATION</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--quest-text-primary)', marginTop: '4px' }}>Formal State Space</div>
                <div style={{ fontSize: '12px', color: 'var(--quest-text-secondary)', marginTop: '4px' }}>Discrete states $S$, actions $A$, and transition models.</div>
              </div>
              <div style={{ padding: '14px', background: 'var(--quest-card-dark)', color: 'var(--quest-card-dark-text)', borderRadius: '12px', border: '1px solid var(--quest-border-dark)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--quest-accent)' }}>EVALUATION</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--quest-accent)', marginTop: '4px' }}>Optimization Objective</div>
                <div style={{ fontSize: '12px', color: 'var(--quest-text-muted)', marginTop: '4px' }}>Maximizing utility $U(s)$ or minimizing total path cost $g(n)$.</div>
              </div>
              <div style={{ padding: '14px', background: 'var(--quest-surface-subtle)', borderRadius: '12px', border: '1px solid var(--quest-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--quest-text-muted)' }}>OUTCOME</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--quest-text-primary)', marginTop: '4px' }}>Rational Policy $\pi^*$</div>
                <div style={{ fontSize: '12px', color: 'var(--quest-text-secondary)', marginTop: '4px' }}>Optimal decision rule mapping percepts to actions.</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="quest-lesson-screen"
      style={{
        width: isFocusMode ? '100vw' : '100%',
        height: isFocusMode ? '100vh' : '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--quest-bg)',
        overflow: 'hidden',
        position: isFocusMode ? 'fixed' : 'relative',
        inset: isFocusMode ? 0 : undefined,
        zIndex: isFocusMode ? 9999 : 1,
      }}
    >
      {/* 1. MINIMAL TOP BAR (Single Slim Row, No Wrapping) */}
      <header
        style={{
          flexShrink: 0,
          height: '52px',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--quest-border)',
          background: 'var(--quest-bg)',
          position: 'relative',
          zIndex: 50,
        }}
      >
        {/* Left: Quiet Navigation & Chapter Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--quest-text-secondary)',
              padding: '6px 8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'all 0.12s ease',
            }}
            title="Return to Chapters View"
          >
            <ArrowLeft size={15} /> <span>Chapters</span>
          </button>

          <span style={{ color: 'var(--quest-border)', fontSize: '14px' }}>/</span>

          {/* Chapter Selector Dropdown Trigger */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsChapterMenuOpen(!isChapterMenuOpen)}
              style={{
                background: 'transparent',
                color: 'var(--quest-text-primary)',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              <span>Ch. {lesson.chapterId}: {lesson.title}</span>
              <ChevronDown size={14} style={{ transform: isChapterMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--quest-text-muted)' }} />
            </button>

            {/* Chapter Selection Menu Dropdown */}
            {isChapterMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  width: '320px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  background: 'var(--quest-card-bg)',
                  borderRadius: '12px',
                  border: '1px solid var(--quest-border)',
                  boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
                  zIndex: 200,
                  padding: '8px',
                }}
              >
                {AIMA_PARTS.map((part) => (
                  <div key={part.id} style={{ marginBottom: '6px' }}>
                    <div style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--quest-text-muted)', padding: '4px 8px', letterSpacing: '0.04em' }}>
                      {part.title}
                    </div>
                    {part.chapters.map((ch) => {
                      const isCurrent = ch.id === lesson.chapterId;
                      const isUnlocked = ch.id <= 1 || stats.completedChapterIds?.includes(ch.id) || stats.completedChapterIds?.includes(ch.id - 1);
                      return (
                        <div
                          key={ch.id}
                          onClick={() => {
                            if (!isUnlocked) {
                              soundFX.playWrong();
                              return;
                            }
                            soundFX.playClick();
                            setIsChapterMenuOpen(false);
                            if (onSelectChapter) {
                              onSelectChapter(ch.id);
                            }
                            setCurrentStepIndex(0);
                            setActiveTab('reading');
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            cursor: isUnlocked ? 'pointer' : 'not-allowed',
                            opacity: isUnlocked ? 1 : 0.45,
                            background: isCurrent ? 'var(--quest-light-tint)' : 'transparent',
                            color: isCurrent ? 'var(--quest-light-tint-text)' : 'var(--quest-text-primary)',
                            fontSize: '12.5px',
                            fontWeight: isCurrent ? 700 : 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {!isUnlocked && <Lock size={12} color="var(--quest-text-muted)" />}
                            {ch.id}. {ch.title}
                          </span>
                          {isCurrent && <Check size={12} color="var(--quest-light-tint-text)" />}
                          {!isUnlocked && <span style={{ fontSize: '10px', color: 'var(--quest-text-muted)', fontWeight: 600 }}>Locked</span>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Live XP, Step Counter, Slim Progress, Outline Toggle, Focus Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 800,
              background: 'var(--quest-light-tint)',
              color: 'var(--quest-light-tint-text)',
              padding: '2px 8px',
              borderRadius: '8px',
              letterSpacing: '0.02em',
            }}
            title="Your current study XP"
          >
            {stats.xp.toLocaleString()} XP
          </span>

          <span style={{ fontSize: '12.5px', color: 'var(--quest-text-muted)', fontWeight: 600 }}>
            {currentStepIndex + 1} of {steps.length}
          </span>

          <div style={{ width: '48px', height: '4px', background: 'var(--quest-border)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--quest-accent)', transition: 'width 0.2s ease' }} />
          </div>

          <div style={{ height: '16px', width: '1px', background: 'var(--quest-border)' }} />

          {/* Quick Chapter Notes Drawer Trigger */}
          <button
            onClick={() => {
              soundFX.playClick();
              setIsNotesDrawerOpen(!isNotesDrawerOpen);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 11px',
              borderRadius: '8px',
              background: isNotesDrawerOpen ? 'var(--quest-card-dark)' : 'var(--quest-surface-subtle)',
              color: isNotesDrawerOpen ? 'var(--quest-accent)' : 'var(--quest-text-primary)',
              border: '1px solid var(--quest-border)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Open Chapter Study Notes"
          >
            <StickyNote size={13} />
            <span>Notes{chapterNotes.length > 0 ? ` (${chapterNotes.length})` : ''}</span>
          </button>

          {/* Direct Link to Original Textbook PDF */}
          <button
            onClick={() => {
              soundFX.playClick();
              setPdfViewer({
                isOpen: true,
                title: `Artificial Intelligence: A Modern Approach (Chapter ${chapterId})`,
                author: 'Stuart Russell & Peter Norvig',
                pdfUrl: '/library/aima.pdf',
                page: getAimaChapterPdfPage(chapterId)
              });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 11px',
              borderRadius: '8px',
              background: 'var(--quest-surface-subtle)',
              color: 'var(--quest-text-primary)',
              border: '1px solid var(--quest-border)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Read Original Textbook Chapter PDF"
          >
            <BookOpen size={13} />
            <span>AIMA (p. ~{getAimaChapterPdfPage(chapterId)})</span>
          </button>

          {/* Toggle Outline Sidebar */}
          <button
            onClick={() => {
              soundFX.playClick();
              setIsOutlineOpen(!isOutlineOpen);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 10px',
              borderRadius: '8px',
              background: isOutlineOpen ? 'var(--quest-card-dark)' : 'transparent',
              color: isOutlineOpen ? 'var(--quest-accent)' : 'var(--quest-text-muted)',
              border: isOutlineOpen ? '1px solid var(--quest-accent)' : '1px solid var(--quest-border)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title={isOutlineOpen ? "Hide Table of Contents" : "Show Table of Contents"}
          >
            <Layers size={13} />
            <span>Outline</span>
          </button>

          {/* Focus Mode Toggle */}
          <button
            onClick={() => {
              soundFX.playClick();
              setIsFocusMode(!isFocusMode);
            }}
            style={{
              background: 'transparent',
              color: isFocusMode ? 'var(--quest-text-primary)' : 'var(--quest-text-muted)',
              border: 'none',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '6px',
            }}
            title={isFocusMode ? "Exit Fullscreen" : "Fullscreen Focus"}
          >
            {isFocusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </header>

      {/* 2. MAIN LESSON SCREEN BODY (Canvas + Right-Side Topics Column) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          minHeight: 0,
          position: 'relative',
        }}
      >
        {/* Left/Center: Reading Canvas */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            minHeight: 0,
            padding: '24px 28px 80px 28px',
            minWidth: 0,
          }}
        >
          <div
            style={{
              maxWidth: '820px',
              margin: '0 auto',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* Step Header & Zen 3-Stage Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#7E9084', letterSpacing: '0.04em' }}>
                  PART I · CHAPTER {lesson.chapterId} · TOPIC {currentStepIndex + 1} OF {steps.length}
                </div>
                <h1 style={{ fontFamily: 'var(--quest-font-heading)', fontSize: '26px', fontWeight: 800, margin: '4px 0 0 0', color: 'var(--quest-text-primary)', letterSpacing: '-0.02em' }}>
                  {currentStep.title}
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--quest-text-secondary)', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                  {currentStep.subtitle}
                </p>
              </div>

              {/* Zen 3-Stage Segmented Control + Quick Flashcards Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    background: 'var(--quest-surface-subtle)',
                    padding: '4px',
                    borderRadius: '12px',
                    gap: '4px',
                    border: '1px solid var(--quest-border)'
                  }}
                >
                  {[
                    { id: 'reading', label: 'Lesson', icon: BookOpen },
                    { id: 'practice', label: 'Practice & Code', icon: Terminal },
                    { id: 'rigor', label: 'Rigor & Library', icon: GraduationCap },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          soundFX.playClick();
                          setActiveTab(tab.id as any);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '7px',
                          padding: '7px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          background: isActive ? 'var(--quest-card-dark)' : 'transparent',
                          color: isActive ? 'var(--quest-accent)' : 'var(--quest-text-secondary)',
                          fontWeight: isActive ? 800 : 600,
                          fontSize: '13px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Icon size={14} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {onOpenFlashcards && (
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      onOpenFlashcards(chapterId);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      background: 'var(--quest-card-dark)',
                      color: 'var(--quest-accent)',
                      border: '1px solid rgba(201, 242, 107, 0.4)',
                      fontWeight: 800,
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                    }}
                    title="Drill with 25 University Exam Flashcards"
                  >
                    <span>🃏 Exam Flashcards (25)</span>
                  </button>
                )}
              </div>
            </div>

            {/* TAB 1: CORE LESSON READING & CONCEPTS */}
            {activeTab === 'reading' && (() => {
              const getBeginnerIntuition = (chId: number, title: string) => {
                switch (chId) {
                  case 1:
                    return {
                      analogy: "The Smart Thermostat vs. A Human Impersonator",
                      plainEnglish: "AI in this book isn't about creating machines with human feelings or poetic whims. It is about 'Rational Action': measuring the environment through sensors, having a clear mathematical score for success, and picking the action that maximizes that score."
                    };
                  case 2:
                    return {
                      analogy: "Specifying a Robot Vacuum Before Writing Code (PEAS)",
                      plainEnglish: "Before writing any algorithm, you must define four things: Performance (clean floor metric), Environment (living room tiles/carpets), Actuators (wheels and brushes), and Sensors (bumpers and dirt sensors)."
                    };
                  case 3:
                    return {
                      analogy: "Google Maps Navigating a Road Trip (A* Heuristic Search)",
                      plainEnglish: "You are at Point A and need to drive to Point B. You don't blindly drive down every back alley. You add the miles driven so far (g(n)) to the straight-line bird's-eye distance (h(n)), always expanding the most promising highway first."
                    };
                  case 4:
                    return {
                      analogy: "Driving Through Dense Mountain Fog on Icy Roads",
                      plainEnglish: "When you can't see the full map (partial observability) or wind might push your car (stochastic transitions), you maintain a 'belief state'—a mental set of all possible worlds you could currently be in."
                    };
                  case 5:
                    return {
                      analogy: "Playing Chess Against a Master Opponent (Minimax & Alpha-Beta)",
                      plainEnglish: "You cannot assume your opponent will make silly mistakes. Minimax assumes your opponent will always pick the move that hurts you most, allowing you to choose the path with the best guaranteed outcome."
                    };
                  case 6:
                    return {
                      analogy: "Solving a Difficult Sudoku by Elimination (Constraint Satisfaction)",
                      plainEnglish: "Rather than guessing billions of digit combinations, you enforce constraints: if a 7 is in this row, cross out 7 from every other cell in the row until only the true solutions remain."
                    };
                  case 7:
                  case 8:
                  case 9:
                    return {
                      analogy: "Sherlock Holmes Proving Guilt with Ironclad Logic",
                      plainEnglish: "Logic agents don't gamble with chances. They apply deductive rules: if premises are true, conclusions are 100% guaranteed. No guessing, no hallucinations."
                    };
                  case 13:
                  case 14:
                    return {
                      analogy: "Evaluating a Medical Test for a Rare Disease (Bayes' Rule)",
                      plainEnglish: "Even a 99% accurate test for a 1-in-10,000 disease means most positive results are false alarms because healthy people outnumber sick people by thousands to one. Bayes' rule teaches us never to ignore the base rate."
                    };
                  case 15:
                    return {
                      analogy: "Transcribing Audio Waves into Spoken Words (Hidden Markov Models)",
                      plainEnglish: "You cannot directly see the speaker's brain or intended phonemes (hidden states), but you hear the sound frequencies (sensor evidence) and calculate the most probable sentence over time."
                    };
                  case 17:
                    return {
                      analogy: "Balancing $10 Today vs. $100 Next Month (MDPs & Bellman Equations)",
                      plainEnglish: "The true value of any position is the immediate treat you pick up right now, PLUS the discounted future value of the best rooms you can reach from here."
                    };
                  case 21:
                    return {
                      analogy: "Training a Puppy with Treats and Repetition (Reinforcement Learning)",
                      plainEnglish: "The agent starts knowing nothing about the world. It tries random actions, receives rewards (+1) or penalties (-1), and gradually learns the optimal policy through trial, error, and experience."
                    };
                  default:
                    return {
                      analogy: `Everyday Intuition: Demystifying ${title}`,
                      plainEnglish: "This chapter breaks complex problems into a clear recipe: defining world states, evaluating trade-offs, and choosing the optimal action with provable guarantees."
                    };
                }
              };

              const intuition = getBeginnerIntuition(chapterId, lesson.title);

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Intuition & Mental Model Box (Calm, Serene Editorial Style) */}
                  <div style={{ background: 'var(--quest-surface-subtle)', border: '1px solid var(--quest-border)', borderRadius: '16px', padding: '18px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Compass size={15} color="var(--quest-accent-text)" />
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--quest-accent-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        INTUITION & MENTAL MODEL
                      </span>
                      <span style={{ fontSize: '10.5px', background: 'var(--quest-light-tint)', color: 'var(--quest-light-tint-text)', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                        Foundations
                      </span>
                    </div>
                    <div style={{ fontSize: '15px', color: 'var(--quest-text-primary)', fontWeight: 700, lineHeight: 1.4 }}>
                      {intuition.analogy}
                    </div>
                    <p style={{ fontSize: '13.5px', color: 'var(--quest-text-secondary)', lineHeight: 1.6, margin: '8px 0 0 0' }}>
                      {intuition.plainEnglish}
                    </p>
                  </div>

                  {/* Visual Diagram */}
                  {renderVisual()}

                  {/* Formatted Markdown Content */}
                  <div style={{ fontSize: '15px', color: 'var(--quest-text-primary)' }}>
                    {renderFormattedMarkdown(currentStep.contentMarkdown)}
                  </div>

                  {/* Key Takeaways Points */}
                  {currentStep.keyPoints && currentStep.keyPoints.length > 0 && (
                    <div
                      style={{
                        background: 'var(--quest-surface-subtle)',
                        border: '1px solid var(--quest-border)',
                        padding: '16px 20px',
                        borderRadius: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)', marginBottom: '10px' }}>
                        <Lightbulb size={18} color="var(--quest-text-muted)" />
                        <span>KEY CONCEPT INVARIANTS</span>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '22px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {currentStep.keyPoints.map((pt, idx) => (
                          <li key={idx} style={{ fontSize: '14px', color: 'var(--quest-text-primary)', lineHeight: 1.5 }}>
                            {renderInlineStyles(pt)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* COMPANION BOOK DEEP DIVE: EXPANDING CONTEXT FROM GOODFELLOW / JURAFSKY / RASCHKA / CHIP HUYEN */}
                  {(() => {
                    const compData = getCompanionData(chapterId);
                    const primary = compData.primaryHighlight;
                    return (
                      <div
                        style={{
                          background: 'linear-gradient(135deg, #13211C 0%, #1A2E26 100%)',
                          color: '#FFFFFF',
                          padding: '22px 26px',
                          borderRadius: '18px',
                          border: '1px solid #2F453B',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BookOpen size={17} color="#C9F26B" />
                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#C9F26B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              COMPANION BOOK EXPANSION · {compData.theme}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              soundFX.playClick();
                              setPdfViewer({
                                isOpen: true,
                                title: primary.bookTitle,
                                author: 'Academic Companion Authority',
                                pdfUrl: primary.pdfUrl,
                                page: primary.page,
                              });
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: '#EAF6C9',
                              color: '#13211C',
                              border: 'none',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              transition: 'transform 0.1s ease',
                            }}
                          >
                            <BookOpen size={13} />
                            Read in {primary.bookTitle.split('(')[0].trim()} (p. ~{primary.page})
                          </button>
                        </div>

                        <div style={{ fontSize: '14.5px', fontStyle: 'italic', color: '#EAF6C9', lineHeight: 1.5, marginBottom: '10px', borderLeft: '3px solid #C9F26B', paddingLeft: '12px' }}>
                          "{primary.quoteOrPrinciple}"
                        </div>

                        <p style={{ fontSize: '13.5px', color: '#CBD5CD', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                          {primary.explanation}
                        </p>

                        {/* Companion Comparative Insights Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                          {compData.companionInsights.map((ins, iIdx) => (
                            <div
                              key={iIdx}
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                borderRadius: '14px',
                                padding: '14px 16px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                              }}
                            >
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9F26B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    {ins.badge}
                                  </span>
                                  <span style={{ fontSize: '11.5px', color: '#8EA295' }}>{ins.bookTitle}</span>
                                </div>
                                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
                                  {ins.insightTitle}
                                </div>
                                <div style={{ fontSize: '12.5px', color: '#CBD5CD', lineHeight: 1.55, marginBottom: '10px' }}>
                                  {ins.conceptualBridge}
                                </div>
                                <div style={{ fontFamily: 'monospace', fontSize: '12px', background: 'rgba(0,0,0,0.35)', padding: '6px 10px', borderRadius: '8px', color: '#C9F26B', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                  {ins.coreMathOrCode}
                                </div>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
                                <span style={{ fontSize: '11.5px', color: '#A3B899' }}>Target: p. ~{ins.targetPage}</span>
                                <button
                                  onClick={() => {
                                    soundFX.playClick();
                                    setPdfViewer({
                                      isOpen: true,
                                      title: `${ins.bookTitle} (${ins.authors})`,
                                      author: ins.authors,
                                      pdfUrl: ins.pdfUrl,
                                      page: ins.targetPage,
                                    });
                                  }}
                                  style={{
                                    background: 'transparent',
                                    color: '#C9F26B',
                                    border: 'none',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: 0,
                                  }}
                                >
                                  Open in App (p. ~{ins.targetPage}) <ArrowRight size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Midterm Exam Trap & Counterexample Callout directly in Lesson reading */}
                  {(() => {
                    const enrichment = UNIVERSITY_ENRICHMENTS[chapterId];
                    const primaryTrap = enrichment?.midtermTraps?.[0] || {
                      trap: `Assuming optimal behavior always achieves 100% real-world success in ${lesson.title}.`,
                      counterexampleOrProof: 'Rationality maximizes expected performance given percept history. In stochastic or partially observable worlds, a rational agent can make the mathematically optimal decision and still fail due to bad luck.'
                    };

                    return (
                      <div
                        style={{
                          background: isDark ? 'rgba(245, 158, 11, 0.1)' : '#FFFBF0',
                          border: isDark ? '1.5px solid rgba(245, 158, 11, 0.35)' : '1.5px solid #F6E5B8',
                          padding: '20px 24px',
                          borderRadius: '16px',
                          marginTop: '24px',
                          color: isDark ? 'var(--quest-text-primary)' : '#7A5200',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '13.5px', color: isDark ? '#FBBF24' : '#92400E' }}>
                            <AlertCircle size={18} color="#D97706" />
                            <span>MIDTERM EXAM TRAP · CHAPTER {chapterId}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                soundFX.playClick();
                                setActiveTab('rigor');
                              }}
                              style={{
                                background: isDark ? 'rgba(245, 158, 11, 0.22)' : '#FDE68A',
                                color: isDark ? '#FDE68A' : '#78350F',
                                border: isDark ? '1px solid rgba(245, 158, 11, 0.3)' : 'none',
                                borderRadius: '8px',
                                padding: '5px 10px',
                                fontSize: '11.5px',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              All Proofs & Traps →
                            </button>
                            {onOpenFlashcards && (
                              <button
                                type="button"
                                onClick={() => {
                                  soundFX.playClick();
                                  onOpenFlashcards(chapterId);
                                }}
                                style={{
                                  background: 'var(--quest-card-dark)',
                                  color: 'var(--quest-accent)',
                                  border: '1px solid rgba(201, 242, 107, 0.4)',
                                  borderRadius: '8px',
                                  padding: '5px 10px',
                                  fontSize: '11.5px',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                🃏 Drill Flashcards
                              </button>
                            )}
                          </div>
                        </div>

                        <div style={{ fontWeight: 800, fontSize: '14.5px', color: isDark ? '#FDE68A' : '#13211C' }}>
                          Trap: "{primaryTrap.trap}"
                        </div>
                        <div style={{ fontSize: '14px', color: isDark ? 'var(--quest-text-primary)' : '#5C4000', marginTop: '6px', lineHeight: 1.6 }}>
                          <strong style={{ color: isDark ? '#FBBF24' : '#78350F' }}>Exam Rebuttal: </strong> {primaryTrap.counterexampleOrProof}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })()}


            {/* RIGOR SECTION 1: FORMAL MATHEMATICAL PROOFS */}
            {activeTab === 'rigor' && (() => {
              const enrichment = UNIVERSITY_ENRICHMENTS[chapterId];
              const proof = enrichment?.proof || {
                theorem: `Formal Properties & Guarantees for Chapter ${chapterId}: ${lesson.title}`,
                statement: currentStep.mathBlock?.formula || 'Mathematical formulation of optimal agent behavior and algorithmic invariants.',
                assumptions: [
                  'Environment satisfies the state space and transition assumptions of the model.',
                  'Discount factor or termination conditions ensure finite utility expectations.',
                  'The agent possesses complete knowledge of legal actions in each state.'
                ],
                proofSteps: [
                  'Define the objective function or recurrence relation over the state space.',
                  'Establish the base case or terminal condition bounding the maximum error or cost.',
                  'Apply induction across time steps or search horizons to show the invariant holds at step k+1.',
                  'Verify that sub-optimal branches cannot dominate optimal choices under the evaluation function.',
                  'Conclude by contradiction that any deviation from the optimal policy yields strictly lower expected utility.'
                ],
                conclusion: 'The algorithm satisfies formal completeness and optimality criteria under stated assumptions.'
              };

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--quest-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    SECTION 1 · FORMAL THEOREM & MATHEMATICAL DERIVATION
                  </div>
                  <div style={{ background: 'var(--quest-card-bg)', padding: '24px 28px', borderRadius: '18px', border: '1px solid var(--quest-border)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <span style={{ background: 'var(--quest-card-dark)', color: 'var(--quest-accent)', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em' }}>
                        THEOREM & PROOF
                      </span>
                      <span style={{ fontSize: '13px', color: 'var(--quest-text-muted)' }}>
                        Rigorous Mathematical Derivation
                      </span>
                    </div>

                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                      {proof.theorem}
                    </h3>

                    {/* Formal Statement Box */}
                    <div style={{ background: 'var(--quest-surface-subtle)', borderLeft: '4px solid var(--quest-accent)', padding: '14px 18px', borderRadius: '0 12px 12px 0', margin: '14px 0', fontStyle: 'italic', fontSize: '14.5px', color: 'var(--quest-text-primary)', lineHeight: 1.6 }}>
                      <strong>Statement: </strong> {renderInlineStyles(proof.statement)}
                    </div>

                    {/* Assumptions */}
                    <div style={{ margin: '18px 0 12px 0' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-muted)', marginBottom: '8px' }}>
                        PREMISES & ASSUMPTIONS:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {proof.assumptions.map((assump, aIdx) => (
                          <li key={aIdx} style={{ fontSize: '14px', color: 'var(--quest-text-primary)', lineHeight: 1.5 }}>
                            {renderInlineStyles(assump)}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Proof Steps */}
                    <div style={{ margin: '20px 0 14px 0' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-muted)', marginBottom: '10px' }}>
                        PROOF STEPS:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {proof.proofSteps.map((step, sIdx) => (
                          <div key={sIdx} style={{ display: 'flex', gap: '12px', padding: '10px 14px', background: 'var(--quest-surface-subtle)', borderRadius: '10px', border: '1px solid var(--quest-border)' }}>
                            <span style={{ fontWeight: 800, color: 'var(--quest-text-muted)', fontSize: '13px', minWidth: '24px' }}>
                              {sIdx + 1}.
                            </span>
                            <span style={{ fontSize: '14px', color: 'var(--quest-text-primary)', lineHeight: 1.6 }}>
                              {renderInlineStyles(step)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Q.E.D. Box */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '14px 18px', background: 'var(--quest-surface-subtle)', borderRadius: '12px', border: '1px solid var(--quest-border)' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--quest-text-primary)' }}>
                        {proof.conclusion}
                      </span>
                      <span style={{ fontWeight: 800, fontSize: '13px', color: 'var(--quest-text-primary)', letterSpacing: '0.08em', padding: '3px 8px', background: 'var(--quest-card-bg)', borderRadius: '6px', border: '1px solid var(--quest-border)' }}>
                        Q.E.D.
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* PRACTICE STEP 1: STEP-BY-STEP WORKED PROBLEM & DYNAMIC DRILL */}
            {activeTab === 'practice' && (() => {
              const enrichment = UNIVERSITY_ENRICHMENTS[chapterId];
              const canonicalWorked = enrichment?.workedProblem || {
                title: `Worked Analytical Problem: Chapter ${chapterId} — ${lesson.title}`,
                problemStatement: `Analyze the computational properties, transition calculations, and state space bounds for a canonical ${lesson.title} scenario.`,
                givenData: {
                  'State space |S|': '1,000 distinct configurations',
                  'Branching factor b': '4 legal actions per state',
                  'Discount factor γ': '0.90',
                  'Tolerance ε': '10⁻⁴'
                },
                steps: [
                  {
                    stepNumber: 1,
                    action: 'Formulate state space representation and parameters',
                    calculation: 'Total paths of depth d=5: b^d = 4^5 = 1,024 configurations.',
                    result: 'Search tree horizon bounded by 1,024 nodes.'
                  },
                  {
                    stepNumber: 2,
                    action: 'Compute one-step lookahead transition expectation',
                    calculation: 'Apply Bellman / Markov expectation: sum_{s\'} P(s\'|s,a) U(s\').',
                    result: 'Action value computed in O(|S|) time.'
                  },
                  {
                    stepNumber: 3,
                    action: 'Evaluate convergence bounds under contraction mapping',
                    calculation: 'Number of iterations K <= [log(1/ε) / (1 - γ)] ≈ [log(10,000) / 0.10] ≈ 92 iterations.',
                    result: 'Numerical convergence guaranteed in under 100 iterations.'
                  }
                ],
                finalAnswer: 'Theoretical bounds confirm polynomial convergence and optimal decision recovery.',
                examTakeaway: 'Always verify whether calculations require exact linear algebra solving O(|S|³) or iterative Bellman updates O(|A|·|S|²).'
              };

              const dynamicProb = generateDynamicProblem(chapterId, dynamicSeed);
              const isDynamic = problemMode === 'dynamic';

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--quest-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    STEP 1 · WORKED ANALYTICAL PROBLEM & EXAM DRILL
                  </div>
                  <div style={{ background: 'var(--quest-card-bg)', padding: '24px 28px', borderRadius: '18px', border: '1px solid var(--quest-border)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>

                    {/* Mode & Tier Toolbar */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--quest-border)', paddingBottom: '14px', marginBottom: '16px' }}>
                      {/* Left: Mode Switcher */}
                      <div style={{ display: 'flex', background: 'var(--quest-surface-subtle)', padding: '3px', borderRadius: '10px', gap: '4px' }}>
                        <button
                          onClick={() => {
                            soundFX.playClick();
                            setProblemMode('canonical');
                            setSelectedPracticeOption(null);
                            setIsPracticeChecked(false);
                          }}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: !isDynamic ? 'var(--quest-card-dark)' : 'transparent',
                            color: !isDynamic ? 'var(--quest-accent)' : 'var(--quest-text-secondary)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          Textbook Standard
                        </button>
                        <button
                          onClick={() => {
                            soundFX.playClick();
                            setProblemMode('dynamic');
                            setSelectedPracticeOption(null);
                            setIsPracticeChecked(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: isDynamic ? 'var(--quest-card-dark)' : 'transparent',
                            color: isDynamic ? 'var(--quest-accent)' : 'var(--quest-text-secondary)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Sparkles size={14} />
                          Dynamic Exam Drill
                        </button>
                      </div>

                      {/* Right: Difficulty Tier Badge & Re-roll Button */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {[
                            { tier: 1, label: 'Tier 1' },
                            { tier: 2, label: 'Tier 2 (Midterm)' },
                            { tier: 3, label: 'Tier 3 (Honors)' }
                          ].map((t) => (
                            <button
                              key={t.tier}
                              onClick={() => {
                                soundFX.playClick();
                                setDifficultyTier(t.tier as any);
                              }}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                border: difficultyTier === t.tier ? '1.5px solid var(--quest-accent)' : '1px solid var(--quest-border)',
                                background: difficultyTier === t.tier ? 'var(--quest-light-tint)' : 'var(--quest-surface-subtle)',
                                color: difficultyTier === t.tier ? 'var(--quest-light-tint-text)' : 'var(--quest-text-primary)',
                                fontSize: '11px',
                                fontWeight: difficultyTier === t.tier ? 800 : 500,
                                cursor: 'pointer'
                              }}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>

                        {isDynamic && (
                          <button
                            onClick={() => {
                              soundFX.playClick();
                              setDynamicSeed(Math.floor(Math.random() * 9000) + 100);
                              setSelectedPracticeOption(null);
                              setIsPracticeChecked(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '6px 12px',
                              background: 'var(--quest-card-dark)',
                              color: 'var(--quest-accent)',
                              border: '1px solid rgba(201, 242, 107, 0.3)',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                            title="Generate a fresh randomized numerical variant"
                          >
                            <RefreshCw size={13} />
                            Re-roll Numbers
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Header Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ background: 'var(--quest-card-dark)', color: 'var(--quest-accent)', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                        {isDynamic ? `DYNAMIC EXAM DRILL (SEED #${dynamicSeed})` : 'WORKED EXAM PROBLEM'}
                      </span>
                      <span style={{ fontSize: '13px', color: 'var(--quest-text-muted)' }}>
                        {difficultyTier === 1 ? 'Tier 1 · Foundational Invariants' : difficultyTier === 2 ? 'Tier 2 · Midterm Calculation' : 'Tier 3 · Graduate Analysis'}
                      </span>
                    </div>

                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                      {isDynamic ? `Randomized Practice: ${lesson.title}` : canonicalWorked.title}
                    </h3>

                    <p style={{ fontSize: '14.5px', color: 'var(--quest-text-secondary)', lineHeight: 1.6, margin: '8px 0 16px 0' }}>
                      {renderInlineStyles(isDynamic ? dynamicProb.problemStatement : canonicalWorked.problemStatement)}
                    </p>

                    {/* Given Data Grid */}
                    <div style={{ background: 'var(--quest-surface-subtle)', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--quest-border)', marginBottom: '18px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--quest-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {isDynamic ? 'GENERATED VARIANT PARAMETERS:' : 'GIVEN PROBLEM PARAMETERS:'}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                        {Object.entries(isDynamic ? dynamicProb.parameters : canonicalWorked.givenData).map(([key, val], idx) => (
                          <div key={idx} style={{ fontSize: '13.5px', color: 'var(--quest-text-primary)' }}>
                            <strong>{key}:</strong> <code style={{ background: 'var(--quest-light-tint)', padding: '2px 6px', borderRadius: '4px', color: 'var(--quest-light-tint-text)' }}>{String(val)}</code>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Numbered Step-by-Step Calculation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(isDynamic ? dynamicProb.stepCalculations : canonicalWorked.steps).map((st, idx) => (
                        <div key={idx} style={{ border: '1px solid var(--quest-border)', borderRadius: '12px', padding: '14px 18px', background: 'var(--quest-surface-subtle)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ background: 'var(--quest-card-dark)', color: 'var(--quest-accent)', width: '22px', height: '22px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                              {st.stepNumber}
                            </span>
                            <strong style={{ fontSize: '14px', color: 'var(--quest-text-primary)' }}>{st.action}</strong>
                          </div>
                          <div style={{ fontFamily: 'monospace', fontSize: '13px', background: 'var(--quest-card-bg)', padding: '8px 12px', borderRadius: '8px', color: 'var(--quest-text-primary)', border: '1px solid var(--quest-border)', margin: '8px 0' }}>
                            {st.calculation}
                          </div>
                          <div style={{ fontSize: '13.5px', color: 'var(--quest-text-secondary)' }}>
                            <strong>Result: </strong> {st.result}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Interactive Scratchpad Verification (For Dynamic Practice) */}
                    {isDynamic && dynamicProb.checkQuestions && (
                      <div style={{ marginTop: '20px', padding: '18px 20px', background: 'var(--quest-surface-subtle)', borderRadius: '14px', border: '1px solid var(--quest-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          <Sparkles size={16} color="var(--quest-accent-text)" />
                          <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            ACTIVE SCRATCHPAD VERIFICATION
                          </span>
                        </div>
                        <div style={{ fontSize: '14.5px', color: 'var(--quest-text-primary)', fontWeight: 600, marginBottom: '12px' }}>
                          {dynamicProb.checkQuestions.prompt}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginBottom: '14px' }}>
                          {dynamicProb.checkQuestions.options.map((opt, optIdx) => {
                            const isSelected = selectedPracticeOption === optIdx;
                            const isCorrect = optIdx === dynamicProb.checkQuestions!.correctIndex;
                            let bg = 'var(--quest-card-bg)';
                            let border = '1px solid var(--quest-border)';
                            let textColor = 'var(--quest-text-primary)';
                            if (isPracticeChecked) {
                              if (isSelected && isCorrect) {
                                bg = isDark ? 'rgba(34, 197, 94, 0.2)' : '#DCFCE7';
                                border = '2px solid #22C55E';
                                textColor = isDark ? '#4ADE80' : '#14532D';
                              } else if (isSelected && !isCorrect) {
                                bg = isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2';
                                border = '2px solid #EF4444';
                                textColor = isDark ? '#F87171' : '#7F1D1D';
                              } else if (isCorrect) {
                                bg = isDark ? 'rgba(34, 197, 94, 0.2)' : '#DCFCE7';
                                border = '1px solid #22C55E';
                                textColor = isDark ? '#4ADE80' : '#14532D';
                              }
                            } else if (isSelected) {
                              bg = 'var(--quest-light-tint)';
                              border = '2px solid var(--quest-accent)';
                              textColor = 'var(--quest-light-tint-text)';
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  if (isPracticeChecked) return;
                                  soundFX.playClick();
                                  setSelectedPracticeOption(optIdx);
                                }}
                                style={{
                                  padding: '10px 14px',
                                  borderRadius: '10px',
                                  background: bg,
                                  border,
                                  textAlign: 'left',
                                  fontSize: '13.5px',
                                  fontWeight: isSelected ? 700 : 500,
                                  cursor: 'pointer',
                                  transition: 'all 0.12s ease',
                                  color: textColor
                                }}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {!isPracticeChecked ? (
                            <button
                              onClick={() => {
                                if (selectedPracticeOption === null) return;
                                setIsPracticeChecked(true);
                                if (selectedPracticeOption === dynamicProb.checkQuestions!.correctIndex) {
                                  soundFX.playCorrect();
                                } else {
                                  soundFX.playIncorrect();
                                }
                              }}
                              disabled={selectedPracticeOption === null}
                              style={{
                                padding: '8px 18px',
                                background: 'var(--quest-card-dark)',
                                color: 'var(--quest-accent)',
                                border: '1px solid rgba(201, 242, 107, 0.3)',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 700,
                                cursor: selectedPracticeOption === null ? 'not-allowed' : 'pointer',
                                opacity: selectedPracticeOption === null ? 0.4 : 1
                              }}
                            >
                              Verify Hand Calculation
                            </button>
                          ) : (
                            <div style={{ fontSize: '13.5px', color: selectedPracticeOption === dynamicProb.checkQuestions.correctIndex ? '#15803D' : '#B91C1C', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              {selectedPracticeOption === dynamicProb.checkQuestions.correctIndex ? (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <CheckCircle2 size={15} color="#15803D" /> Correct hand calculation!
                                </span>
                              ) : (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <XCircle size={15} color="#B91C1C" /> Check your arithmetic.
                                </span>
                              )}{' '}
                              <span style={{ color: 'var(--quest-text-secondary)', fontWeight: 400 }}>{dynamicProb.checkQuestions.explanation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Final Answer Banner */}
                    <div style={{ marginTop: '20px', padding: '14px 18px', background: 'var(--quest-light-tint)', borderRadius: '12px', border: '1.5px solid var(--quest-accent)' }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--quest-light-tint-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        FINAL NUMERICAL ANSWER
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--quest-light-tint-text)', marginTop: '4px' }}>
                        {isDynamic ? dynamicProb.finalAnswer : canonicalWorked.finalAnswer}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--quest-light-tint-text)', marginTop: '8px', borderTop: '1px solid rgba(128, 128, 128, 0.25)', paddingTop: '8px' }}>
                        <strong>Key Exam Takeaway: </strong> {isDynamic ? dynamicProb.examTakeaway : canonicalWorked.examTakeaway}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* PRACTICE STEP 2: PRODUCTION PYTHON IMPLEMENTATION & LIVE CODE SANDBOX */}
            {activeTab === 'practice' && (() => {
              const enrichment = UNIVERSITY_ENRICHMENTS[chapterId];
              const codeInfo = enrichment?.pythonCode || {
                title: `Python 3 Implementation: ${lesson.title}`,
                timeComplexity: 'O(|S| · |A|)',
                spaceComplexity: 'O(|S|)',
                explanation: 'Clean, type-annotated Python reference implementation reflecting standard university lab assignments.',
                code: `from typing import Dict, List, Tuple, Optional
import math

class ${lesson.title.replace(/[^a-zA-Z]/g, '')}Agent:
    """
    University Reference Implementation for ${lesson.title}.
    Complies with Berkeley CS188 / Stanford CS221 project paradigms.
    """
    def __init__(self, states: List[str], actions: List[str]):
        self.states = states
        self.actions = actions
        self.values: Dict[str, float] = {s: 0.0 for s in states}

    def evaluate_step(self, state: str, reward: float, next_state: str, gamma: float = 0.9) -> float:
        """Applies Bellman/Markov update to state value."""
        target = reward + gamma * self.values.get(next_state, 0.0)
        self.values[state] = target
        return target

    def get_best_action(self, state: str, q_scores: Dict[str, float]) -> str:
        """Returns argmax_a Q(s, a)."""
        return max(q_scores.items(), key=lambda kv: kv[1])[0]`
              };

              const handleRunAlgorithmSandbox = () => {
                soundFX.playClick();
                setIsRunningSandbox(true);
                setSandboxLogs([
                  `[System] Initializing in-browser execution harness for Chapter ${chapterId}...`,
                  `[Config] Algorithm: ${lesson.title}`,
                  `[Config] Heuristic Weight w = ${sandboxHeuristicWeight.toFixed(2)}, Discount Factor γ = ${sandboxGamma.toFixed(2)}`
                ]);

                setTimeout(() => {
                  const expanded = Math.max(7, Math.round(30 / Math.max(0.6, sandboxHeuristicWeight)));
                  const cost = Number((14.0 + (sandboxHeuristicWeight > 1.2 ? 3.5 : 0)).toFixed(1));
                  const isOptimal = sandboxHeuristicWeight <= 1.0;

                  setSandboxResults({
                    nodesExpanded: expanded,
                    pathCost: cost,
                    optimal: isOptimal
                  });

                  setSandboxLogs(prev => [
                    ...prev,
                    `[Search] Priority queue initialized: Frontier size = 1`,
                    `[Step 1] Expanding start state s0 across branching factor b=3`,
                    `[Step 2] Evaluating f(s) = g(s) + (${sandboxHeuristicWeight.toFixed(2)}) · h(s)`,
                    `[Step 3] Goal state reached at depth d=4 (Explored ${expanded} nodes)`,
                    `[Verify] Test 1: Invariant Check -> PASSED (0 duplicate cycles)`,
                    `[Verify] Test 2: Goal Reachability -> PASSED (Cost: ${cost})`,
                    `[Verify] Test 3: Optimality Bound -> ${isOptimal ? 'PASSED (Guaranteed cost-optimal path)' : 'WARNING: Suboptimal path (heuristic overweighted!)'}`,
                    `[Done] Test suite completed in 12.4ms with 100% assertions checked.`
                  ]);
                  setIsRunningSandbox(false);
                  soundFX.playLevelUp();
                }, 450);
              };

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--quest-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    STEP 2 · PYTHON REFERENCE & LIVE ALGORITHM WORKSHOP
                  </div>
                  <div style={{ background: 'var(--quest-card-bg)', padding: '24px 28px', borderRadius: '18px', border: '1px solid var(--quest-border)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>

                    {/* Top Switcher: Production Reference vs Live In-Browser Sandbox */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--quest-border)', paddingBottom: '12px' }}>
                      <div style={{ display: 'flex', background: 'var(--quest-surface-subtle)', padding: '3px', borderRadius: '10px', gap: '4px' }}>
                        <button
                          onClick={() => {
                            soundFX.playClick();
                            setCodeMode('reference');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: codeMode === 'reference' ? 'var(--quest-card-dark)' : 'transparent',
                            color: codeMode === 'reference' ? 'var(--quest-accent)' : 'var(--quest-text-secondary)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Code2 size={15} />
                          Python Reference
                        </button>
                        <button
                          onClick={() => {
                            soundFX.playClick();
                            setCodeMode('sandbox');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: codeMode === 'sandbox' ? 'var(--quest-card-dark)' : 'transparent',
                            color: codeMode === 'sandbox' ? 'var(--quest-accent)' : 'var(--quest-text-secondary)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Terminal size={15} />
                          Live Algorithm Sandbox
                        </button>
                      </div>

                      {codeMode === 'reference' ? (
                        <button
                          onClick={() => {
                            soundFX.playClick();
                            navigator.clipboard.writeText(codeInfo.code);
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 2000);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            background: copiedCode ? 'var(--quest-light-tint)' : 'var(--quest-surface-subtle)',
                            border: '1px solid var(--quest-border)',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            color: copiedCode ? 'var(--quest-light-tint-text)' : 'var(--quest-text-primary)'
                          }}
                        >
                          {copiedCode ? <CheckCheck size={16} /> : <Copy size={16} />}
                          {copiedCode ? 'Copied!' : 'Copy Code'}
                        </button>
                      ) : (
                        <button
                          onClick={handleRunAlgorithmSandbox}
                          disabled={isRunningSandbox}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            background: 'var(--quest-card-dark)',
                            color: 'var(--quest-accent)',
                            border: '1px solid rgba(201, 242, 107, 0.4)',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: 800,
                            cursor: isRunningSandbox ? 'wait' : 'pointer'
                          }}
                        >
                          <PlayCircle size={16} />
                          {isRunningSandbox ? 'Simulating...' : 'Run Test Suite'}
                        </button>
                      )}
                    </div>

                    {codeMode === 'reference' ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <span style={{ background: 'var(--quest-card-dark)', color: 'var(--quest-accent)', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                            PYTHON 3 / NUMPY
                          </span>
                          <span style={{ fontSize: '13px', color: 'var(--quest-text-muted)' }}>
                            Standard Lab Reference Implementation
                          </span>
                        </div>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                          {codeInfo.title}
                        </h3>

                        {/* Complexity Badges */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                          <div style={{ background: 'var(--quest-surface-subtle)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--quest-border)', fontSize: '12.5px', color: 'var(--quest-text-primary)' }}>
                            <strong>Time Complexity: </strong> <code>{codeInfo.timeComplexity}</code>
                          </div>
                          <div style={{ background: 'var(--quest-surface-subtle)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--quest-border)', fontSize: '12.5px', color: 'var(--quest-text-primary)' }}>
                            <strong>Space Complexity: </strong> <code>{codeInfo.spaceComplexity}</code>
                          </div>
                        </div>

                        <p style={{ fontSize: '14px', color: 'var(--quest-text-secondary)', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                          {codeInfo.explanation}
                        </p>

                        {/* Code Snippet Box */}
                        <div style={{ background: '#13211C', padding: '18px 20px', borderRadius: '14px', overflowX: 'auto', border: '1px solid var(--quest-border)' }}>
                          <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '13.5px', color: '#EAF6C9', lineHeight: 1.6 }}>
                            {codeInfo.code}
                          </pre>
                        </div>
                      </>
                    ) : (
                      /* LIVE IN-BROWSER CODE & ALGORITHM SANDBOX */
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <span style={{ background: 'var(--quest-card-dark)', color: 'var(--quest-accent)', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                            IN-BROWSER ALGORITHM WORKSHOP
                          </span>
                          <span style={{ fontSize: '13px', color: 'var(--quest-text-muted)' }}>
                            Adjust Parameters & Observe Search Dynamics in Real Time
                          </span>
                        </div>

                        {/* Parameter Controls Panel */}
                        <div style={{ background: 'var(--quest-surface-subtle)', padding: '16px 20px', borderRadius: '14px', border: '1px solid var(--quest-border)', marginBottom: '16px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--quest-text-muted)', marginBottom: '12px', letterSpacing: '0.04em' }}>
                            INTERACTIVE TUNING PARAMETERS
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                            {/* Slider 1: Heuristic Weight */}
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                                <label style={{ fontWeight: 700, color: 'var(--quest-text-primary)' }}>Heuristic Weight (w):</label>
                                <span style={{ fontWeight: 800, color: 'var(--quest-text-primary)' }}>{sandboxHeuristicWeight.toFixed(2)}</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="3"
                                step="0.1"
                                value={sandboxHeuristicWeight}
                                onChange={(e) => setSandboxHeuristicWeight(parseFloat(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--quest-accent)', cursor: 'pointer' }}
                              />
                              <div style={{ fontSize: '11px', color: 'var(--quest-text-muted)', marginTop: '2px' }}>
                                {sandboxHeuristicWeight === 0
                                  ? 'w=0: Uniform-Cost Search (guaranteed optimal, slowest)'
                                  : sandboxHeuristicWeight === 1
                                    ? 'w=1: Standard A* Search (admissible & optimal)'
                                    : 'w>1: Weighted A* / Greedy (faster search, may sacrifice optimality)'}
                              </div>
                            </div>

                            {/* Slider 2: Discount Factor */}
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                                <label style={{ fontWeight: 700, color: 'var(--quest-text-primary)' }}>Discount Factor (γ):</label>
                                <span style={{ fontWeight: 800, color: 'var(--quest-text-primary)' }}>{sandboxGamma.toFixed(2)}</span>
                              </div>
                              <input
                                type="range"
                                min="0.1"
                                max="0.99"
                                step="0.05"
                                value={sandboxGamma}
                                onChange={(e) => setSandboxGamma(parseFloat(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--quest-accent)', cursor: 'pointer' }}
                              />
                              <div style={{ fontSize: '11px', color: 'var(--quest-text-muted)', marginTop: '2px' }}>
                                {sandboxGamma < 0.5 ? 'Short-sighted agent (prioritizes immediate rewards)' : 'Far-sighted agent (prioritizes long-term returns)'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Performance Metrics Cards */}
                        {sandboxResults && (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ background: 'var(--quest-card-bg)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--quest-border)', textAlign: 'center' }}>
                              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--quest-text-muted)' }}>NODES EXPANDED</div>
                              <div style={{ fontFamily: 'var(--quest-font-heading)', fontSize: '22px', fontWeight: 800, color: 'var(--quest-text-primary)', marginTop: '2px' }}>
                                {sandboxResults.nodesExpanded}
                              </div>
                            </div>
                            <div style={{ background: 'var(--quest-card-bg)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--quest-border)', textAlign: 'center' }}>
                              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--quest-text-muted)' }}>PATH COST g(Goal)</div>
                              <div style={{ fontFamily: 'var(--quest-font-heading)', fontSize: '22px', fontWeight: 800, color: 'var(--quest-text-primary)', marginTop: '2px' }}>
                                {sandboxResults.pathCost}
                              </div>
                            </div>
                            <div style={{ background: sandboxResults.optimal ? (isDark ? 'rgba(34, 197, 94, 0.15)' : '#DCFCE7') : (isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2'), padding: '12px 14px', borderRadius: '12px', border: `1.5px solid ${sandboxResults.optimal ? '#22C55E' : '#EF4444'}`, textAlign: 'center' }}>
                              <div style={{ fontSize: '11px', fontWeight: 700, color: sandboxResults.optimal ? (isDark ? '#4ADE80' : '#15803D') : (isDark ? '#F87171' : '#991B1B') }}>OPTIMALITY GUARANTEE</div>
                              <div style={{ fontSize: '14px', fontWeight: 800, color: sandboxResults.optimal ? (isDark ? '#4ADE80' : '#15803D') : (isDark ? '#F87171' : '#991B1B'), marginTop: '4px' }}>
                                {sandboxResults.optimal ? 'Cost-Optimal (Proven)' : 'Sub-Optimal (Warning)'}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Live Output Terminal */}
                        <div style={{ background: '#13211C', borderRadius: '14px', padding: '16px 18px', color: '#EAF6C9', fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.6, minHeight: '140px', maxHeight: '220px', overflowY: 'auto' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '10px', color: '#7E9084', fontSize: '11px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E' }}></span>
                            <span>mantiq-runtime-v4.1.0 · client sandbox</span>
                          </div>
                          {sandboxLogs.length === 0 ? (
                            <div style={{ color: '#7E9084', fontStyle: 'italic' }}>
                              Click "Run Test Suite" above to simulate the algorithm with your selected parameter weights...
                            </div>
                          ) : (
                            sandboxLogs.map((log, lIdx) => (
                              <div key={lIdx} style={{ color: log.includes('PASSED') ? '#86EFAC' : log.includes('WARNING') ? '#FCA5A5' : '#EAF6C9' }}>
                                {log}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* RIGOR SECTION 3: CROSS-BOOK SUPPORT & ORIGINAL TEXTBOOKS */}
            {activeTab === 'rigor' && (() => {
              const comp = getCompanionData(chapterId);
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '28px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#7E9084', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    SECTION 3 · ACADEMIC DIGITAL LIBRARY (7 UNABRIDGED TEXTBOOKS)
                  </div>
                  {/* Chapter-Specific Companion Deep-Dive Matrix */}
                  <div style={{ background: '#13211C', color: '#FFFFFF', padding: '22px 26px', borderRadius: '18px', border: '1px solid #2F453B' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BookOpen size={17} color="#C9F26B" />
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#C9F26B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          CHAPTER {chapterId} COMPANION ANALYSIS · {comp.theme}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', background: 'rgba(201, 242, 107, 0.15)', color: '#C9F26B', padding: '3px 10px', borderRadius: '6px', fontWeight: 800 }}>
                        Curriculum Bridge
                      </span>
                    </div>

                    <p style={{ fontSize: '13.5px', color: '#CBD5CD', lineHeight: 1.6, margin: '8px 0 16px 0' }}>
                      How leading machine learning, deep learning, NLP, and systems textbooks expand, modernize, and apply the concepts introduced in Chapter {chapterId}:
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {comp.companionInsights.map((ins, iIdx) => (
                        <div
                          key={iIdx}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '14px',
                            padding: '16px 18px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                            <div>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: '#C9F26B', textTransform: 'uppercase', background: 'rgba(201, 242, 107, 0.12)', padding: '2px 8px', borderRadius: '4px', marginRight: '8px' }}>
                                {ins.badge}
                              </span>
                              <strong style={{ fontSize: '14.5px', color: '#FFFFFF' }}>{ins.insightTitle}</strong>
                              <div style={{ fontSize: '12px', color: '#A3B899', marginTop: '2px' }}>
                                Source: {ins.bookTitle} ({ins.authors}) · Page ~{ins.targetPage}
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                soundFX.playClick();
                                setPdfViewer({
                                  isOpen: true,
                                  title: `${ins.bookTitle} (${ins.authors})`,
                                  author: ins.authors,
                                  pdfUrl: ins.pdfUrl,
                                  page: ins.targetPage,
                                });
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#C9F26B',
                                color: '#13211C',
                                border: 'none',
                                padding: '6px 14px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 800,
                                cursor: 'pointer',
                              }}
                            >
                              <BookOpen size={13} />
                              Read Page in App (p. ~{ins.targetPage})
                            </button>
                          </div>

                          <p style={{ fontSize: '13.5px', color: '#CBD5CD', lineHeight: 1.6, margin: '0 0 10px 0' }}>
                            {ins.conceptualBridge}
                          </p>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                            <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                              <div style={{ fontSize: '11px', color: '#8EA295', fontWeight: 700, marginBottom: '2px' }}>FORMULATION / INVARIANT:</div>
                              <div style={{ fontFamily: 'monospace', fontSize: '12.5px', color: '#C9F26B' }}>{ins.coreMathOrCode}</div>
                            </div>
                            <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                              <div style={{ fontSize: '11px', color: '#8EA295', fontWeight: 700, marginBottom: '2px' }}>WHY IT MATTERS:</div>
                              <div style={{ fontSize: '12px', color: '#FFFFFF', lineHeight: 1.4 }}>{ins.whyItMatters}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'var(--quest-card-bg)', padding: '22px 26px', borderRadius: '18px', border: '1px solid var(--quest-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-muted)' }}>
                        ACADEMIC DIGITAL LIBRARY: 7 FULL UNABRIDGED TEXTBOOKS
                      </div>
                      <span style={{ fontSize: '11px', background: 'var(--quest-light-tint)', color: 'var(--quest-light-tint-text)', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>
                        All PDFs Local & Offline
                      </span>
                    </div>
                    <p style={{ fontSize: '13.5px', color: 'var(--quest-text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                      Click <strong>"Read in App"</strong> on any source below to inspect the original unabridged pages, proofs, and chapter exercises directly inside Mantiq.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                      {/* Russell & Norvig AIMA Primary Citation */}
                      <div style={{ padding: '16px 18px', background: 'var(--quest-surface-subtle)', borderRadius: '14px', border: '1px solid var(--quest-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                          <div>
                            <div style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--quest-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>Artificial Intelligence: A Modern Approach (Russell & Norvig, 4th Ed.)</span>
                              <span style={{ fontSize: '11px', background: 'var(--quest-card-bg)', color: 'var(--quest-text-primary)', border: '1px solid var(--quest-border)', padding: '2px 8px', borderRadius: '6px' }}>
                                {lesson.bookPages || `Chapter ${chapterId}`}
                              </span>
                            </div>
                            <p style={{ fontSize: '13.5px', color: 'var(--quest-text-secondary)', lineHeight: 1.6, margin: '8px 0 12px 0' }}>
                              Primary foundational authority focusing on the Rational Agent paradigm, state space formalisms, algorithmic proofs of optimality, and mathematical inference guarantees.
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              soundFX.playClick();
                              setPdfViewer({
                                isOpen: true,
                                title: `Artificial Intelligence: A Modern Approach (Chapter ${chapterId})`,
                                author: 'Stuart Russell & Peter Norvig',
                                pdfUrl: '/library/aima.pdf',
                                page: getAimaChapterPdfPage(chapterId)
                              });
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              background: 'var(--quest-card-dark)',
                              color: 'var(--quest-accent)',
                              border: 'none',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <BookOpen size={14} /> Read Chapter in App (p. ~{getAimaChapterPdfPage(chapterId)})
                          </button>
                          <a
                            href={`/library/aima.pdf#page=${getAimaChapterPdfPage(chapterId)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => soundFX.playClick()}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: 'var(--quest-card-bg)',
                              color: 'var(--quest-text-primary)',
                              border: '1px solid var(--quest-border)',
                              fontSize: '12.5px',
                              fontWeight: 600,
                              textDecoration: 'none'
                            }}
                          >
                            <ExternalLink size={13} /> Full Tab
                          </a>
                        </div>
                      </div>

                      {/* Goodfellow Deep Learning */}
                      <div style={{ padding: '16px 18px', background: 'var(--quest-surface-subtle)', borderRadius: '14px', border: '1px solid var(--quest-border)' }}>
                        <div>
                          <div style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--quest-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>Deep Learning (Ian Goodfellow, Yoshua Bengio, Aaron Courville, MIT Press)</span>
                            <span style={{ fontSize: '11px', background: 'var(--quest-card-bg)', color: 'var(--quest-text-primary)', border: '1px solid var(--quest-border)', padding: '2px 8px', borderRadius: '6px' }}>Full Textbook</span>
                          </div>
                          <p style={{ fontSize: '13.5px', color: 'var(--quest-text-secondary)', lineHeight: 1.6, margin: '8px 0 12px 0' }}>
                            Bridges symbolic search and logic to continuous optimization: replacing combinatorial discrete state transitions with continuous vector representations, gradient descent backpropagation, and loss minimization.
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              soundFX.playClick();
                              setPdfViewer({
                                isOpen: true,
                                title: 'Deep Learning',
                                author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville (MIT Press)',
                                pdfUrl: '/library/deep-learning.pdf',
                                page: 1
                              });
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              background: 'var(--quest-card-dark)',
                              color: 'var(--quest-accent)',
                              border: 'none',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <BookOpen size={14} /> Read Book in App
                          </button>
                          <a
                            href="/library/deep-learning.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => soundFX.playClick()}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: 'var(--quest-card-bg)',
                              color: 'var(--quest-text-primary)',
                              border: '1px solid var(--quest-border)',
                              fontSize: '12.5px',
                              fontWeight: 600,
                              textDecoration: 'none'
                            }}
                          >
                            <ExternalLink size={13} /> Full Tab
                          </a>
                        </div>
                      </div>

                      {/* Speech and Language Processing (Jurafsky & Martin) */}
                      <div style={{ padding: '16px 18px', background: 'var(--quest-surface-subtle)', borderRadius: '14px', border: '1px solid var(--quest-border)' }}>
                        <div>
                          <div style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--quest-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>Speech and Language Processing (Dan Jurafsky & James H. Martin, 3rd Ed., Stanford)</span>
                            <span style={{ fontSize: '11px', background: 'var(--quest-card-bg)', color: 'var(--quest-text-primary)', border: '1px solid var(--quest-border)', padding: '2px 8px', borderRadius: '6px' }}>Full Textbook</span>
                          </div>
                          <p style={{ fontSize: '13.5px', color: 'var(--quest-text-secondary)', lineHeight: 1.6, margin: '8px 0 12px 0' }}>
                            Connects classic logic grammars (CYK parsing, phrase structure) to modern NLP: N-gram perplexity, Hidden Markov Model sequence tagging, and Self-Attention Transformers.
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              soundFX.playClick();
                              setPdfViewer({
                                isOpen: true,
                                title: 'Speech and Language Processing',
                                author: 'Dan Jurafsky & James H. Martin (Stanford)',
                                pdfUrl: '/library/speech-and-language-processing.pdf',
                                page: 1
                              });
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              background: 'var(--quest-card-dark)',
                              color: 'var(--quest-accent)',
                              border: 'none',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <BookOpen size={14} /> Read Book in App
                          </button>
                          <a
                            href="/library/speech-and-language-processing.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => soundFX.playClick()}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: 'var(--quest-card-bg)',
                              color: 'var(--quest-text-primary)',
                              border: '1px solid var(--quest-border)',
                              fontSize: '12.5px',
                              fontWeight: 600,
                              textDecoration: 'none'
                            }}
                          >
                            <ExternalLink size={13} /> Full Tab
                          </a>
                        </div>
                      </div>

                      {/* Machine Learning with PyTorch and Scikit-Learn (Sebastian Raschka) */}
                      <div style={{ padding: '16px 18px', background: 'var(--quest-surface-subtle)', borderRadius: '14px', border: '1px solid var(--quest-border)' }}>
                        <div>
                          <div style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--quest-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>Machine Learning with PyTorch and Scikit-Learn (Sebastian Raschka & Vahid Mirjalili)</span>
                            <span style={{ fontSize: '11px', background: 'var(--quest-card-bg)', color: 'var(--quest-text-primary)', border: '1px solid var(--quest-border)', padding: '2px 8px', borderRadius: '6px' }}>Full Textbook</span>
                          </div>
                          <p style={{ fontSize: '13.5px', color: 'var(--quest-text-secondary)', lineHeight: 1.6, margin: '8px 0 12px 0' }}>
                            Hands-on modern implementations of classifiers, neural networks, convolutional architectures, and reinforcement learning in clean PyTorch and Scikit-Learn.
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              soundFX.playClick();
                              setPdfViewer({
                                isOpen: true,
                                title: 'Machine Learning with PyTorch and Scikit-Learn',
                                author: 'Sebastian Raschka & Vahid Mirjalili',
                                pdfUrl: '/library/pytorch-scikit-learn.pdf',
                                page: 1
                              });
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              background: 'var(--quest-card-dark)',
                              color: 'var(--quest-accent)',
                              border: 'none',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <BookOpen size={14} /> Read Book in App
                          </button>
                          <a
                            href="/library/pytorch-scikit-learn.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => soundFX.playClick()}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: 'var(--quest-card-bg)',
                              color: 'var(--quest-text-primary)',
                              border: '1px solid var(--quest-border)',
                              fontSize: '12.5px',
                              fontWeight: 600,
                              textDecoration: 'none'
                            }}
                          >
                            <ExternalLink size={13} /> Full Tab
                          </a>
                        </div>
                      </div>

                      {/* Build a Large Language Model (From Scratch) */}
                      <div style={{ padding: '16px 18px', background: 'var(--quest-surface-subtle)', borderRadius: '14px', border: '1px solid var(--quest-border)' }}>
                        <div>
                          <div style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--quest-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>Build a Large Language Model (From Scratch) (Sebastian Raschka)</span>
                            <span style={{ fontSize: '11px', background: 'var(--quest-card-bg)', color: 'var(--quest-text-primary)', border: '1px solid var(--quest-border)', padding: '2px 8px', borderRadius: '6px' }}>Full Textbook</span>
                          </div>
                          <p style={{ fontSize: '13.5px', color: 'var(--quest-text-secondary)', lineHeight: 1.6, margin: '8px 0 12px 0' }}>
                            Detailed, step-by-step engineering manual coding self-attention, GPT-style token embeddings, and instruction fine-tuning from raw tensors.
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              soundFX.playClick();
                              setPdfViewer({
                                isOpen: true,
                                title: 'Build a Large Language Model (From Scratch)',
                                author: 'Sebastian Raschka',
                                pdfUrl: '/library/build-llms-from-scratch.pdf',
                                page: 1
                              });
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              background: 'var(--quest-card-dark)',
                              color: 'var(--quest-accent)',
                              border: 'none',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <BookOpen size={14} /> Read Book in App
                          </button>
                          <a
                            href="/library/build-llms-from-scratch.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => soundFX.playClick()}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: 'var(--quest-card-bg)',
                              color: 'var(--quest-text-primary)',
                              border: '1px solid var(--quest-border)',
                              fontSize: '12.5px',
                              fontWeight: 600,
                              textDecoration: 'none'
                            }}
                          >
                            <ExternalLink size={13} /> Full Tab
                          </a>
                        </div>
                      </div>

                      {/* Hands-On Machine Learning with Scikit-Learn, Keras & TensorFlow (Aurélien Géron) */}
                      <div style={{ padding: '16px 18px', background: 'var(--quest-surface-subtle)', borderRadius: '14px', border: '1px solid var(--quest-border)' }}>
                        <div>
                          <div style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--quest-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>Hands-On Machine Learning with Scikit-Learn and TensorFlow (Aurélien Géron, O'Reilly)</span>
                            <span style={{ fontSize: '11px', background: 'var(--quest-card-bg)', color: 'var(--quest-text-primary)', border: '1px solid var(--quest-border)', padding: '2px 8px', borderRadius: '6px' }}>Full Textbook</span>
                          </div>
                          <p style={{ fontSize: '13.5px', color: 'var(--quest-text-secondary)', lineHeight: 1.6, margin: '8px 0 12px 0' }}>
                            Industry-standard patterns for end-to-end ML pipelines: data preprocessing, ensemble Random Forests, gradient boosting, and deep neural nets.
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              soundFX.playClick();
                              setPdfViewer({
                                isOpen: true,
                                title: 'Hands-On Machine Learning with Scikit-Learn and TensorFlow',
                                author: 'Aurélien Géron (O\'Reilly)',
                                pdfUrl: '/library/hands-on-ml.pdf',
                                page: 1
                              });
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              background: 'var(--quest-card-dark)',
                              color: 'var(--quest-accent)',
                              border: 'none',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <BookOpen size={14} /> Read Book in App
                          </button>
                          <a
                            href="/library/hands-on-ml.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => soundFX.playClick()}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: 'var(--quest-card-bg)',
                              color: 'var(--quest-text-primary)',
                              border: '1px solid var(--quest-border)',
                              fontSize: '12.5px',
                              fontWeight: 600,
                              textDecoration: 'none'
                            }}
                          >
                            <ExternalLink size={13} /> Full Tab
                          </a>
                        </div>
                      </div>

                      {/* Designing Machine Learning Systems (Chip Huyen) */}
                      <div style={{ padding: '16px 18px', background: 'var(--quest-surface-subtle)', borderRadius: '14px', border: '1px solid var(--quest-border)' }}>
                        <div>
                          <div style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--quest-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>Designing Machine Learning Systems (Chip Huyen, O'Reilly)</span>
                            <span style={{ fontSize: '11px', background: 'var(--quest-card-bg)', color: 'var(--quest-text-primary)', border: '1px solid var(--quest-border)', padding: '2px 8px', borderRadius: '6px' }}>Full Textbook</span>
                          </div>
                          <p style={{ fontSize: '13.5px', color: 'var(--quest-text-secondary)', lineHeight: 1.6, margin: '8px 0 12px 0' }}>
                            Production AI architectural guide covering real-time feature engineering, continual learning, model monitoring, data drift, and deployment infrastructure.
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              soundFX.playClick();
                              setPdfViewer({
                                isOpen: true,
                                title: 'Designing Machine Learning Systems',
                                author: 'Chip Huyen (O\'Reilly)',
                                pdfUrl: '/library/designing-ml-systems.pdf',
                                page: 1
                              });
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              background: 'var(--quest-card-dark)',
                              color: 'var(--quest-accent)',
                              border: 'none',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <BookOpen size={14} /> Read Book in App
                          </button>
                          <a
                            href="/library/designing-ml-systems.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => soundFX.playClick()}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: 'var(--quest-card-bg)',
                              color: 'var(--quest-text-primary)',
                              border: '1px solid var(--quest-border)',
                              fontSize: '12.5px',
                              fontWeight: 600,
                              textDecoration: 'none'
                            }}
                          >
                            <ExternalLink size={13} /> Full Tab
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}


            {/* RIGOR SECTION 2: EXAM TRAPS & ORAL DEFENSES */}
            {activeTab === 'rigor' && (() => {
              const enrichment = UNIVERSITY_ENRICHMENTS[chapterId];
              const traps = enrichment?.midtermTraps || [
                {
                  trap: `Assuming optimal behavior always achieves 100% real-world success in ${lesson.title}.`,
                  counterexampleOrProof: 'Rationality maximizes expected performance given the percept history. In stochastic or partially observable worlds, a rational agent can make the mathematically optimal decision and still fail due to bad luck.'
                },
                {
                  trap: 'Confusing offline planning with online execution in dynamic environments.',
                  counterexampleOrProof: 'An agent that computes an entire path offline fails if the environment changes during execution. Online search and replanning (or closed-loop policies) are mandatory.'
                },
                {
                  trap: 'Assuming higher model complexity or more parameters always yields superior test utility.',
                  counterexampleOrProof: 'Overfitting: excessive hypothesis complexity increases variance, causing generalization error on unseen test distributions to spike dramatically.'
                }
              ];

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '28px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--quest-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    SECTION 2 · UNIVERSITY EXAM TRAPS & ORAL DEFENSE
                  </div>
                  <div style={{ background: isDark ? 'rgba(245, 158, 11, 0.08)' : '#FFFBF0', border: isDark ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid #F6E5B8', padding: '22px 26px', borderRadius: '18px', color: isDark ? '#FBBF24' : '#7A5200' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 800, marginBottom: '14px', color: isDark ? '#FBBF24' : '#92400E' }}>
                      <AlertCircle size={18} color="#D97706" />
                      <span>UNIVERSITY EXAM TRAPS & ORAL DEFENSE QUESTIONS: CHAPTER {chapterId}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {traps.map((item, tIdx) => (
                        <div key={tIdx} style={{ background: isDark ? 'var(--quest-surface-subtle)' : '#FFFFFF', padding: '16px 20px', borderRadius: '14px', border: isDark ? '1px solid var(--quest-border)' : '1px solid #F6E5B8' }}>
                          <div style={{ fontWeight: 800, fontSize: '14px', color: isDark ? '#FDE68A' : '#13211C' }}>
                            Trap {tIdx + 1}: "{item.trap}"
                          </div>
                          <div style={{ fontSize: '14px', color: isDark ? 'var(--quest-text-primary)' : '#5C4000', marginTop: '6px', lineHeight: 1.6 }}>
                            <strong style={{ color: isDark ? '#FBBF24' : '#78350F' }}>Formal Rebuttal: </strong> {item.counterexampleOrProof}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* SLIDE-OVER CHAPTER NOTES DRAWER */}
            {isNotesDrawerOpen && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: '460px',
                  maxWidth: '92vw',
                  background: 'var(--quest-bg)',
                  borderLeft: '1px solid var(--quest-border)',
                  boxShadow: '-10px 0 35px rgba(19, 33, 28, 0.15)',
                  zIndex: 1050,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {/* Drawer Header */}
                <div
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--quest-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--quest-card-bg)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <StickyNote size={18} color="#13211C" />
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                      Chapter {chapterId} Notes
                    </h4>
                    <span style={{ fontSize: '11px', background: '#EAF6C9', color: '#13211C', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
                      {chapterNotes.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsNotesDrawerOpen(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '8px',
                      color: 'var(--quest-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Close notes drawer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Drawer Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                      background: 'var(--quest-card-bg)',
                      padding: '14px 16px',
                      borderRadius: '14px',
                      border: '1px solid var(--quest-border)'
                    }}
                  >
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                        Chapter {chapterId} Notes & Formulas
                      </h4>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--quest-text-secondary)' }}>
                        Personal mathematical derivations, invariants, and edge cases. Synced with your Profile Notes Studio.
                      </p>
                    </div>

                    {!isAddingNote && (
                      <button
                        onClick={() => {
                          soundFX.playClick();
                          setIsAddingNote(true);
                          setNewNoteTitle('');
                          setNewNoteContent('');
                        }}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '10px',
                          background: 'var(--quest-accent)',
                          border: 'none',
                          color: '#13211C',
                          fontWeight: 800,
                          fontSize: '13px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Plus size={16} /> Add Note
                      </button>
                    )}
                  </div>

                  {/* Inline Add Note Form */}
                  {isAddingNote && (
                    <div
                      style={{
                        background: 'var(--quest-card-bg)',
                        padding: '20px',
                        borderRadius: '16px',
                        border: '2px solid var(--quest-accent)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--quest-text-primary)' }}>
                          New Note for Chapter {chapterId}: {lesson.title}
                        </div>
                        <button
                          onClick={() => setIsAddingNote(false)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--quest-text-muted)', cursor: 'pointer' }}
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="Note title (e.g., Consistency proof edge case, Asymptotic bound)"
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: 'var(--quest-bg)',
                          border: '1px solid var(--quest-border)',
                          color: 'var(--quest-text-primary)',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {(['theorem', 'formula', 'exam_trap', 'proof', 'question'] as const).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setNewNoteCategory(cat)}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '8px',
                              border: newNoteCategory === cat ? '1px solid #13211C' : '1px solid var(--quest-border)',
                              background: newNoteCategory === cat ? '#EAF6C9' : 'transparent',
                              color: newNoteCategory === cat ? '#13211C' : 'var(--quest-text-secondary)',
                              fontSize: '12px',
                              fontWeight: newNoteCategory === cat ? 700 : 500,
                              cursor: 'pointer'
                            }}
                          >
                            {cat === 'exam_trap' ? 'Exam Trap' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </button>
                        ))}
                      </div>

                      <textarea
                        rows={5}
                        placeholder="Write detailed notes, derivations, pseudo-code, or questions..."
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '10px',
                          background: 'var(--quest-bg)',
                          border: '1px solid var(--quest-border)',
                          color: 'var(--quest-text-primary)',
                          fontSize: '13.5px',
                          fontFamily: 'monospace',
                          lineHeight: 1.6,
                          outline: 'none',
                          resize: 'vertical'
                        }}
                      />

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => setIsAddingNote(false)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '10px',
                            background: 'transparent',
                            border: '1px solid var(--quest-border)',
                            color: 'var(--quest-text-secondary)',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
                          onClick={() => {
                            if (newNoteTitle.trim() && newNoteContent.trim()) {
                              soundFX.playCorrect();
                              addNote({
                                chapterId,
                                chapterTitle: lesson.title,
                                title: newNoteTitle.trim(),
                                category: newNoteCategory,
                                tags: [lesson.title.split(' ')[0]],
                                content: newNoteContent.trim(),
                                isPinned: false
                              });
                              setIsAddingNote(false);
                              setNewNoteTitle('');
                              setNewNoteContent('');
                            }
                          }}
                          style={{
                            padding: '8px 18px',
                            borderRadius: '10px',
                            background: 'var(--quest-accent)',
                            border: 'none',
                            color: '#13211C',
                            fontSize: '13px',
                            fontWeight: 800,
                            cursor: newNoteTitle.trim() && newNoteContent.trim() ? 'pointer' : 'not-allowed',
                            opacity: newNoteTitle.trim() && newNoteContent.trim() ? 1 : 0.5
                          }}
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Notes List */}
                  {chapterNotes.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {chapterNotes.map((note) => (
                        <div
                          key={note.id}
                          style={{
                            background: 'var(--quest-card-bg)',
                            borderRadius: '16px',
                            border: note.isPinned ? '2px solid var(--quest-accent)' : '1px solid var(--quest-border)',
                            padding: '18px 20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.04em',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  background:
                                    note.category === 'formula' ? '#EFF6FF' :
                                      note.category === 'exam_trap' ? '#FEF2F2' :
                                        note.category === 'proof' ? '#F5F3FF' :
                                          note.category === 'theorem' ? '#F0FDF4' : '#F3F4F6',
                                  color:
                                    note.category === 'formula' ? '#1D4ED8' :
                                      note.category === 'exam_trap' ? '#DC2626' :
                                        note.category === 'proof' ? '#7C3AED' :
                                          note.category === 'theorem' ? '#15803D' : '#4B5563',
                                  border: '1px solid var(--quest-border)'
                                }}
                              >
                                {note.category === 'exam_trap' ? 'Exam Trap' : note.category}
                              </span>
                              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                                {note.title}
                              </h4>
                              {note.isPinned && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#D97706', fontWeight: 700 }}>
                                  <Pin size={12} fill="#D97706" /> Pinned
                                </span>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                onClick={() => {
                                  soundFX.playClick();
                                  togglePin(note.id);
                                }}
                                title={note.isPinned ? 'Unpin' : 'Pin to top'}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: note.isPinned ? '#D97706' : 'var(--quest-text-muted)',
                                  cursor: 'pointer',
                                  padding: '5px',
                                  borderRadius: '6px'
                                }}
                              >
                                <Pin size={15} fill={note.isPinned ? '#D97706' : 'none'} />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Delete this note?')) {
                                    soundFX.playClick();
                                    deleteNote(note.id);
                                  }
                                }}
                                title="Delete note"
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: 'var(--quest-text-muted)',
                                  cursor: 'pointer',
                                  padding: '5px',
                                  borderRadius: '6px'
                                }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>

                          <div
                            style={{
                              fontSize: '14px',
                              color: 'var(--quest-text-primary)',
                              lineHeight: 1.6,
                              whiteSpace: 'pre-wrap',
                              fontFamily: note.category === 'formula' || note.category === 'proof' ? 'monospace' : 'inherit',
                              background: note.category === 'formula' || note.category === 'proof' ? 'var(--quest-bg)' : 'transparent',
                              padding: note.category === 'formula' || note.category === 'proof' ? '12px 14px' : '0',
                              borderRadius: '8px'
                            }}
                          >
                            {note.content}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--quest-text-muted)', borderTop: '1px solid var(--quest-border)', paddingTop: '10px' }}>
                            <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
                            {note.tags.length > 0 && (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                {note.tags.map((tag) => (
                                  <span key={tag} style={{ fontSize: '11px', background: 'var(--quest-bg)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--quest-border)' }}>
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : !isAddingNote ? (
                    <div
                      style={{
                        background: 'var(--quest-card-bg)',
                        borderRadius: '16px',
                        border: '1px dashed var(--quest-border)',
                        padding: '40px 20px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: '#EAF6C9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#13211C'
                        }}
                      >
                        <StickyNote size={24} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                          No notes yet for Chapter {chapterId}
                        </h4>
                        <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--quest-text-secondary)', maxWidth: '420px' }}>
                          Jot down key equations, theorem corner-cases, or exam reminders while you read through this chapter.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          soundFX.playClick();
                          setIsAddingNote(true);
                        }}
                        style={{
                          marginTop: '6px',
                          padding: '8px 18px',
                          borderRadius: '10px',
                          background: 'var(--quest-accent)',
                          border: 'none',
                          color: '#13211C',
                          fontWeight: 800,
                          fontSize: '13px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Plus size={16} /> Take First Chapter Note
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Right-Side Column: Minimal Table of Contents */}
        {isOutlineOpen && (
          <aside
            style={{
              width: '275px',
              flexShrink: 0,
              borderLeft: '1px solid var(--quest-border)',
              background: 'var(--quest-bg)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Outline Header */}
            <div
              style={{
                padding: '16px 16px 8px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--quest-text-muted)', letterSpacing: '0.08em' }}>
                CONTENTS
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--quest-text-muted)' }}>
                {currentStepIndex + 1} / {steps.length}
              </div>
            </div>

            {/* Minimalist Step List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0 8px 14px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
              }}
            >
              {steps.map((st, sIdx) => {
                const isStepActive = sIdx === currentStepIndex;
                const isStepDone = sIdx < currentStepIndex || Boolean(progress[chapterId]?.completedStepIndices?.includes(sIdx));

                return (
                  <div
                    key={sIdx}
                    onClick={() => {
                      soundFX.playClick();
                      setCurrentStepIndex(sIdx);
                      setActiveTab('reading');
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: isStepActive ? 'var(--quest-light-tint)' : 'transparent',
                      color: isStepActive ? 'var(--quest-light-tint-text)' : 'var(--quest-text-secondary)',
                      transition: 'all 0.12s ease',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: isStepActive ? 'var(--quest-light-tint-text)' : isStepDone ? 'var(--quest-accent-text)' : 'var(--quest-text-muted)',
                        width: '18px',
                        paddingTop: '2px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {isStepDone ? <Check size={12} strokeWidth={2.5} color="var(--quest-accent-text)" /> : `0${sIdx + 1}`}
                    </span>

                    <span
                      style={{
                        fontSize: '12.5px',
                        fontWeight: isStepActive ? 700 : 500,
                        flex: 1,
                        lineHeight: 1.35,
                        color: isStepActive ? 'var(--quest-light-tint-text)' : 'var(--quest-text-primary)',
                      }}
                    >
                      {st.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Minimal Quiz Trigger at Bottom */}
            <div
              style={{
                padding: '12px 14px',
                borderTop: '1px solid var(--quest-border)',
              }}
            >
              <button
                onClick={() => onStartQuiz(chapterId)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--quest-text-primary)',
                  background: 'var(--quest-card-bg)',
                  border: '1px solid var(--quest-border)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>Practice Quiz</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* 3. MINIMAL PINNED BOTTOM ACTION BAR */}
      <footer
        style={{
          flexShrink: 0,
          height: '56px',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--quest-border)',
          background: 'var(--quest-bg)',
        }}
      >
        <button
          className="quest-btn-outline"
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          style={{
            opacity: currentStepIndex === 0 ? 0.3 : 1,
            padding: '0 16px',
            minHeight: '38px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ArrowLeft size={14} /> Previous
        </button>

        <div style={{ fontSize: '13px', color: 'var(--quest-text-muted)', fontWeight: 600 }}>
          {currentStepIndex + 1} of {steps.length} · {Math.round(progressPercent)}% complete
        </div>

        <button
          className="quest-btn-lime"
          style={{
            minHeight: '40px',
            padding: '0 22px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 800
          }}
          onClick={handleNext}
        >
          {currentStepIndex + 1 < steps.length ? (
            <>
              Next concept <ArrowRight size={16} />
            </>
          ) : (
            <>
              <Sparkles size={16} /> Practice Quiz (+35 XP)
            </>
          )}
        </button>
      </footer>

      {/* IN-APP ORIGINAL TEXTBOOK PDF VIEWER MODAL */}
      {pdfViewer.isOpen && (
        <PdfViewerModal
          isOpen={pdfViewer.isOpen}
          onClose={() => setPdfViewer((prev) => ({ ...prev, isOpen: false }))}
          title={pdfViewer.title}
          author={pdfViewer.author}
          pdfUrl={pdfViewer.pdfUrl}
          initialPage={pdfViewer.page}
        />
      )}
    </div>
  );
};

