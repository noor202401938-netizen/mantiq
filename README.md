# Mantiq (منطق) — Interactive AI Study & University Exam Companion

<p align="center">
  <img src="public/mantiq-logo.png" alt="Mantiq Logo" width="120" style="border-radius: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.3);" />
</p>

<p align="center">
  <em>"Let's have some Mantiq about AI."</em><br />
  <strong>A rigorous, active-recall interactive study platform for Stuart Russell & Peter Norvig's <em>Artificial Intelligence: A Modern Approach (AIMA 4th Edition)</em>.</strong>
</p>

<p align="center">
  <a href="https://noor202401938-netizen.github.io/mantiq/"><img src="https://img.shields.io/badge/Live_App-Launch_Mantiq-C9F26B?style=for-the-badge&logoColor=13211C&labelColor=13211C" alt="Launch Mantiq" /></a>
  <a href="https://github.com/noor202401938-netizen/mantiq/actions"><img src="https://img.shields.io/badge/CI%2FCD-Passing-10b981?style=for-the-badge&logo=githubactions&logoColor=white&labelColor=13211C" alt="CI/CD Status" /></a>
  <a href="tests/"><img src="https://img.shields.io/badge/Tests-13_Passed-22c55e?style=for-the-badge&logo=vitest&logoColor=white&labelColor=13211C" alt="Vitest Tests" /></a>
  <img src="https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react&logoColor=white&labelColor=13211C" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178c6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=13211C" alt="TypeScript" />
  <img src="https://img.shields.io/badge/KaTeX-0.19-3298dc?style=for-the-badge&logo=latex&logoColor=white&labelColor=13211C" alt="KaTeX" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge&labelColor=13211C" alt="License" />
</p>

---

## 🌟 Overview

**Mantiq** (Arabic: **منطق**, meaning *"Logic"* or *"Rational Reasoning"*) transforms textbook learning into a tactile, active-recall experience. Engineered specifically for undergraduate and graduate computer science students preparing for rigorous university examinations in Artificial Intelligence.

Instead of passive PDF reading, Mantiq bridges theoretical mathematical rigor with active recall, live algorithm walkthroughs, and exam trap mitigation.

### 🚀 Key Capabilities

- **📚 27 Chapters Across All 7 Parts:** Complete alignment with Russell & Norvig's *AIMA 4th Edition* (from Rational Agents and $A^*$ Search to POMDPs, Transformers, and AI Safety).
- **🃏 43+ Active Recall Flashcards:** Chapter-grouped deck navigation with quick filters for Part I–VII, topic pills, and a dedicated **⚠️ Traps Only (11 Cards)** filter for common exam pitfalls.
- **📐 Crystal-Clear KaTeX Math:** Mathematical equations and theorem proofs rendered in high-contrast Citron Lime (`#C9F26B`) on Pitch Onyx (`#13211C`).
- **🎯 3-Tier Exam Quizzes:** Tier 1 (Foundation), Tier 2 (Midterm Calculation), and Tier 3 (Graduate Invariants) with detailed derivation rationales.
- **💾 100% Offline-First with Checksum Verification:** Fully functional without internet connectivity. Export and import portable backup snapshots protected by cryptographic checksum validation.
- **⚡ Superpowers & TDD Engineering:** Developed following strict Test-Driven Development (Red-Green-Refactor) and automated verification gates.

---

## 📖 Curriculum Map (Parts I – VII)

| Part | Chapters | Focus Areas | Key Theorems & Algorithms |
| :--- | :--- | :--- | :--- |
| **Part I: Artificial Intelligence** | Ch. 1–2 | Foundations & Rational Agents | PEAS Framework, Rationality Criteria, Environment Dimensions |
| **Part II: Problem-Solving** | Ch. 3–6 | Search & Games | $A^*$, Admissibility vs. Consistency, Minimax, $\alpha$-$\beta$ Pruning, AC-3 |
| **Part III: Knowledge & Reasoning** | Ch. 7–11 | Logic & Planning | Propositional Resolution, Horn Clauses, FOL Unification, PDDL |
| **Part IV: Uncertain Knowledge** | Ch. 12–17 | Probability, MDPs & RL | Bayes' Rule, D-Separation, HMM Forward-Backward, Bellman Optimality |
| **Part V: Machine Learning** | Ch. 18–21 | Learning & Neural Nets | PAC Bounds, Backpropagation, CNN Convolutions, Q-Learning vs. SARSA |
| **Part VI: Communicating & Acting** | Ch. 22–25 | NLP, Vision & Robotics | Multi-Head Self-Attention, Epipolar Geometry, SLAM Filtering |
| **Part VII: Philosophy & Ethics** | Ch. 26–27 | Safety & Philosophy | Chinese Room, Strong vs. Weak AI, Value Alignment, Existential Risk |

---

## 🎨 Design System

Mantiq is built with custom tokens tailored for distraction-free, long-duration reading and dark-room study sessions:

| Token Name | Hex Code | Swatch | Application |
| :--- | :--- | :--- | :--- |
| **Pitch Onyx** | `#13211C` | `■` | Primary dark surface, code blocks, modal backgrounds |
| **Citron Lime** | `#C9F26B` | `■` | Active accents, formula highlights, primary CTA buttons |
| **Ivory** | `#F3F5EF` | `■` | Text typography, reading backgrounds in Zen mode |
| **Card Surface** | `#1A2F27` | `■` | Elevated cards, quiz options, flashcard reverse face |

---

## 🛠️ Architecture & Tech Stack

```text
src/
├── components/          # UI Views & Interactive Modals
│   ├── AimaDesktopNav.tsx       # Desktop & Mobile responsive navigation
│   ├── AimaFlashcardModal.tsx   # 43+ Chapter-grouped flashcard deck
│   ├── AimaLessonViewer.tsx     # In-depth 27-chapter reading & rigor view
│   ├── AimaQuizModal.tsx        # 3-Tier examination testing module
│   ├── HomeFocusView.tsx        # Daily focus, streak, and quick drills
│   ├── LearnChaptersView.tsx    # Complete syllabus directory
│   ├── SyncModal.tsx            # Cryptographic backup export/import
│   └── YouProfileView.tsx       # Scholar stats, XP, and badges
├── context/             # Global State Management
│   ├── AuthContext.tsx          # Scholar profile & local session
│   ├── ProgressContext.tsx      # XP, streak tracking, chapter unlock gates
│   ├── NotesContext.tsx         # Margin annotations & pinned chapter notes
│   └── ThemeContext.tsx         # Pitch Onyx Dark / Ivory Light switching
├── data/                # Authoritative Curriculum Data
│   ├── aimaBookData.ts          # Parts, chapters, section definitions
│   ├── aimaExamFlashcardsData.ts# 43+ rigorous flashcards with KaTeX
│   ├── aimaLessonsData.ts       # Detailed lecture content & proofs
│   └── quizzesData.ts           # Tiered chapter exam questions
└── utils/               # Helpers & Engines
    ├── mathRenderer.tsx         # KaTeX rendering & inline markdown parser
    ├── soundEffects.ts          # Tactile audio feedback (click, success, error)
    ├── supabaseClient.ts        # Optional cloud synchronization
    └── syncManager.ts           # Backup generation with checksum validation
```

---

## 💻 Developer Quickstart

### Prerequisites
- **Node.js** `v20.x` or higher
- **npm** `v10.x` or higher

### 1. Clone the Repository
```bash
git clone https://github.com/noor202401938-netizen/mantiq.git
cd mantiq
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Automated Tests
```bash
npm test            # Runs all Vitest test suites
npm run test:watch  # Interactive TDD watch mode
```

### 5. Production Build
```bash
npm run build       # Compiles TypeScript types and produces ./dist bundle
npm run preview     # Preview production build locally
```

---

## 🛡️ Engineering Disciplines (`Superpowers`)

This codebase enforces disciplined agent workflows via the [**obra/superpowers**](https://github.com/obra/superpowers) engineering framework:

1. **Test-Driven Development (TDD):** The Iron Law — *No production code without a failing test first*. Every business logic fix (e.g., checksum verification in `SyncManager`) begins with a failing test in `tests/`.
2. **Verification Before Completion:** No feature or bugfix is marked complete without fresh, checkable command evidence (`npm test` and `npm run build`).
3. **Automated CI Test Gate:** Every push to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), running Vitest prior to publishing to GitHub Pages.

---

## 📚 Documentation Index

- **[Learner / User Guide](docs/USER_GUIDE.md):** Complete walkthrough of active recall flashcards, study tips, and offline backup.
- **[Developer & Architecture Guide](docs/DEVELOPER_GUIDE.md):** Coding conventions, state management patterns, and math rendering details.
- **[Contributing Guidelines](CONTRIBUTING.md):** How to submit issues, add flashcards, or contribute new chapter lessons.
- **[Code of Conduct](CODE_OF_CONDUCT.md):** Community standards and expectations.
- **[LLM Summary for AI Assistants](public/llms.txt):** Machine-readable curriculum summary for AI search engines.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<p align="center">
  Crafted with care for university scholars mastering Artificial Intelligence.
</p>
