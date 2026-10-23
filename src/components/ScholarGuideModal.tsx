import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Compass,
  Cpu,
  Flame,
  Award,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

interface ScholarGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFlashcards?: () => void;
  onNavigateToTab?: (tab: 'home' | 'learn' | 'lesson' | 'ranks' | 'you') => void;
}

type GuideTab = 'usage' | 'reading' | 'labs';

export const ScholarGuideModal: React.FC<ScholarGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenFlashcards,
  onNavigateToTab
}) => {
  const [activeTab, setActiveTab] = useState<GuideTab>('usage');

  if (!isOpen) return null;

  return (
    <div
      className="quest-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(19, 33, 28, 0.78)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundFX.playClick();
          onClose();
        }
      }}
    >
      <div
        className="quest-modal-card"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          backgroundColor: 'var(--quest-card-bg)',
          borderRadius: '24px',
          border: '1px solid var(--quest-border)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.28)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid var(--quest-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--quest-card-bg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#13211C',
                color: '#C9F26B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                border: '1.5px solid rgba(201, 242, 107, 0.3)'
              }}
            >
              📖
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    margin: 0,
                    color: 'var(--quest-text-primary)',
                    fontFamily: 'var(--quest-font-heading)'
                  }}
                >
                  Mantiq Scholar & Study Guide
                </h2>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '10.5px',
                    fontWeight: 800,
                    background: '#C9F26B',
                    color: '#13211C'
                  }}
                >
                  v4.0
                </span>
              </div>
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--quest-text-muted)',
                  margin: '3px 0 0',
                  fontWeight: 500
                }}
              >
                App navigation, Russell & Norvig reading curriculum, and interactive labs
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              border: '1px solid var(--quest-border)',
              background: 'var(--quest-bg)',
              color: 'var(--quest-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            title="Close Guide"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            padding: '10px 24px',
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid var(--quest-border)',
            background: 'var(--quest-bg)',
            overflowX: 'auto'
          }}
        >
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setActiveTab('usage');
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              border: activeTab === 'usage' ? '1.5px solid #13211C' : '1px solid var(--quest-border)',
              background: activeTab === 'usage' ? '#13211C' : 'var(--quest-card-bg)',
              color: activeTab === 'usage' ? '#C9F26B' : 'var(--quest-text-secondary)',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <Compass size={15} />
            How to Use Mantiq
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setActiveTab('reading');
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              border: activeTab === 'reading' ? '1.5px solid #13211C' : '1px solid var(--quest-border)',
              background: activeTab === 'reading' ? '#13211C' : 'var(--quest-card-bg)',
              color: activeTab === 'reading' ? '#C9F26B' : 'var(--quest-text-secondary)',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <BookOpen size={15} />
            Reading Material (AIMA 4th Ed.)
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setActiveTab('labs');
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              border: activeTab === 'labs' ? '1.5px solid #13211C' : '1px solid var(--quest-border)',
              background: activeTab === 'labs' ? '#13211C' : 'var(--quest-card-bg)',
              color: activeTab === 'labs' ? '#C9F26B' : 'var(--quest-text-secondary)',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <Cpu size={15} />
            Supporting Material & Labs
          </button>
        </div>

        {/* Tab Content Body */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          {/* TAB 1: HOW TO USE MANTIQ */}
          {activeTab === 'usage' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Core Learning Loop Card */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, rgba(201, 242, 107, 0.16) 0%, rgba(201, 242, 107, 0.04) 100%)',
                  border: '1.5px solid rgba(201, 242, 107, 0.45)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Sparkles size={18} color="#13211C" />
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#13211C' }}>
                    The 3-Step Mastery Loop
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                    gap: '12px',
                    marginTop: '12px'
                  }}
                >
                  <div
                    style={{
                      background: 'var(--quest-card-bg)',
                      padding: '14px',
                      borderRadius: '14px',
                      border: '1px solid var(--quest-border)'
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase' }}>
                      Step 1 · Read & Digest
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, margin: '4px 0 6px', color: 'var(--quest-text-primary)' }}>
                      Chapter Curriculum
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', lineHeight: 1.45 }}>
                      Read the chapter lessons structured after Russell & Norvig. Study theoretical bounds, agent formulations, and pseudocode.
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'var(--quest-card-bg)',
                      padding: '14px',
                      borderRadius: '14px',
                      border: '1px solid var(--quest-border)'
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase' }}>
                      Step 2 · Experiment
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, margin: '4px 0 6px', color: 'var(--quest-text-primary)' }}>
                      Interactive Labs
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', lineHeight: 1.45 }}>
                      Step through algorithm visualizers (A* search, Minimax pruning, Value Iteration) to build concrete mathematical intuition.
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'var(--quest-card-bg)',
                      padding: '14px',
                      borderRadius: '14px',
                      border: '1px solid var(--quest-border)'
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#EA580C', textTransform: 'uppercase' }}>
                      Step 3 · Midterm Assessment
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, margin: '4px 0 6px', color: 'var(--quest-text-primary)' }}>
                      Pass with 65%+
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', lineHeight: 1.45 }}>
                      Take the chapter quiz. Scoring 65% or higher unlocks the next chapter in your curriculum and awards mastery XP.
                    </div>
                  </div>
                </div>
              </div>

              {/* Streaks & Progression Rules */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '14px'
                }}
              >
                {/* Streak Rules */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid var(--quest-border)',
                    background: 'var(--quest-card-bg)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Flame size={18} color="#EA580C" />
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                      How Streaks Are Recorded
                    </span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--quest-text-secondary)', lineHeight: 1.6 }}>
                    <li>
                      <strong>Earned Through Learning:</strong> Streaks advance only when you complete active study (reading a chapter, completing steps, passing quizzes, or daily challenges).
                    </li>
                    <li>
                      <strong>Zero Blind Increments:</strong> Simply opening or refreshing the app will <em>never</em> mark or increase your streak.
                    </li>
                    <li>
                      <strong>Missing Days:</strong> If 2 or more consecutive days pass without studying, your streak resets to 0 (unless protected by a Streak Freeze).
                    </li>
                    <li>
                      <strong>Streak Freeze:</strong> Shields your streak for 1 day of absence when active.
                    </li>
                  </ul>
                </div>

                {/* Progression & Unlocking */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid var(--quest-border)',
                    background: 'var(--quest-card-bg)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Lock size={18} color="#13211C" />
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                      Chapter Progression & Unlocking
                    </span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--quest-text-secondary)', lineHeight: 1.6 }}>
                    <li>
                      <strong>Sequential Academic Path:</strong> Chapter 1 is unlocked by default. Subsequent chapters unlock once the previous chapter's assessment is passed.
                    </li>
                    <li>
                      <strong>Exam Quizzes Never Auto-Pass:</strong> Quizzes only display as passed when you take the quiz and achieve a passing score (&ge; 65%).
                    </li>
                    <li>
                      <strong>Retakes Allowed:</strong> You can retake any assessment to improve your score, sharpen concepts, or review Socratic feedback.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Scholar Stats: XP, Ranks, Hearts */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid var(--quest-border)',
                  background: 'var(--quest-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={16} color="#C9F26B" fill="#13211C" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--quest-text-primary)' }}>
                      <strong>XP & Levels:</strong> Earn 350 XP per scholar tier
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Shield size={16} color="#16A34A" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--quest-text-primary)' }}>
                      <strong>5 Hearts:</strong> Conserved through correct answers
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={16} color="#EAB308" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--quest-text-primary)' }}>
                      <strong>Gems & Chests:</strong> Rewarded on milestone chapters
                    </span>
                  </div>
                </div>

                {onNavigateToTab && (
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      onClose();
                      onNavigateToTab('learn');
                    }}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '10px',
                      background: '#13211C',
                      color: '#C9F26B',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    Go to Chapters <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: READING MATERIAL */}
          {activeTab === 'reading' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Textbook Feature Banner */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, #13211C 0%, #1A2F28 100%)',
                  color: '#F3F5EF',
                  border: '1.5px solid rgba(201, 242, 107, 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span
                      style={{
                        background: '#C9F26B',
                        color: '#13211C',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: 900,
                        letterSpacing: '0.04em'
                      }}
                    >
                      FOUNDATIONAL CANON
                    </span>
                    <span style={{ fontSize: '12px', color: '#C9F26B', fontWeight: 700 }}>
                      Global Academic Standard
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '4px 0', color: '#F3F5EF' }}>
                    Artificial Intelligence: A Modern Approach (4th Edition)
                  </h3>
                  <div style={{ fontSize: '12.5px', color: 'rgba(243, 245, 239, 0.75)', marginTop: '2px' }}>
                    Authored by Stuart Russell (UC Berkeley) and Peter Norvig (Stanford / Google)
                  </div>
                </div>

                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: '12px',
                    background: 'rgba(201, 242, 107, 0.12)',
                    border: '1px solid rgba(201, 242, 107, 0.35)',
                    fontSize: '11.5px',
                    color: '#C9F26B',
                    fontWeight: 700
                  }}
                >
                  28 Chapters · 7 Fundamental Parts
                </div>
              </div>

              {/* The 7 Parts Curriculum Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={16} />
                  Curriculum Breakdown by Textbook Parts
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                    gap: '10px'
                  }}
                >
                  {[
                    {
                      part: 'Part I · Artificial Intelligence',
                      chapters: 'Chapters 1 - 2',
                      desc: 'Foundations of rationality, history of AI, PEAS task environment framework, agent architectures (simple reflex, model-based, goal-based, utility-based).'
                    },
                    {
                      part: 'Part II · Problem-Solving & Search',
                      chapters: 'Chapters 3 - 6',
                      desc: 'State-space search, uninformed search (BFS, DFS, IDS), informed search (A* admissibility & consistency proofs), Minimax with Alpha-Beta pruning, CSPs.'
                    },
                    {
                      part: 'Part III · Knowledge & Reasoning',
                      chapters: 'Chapters 7 - 11',
                      desc: 'Propositional logic, inference rules, DPLL SAT solvers, first-order logic forward & backward chaining, resolution proofs, classical PDDL planning.'
                    },
                    {
                      part: 'Part IV · Uncertain Knowledge',
                      chapters: 'Chapters 12 - 18',
                      desc: 'Probability theory, Bayesian Networks, d-separation, exact & approximate inference (MCMC, Gibbs), Hidden Markov Models, Markov Decision Processes (MDPs), Bellman equations.'
                    },
                    {
                      part: 'Part V · Machine Learning',
                      chapters: 'Chapters 19 - 21',
                      desc: 'Supervised learning (decision trees, linear models), deep neural network architectures & backpropagation, reinforcement learning (Q-learning, policy search).'
                    },
                    {
                      part: 'Part VI · Perceiving & Acting',
                      chapters: 'Chapters 22 - 26',
                      desc: 'Natural language processing, transformer architectures, computer vision convolutional pipelines, robotic kinematics & localization.'
                    },
                    {
                      part: 'Part VII · Philosophy & Ethics',
                      chapters: 'Chapters 27 - 28',
                      desc: 'Philosophical limits of AI, Turing test, Chinese Room argument, AI alignment, safety bounds, and future societal impacts.'
                    }
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '1px solid var(--quest-border)',
                        background: 'var(--quest-card-bg)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                          {p.part}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#C9F26B', background: '#13211C', padding: '1px 6px', borderRadius: '4px' }}>
                          {p.chapters}
                        </span>
                      </div>
                      <p style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                        {p.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reader Guidance Note */}
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'var(--quest-bg)',
                  border: '1px solid var(--quest-border)',
                  fontSize: '11.5px',
                  color: 'var(--quest-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <HelpCircle size={16} color="var(--quest-text-primary)" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Tip:</strong> In Lesson view, use the <em>Textbook Reference</em> toggle to view exact book page references and theorem notations while studying.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: SUPPORTING MATERIAL & LABS */}
          {activeTab === 'labs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '12px'
                }}
              >
                {/* Visual Simulators */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid var(--quest-border)',
                    background: 'var(--quest-card-bg)'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#13211C',
                      color: '#C9F26B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '15px',
                      marginBottom: '10px'
                    }}
                  >
                    🕹️
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                    Algorithm Simulators
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', margin: '6px 0 0', lineHeight: 1.45 }}>
                    Every chapter includes an interactive canvas. Step through A* frontier expansions, play against Minimax game trees with &alpha;-&beta; cutoffs, or run MDP Bellman value iteration until convergence.
                  </p>
                </div>

                {/* Mathematical Proofs & KaTeX */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid var(--quest-border)',
                    background: 'var(--quest-card-bg)'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#13211C',
                      color: '#C9F26B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '15px',
                      marginBottom: '10px'
                    }}
                  >
                    📐
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                    Formal Mathematical Bounds
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', margin: '6px 0 0', lineHeight: 1.45 }}>
                    Real academic formulations rendered with KaTeX: admissibility (h(n) &le; h*(n)), consistency (h(n) &le; c(n, a, n&apos;) + h(n&apos;)), time complexity O(b^d), and exact Bellman optimality U*(s).
                  </p>
                </div>

                {/* Socratic Feedback & Quizzes */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid var(--quest-border)',
                    background: 'var(--quest-card-bg)'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#13211C',
                      color: '#C9F26B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '15px',
                      marginBottom: '10px'
                    }}
                  >
                    🧠
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                    Socratic Diagnostic Feedback
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', margin: '6px 0 0', lineHeight: 1.45 }}>
                    Assessments provide instant Socratic diagnostic feedback for both correct and incorrect choices, breaking down why distractors are invalid and proving the correct solution.
                  </p>
                </div>
              </div>

              {/* Exam Flashcards CTA Banner */}
              <div
                style={{
                  padding: '18px 20px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(201, 242, 107, 0.22) 0%, rgba(201, 242, 107, 0.08) 100%)',
                  border: '1.5px solid rgba(201, 242, 107, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>🃏</span>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#13211C' }}>
                      43+ University Exam Flashcards
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--quest-text-secondary)', marginTop: '4px' }}>
                    Curated flashcard decks spanning all 27 chapters, featuring critical <em>Exam Traps</em> and common student pitfalls.
                  </div>
                </div>

                {onOpenFlashcards && (
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      onClose();
                      onOpenFlashcards();
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      background: '#13211C',
                      color: '#C9F26B',
                      border: 'none',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    Open Flashcards <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--quest-border)',
            background: 'var(--quest-card-bg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ fontSize: '11.5px', color: 'var(--quest-text-muted)', fontWeight: 600 }}>
            Mantiq AI Learning Environment
          </span>

          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            style={{
              padding: '8px 20px',
              borderRadius: '12px',
              background: '#13211C',
              color: '#C9F26B',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CheckCircle2 size={15} />
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
