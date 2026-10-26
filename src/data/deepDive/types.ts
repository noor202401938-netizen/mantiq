// Deep-dive overlay for lesson steps: Q&A pairs and worked examples.
// Keyed by canonical chapterId and LessonStep.stepNumber, merged at render time
// so the core lesson data in aimaLessonsData.ts stays untouched.

export interface DeepDiveQA {
  /** A question a curious or exam-focused student would genuinely ask. */
  question: string;
  /** Markdown answer. Supports **bold**, `code`, $inline$ and $$display$$ math, tables, and > quotes. */
  answer: string;
}

export interface WorkedExample {
  title: string;
  /** Concrete setup with real numbers, states, or a small instance. */
  scenario: string;
  /** Ordered walkthrough; each entry is one markdown step. */
  walkthrough: string[];
  /** One-sentence lesson the example proves. */
  takeaway: string;
}

export interface StepDeepDive {
  qa: DeepDiveQA[];
  workedExample?: WorkedExample;
}

export type ChapterDeepDive = Record<number, StepDeepDive>;
