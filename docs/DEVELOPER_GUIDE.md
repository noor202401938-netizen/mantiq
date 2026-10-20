# Mantiq Developer & Architecture Guide

This document details the internal design, coding standards, state architecture, and testing guidelines for contributors and AI agents working on **Mantiq**.

---

## 1. Architectural Principles

1. **Strict Design Tokens:**
   - Dark Surface: Pitch Onyx (`#13211C`)
   - Accent / Math Highlight: Citron Lime (`#C9F26B`)
   - Light Reading Surface: Ivory (`#F3F5EF`)
   - Elevated Cards: `#1A2F27`
2. **Offline-First Resilience:**
   - The application must always function without network connectivity.
   - External services (Supabase) are optional enhancements and must never block rendering.
3. **Mathematical Precision:**
   - Formulas must use KaTeX via `src/utils/mathRenderer.tsx`. Never display raw unparsed LaTeX.

---

## 2. Directory Structure & Key Files

```text
src/
├── components/          # React views & interactive modals
│   ├── AimaDesktopNav.tsx       # Primary sidebar navigation
│   ├── AimaFlashcardModal.tsx   # 43+ Chapter-grouped flashcard deck
│   ├── AimaLessonViewer.tsx     # In-depth 27-chapter reading & rigor view
│   ├── AimaQuizModal.tsx        # 3-Tier examination testing module
│   ├── HomeFocusView.tsx        # Daily focus, streak, and quick drills
│   ├── LearnChaptersView.tsx    # Complete syllabus directory
│   ├── SyncModal.tsx            # Cryptographic backup export/import
│   └── YouProfileView.tsx       # Scholar stats, XP, and badges
├── context/             # Global React Contexts
│   ├── AuthContext.tsx          # User identity, SHA-256 hashed auth, profile
│   ├── ProgressContext.tsx      # XP, streak days, chapter unlock gates
│   ├── NotesContext.tsx         # Pinned study notes and chapter marginalia
│   └── ThemeContext.tsx         # Pitch Onyx Dark / Ivory Light switching
├── data/                # Static Curriculum Data
│   ├── aimaBookData.ts          # Parts I–VII and chapter outlines
│   ├── aimaExamFlashcardsData.ts# 43+ rich flashcards with KaTeX formulas
│   ├── aimaLessonsData.ts       # 27 detailed chapter lecture notes
│   └── quizzesData.ts           # Chapter quiz question pools
└── utils/               # Engines & Pure Functions
    ├── mathRenderer.tsx         # KaTeX rendering & markdown tokenization
    ├── soundEffects.ts          # Tactile Web Audio synthesizer
    ├── supabaseClient.ts        # Optional cloud sync & leaderboard
    └── syncManager.ts           # Backup generation with checksum verification
```

---

## 3. Engineering Workflows (`Superpowers`)

Contributors must adhere to the **Superpowers** discipline:

### Test-Driven Development (TDD)
- **Iron Law:** *No production code without a failing test first.*
- Write failing tests in `tests/` before fixing bugs or introducing new calculation logic.
- Run `npm test` or `npm run test:watch` to observe the test transition from Red to Green.

### Verification Before Completion
Before opening a Pull Request or committing changes:
```bash
npm test        # All Vitest suites must pass with 0 failures
npm run build   # Type-check (tsc) and Vite bundle must exit 0
```

---

## 4. KaTeX & Math Rendering Engine

In [`src/utils/mathRenderer.tsx`](../src/utils/mathRenderer.tsx):
- `renderKaTeX(rawTex, displayMode)`: Sanitizes double backslashes (`\\\\frac` $\to$ `\\frac`), calls `katex.renderToString` with `throwOnError: false`, and renders inside `.mantiq-math-inline` or `.mantiq-math-block`.
- `renderInlineMathAndStyles(text)`: Parses markdown strings containing `$...$` (inline math), `$$...$$` (display math), `**bold**`, and `` `code` ``.

---

## 5. Adding New Flashcards

To add new exam cards to [`src/data/aimaExamFlashcardsData.ts`](../src/data/aimaExamFlashcardsData.ts):
```typescript
{
  id: 44,
  chapterId: 14,
  chapterTitle: "Chapter 14: Probabilistic Reasoning",
  partId: 4,
  partTitle: "Part IV: Uncertain Knowledge and Reasoning",
  category: "probability",
  categoryLabel: "Probability & Bayes",
  q: "What is the computational complexity of exact inference in general Bayesian networks?",
  a: "Exact inference in arbitrary Bayesian networks is NP-hard (more precisely, #P-hard for counting problems). For polytrees (networks with no undirected cycles), inference runs in linear time O(n) in the number of nodes.",
  formula: "\\text{General DAG: } \\mathcal{O}(2^k \\cdot n) \\quad \\text{Polytree: } \\mathcal{O}(n)",
  examTakeaway: "On exams, identify network topology first: if it's a singly-connected polytree, variable elimination is O(n); if it contains undirected cycles, exact inference is exponential in tree width.",
  isExamTrap: true
}
```
After editing, run `npm test` and `npm run build` to verify types.
