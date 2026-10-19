import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  FlaskConical,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Code2,
  Sparkles,
  FileText
} from 'lucide-react';
import { AIMA_PARTS } from '../data/aimaBookData';
import { useProgress } from '../context/ProgressContext';
import { soundFX } from '../utils/soundEffects';

// Import simulations
import { SearchVisualizer } from './simulations/SearchVisualizer';
import { VacuumAgentSimulator } from './simulations/VacuumAgentSimulator';
import { MinimaxAlphaBetaSim } from './simulations/MinimaxAlphaBetaSim';
import { MdpValueIterationSim } from './simulations/MdpValueIterationSim';
import { QLearningSim } from './simulations/QLearningSim';
import { BayesNetSim } from './simulations/BayesNetSim';

interface ChapterReaderProps {
  chapterId: number;
  onSelectChapter: (id: number) => void;
  onStartQuiz: (chapterId: number) => void;
}

export const ChapterReader: React.FC<ChapterReaderProps> = ({
  chapterId,
  onSelectChapter,
  onStartQuiz
}) => {
  const { progress, markChapterRead, markSimulationInteracted } = useProgress();
  const [activeTab, setActiveTab] = useState<'content' | 'lab' | 'algorithms'>('content');

  // Find chapter and part
  let currentChapter = AIMA_PARTS[0].chapters[0];
  let currentPart = AIMA_PARTS[0];

  for (const part of AIMA_PARTS) {
    const found = part.chapters.find((ch) => ch.id === chapterId);
    if (found) {
      currentChapter = found;
      currentPart = part;
      break;
    }
  }

  const isRead = progress[chapterId]?.read;
  const quizProgress = progress[chapterId];

  // Previous and Next chapters
  const allChapters = AIMA_PARTS.flatMap((p) => p.chapters);
  const currentIndex = allChapters.findIndex((ch) => ch.id === chapterId);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  const handleMarkRead = () => {
    soundFX.playCorrect();
    markChapterRead(chapterId);
  };

  const renderSimulation = () => {
    switch (currentChapter.simulationType) {
      case 'search':
        return <SearchVisualizer />;
      case 'vacuum':
        return <VacuumAgentSimulator />;
      case 'minimax':
        return <MinimaxAlphaBetaSim />;
      case 'mdp':
        return <MdpValueIterationSim />;
      case 'qlearn':
        return <QLearningSim />;
      case 'bayes':
        return <BayesNetSim />;
      default:
        return (
          <div className="sim-empty-card">
            <FlaskConical size={32} className="text-accent" />
            <h3>Interactive Model Available</h3>
            <p>Explore algorithmic foundations in the neighboring chapters or practice with flashcards.</p>
          </div>
        );
    }
  };

  return (
    <div className="reader-container">
      {/* Chapter Top Breadcrumb Header */}
      <div className="reader-header-card">
        <div className="reader-part-badge" style={{ color: currentPart.color }}>
          {currentPart.title} • {currentChapter.pageRange}
        </div>

        <div className="reader-title-row">
          <div>
            <h1 className="reader-title">
              Chapter {currentChapter.id}: {currentChapter.title}
            </h1>
            <p className="reader-subtitle">{currentChapter.subtitle}</p>
          </div>

          <div className="reader-header-actions">
            <span className={`tag-weight ${currentChapter.examWeight.toLowerCase()}`}>
              {currentChapter.examWeight} Exam Weight
            </span>

            <button
              className={`btn-action ${isRead ? 'secondary' : 'primary'}`}
              onClick={handleMarkRead}
            >
              <CheckCircle2 size={16} />
              {isRead ? 'Completed (+50 XP)' : 'Mark Completed (+50 XP)'}
            </button>

            <button
              className="btn-action accent-btn"
              onClick={() => {
                soundFX.playClick();
                onStartQuiz(chapterId);
              }}
            >
              <HelpCircle size={16} />
              Take Chapter Quiz
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="reader-tabs-row">
          <button
            className={`reader-tab ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <FileText size={15} /> Chapter Deep Dive
          </button>
          {currentChapter.hasSimulation && (
            <button
              className={`reader-tab ${activeTab === 'lab' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('lab');
                markSimulationInteracted(chapterId);
              }}
            >
              <FlaskConical size={15} /> Interactive Simulation Lab
            </button>
          )}
          {currentChapter.algorithms && currentChapter.algorithms.length > 0 && (
            <button
              className={`reader-tab ${activeTab === 'algorithms' ? 'active' : ''}`}
              onClick={() => setActiveTab('algorithms')}
            >
              <Code2 size={15} /> AIMA Algorithm Pseudo-code
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="reader-body">
        {activeTab === 'content' && (
          <div className="reader-content-layout">
            {/* Executive High-Yield Summary */}
            <div className="summary-callout-card">
              <h3 className="callout-title">
                <BookOpen size={18} className="text-accent" /> High-Yield Core Summary
              </h3>
              <p className="callout-text">{currentChapter.summary}</p>

              <div className="sections-list-box">
                <h4 className="sections-heading">Textbook Sections Covered:</h4>
                <ul className="sections-list">
                  {currentChapter.sections.map((sec, idx) => (
                    <li key={idx} className="section-item">{sec}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Embedded Lab Preview if available */}
            {currentChapter.hasSimulation && (
              <div className="embedded-lab-section">
                <div className="section-header-compact">
                  <span className="badge-lab">
                    <FlaskConical size={14} /> Interactive Lab
                  </span>
                  <h4>Hands-on Concept Playground</h4>
                </div>
                {renderSimulation()}
              </div>
            )}

            {/* Key Concepts Deep Dive */}
            <div className="concepts-section">
              <h3 className="section-title">Key Formalisms & Theorems</h3>

              <div className="concepts-list">
                {currentChapter.keyConcepts.map((concept, idx) => (
                  <div key={idx} className="concept-card">
                    <h4 className="concept-title">{concept.title}</h4>
                    <p className="concept-summary">{concept.summary}</p>

                    {concept.keyFormula && (
                      <div className="formula-box">
                        <div className="formula-latex">{concept.keyFormula.latex}</div>
                        <div className="formula-desc">{concept.keyFormula.description}</div>
                      </div>
                    )}

                    <div className="concept-deep-dive">
                      <ul className="deep-dive-bullets">
                        {concept.deepDive.map((item, dIdx) => (
                          <li key={dIdx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {concept.examTip && (
                      <div className="exam-trap-box">
                        <AlertTriangle size={16} className="trap-icon" />
                        <div>
                          <strong>Exam Alert:</strong> {concept.examTip}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lab' && currentChapter.hasSimulation && (
          <div className="lab-standalone-layout">
            {renderSimulation()}
          </div>
        )}

        {activeTab === 'algorithms' && currentChapter.algorithms && (
          <div className="algorithms-layout">
            {currentChapter.algorithms.map((algo, idx) => (
              <div key={idx} className="algo-card">
                <div className="algo-header">
                  <h3 className="algo-name">function {algo.name}({algo.inputs}) returns {algo.returns}</h3>
                </div>

                <div className="algo-complexity-grid">
                  <div className="complexity-item">
                    <span className="c-label">Time Complexity:</span>
                    <span className="c-val">{algo.timeComplexity}</span>
                  </div>
                  <div className="complexity-item">
                    <span className="c-label">Space Complexity:</span>
                    <span className="c-val">{algo.spaceComplexity}</span>
                  </div>
                  <div className="complexity-item">
                    <span className="c-label">Completeness:</span>
                    <span className="c-val">{algo.completeness}</span>
                  </div>
                  <div className="complexity-item">
                    <span className="c-label">Optimality:</span>
                    <span className="c-val">{algo.optimality}</span>
                  </div>
                </div>

                <div className="code-block-container">
                  <pre className="code-pre">
                    <code>
                      {algo.steps.map((st, sIdx) => (
                        <div key={sIdx} className="code-line">
                          <span className="line-num">{sIdx + 1}</span>
                          <span className="line-content">{st}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reader Bottom Navigation Bar */}
      <div className="reader-bottom-nav">
        {prevChapter ? (
          <button
            className="btn-nav-chapter prev"
            onClick={() => {
              soundFX.playClick();
              onSelectChapter(prevChapter.id);
            }}
          >
            <ChevronLeft size={18} />
            <div>
              <span className="nav-sub">Previous Chapter</span>
              <span className="nav-title">Ch {prevChapter.id}: {prevChapter.title}</span>
            </div>
          </button>
        ) : <div />}

        <button
          className="btn-action primary btn-take-quiz-lg"
          onClick={() => {
            soundFX.playClick();
            onStartQuiz(chapterId);
          }}
        >
          <HelpCircle size={18} /> Take Chapter {chapterId} Quiz
        </button>

        {nextChapter ? (
          <button
            className="btn-nav-chapter next"
            onClick={() => {
              soundFX.playClick();
              onSelectChapter(nextChapter.id);
            }}
          >
            <div>
              <span className="nav-sub">Next Chapter</span>
              <span className="nav-title">Ch {nextChapter.id}: {nextChapter.title}</span>
            </div>
            <ChevronRight size={18} />
          </button>
        ) : <div />}
      </div>
    </div>
  );
};
