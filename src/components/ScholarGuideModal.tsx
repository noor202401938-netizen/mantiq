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
  HelpCircle,
  Home,
  GraduationCap,
  Trophy,
  User,
  Calculator,
  Code2
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects';
import { MantiqLogo } from './MantiqLogo';

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
          maxWidth: '860px',
          maxHeight: '90vh',
          backgroundColor: 'var(--quest-card-bg)',
          borderRadius: '24px',
          border: '1px solid var(--quest-border)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#13211C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(201, 242, 107, 0.3)'
              }}
            >
              <MantiqLogo size={26} />
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
                  AIMA 4th Edition
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
                App navigation, Russell & Norvig reading curriculum, worked examples & interactive labs
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* App Overview Banner */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, rgba(201, 242, 107, 0.15) 0%, rgba(201, 242, 107, 0.04) 100%)',
                  border: '1.5px solid rgba(201, 242, 107, 0.4)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={18} color="#13211C" />
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#13211C' }}>
                    Welcome to Mantiq
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--quest-text-primary)', lineHeight: 1.6 }}>
                  Mantiq is an interactive, textbook-grade academic environment built directly around Stuart Russell & Peter Norvig&apos;s standard canon, <em>Artificial Intelligence: A Modern Approach (4th Edition)</em>. It combines deep theoretical reading, interactive algorithm visualizers, active recall exam flashcards, and chapter assessments into a unified study platform.
                </p>
              </div>

              {/* The 5 Main App Views */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Compass size={16} />
                  Main App Navigation & Sections
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '10px'
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#13211C', color: '#C9F26B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Home size={13} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>1. Home</span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', lineHeight: 1.45 }}>
                      Your daily study command deck. Features <em>Today&apos;s Focus</em>, quick resume of your current chapter, daily study streak monitor, curriculum progress, and direct access to the 43+ Active Recall Exam Deck.
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#13211C', color: '#C9F26B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen size={13} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>2. Chapters</span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', lineHeight: 1.45 }}>
                      The full sequential academic curriculum of 27 chapters across 7 parts. View unlocked chapters, completion percentage, key learning objectives, and launch directly into lesson reading or chapter assessments.
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#13211C', color: '#C9F26B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <GraduationCap size={13} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>3. Lessons</span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', lineHeight: 1.45 }}>
                      Distraction-free academic reading mode with KaTeX math rendering, active recall checkpoints, interactive algorithm visualizers, and step-by-step worked numerical examples with revealable solutions.
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#13211C', color: '#C9F26B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trophy size={13} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>4. Ranks</span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', lineHeight: 1.45 }}>
                      Academic cohort leaderboard and scholar rank progression. Advance through tiers (Novice, Apprentice, Scholar, Master, Architect) as you earn XP through active study and quiz completion.
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#13211C', color: '#C9F26B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={13} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>5. Profile</span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', lineHeight: 1.45 }}>
                      Your academic dossier. Tracks daily study streaks, target exam date countdown, earned badges, topic mastery scores, and offline local-storage backup synchronization.
                    </div>
                  </div>
                </div>
              </div>

              {/* The 3-Step Academic Mastery Loop */}
              <div
                style={{
                  padding: '18px 20px',
                  borderRadius: '16px',
                  background: 'var(--quest-card-bg)',
                  border: '1px solid var(--quest-border)'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)', marginBottom: '10px' }}>
                  The 3-Step Mastery Loop
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                    gap: '12px'
                  }}
                >
                  <div
                    style={{
                      background: 'var(--quest-bg)',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--quest-border)'
                    }}
                  >
                    <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase' }}>
                      Step 1 · Read & Comprehend
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, margin: '3px 0 5px', color: 'var(--quest-text-primary)' }}>
                      Theory & Deep Dives
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--quest-text-secondary)', lineHeight: 1.45 }}>
                      Study the chapter text, mathematical theorems, and worked numerical examples. Test yourself on inline active recall checkpoints.
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'var(--quest-bg)',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--quest-border)'
                    }}
                  >
                    <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase' }}>
                      Step 2 · Experiment
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, margin: '3px 0 5px', color: 'var(--quest-text-primary)' }}>
                      Interactive Labs
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--quest-text-secondary)', lineHeight: 1.45 }}>
                      Step through algorithm visualizers (A* pathfinding, Minimax &alpha;-&beta; pruning, Bayes net propagation, Value Iteration) to verify intuition.
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'var(--quest-bg)',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--quest-border)'
                    }}
                  >
                    <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#EA580C', textTransform: 'uppercase' }}>
                      Step 3 · Assessment
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, margin: '3px 0 5px', color: 'var(--quest-text-primary)' }}>
                      Pass with &ge; 65%
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--quest-text-secondary)', lineHeight: 1.45 }}>
                      Take the chapter quiz. Scoring 65% or higher unlocks the next chapter, awards mastery XP, and records verified chapter mastery.
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
                      Verified Study Streaks
                    </span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--quest-text-secondary)', lineHeight: 1.6 }}>
                    <li>
                      <strong>Earned Through Active Study:</strong> Streaks advance only when you engage in actual learning (reading sections, completing interactive steps, or taking quizzes).
                    </li>
                    <li>
                      <strong>Zero Blind Increments:</strong> Simply refreshing or opening the app never artificially increases your streak count.
                    </li>
                    <li>
                      <strong>Reset Rule:</strong> If 2 or more consecutive days elapse without study, the streak resets to 0 (unless shielded by a Streak Freeze).
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
                      Academic Unlocking & Assessments
                    </span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--quest-text-secondary)', lineHeight: 1.6 }}>
                    <li>
                      <strong>Sequential Progression:</strong> Chapter 1 is unlocked for everyone. Subsequent chapters unlock upon passing the previous chapter&apos;s quiz (&ge; 65%).
                    </li>
                    <li>
                      <strong>Authentic Pass Marks:</strong> Assessments provide Socratic feedback explaining why distractors are wrong and why correct choices are valid.
                    </li>
                    <li>
                      <strong>Unlimited Retakes:</strong> You can retake any assessment to review missed concepts, improve your score, or reinforce memory before university exams.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Scholar Stats & Shortcuts */}
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
                      <strong>XP Tiers:</strong> Earn 350 XP per scholar promotion level
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} color="#16A34A" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--quest-text-primary)' }}>
                      <strong>Pass Mark:</strong> 65% minimum required for chapter mastery
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                      GLOBAL CANON
                    </span>
                    <span style={{ fontSize: '12px', color: '#C9F26B', fontWeight: 700 }}>
                      Academic Standard (Used in 1,500+ Universities)
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
                  27 Chapters · 7 Fundamental Parts
                </div>
              </div>

              {/* Deep-Dive Enhancements Overview */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    padding: '14px',
                    borderRadius: '14px',
                    border: '1px solid var(--quest-border)',
                    background: 'var(--quest-card-bg)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Calculator size={16} color="#13211C" />
                    <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                      Worked Numerical Examples
                    </span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', margin: 0, lineHeight: 1.45 }}>
                    Every core chapter features practical numerical problems with full step-by-step mathematical solutions (e.g. A* Manhattan path costs, Minimax branch pruning, Bayes posterior calculations).
                  </p>
                </div>

                <div
                  style={{
                    padding: '14px',
                    borderRadius: '14px',
                    border: '1px solid var(--quest-border)',
                    background: 'var(--quest-card-bg)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <CheckCircle2 size={16} color="#16A34A" />
                    <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                      Active Recall Checkpoints
                    </span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', margin: 0, lineHeight: 1.45 }}>
                    Embedded throughout lesson reading to reinforce retention and test critical concepts before attempting the final chapter quiz.
                  </p>
                </div>

                <div
                  style={{
                    padding: '14px',
                    borderRadius: '14px',
                    border: '1px solid var(--quest-border)',
                    background: 'var(--quest-card-bg)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Code2 size={16} color="#2563EB" />
                    <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                      KaTeX Math & Pseudocode
                    </span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', margin: 0, lineHeight: 1.45 }}>
                    Full mathematical definitions for admissibility, consistency, Bellman equations, and exact pseudocode from the textbook.
                  </p>
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
                      desc: 'Foundations of rationality, history of AI, PEAS task environment framework, and 5 agent architectures (simple reflex, model-based, goal-based, utility-based, learning agents).'
                    },
                    {
                      part: 'Part II · Problem-Solving & Search',
                      chapters: 'Chapters 3 - 6',
                      desc: 'State-space search, uninformed search (BFS, DFS, IDS), informed search (A* admissibility & consistency proofs), Minimax with Alpha-Beta pruning, and Constraint Satisfaction Problems (AC-3, MRV, LCV).'
                    },
                    {
                      part: 'Part III · Knowledge, Reasoning, and Planning',
                      chapters: 'Chapters 7 - 12',
                      desc: 'Propositional logic, Wumpus World, DPLL SAT solvers, first-order logic forward/backward chaining, resolution refutation proofs, classical PDDL planning, and knowledge representation.'
                    },
                    {
                      part: 'Part IV · Uncertain Knowledge and Reasoning',
                      chapters: 'Chapters 13 - 17',
                      desc: 'Probability theory, Bayesian Networks, d-separation, variable elimination, Hidden Markov Models, Markov Decision Processes (MDPs), and Bellman optimality equations.'
                    },
                    {
                      part: 'Part V · Machine Learning',
                      chapters: 'Chapters 18 - 21',
                      desc: 'Supervised learning (decision trees, linear models, neural nets, backpropagation), inductive logic programming, statistical learning (EM algorithm), and reinforcement learning (TD-learning, Q-learning, SARSA).'
                    },
                    {
                      part: 'Part VI · Communicating, Perceiving, and Acting',
                      chapters: 'Chapters 22 - 25',
                      desc: 'Natural language processing (n-grams, TF-IDF), PCFG phrase structure parsing (CYK algorithm), computer vision (convolution, edge detection, 3D world), and robotics (configuration space, SLAM).'
                    },
                    {
                      part: 'Part VII · Philosophy, Ethics, and Future',
                      chapters: 'Chapters 26 - 27',
                      desc: 'Philosophical limits of AI, Turing test, Searle’s Chinese Room argument, AI alignment, provably beneficial AI, and long-term societal impacts.'
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
                  <strong>Tip:</strong> In Lesson view, examine both the theoretical explanation and the <em>Worked Numerical Example</em> to develop the concrete arithmetic intuition tested on university exams.
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
                    State-Space & A* Search Simulator
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', margin: '6px 0 0', lineHeight: 1.45 }}>
                    Interactive 2D grid canvas. Place custom barriers, toggle between BFS, DFS, and A* with Manhattan or Euclidean heuristics, and watch the frontier and explored sets expand step-by-step.
                  </p>
                </div>

                {/* Minimax & Alpha-Beta Game Trees */}
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
                    ♟️
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                    Minimax & &alpha;-&beta; Pruning Lab
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', margin: '6px 0 0', lineHeight: 1.45 }}>
                    Interactive game tree visualizer. Step through node expansions and watch alpha cutoffs (&ge; &beta;) and beta cutoffs (&le; &alpha;) eliminate branches in real time.
                  </p>
                </div>

                {/* Vacuum World & Agent Architectures */}
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
                    🧹
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                    Vacuum World Environment
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', margin: '6px 0 0', lineHeight: 1.45 }}>
                    Simulate simple reflex vs model-based reflex agents in a 2-room or n-room environment. Observe why memoryless agents infinite-loop under partial observability.
                  </p>
                </div>

                {/* Bayesian Network Visualizer */}
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
                    📊
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                    Bayesian Network Propagation
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', margin: '6px 0 0', lineHeight: 1.45 }}>
                    Explore directed acyclic causal graphs, clamp evidence nodes, and watch posterior probabilities update across conditional probability tables.
                  </p>
                </div>

                {/* Reinforcement Learning Lab */}
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
                    ⚡
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                    MDP & Q-Learning Gridworld
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', margin: '6px 0 0', lineHeight: 1.45 }}>
                    Observe Bellman Value Iteration and Q-learning updates in real time as the agent balances exploration (&epsilon;) and exploitation to discover optimal policy &pi;*.
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
                    Socratic Diagnostic Quizzes
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--quest-text-secondary)', margin: '6px 0 0', lineHeight: 1.45 }}>
                    Assessments provide instant diagnostic feedback for both correct and incorrect choices, explaining precisely why distractors fail and proving the correct mathematical formulation.
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
                    Spaced-repetition revision deck spanning all 27 chapters, with dedicated <em>Exam Traps</em> highlighting the most common student errors.
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
                      gap: '6px'
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
