export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  bookReference: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  chapterId: number;
  partId: number;
  category: string;
  formula?: string;
}

export interface AlgorithmPseudo {
  name: string;
  inputs: string;
  returns: string;
  steps: string[];
  timeComplexity: string;
  spaceComplexity: string;
  optimality: string;
  completeness: string;
}

export interface ChapterConcept {
  title: string;
  summary: string;
  deepDive: string[];
  keyFormula?: {
    latex: string;
    description: string;
  };
  examTip?: string;
}

export interface Chapter {
  id: number;
  partId: number;
  title: string;
  subtitle: string;
  pageRange: string;
  summary: string;
  keyConcepts: ChapterConcept[];
  algorithms?: AlgorithmPseudo[];
  hasSimulation?: boolean;
  simulationType?: 'search' | 'vacuum' | 'minimax' | 'csp' | 'wumpus' | 'bayes' | 'mdp' | 'qlearn' | 'hmm' | 'decisiontree';
  examWeight: 'High' | 'Medium' | 'Essential';
  sections: string[];
}

export interface BookPart {
  id: number;
  title: string;
  description: string;
  chapters: Chapter[];
  color: string;
  iconName: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  university?: string;
  degreeProgram?: string;
  academicRole?: 'undergraduate' | 'graduate' | 'phd' | 'faculty' | 'independent';
  bio?: string;
  dailyGoalMinutes?: number;
  targetExamDate?: string;
  targetScore?: number;
  currentTitle: string;
  joinedDate: string;
  offlineReady: boolean;
  lastSyncedAt?: string;
  isGuest?: boolean;
}

export interface ChapterProgress {
  chapterId: number;
  read: boolean;
  quizScore?: number;
  quizTotal?: number;
  quizPassed?: boolean;
  simulationInteracted?: boolean;
  flashcardsReviewed?: number;
  lastStudiedAt: string;
}

export interface UserStats {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  streakProtected: boolean;
  totalQuizzesTaken: number;
  totalCorrectAnswers: number;
  completedChapterIds: number[];
  unlockedBadgeIds: string[];
  dailyChallengeCompleted: boolean;
  dailyChallengeDate: string;
  gems: number;
  hearts: number;
  maxHearts: number;
  claimedChests: number[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'search' | 'logic' | 'probability' | 'learning' | 'mastery' | 'streak';
  requirement: string;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  badge: string;
  isCurrentUser?: boolean;
}

export interface StudyNote {
  id: string;
  chapterId: number;
  chapterTitle?: string;
  title: string;
  content: string;
  category: 'formula' | 'theorem' | 'exam_trap' | 'summary' | 'question' | 'proof';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
}
