import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { NotesProvider } from './context/NotesContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useProgress } from './context/ProgressContext';
import { soundFX } from './utils/soundEffects';
import { AimaDesktopNav, QuestTab } from './components/AimaDesktopNav';
import { HomeFocusView } from './components/HomeFocusView';
import { LearnChaptersView } from './components/LearnChaptersView';
import { RanksView } from './components/RanksView';
import { AuthModal } from './components/AuthModal';
import { AuthLandingPage } from './components/AuthLandingPage';
import './styles/index.css';
import './styles/learningAppDesign.css';
import 'katex/dist/katex.min.css';

// Code-split heavy interactive and textbook modules for faster initial load
const InteractiveLabView = lazy(() =>
  import('./components/InteractiveLabView').then((m) => ({ default: m.InteractiveLabView }))
);
const AimaLessonViewer = lazy(() =>
  import('./components/AimaLessonViewer').then((m) => ({ default: m.AimaLessonViewer }))
);
const YouProfileView = lazy(() =>
  import('./components/YouProfileView').then((m) => ({ default: m.YouProfileView }))
);
const AimaQuizModal = lazy(() =>
  import('./components/AimaQuizModal').then((m) => ({ default: m.AimaQuizModal }))
);
const AimaFlashcardModal = lazy(() =>
  import('./components/AimaFlashcardModal').then((m) => ({ default: m.AimaFlashcardModal }))
);
const SyncModal = lazy(() =>
  import('./components/SyncModal').then((m) => ({ default: m.SyncModal }))
);

const ViewLoadingFallback: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '12px',
      color: 'var(--quest-text-muted)'
    }}
  >
    <div
      style={{
        width: '32px',
        height: '32px',
        border: '3px solid var(--quest-border)',
        borderTopColor: 'var(--quest-accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }}
    />
    <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--quest-font-heading)' }}>
      Loading Mantiq Module...
    </span>
  </div>
);

const AppContent: React.FC = () => {
  const { isDark } = useTheme();
  const { hasStartedSession } = useAuth();
  const { stats } = useProgress();

  const isChapterUnlocked = (chId: number): boolean => {
    if (chId <= 1) return true;
    return (
      stats.completedChapterIds?.includes(chId) ||
      stats.completedChapterIds?.includes(chId - 1)
    );
  };

  const [currentTab, setCurrentTab] = useState<QuestTab>(() => {
    const saved = localStorage.getItem('mantiq_active_tab');
    if (saved && ['home', 'learn', 'lesson', 'ranks', 'you'].includes(saved)) {
      return saved as QuestTab;
    }
    return 'home';
  });

  const [learnSubView, setLearnSubView] = useState<'chapters' | 'lab'>(() => {
    const saved = localStorage.getItem('mantiq_learn_subview');
    return saved === 'lab' ? 'lab' : 'chapters';
  });

  // Modals & Active IDs - All hooks must be called unconditionally at top of component
  const [activeLessonChapterId, setActiveLessonChapterId] = useState<number | null>(() => {
    const saved = localStorage.getItem('mantiq_active_lesson_chapter');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [activeQuizChapterId, setActiveQuizChapterId] = useState<number | null>(null);
  const [isFlashcardOpen, setIsFlashcardOpen] = useState<boolean>(false);
  const [isSyncOpen, setIsSyncOpen] = useState<boolean>(false);

  // Persist navigation states across browser refreshes
  useEffect(() => {
    if (hasStartedSession) {
      localStorage.setItem('mantiq_active_tab', currentTab);
    }
  }, [currentTab, hasStartedSession]);

  useEffect(() => {
    if (hasStartedSession) {
      localStorage.setItem('mantiq_learn_subview', learnSubView);
    }
  }, [learnSubView, hasStartedSession]);

  useEffect(() => {
    if (hasStartedSession && activeLessonChapterId !== null) {
      localStorage.setItem('mantiq_active_lesson_chapter', activeLessonChapterId.toString());
    }
  }, [activeLessonChapterId, hasStartedSession]);

  // If user hasn't authenticated or started session, first page is Sign-In / Register
  if (!hasStartedSession) {
    return <AuthLandingPage />;
  }

  const handleStartLesson = (chapterId: number) => {
    if (!isChapterUnlocked(chapterId)) {
      soundFX.playWrong();
      return;
    }
    setActiveLessonChapterId(chapterId);
    setCurrentTab('lesson');
  };

  const handleOpenLab = (chapterId: number) => {
    setLearnSubView('lab');
    setCurrentTab('learn');
  };

  return (
    <div className={`quest-shell ${isDark ? 'dark' : 'light'}`}>
      {/* Desktop & Mobile Navigation (Hidden in Zen Lesson Mode for distraction-free reading) */}
      {currentTab !== 'lesson' && (
        <AimaDesktopNav
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            if (tab === 'learn') setLearnSubView('chapters');
          }}
          onOpenSync={() => setIsSyncOpen(true)}
        />
      )}

      {/* Main Content Viewport */}
      <main className={`quest-main-viewport ${currentTab === 'lesson' ? 'lesson-viewport' : ''}`}>
        <Suspense fallback={<ViewLoadingFallback />}>
          {currentTab === 'home' && (
            <HomeFocusView
              onStartLesson={handleStartLesson}
              onOpenLab={handleOpenLab}
              onOpenFlashcards={() => setIsFlashcardOpen(true)}
              onOpenRanks={() => setCurrentTab('ranks')}
            />
          )}

          {currentTab === 'learn' && (
            <>
              {learnSubView === 'chapters' ? (
                <LearnChaptersView
                  onStartLesson={handleStartLesson}
                  onOpenLab={handleOpenLab}
                />
              ) : (
                <InteractiveLabView
                  onStartQuiz={() => handleStartLesson(3)}
                  onBackToLearn={() => setLearnSubView('chapters')}
                />
              )}
            </>
          )}

          {currentTab === 'lesson' && (
            <AimaLessonViewer
              chapterId={activeLessonChapterId && isChapterUnlocked(activeLessonChapterId) ? activeLessonChapterId : 1}
              onClose={() => setCurrentTab('learn')}
              onSelectChapter={(chId) => {
                if (isChapterUnlocked(chId)) {
                  setActiveLessonChapterId(chId);
                } else {
                  soundFX.playWrong();
                }
              }}
              onStartQuiz={(chId) => {
                setActiveQuizChapterId(chId);
              }}
            />
          )}

          {currentTab === 'ranks' && <RanksView />}

          {currentTab === 'you' && (
            <YouProfileView onOpenSync={() => setIsSyncOpen(true)} />
          )}
        </Suspense>
      </main>

      {/* Lazy Loaded Interactive Modals */}
      <Suspense fallback={null}>
        {activeQuizChapterId !== null && (
          <AimaQuizModal
            chapterId={activeQuizChapterId}
            onClose={() => setActiveQuizChapterId(null)}
            onComplete={() => setActiveQuizChapterId(null)}
          />
        )}

        {isFlashcardOpen && (
          <AimaFlashcardModal onClose={() => setIsFlashcardOpen(false)} />
        )}

        {isSyncOpen && (
          <SyncModal isOpen={isSyncOpen} onClose={() => setIsSyncOpen(false)} />
        )}
      </Suspense>

      {/* University Scholar Auth Modal (Sign In / Sign Up) */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <NotesProvider>
            <AppContent />
          </NotesProvider>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
