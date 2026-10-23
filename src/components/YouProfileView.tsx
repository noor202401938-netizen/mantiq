import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Building2,
  Calendar,
  Target,
  Award,
  Flame,
  Bookmark,
  BookOpen,
  Check,
  Moon,
  Sun,
  ShieldCheck,
  LogOut,
  LogIn,
  Edit3,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Clock,
  Settings,
  ChevronRight,
  Search,
  Plus,
  Trash2,
  Pin,
  Download,
  Tag,
  Filter,
  X,
  Upload,
  FileJson,
  HardDrive,
  Zap,
  Trophy,
  Star,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { useNotes } from '../context/NotesContext';
import { StudyNote } from '../types';
import { SyncManager, SyncPayload } from '../utils/syncManager';
import { soundFX } from '../utils/soundEffects';

interface YouProfileViewProps {
  onOpenSync: () => void;
}

const AIMA_PARTS = [
  { id: 1, title: 'Part I: Artificial Intelligence', chapters: [1, 2], weight: 'Foundational' },
  { id: 2, title: 'Part II: Problem-Solving', chapters: [3, 4, 5, 6], weight: 'Essential' },
  { id: 3, title: 'Part III: Knowledge & Reasoning', chapters: [7, 8, 9, 10, 11, 12], weight: 'High' },
  { id: 4, title: 'Part IV: Uncertain Knowledge & Reasoning', chapters: [13, 14, 15, 16, 17], weight: 'High' },
  { id: 5, title: 'Part V: Machine Learning', chapters: [18, 19, 20, 21], weight: 'High' },
  { id: 6, title: 'Part VI: Communicating, Perceiving, Acting', chapters: [22, 23, 24, 25], weight: 'Medium' },
  { id: 7, title: 'Part VII: Conclusions & Safety', chapters: [26, 27], weight: 'Medium' }
];

const getComputedAvatar = (name: string, fallback: string = 'AS') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1] ? parts[1][0] : parts[0][1] || '')).toUpperCase();
};

const CHAPTER_OPTIONS = [
  { id: 1, title: 'Ch 1: Introduction to AI' },
  { id: 2, title: 'Ch 2: Intelligent Agents' },
  { id: 3, title: 'Ch 3: Solving Problems by Searching' },
  { id: 4, title: 'Ch 4: Beyond Classical Search' },
  { id: 5, title: 'Ch 5: Adversarial Search & Games' },
  { id: 6, title: 'Ch 6: Constraint Satisfaction Problems' },
  { id: 7, title: 'Ch 7: Logical Agents' },
  { id: 8, title: 'Ch 8: First-Order Logic' },
  { id: 9, title: 'Ch 9: Inference in First-Order Logic' },
  { id: 10, title: 'Ch 10: Knowledge Representation' },
  { id: 11, title: 'Ch 11: Automated Planning' },
  { id: 12, title: 'Ch 12: Planning & Acting in Real World' },
  { id: 13, title: 'Ch 13: Quantifying Uncertainty' },
  { id: 14, title: 'Ch 14: Probabilistic Reasoning' },
  { id: 15, title: 'Ch 15: Probabilistic Reasoning over Time' },
  { id: 16, title: 'Ch 16: Making Simple Decisions' },
  { id: 17, title: 'Ch 17: Making Complex Decisions (MDPs)' },
  { id: 18, title: 'Ch 18: Learning from Examples' },
  { id: 19, title: 'Ch 19: Learning Probabilistic Models' },
  { id: 20, title: 'Ch 20: Deep Learning' },
  { id: 21, title: 'Ch 21: Reinforcement Learning' },
  { id: 22, title: 'Ch 22: Natural Language Processing' },
  { id: 23, title: 'Ch 23: Deep Learning for NLP' },
  { id: 24, title: 'Ch 24: Computer Vision' },
  { id: 25, title: 'Ch 25: Robotics' },
  { id: 26, title: 'Ch 26: Philosophy & Ethics of AI' },
  { id: 27, title: 'Ch 27: The Future of AI' }
];

export const YouProfileView: React.FC<YouProfileViewProps> = ({ onOpenSync }) => {
  const { user, isAuthenticated, isGuest, logout, openSignIn, openSignUp, updateProfile } = useAuth();
  const { stats, progress, loadSyncData, examReadinessScore, completedCount, resetProgress } = useProgress();
  const { isDark, toggleTheme } = useTheme();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'plan' | 'notes' | 'settings'>('overview');
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  // Backup & disaster recovery state
  const [backupStatus, setBackupStatus] = useState<string | null>(null);

  // Edit form state
  const [editName, setEditName] = useState(user.name);
  const [editUniversity, setEditUniversity] = useState(user.university || 'University AI Institute');
  const [editDegree, setEditDegree] = useState(user.degreeProgram || 'Computer Science & Artificial Intelligence');
  const [editRole, setEditRole] = useState(user.academicRole || 'undergraduate');
  const [editBio, setEditBio] = useState(user.bio || '');
  const [editExamName, setEditExamName] = useState<string>((user as any).examName || 'Russell & Norvig AIMA 4th Edition Final');
  const [editExamDate, setEditExamDate] = useState(user.targetExamDate || '2026-12-15');
  const [editScore, setEditScore] = useState(user.targetScore || 95);
  const [editDailyGoalMinutes, setEditDailyGoalMinutes] = useState(user.dailyGoalMinutes || 30);
  const [editFocusAreas, setEditFocusAreas] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mantiq_exam_focus_areas');
      return saved ? JSON.parse(saved) : ['Search & Problem-Solving', 'Logic & Knowledge Representation', 'Probabilistic Reasoning'];
    } catch {
      return ['Search & Problem-Solving', 'Logic & Knowledge Representation'];
    }
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [examGoalSuccess, setExamGoalSuccess] = useState(false);

  // Notes Studio state
  const { notes, addNote, updateNote, deleteNote, togglePin, searchNotes, exportNotesMarkdown, loadNotes } = useNotes();

  const handleExportFullBackup = () => {
    soundFX.playClick();
    const payload = SyncManager.createExportPayload(user, stats, progress, notes);
    SyncManager.exportToFile(
      payload,
      `mantiq-backup-${user.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json`
    );
    soundFX.playCorrect();
    setBackupStatus(`Complete scholar backup (${notes.length} notes, all progress) saved!`);
    setTimeout(() => setBackupStatus(null), 4000);
  };

  const handleImportFullBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const payload: SyncPayload = SyncManager.parseImport(text);
        loadSyncData(payload);
        if (payload.notes && Array.isArray(payload.notes)) {
          loadNotes(payload.notes);
        }
        soundFX.playCorrect();
        setBackupStatus(`Successfully restored ${payload.notes?.length ?? 0} notes and all progress!`);
        setTimeout(() => setBackupStatus(null), 4000);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown parsing error';
        alert(`Failed to import backup: ${msg}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };
  const [noteSearchQuery, setNoteSearchQuery] = useState('');
  const [noteCategoryFilter, setNoteCategoryFilter] = useState<string>('all');
  const [noteChapterFilter, setNoteChapterFilter] = useState<number>(0);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<StudyNote | null>(null);

  // Note draft state
  const [draftChapterId, setDraftChapterId] = useState<number>(3);
  const [draftCategory, setDraftCategory] = useState<StudyNote['category']>('theorem');
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftTags, setDraftTags] = useState('Midterm, Formula');

  const handleOpenCreateNote = (chapterId = 3) => {
    soundFX.playClick();
    setEditingNote(null);
    setDraftChapterId(chapterId);
    setDraftCategory('theorem');
    setDraftTitle('');
    setDraftContent('');
    setDraftTags('Formula, Midterm');
    setIsNoteModalOpen(true);
  };

  const handleOpenEditNote = (note: StudyNote) => {
    soundFX.playClick();
    setEditingNote(note);
    setDraftChapterId(note.chapterId);
    setDraftCategory(note.category);
    setDraftTitle(note.title);
    setDraftContent(note.content);
    setDraftTags(note.tags.join(', '));
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim() || !draftContent.trim()) return;

    const tagsArray = draftTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingNote) {
      updateNote(editingNote.id, {
        chapterId: draftChapterId,
        category: draftCategory,
        title: draftTitle.trim(),
        content: draftContent.trim(),
        tags: tagsArray
      });
    } else {
      addNote({
        chapterId: draftChapterId,
        category: draftCategory,
        title: draftTitle.trim(),
        content: draftContent.trim(),
        tags: tagsArray,
        isPinned: false
      });
    }

    soundFX.playCorrect();
    setIsNoteModalOpen(false);
  };

  const handleDeleteNote = (id: string) => {
    soundFX.playClick();
    if (window.confirm('Delete this study note?')) {
      deleteNote(id);
    }
  };

  // System toggles
  const [offlineSaved, setOfflineSaved] = useState<boolean>(user.offlineReady ?? true);
  const [dailyReminder, setDailyReminder] = useState<boolean>(true);

  // Academic metrics
  const streakDays = stats.streakDays;
  const currentXP = stats.xp;
  const currentLevel = stats.level;
  const nextLevelXP = currentLevel * 350;
  const currentLevelBaseXP = (currentLevel - 1) * 350;
  const levelProgress = Math.min(100, Math.max(0, Math.round(((currentXP - currentLevelBaseXP) / 350) * 100)));

  // Days left to exam
  const calculateDaysLeft = () => {
    if (!user.targetExamDate) return null;
    const diff = new Date(user.targetExamDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };
  const daysUntilExam = calculateDaysLeft();

  const badges = [
    { id: 'first_quiz', name: 'First Quiz Passed', unlocked: stats.unlockedBadgeIds?.includes('first_quiz') || stats.totalQuizzesTaken > 0, icon: Target, desc: 'Completed first chapter assessment' },
    { id: '3_streak', name: '3-Day Scholar Streak', unlocked: streakDays >= 3, icon: Flame, desc: 'Maintained 3 consecutive study sessions' },
    { id: 'astar_master', name: 'A* Admissibility Prover', unlocked: stats.completedChapterIds?.includes(3), icon: Star, desc: 'Mastered informed search & tree pruning' },
    { id: 'bellman_solver', name: 'Bellman Contraction', unlocked: stats.completedChapterIds?.includes(17), icon: Zap, desc: 'Solved MDP value iteration to convergence' },
    { id: 'perfect_quiz', name: 'Summa Cum Laude', unlocked: stats.unlockedBadgeIds?.includes('perfect_quiz'), icon: Trophy, desc: 'Scored 100% on a university midterm quiz' },
    { id: 'bayesian_fellow', name: 'Bayes Trellis Fellow', unlocked: stats.completedChapterIds?.includes(14) || stats.completedChapterIds?.includes(15), icon: GraduationCap, desc: 'Inferred exact posterior probability' }
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playCorrect();
    const autoAvatar = getComputedAvatar(editName, user.avatar || 'AS');
    updateProfile({
      name: editName,
      university: editUniversity,
      degreeProgram: editDegree,
      academicRole: editRole as any,
      bio: editBio,
      avatar: autoAvatar,
      offlineReady: offlineSaved
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  const handleSaveExamGoals = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playCorrect();
    updateProfile({
      targetExamDate: editExamDate,
      targetScore: editScore,
      dailyGoalMinutes: editDailyGoalMinutes,
      ...({ examName: editExamName } as any)
    });
    try {
      localStorage.setItem('mantiq_exam_focus_areas', JSON.stringify(editFocusAreas));
    } catch {}
    setExamGoalSuccess(true);
    setTimeout(() => {
      setExamGoalSuccess(false);
    }, 2500);
  };

  const handleLogout = () => {
    soundFX.playClick();
    logout();
  };

  return (
    <div className="quest-you-flow">
      {/* View Header with Academic Badging */}
      <div className="quest-view-header">
        <div>
          <div className="quest-greeting-sub">ACADEMIC PORTFOLIO</div>
          <h1 className="quest-view-title">{user.name}</h1>
        </div>

        {/* Sub-tab Filter Pills */}
        <div className="quest-ranks-filter-pills">
          <button
            className={`quest-filter-pill ${activeSubTab === 'overview' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveSubTab('overview');
            }}
          >
            Overview
          </button>
          <button
            className={`quest-filter-pill ${activeSubTab === 'plan' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveSubTab('plan');
            }}
          >
            Exam Plan
          </button>
          <button
            className={`quest-filter-pill ${activeSubTab === 'notes' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveSubTab('notes');
            }}
          >
            Notes & Formulas
          </button>
          <button
            className={`quest-filter-pill ${activeSubTab === 'settings' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              setActiveSubTab('settings');
            }}
          >
            Settings
          </button>
        </div>
      </div>

      {/* SCHOLAR PROFILE HEADER HERO CARD */}
      <div
        style={{
          background: 'var(--quest-card-bg)',
          borderRadius: '24px',
          border: '1px solid var(--quest-border)',
          padding: '28px',
          marginBottom: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Avatar with Academic Cap Ring */}
          <div
            style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'var(--quest-bg)',
              border: '2px solid var(--quest-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              boxShadow: '0 8px 24px rgba(74, 222, 128, 0.15)'
            }}
          >
            {user.avatar}
            <div
              style={{
                position: 'absolute',
                bottom: '-6px',
                right: '-6px',
                background: 'var(--quest-card-dark)',
                color: 'var(--quest-accent)',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 800,
                border: '2px solid var(--quest-card-bg)'
              }}
              title={`Level ${currentLevel}`}
            >
              {currentLevel}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2
                style={{
                  fontFamily: 'var(--quest-font-heading)',
                  fontSize: '24px',
                  fontWeight: 800,
                  margin: 0,
                  color: 'var(--quest-text-primary)'
                }}
              >
                {user.name}
              </h2>

              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '100px',
                  background: isGuest ? 'rgba(156, 163, 175, 0.15)' : 'rgba(74, 222, 128, 0.15)',
                  color: isGuest ? 'var(--quest-text-muted)' : 'var(--quest-accent-text)',
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                {isGuest ? 'Auditing Guest' : user.academicRole || 'Scholar'}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '6px',
                fontSize: '14px',
                color: 'var(--quest-text-secondary)',
                flexWrap: 'wrap'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Building2 size={14} color="var(--quest-accent-text)" /> {user.university || 'Independent Scholar'}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <GraduationCap size={14} /> {user.degreeProgram || 'Artificial Intelligence'}
              </span>
            </div>

            {user.bio && (
              <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--quest-text-muted)', maxWidth: '560px' }}>
                "{user.bio}"
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons: Edit Profile, Sign In / Sign Out */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="quest-btn-outline"
            style={{
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '14px'
            }}
            onClick={() => {
              soundFX.playClick();
              setIsEditingProfile(true);
              setActiveSubTab('settings');
            }}
          >
            <Edit3 size={15} /> Edit Profile
          </button>

          {isGuest ? (
            <button
              style={{
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: 800,
                borderRadius: '14px',
                background: 'var(--quest-accent)',
                color: '#13211C',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onClick={() => {
                soundFX.playClick();
                openSignIn();
              }}
            >
              <LogIn size={15} /> Sign In / Register
            </button>
          ) : (
            <button
              className="quest-btn-outline"
              style={{
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderRadius: '14px',
                color: '#EF4444',
                borderColor: 'rgba(239, 68, 68, 0.3)'
              }}
              onClick={handleLogout}
              title="Sign out to Guest mode"
            >
              <LogOut size={15} /> Sign Out
            </button>
          )}
        </div>
      </div>

      {/* SUB-TAB 1: ACADEMIC OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="quest-you-layout">
          {/* Left Column: Academic Standing & Curriculum Mastery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Academic Standing Card */}
            <div className="quest-settings-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="quest-stat-card-title">Academic Level & Standing</span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: 'var(--quest-accent-text)',
                    background: 'rgba(74, 222, 128, 0.1)',
                    padding: '4px 10px',
                    borderRadius: '100px'
                  }}
                >
                  Projected Grade:{' '}
                  {examReadinessScore === 0
                    ? 'Pending (0%)'
                    : examReadinessScore >= 90
                    ? 'A+'
                    : examReadinessScore >= 80
                    ? 'A'
                    : examReadinessScore >= 70
                    ? 'B+'
                    : 'In Progress'}
                </span>
              </div>

              <div className="quest-level-row">
                <div className="quest-level-circle">{currentLevel}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--quest-font-heading)', fontSize: '20px', fontWeight: 800 }}>
                    Level {currentLevel} · {user.currentTitle || 'Rational Agent Apprentice'}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--quest-text-muted)', marginBottom: '8px' }}>
                    {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP to Level {currentLevel + 1}
                  </div>
                  <div className="quest-hero-progress-track">
                    <div className="quest-hero-progress-fill" style={{ width: `${levelProgress}%` }} />
                  </div>
                </div>
              </div>

              {/* 3 Metric Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '12px' }}>
                <div style={{ padding: '14px', background: 'var(--quest-bg)', borderRadius: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--quest-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Mastery Score
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--quest-accent-text)', marginTop: '4px' }}>
                    {examReadinessScore}%
                  </div>
                </div>

                <div style={{ padding: '14px', background: 'var(--quest-bg)', borderRadius: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--quest-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Completed
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--quest-text-primary)', marginTop: '4px' }}>
                    {completedCount} / 27
                  </div>
                </div>

                <div style={{ padding: '14px', background: 'var(--quest-bg)', borderRadius: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--quest-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Study Streak
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#FF6A00', marginTop: '4px' }}>
                    {streakDays} Days
                  </div>
                </div>
              </div>
            </div>

            {/* AIMA 7-Part Mastery Breakdown */}
            <div className="quest-settings-card">
              <span className="quest-stat-card-title">Curriculum Mastery by Part (Russell & Norvig 4th ed)</span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
                {AIMA_PARTS.map((part) => {
                  const doneCount = part.chapters.filter((c) => stats.completedChapterIds?.includes(c)).length;
                  const partPct = Math.round((doneCount / part.chapters.length) * 100);

                  return (
                    <div key={part.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--quest-text-primary)' }}>{part.title}</span>
                        <span style={{ fontSize: '12px', color: 'var(--quest-text-muted)', fontWeight: 600 }}>
                          {doneCount} / {part.chapters.length} chapters ({partPct}%)
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'var(--quest-bg)', borderRadius: '100px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${partPct}%`,
                            height: '100%',
                            background: partPct > 0 ? 'var(--quest-accent)' : 'transparent',
                            borderRadius: '100px',
                            transition: 'width 0.4s ease'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Streak Calendar & Honors Badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Streak & Weekly Commitment Card */}
            <div className="quest-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="quest-stat-card-title">Weekly Study Commitment</div>
                  <div
                    style={{
                      fontFamily: 'var(--quest-font-heading)',
                      fontSize: '36px',
                      fontWeight: 800,
                      color: 'var(--quest-text-primary)'
                    }}
                  >
                    {streakDays} days
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--quest-text-muted)' }}>
                    Target: {user.dailyGoalMinutes || 30} mins daily
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'rgba(249, 115, 22, 0.12)',
                    border: '1px solid rgba(249, 115, 22, 0.25)'
                  }}
                >
                  <Flame size={26} color="#EA580C" />
                </div>
              </div>

              {/* Day circles */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                  const todayIdx = (new Date().getDay() + 6) % 7;
                  const isToday = idx === todayIdx;

                  const todayDate = new Date();
                  const year = todayDate.getFullYear();
                  const month = String(todayDate.getMonth() + 1).padStart(2, '0');
                  const dayNum = String(todayDate.getDate()).padStart(2, '0');
                  const todayStr = `${year}-${month}-${dayNum}`;

                  const isTodayActive = stats.lastActiveDate === todayStr;
                  const isDayDone = isToday
                    ? (streakDays > 0 && isTodayActive)
                    : (streakDays > 0 && idx < todayIdx && (todayIdx - idx < (isTodayActive ? streakDays : streakDays + 1)));

                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: isDayDone ? 'var(--quest-card-dark)' : 'transparent',
                          border: `2px solid ${isDayDone ? 'var(--quest-card-dark)' : 'var(--quest-border)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--quest-accent)',
                          fontSize: '12px',
                          fontWeight: 700
                        }}
                      >
                        {isDayDone ? <Check size={14} strokeWidth={2.5} /> : ''}
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--quest-text-muted)' }}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Academic Honors Badges */}
            <div className="quest-stat-card">
              <div className="quest-stat-card-title">Academic Honors & Certifications</div>
              <div className="quest-badges-grid">
                {badges.map((badge) => {
                  const BadgeIcon = badge.icon;
                  return (
                    <div key={badge.id} className="quest-badge-item" title={badge.desc}>
                      <div className={`quest-badge-circle ${badge.unlocked ? 'unlocked' : ''}`}>
                        {badge.unlocked ? (
                          <BadgeIcon size={18} color="var(--quest-accent-dark, #13211C)" />
                        ) : (
                          <Lock size={15} color="var(--quest-text-muted)" />
                        )}
                      </div>
                      <div className="quest-badge-name">{badge.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--quest-text-muted)' }}>
                        {badge.unlocked ? 'Earned' : 'Locked'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: EXAM PLAN & DEADLINES */}
      {activeSubTab === 'plan' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px' }}>
          <div className="quest-settings-card">
            <span className="quest-stat-card-title">Target Exam Schedule & Milestone Timeline</span>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                background: 'var(--quest-bg)',
                borderRadius: '16px',
                marginTop: '12px'
              }}
            >
              <Calendar size={32} color="var(--quest-accent-text)" />
              <div>
                <div style={{ fontSize: '13px', color: 'var(--quest-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Upcoming Final Exam
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                  {user.targetExamDate || 'December 15, 2026'}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--quest-accent-text)', fontWeight: 600, marginTop: '2px' }}>
                  {daysUntilExam !== null ? `${daysUntilExam} days remaining` : 'Schedule set'}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
                Recommended High-Yield Chapters:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { ch: 3, title: 'Informed Search & A*', status: 'Core Exam Weight', color: '#10B981' },
                  { ch: 5, title: 'Adversarial Search & Alpha-Beta', status: 'Oral Defense Item', color: '#6366F1' },
                  { ch: 13, title: 'Quantifying Uncertainty & Bayes', status: 'Midterm Guaranteed', color: '#F59E0B' },
                  { ch: 17, title: 'Markov Decision Processes & Bellman', status: 'Graduate Comprehensive', color: '#EC4899' },
                  { ch: 21, title: 'Reinforcement Learning (TD & Q-Learn)', status: 'Capstone Weight', color: '#8B5CF6' }
                ].map((item) => (
                  <div
                    key={item.ch}
                    style={{
                      padding: '12px 16px',
                      background: 'var(--quest-bg)',
                      borderRadius: '12px',
                      border: '1px solid var(--quest-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>
                        Chapter {item.ch}: {item.title}
                      </div>
                      <div style={{ fontSize: '12px', color: item.color, fontWeight: 600 }}>
                        {item.status}
                      </div>
                    </div>
                    <CheckCircle2 size={18} color="var(--quest-text-muted)" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="quest-stat-card">
            <span className="quest-stat-card-title">Mastery Goal Target</span>

            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  border: '6px solid var(--quest-accent)',
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--quest-bg)'
                }}
              >
                <span style={{ fontSize: '32px', fontWeight: 900, color: 'var(--quest-text-primary)' }}>
                  {user.targetScore || 95}%
                </span>
                <span style={{ fontSize: '11px', color: 'var(--quest-text-muted)', fontWeight: 700 }}>
                  GOAL
                </span>
              </div>

              <div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--quest-text-secondary)' }}>
                Targeting Top 5th Percentile in CS Midterm Assessments.
              </div>

              <div style={{ marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setActiveSubTab('settings');
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    background: 'var(--quest-accent)',
                    color: '#13211C',
                    fontSize: '12px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Configure Exam Goals & Milestones →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: NOTES & FORMULAS STUDIO */}
      {activeSubTab === 'notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Control Bar: Search, Filters, New Note, Export */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--quest-card-bg)',
              padding: '16px 20px',
              borderRadius: '18px',
              border: '1px solid var(--quest-border)'
            }}
          >
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--quest-bg)', padding: '8px 14px', borderRadius: '12px', border: '1px solid var(--quest-border)', minWidth: '240px', flex: 1 }}>
              <Search size={16} color="var(--quest-text-muted)" />
              <input
                type="text"
                value={noteSearchQuery}
                onChange={(e) => setNoteSearchQuery(e.target.value)}
                placeholder="Search notes, formulas, theorems, tags..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--quest-text-primary)',
                  fontSize: '13px',
                  width: '100%'
                }}
              />
              {noteSearchQuery && (
                <button
                  type="button"
                  onClick={() => setNoteSearchQuery('')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--quest-text-muted)', cursor: 'pointer', padding: 0 }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Chapter Selector Dropdown */}
            <select
              value={noteChapterFilter}
              onChange={(e) => setNoteChapterFilter(Number(e.target.value))}
              style={{
                padding: '9px 14px',
                borderRadius: '12px',
                background: 'var(--quest-bg)',
                border: '1px solid var(--quest-border)',
                color: 'var(--quest-text-primary)',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <option value={0}>All Chapters (1–27)</option>
              {CHAPTER_OPTIONS.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.title}
                </option>
              ))}
            </select>

            {/* Actions: Export & New Note */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={exportNotesMarkdown}
                className="quest-btn-outline"
                style={{
                  padding: '9px 14px',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '12px'
                }}
                title="Export all notes to Markdown study guide"
              >
                <Download size={14} /> Export MD
              </button>

              <button
                type="button"
                onClick={handleExportFullBackup}
                className="quest-btn-outline"
                style={{
                  padding: '9px 14px',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '12px'
                }}
                title="Download complete scholar backup (.json)"
              >
                <FileJson size={14} /> Backup JSON
              </button>

              <button
                type="button"
                onClick={() => handleOpenCreateNote(noteChapterFilter > 0 ? noteChapterFilter : 3)}
                style={{
                  padding: '9px 16px',
                  fontSize: '13px',
                  fontWeight: 800,
                  borderRadius: '12px',
                  background: 'var(--quest-accent)',
                  color: '#13211C',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={15} /> New Note
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              { id: 'all', label: 'All Notes' },
              { id: 'theorem', label: 'Theorems & Proofs' },
              { id: 'formula', label: 'Formulas & Math' },
              { id: 'exam_trap', label: 'Exam Traps' },
              { id: 'summary', label: 'Chapter Summaries' },
              { id: 'question', label: 'Open Questions' },
            ].map((cat) => {
              const isSelected = noteCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setNoteCategoryFilter(cat.id);
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '100px',
                    border: isSelected ? '1px solid var(--quest-accent)' : '1px solid var(--quest-border)',
                    background: isSelected ? 'rgba(74, 222, 128, 0.15)' : 'var(--quest-card-bg)',
                    color: isSelected ? 'var(--quest-accent-text)' : 'var(--quest-text-secondary)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Notes Cards Grid / List */}
          {searchNotes(noteSearchQuery, noteCategoryFilter, noteChapterFilter).length === 0 ? (
            <div
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                background: 'var(--quest-card-bg)',
                borderRadius: '20px',
                border: '1px dashed var(--quest-border)',
                color: 'var(--quest-text-muted)'
              }}
            >
              <Bookmark size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--quest-text-primary)' }}>
                No notes found matching your filters
              </div>
              <p style={{ fontSize: '13px', margin: '4px 0 16px' }}>
                Capture important formulas, proofs, and midterm gotchas as you study.
              </p>
              <button
                type="button"
                onClick={() => handleOpenCreateNote(noteChapterFilter > 0 ? noteChapterFilter : 3)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '12px',
                  background: 'var(--quest-accent)',
                  color: '#13211C',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                + Create Note
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
              {searchNotes(noteSearchQuery, noteCategoryFilter, noteChapterFilter).map((note) => {
                const getCategoryStyle = (cat: StudyNote['category']) => {
                  switch (cat) {
                    case 'theorem':
                      return { bg: 'rgba(59, 130, 246, 0.12)', text: '#3B82F6', label: 'THEOREM' };
                    case 'formula':
                      return { bg: 'rgba(34, 197, 94, 0.12)', text: '#22C55E', label: 'FORMULA' };
                    case 'exam_trap':
                      return { bg: 'rgba(239, 68, 68, 0.12)', text: '#EF4444', label: 'EXAM TRAP' };
                    case 'summary':
                      return { bg: 'rgba(245, 158, 11, 0.12)', text: '#F59E0B', label: 'SUMMARY' };
                    case 'question':
                      return { bg: 'rgba(139, 92, 246, 0.12)', text: '#8B5CF6', label: 'QUESTION' };
                    default:
                      return { bg: 'rgba(156, 163, 175, 0.12)', text: '#9CA3AF', label: 'NOTE' };
                  }
                };
                const catStyle = getCategoryStyle(note.category);

                return (
                  <div
                    key={note.id}
                    style={{
                      background: 'var(--quest-card-bg)',
                      border: note.isPinned ? '2px solid var(--quest-accent)' : '1px solid var(--quest-border)',
                      borderRadius: '18px',
                      padding: '20px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Header: Meta Badges + Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {note.isPinned && (
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: 'rgba(255, 106, 0, 0.15)',
                              color: '#FF6A00',
                              fontSize: '11px',
                              fontWeight: 800,
                              letterSpacing: '0.04em'
                            }}
                          >
                            PINNED
                          </span>
                        )}

                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: 'var(--quest-bg)',
                            color: 'var(--quest-text-primary)',
                            fontSize: '11px',
                            fontWeight: 800,
                            border: '1px solid var(--quest-border)'
                          }}
                        >
                          CHAPTER {note.chapterId}
                        </span>

                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: catStyle.bg,
                            color: catStyle.text,
                            fontSize: '11px',
                            fontWeight: 800,
                            letterSpacing: '0.04em'
                          }}
                        >
                          {catStyle.label}
                        </span>
                      </div>

                      {/* Controls: Pin, Edit, Delete */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            soundFX.playClick();
                            togglePin(note.id);
                          }}
                          style={{
                            padding: '6px',
                            background: 'transparent',
                            border: 'none',
                            color: note.isPinned ? '#FF6A00' : 'var(--quest-text-muted)',
                            cursor: 'pointer',
                            borderRadius: '6px'
                          }}
                          title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
                        >
                          <Pin size={16} fill={note.isPinned ? '#FF6A00' : 'none'} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditNote(note)}
                          style={{
                            padding: '6px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--quest-text-muted)',
                            cursor: 'pointer',
                            borderRadius: '6px'
                          }}
                          title="Edit note"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteNote(note.id)}
                          style={{
                            padding: '6px',
                            background: 'transparent',
                            border: 'none',
                            color: '#EF4444',
                            cursor: 'pointer',
                            borderRadius: '6px'
                          }}
                          title="Delete note"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Note Title */}
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '17px',
                        fontWeight: 800,
                        color: 'var(--quest-text-primary)',
                        fontFamily: 'var(--quest-font-heading)'
                      }}
                    >
                      {note.title}
                    </h3>

                    {/* Note Content */}
                    <div
                      style={{
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: 'var(--quest-text-primary)',
                        whiteSpace: 'pre-wrap',
                        fontFamily: note.category === 'formula' ? 'var(--quest-font-mono, monospace)' : 'inherit',
                        background: 'var(--quest-bg)',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid var(--quest-border)'
                      }}
                    >
                      {note.content}
                    </div>

                    {/* Footer: Tags & Date */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {note.tags.map((t, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: 'var(--quest-text-muted)',
                              background: 'var(--quest-bg)',
                              padding: '2px 8px',
                              borderRadius: '6px'
                            }}
                          >
                            #{t}
                          </span>
                        ))}
                      </div>

                      <div style={{ fontSize: '11px', color: 'var(--quest-text-muted)' }}>
                        {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: SETTINGS & EDIT PROFILE */}
      {activeSubTab === 'settings' && (
        <div className="quest-you-layout">
          {/* Left Column: Edit Profile & Exam Goals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 1. Scholar Identity & Credentials Card */}
            <div className="quest-settings-card">
              <span className="quest-stat-card-title">Scholar Identity & Credentials</span>

              {saveSuccess && (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#22C55E',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}
                >
                  <Check size={16} /> Scholar identity credentials updated successfully!
                </div>
              )}

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Auto Scholar Monogram Indicator */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    background: 'var(--quest-bg)',
                    border: '1px solid var(--quest-border)'
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      background: 'var(--quest-accent)',
                      color: '#13211C',
                      fontWeight: 900,
                      fontSize: '18px',
                      fontFamily: 'var(--quest-font-heading)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }}
                  >
                    {getComputedAvatar(editName, user.avatar || 'AS')}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                      Academic Monogram
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--quest-text-muted)' }}>
                      Automatically formatted from your scholar identity
                    </div>
                  </div>
                </div>

                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-input"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'var(--quest-bg)',
                      border: '1px solid var(--quest-border)',
                      color: 'var(--quest-text-primary)',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* University & Degree */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">University / Institution</label>
                    <input
                      type="text"
                      value={editUniversity}
                      onChange={(e) => setEditUniversity(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'var(--quest-bg)',
                        border: '1px solid var(--quest-border)',
                        color: 'var(--quest-text-primary)',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Degree / Program</label>
                    <input
                      type="text"
                      value={editDegree}
                      onChange={(e) => setEditDegree(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'var(--quest-bg)',
                        border: '1px solid var(--quest-border)',
                        color: 'var(--quest-text-primary)',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Academic Role */}
                <div className="form-group">
                  <label className="form-label">Academic Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'var(--quest-bg)',
                      border: '1px solid var(--quest-border)',
                      color: 'var(--quest-text-primary)',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="undergraduate">Undergraduate Student</option>
                    <option value="graduate">Graduate (M.S.) Student</option>
                    <option value="phd">Ph.D. / Postdoc Fellow</option>
                    <option value="faculty">Faculty / Instructor</option>
                    <option value="independent">Independent Researcher</option>
                  </select>
                </div>

                {/* Bio */}
                <div className="form-group">
                  <label className="form-label">Research / Study Focus</label>
                  <textarea
                    rows={2}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="e.g. Heuristic search and reinforcement learning safety"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'var(--quest-bg)',
                      border: '1px solid var(--quest-border)',
                      color: 'var(--quest-text-primary)',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: '4px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'var(--quest-accent)',
                    color: '#13211C',
                    fontFamily: 'var(--quest-font-heading)',
                    fontWeight: 800,
                    fontSize: '15px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Save Scholar Credentials
                </button>
              </form>
            </div>

            {/* 2. Dedicated Academic Exam Goals & Milestones Card */}
            <div className="quest-settings-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={20} color="var(--quest-accent)" />
                  <span className="quest-stat-card-title" style={{ margin: 0 }}>Academic Exam Goals</span>
                </div>
                {daysUntilExam !== null && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      borderRadius: '100px',
                      background: 'rgba(201, 242, 107, 0.2)',
                      color: isDark ? 'var(--quest-accent)' : '#13211C',
                      fontSize: '12px',
                      fontWeight: 800
                    }}
                  >
                    <Clock size={13} /> {daysUntilExam} Days Left
                  </span>
                )}
              </div>

              {examGoalSuccess && (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#22C55E',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px'
                  }}
                >
                  <Check size={16} /> Exam goals & target milestones successfully saved!
                </div>
              )}

              <form onSubmit={handleSaveExamGoals} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Target Examination Name with quick presets */}
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px' }}>
                    Target Examination / Course
                  </label>
                  <input
                    type="text"
                    value={editExamName}
                    onChange={(e) => setEditExamName(e.target.value)}
                    placeholder="e.g. Russell & Norvig AIMA 4th Edition Final"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'var(--quest-bg)',
                      border: '1px solid var(--quest-border)',
                      color: 'var(--quest-text-primary)',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {[
                      'Russell & Norvig AIMA 4th Edition Final',
                      'CS AI Midterm Exam',
                      'AI Qualifying Exam',
                      'Self-Paced Mastery'
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setEditExamName(preset)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: editExamName === preset ? 'var(--quest-accent)' : 'var(--quest-bg)',
                          color: editExamName === preset ? '#13211C' : 'var(--quest-text-muted)',
                          border: '1px solid var(--quest-border)',
                          cursor: 'pointer'
                        }}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exam Date & Target Score */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                      <Calendar size={14} /> Target Exam Date
                    </label>
                    <input
                      type="date"
                      value={editExamDate}
                      onChange={(e) => setEditExamDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'var(--quest-bg)',
                        border: '1px solid var(--quest-border)',
                        color: 'var(--quest-text-primary)',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                      <Award size={14} /> Target Score ({editScore}%)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="number"
                        min="50"
                        max="100"
                        value={editScore}
                        onChange={(e) => setEditScore(Number(e.target.value))}
                        style={{
                          width: '75px',
                          padding: '10px 8px',
                          borderRadius: '10px',
                          background: 'var(--quest-bg)',
                          border: '1px solid var(--quest-border)',
                          color: 'var(--quest-text-primary)',
                          fontSize: '14px',
                          fontWeight: 700,
                          textAlign: 'center',
                          boxSizing: 'border-box'
                        }}
                      />
                      <span style={{ fontSize: '11px', color: 'var(--quest-text-muted)', fontWeight: 700 }}>
                        {editScore >= 95 ? 'Summa Cum Laude (A+)' : editScore >= 90 ? 'Magna Cum Laude (A)' : editScore >= 80 ? 'Dean\'s List (B+)' : 'Passing Goal'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Target Score Slider */}
                <div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={editScore}
                    onChange={(e) => setEditScore(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#C9F26B', cursor: 'pointer' }}
                  />
                </div>

                {/* Daily Study Commitment (Minutes) */}
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px' }}>
                    Daily Study Commitment
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[15, 30, 45, 60, 90].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setEditDailyGoalMinutes(mins)}
                        style={{
                          flex: 1,
                          padding: '8px 4px',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: 800,
                          border: editDailyGoalMinutes === mins ? '2px solid var(--quest-accent)' : '1px solid var(--quest-border)',
                          background: editDailyGoalMinutes === mins ? 'rgba(201, 242, 107, 0.2)' : 'var(--quest-bg)',
                          color: editDailyGoalMinutes === mins ? (isDark ? 'var(--quest-accent)' : '#13211C') : 'var(--quest-text-primary)',
                          cursor: 'pointer'
                        }}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority Focus Areas */}
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px' }}>
                    Priority Syllabus Focus
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {[
                      'Search & Problem-Solving',
                      'Logic & Knowledge Representation',
                      'Probabilistic Reasoning',
                      'Machine Learning & Deep Learning',
                      'NLP & Natural Language Processing'
                    ].map((area) => {
                      const isSelected = editFocusAreas.includes(area);
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setEditFocusAreas(editFocusAreas.filter((a) => a !== area));
                            } else {
                              setEditFocusAreas([...editFocusAreas, area]);
                            }
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '100px',
                            fontSize: '12px',
                            fontWeight: 700,
                            border: isSelected ? '1px solid var(--quest-accent)' : '1px solid var(--quest-border)',
                            background: isSelected ? 'rgba(201, 242, 107, 0.15)' : 'var(--quest-bg)',
                            color: isSelected ? (isDark ? 'var(--quest-accent)' : '#13211C') : 'var(--quest-text-muted)',
                            cursor: 'pointer'
                          }}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {area}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: '6px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'var(--quest-accent)',
                    color: '#13211C',
                    fontFamily: 'var(--quest-font-heading)',
                    fontWeight: 800,
                    fontSize: '15px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(201, 242, 107, 0.3)'
                  }}
                >
                  Save Exam Goals & Milestones
                </button>
              </form>
            </div>
          </div>


          {/* Right Column: Preferences, Sync & Danger Zone */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Preferences */}
            <div className="quest-settings-card">
              <span className="quest-stat-card-title">System & Study Preferences</span>

              {/* Dark Mode */}
              <div className="quest-toggle-row">
                <div>
                  <div className="quest-toggle-label">Dark mode</div>
                  <div className="quest-toggle-sub">Follows your preference ({isDark ? 'Dark' : 'Light'})</div>
                </div>

                <button
                  className="quest-btn-outline"
                  style={{
                    padding: '6px 16px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: isDark ? 'var(--quest-accent)' : 'transparent',
                    color: isDark ? '#13211C' : 'var(--quest-text-primary)'
                  }}
                  onClick={() => {
                    soundFX.playClick();
                    toggleTheme();
                  }}
                >
                  {isDark ? <Moon size={14} /> : <Sun size={14} />} {isDark ? 'On' : 'Off'}
                </button>
              </div>

              {/* Offline Chapters */}
              <div className="quest-toggle-row">
                <div>
                  <div className="quest-toggle-label">Offline chapters cache</div>
                  <div className="quest-toggle-sub">Pre-cache all 27 chapters for offline access</div>
                </div>

                <button
                  className="quest-btn-outline"
                  style={{
                    padding: '6px 16px',
                    fontSize: '13px',
                    background: offlineSaved ? 'var(--quest-accent)' : 'transparent',
                    color: offlineSaved ? '#13211C' : 'var(--quest-text-primary)'
                  }}
                  onClick={() => {
                    soundFX.playClick();
                    setOfflineSaved(!offlineSaved);
                  }}
                >
                  {offlineSaved ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Multi-Device Cloud Sync */}
              <div
                style={{
                  marginTop: '12px',
                  padding: '16px',
                  background: 'var(--quest-bg)',
                  borderRadius: '16px',
                  border: '1px solid var(--quest-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--quest-font-heading)', fontSize: '15px', fontWeight: 800 }}>
                    Cross-Device Sync
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--quest-text-muted)' }}>
                    Export/import progress token or sync via QR code
                  </div>
                </div>

                <button
                  className="quest-btn-outline"
                  style={{ padding: '8px 16px', fontSize: '13px', background: 'var(--quest-card-bg)' }}
                  onClick={() => {
                    soundFX.playClick();
                    onOpenSync();
                  }}
                >
                  Sync Now
                </button>
              </div>
            </div>

            {/* Scholar Data Safety & Disaster Recovery */}
            <div className="quest-settings-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="quest-stat-card-title" style={{ margin: 0 }}>Scholar Data Safety & Backup</span>
                <span style={{ fontSize: '11px', fontWeight: 700, background: '#EAF6C9', color: '#13211C', padding: '2px 8px', borderRadius: '6px' }}>
                  Offline First
                </span>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--quest-text-secondary)', margin: '0 0 14px', lineHeight: 1.5 }}>
                Mantiq stores all notes, quiz records, and chapter progress in local browser storage for maximum privacy and zero latency. Back up your data to prevent accidental loss if browser cache is cleared.
              </p>

              {backupStatus && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: '#15803D',
                    fontSize: '13px',
                    fontWeight: 600,
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{backupStatus}</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="quest-btn-outline"
                  onClick={handleExportFullBackup}
                  style={{
                    flex: '1 1 180px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'var(--quest-bg)'
                  }}
                >
                  <Download size={15} /> Export Backup (.json)
                </button>

                <label
                  className="quest-btn-outline"
                  style={{
                    flex: '1 1 180px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'var(--quest-bg)',
                    cursor: 'pointer',
                    margin: 0
                  }}
                >
                  <Upload size={15} /> Restore Backup (.json)
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportFullBackup}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            {/* Account Management & Security */}
            <div className="quest-settings-card">
              <span className="quest-stat-card-title">Account Session & Security</span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--quest-text-secondary)' }}>
                <ShieldCheck size={18} color="var(--quest-accent-text)" />
                <span>Session ID: {user.id}</span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  className="quest-btn-outline"
                  style={{ flex: 1, padding: '10px', fontSize: '13px', fontWeight: 700 }}
                  onClick={() => {
                    soundFX.playClick();
                    openSignIn();
                  }}
                >
                  Switch Account
                </button>

                <button
                  className="quest-btn-outline"
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#EF4444',
                    borderColor: 'rgba(239, 68, 68, 0.3)'
                  }}
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>

              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--quest-border)' }}>
                <button
                  className="quest-btn-outline"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--quest-text-muted)',
                    background: 'transparent',
                    border: '1px dashed var(--quest-border)'
                  }}
                  onClick={() => {
                    if (window.confirm('Reset all course progress, badges, and study streaks to fresh initial state?')) {
                      resetProgress();
                      soundFX.playClick();
                      alert('Course progress has been reset to fresh state.');
                    }
                  }}
                >
                  <RefreshCw size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                  Reset Study Progress to Fresh State
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Note Create / Edit Modal Dialog */}
      {isNoteModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsNoteModalOpen(false)} style={{ zIndex: 1250 }}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '540px',
              width: '92%',
              background: 'var(--quest-card-bg)',
              borderRadius: '24px',
              border: '1px solid var(--quest-border)',
              padding: '24px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.4)'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bookmark size={20} color="var(--quest-accent-text)" />
                <h3 style={{ margin: 0, fontFamily: 'var(--quest-font-heading)', fontSize: '18px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                  {editingNote ? 'Edit Study Note' : 'Create New Study Note'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNoteModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--quest-text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Note Form */}
            <form onSubmit={handleSaveNote} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                {/* Chapter Select */}
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                    AIMA Chapter
                  </label>
                  <select
                    value={draftChapterId}
                    onChange={(e) => setDraftChapterId(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'var(--quest-bg)',
                      border: '1px solid var(--quest-border)',
                      color: 'var(--quest-text-primary)',
                      fontSize: '13px'
                    }}
                  >
                    {CHAPTER_OPTIONS.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Select */}
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                    Note Category
                  </label>
                  <select
                    value={draftCategory}
                    onChange={(e) => setDraftCategory(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'var(--quest-bg)',
                      border: '1px solid var(--quest-border)',
                      color: 'var(--quest-text-primary)',
                      fontSize: '13px'
                    }}
                  >
                    <option value="theorem">Theorem & Proof</option>
                    <option value="formula">Formula / Math</option>
                    <option value="exam_trap">Exam Trap</option>
                    <option value="summary">Chapter Summary</option>
                    <option value="question">Open Question</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="e.g. A* Consistency Monotonicity Condition"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'var(--quest-bg)',
                    border: '1px solid var(--quest-border)',
                    color: 'var(--quest-text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              {/* Tags */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={draftTags}
                  onChange={(e) => setDraftTags(e.target.value)}
                  placeholder="e.g. Heuristics, Proof, Midterm"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'var(--quest-bg)',
                    border: '1px solid var(--quest-border)',
                    color: 'var(--quest-text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              {/* Content */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                  Note Content / Equations
                </label>
                <textarea
                  required
                  rows={5}
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  placeholder="Type formulas, theorem premises, code snippets, or study notes..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'var(--quest-bg)',
                    border: '1px solid var(--quest-border)',
                    color: 'var(--quest-text-primary)',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="quest-btn-outline"
                  style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '10px' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '10px',
                    background: 'var(--quest-accent)',
                    color: '#13211C',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {editingNote ? 'Save Changes' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
