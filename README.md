# Mantiq (منطق) — Interactive AI Study & University Exam Companion

<p align="center">
  <img src="public/mantiq-logo.png" alt="Mantiq Logo" width="120" style="border-radius: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.3);" />
</p>

<p align="center">
  <em>"Let's have some Mantiq about AI."</em><br />
  <strong>A university-grade interactive study companion and active-recall exam prep platform for Stuart Russell & Peter Norvig's <em>Artificial Intelligence: A Modern Approach (AIMA 4th Edition)</em>. Built by a student for university AI coursework.</strong>
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

## 🎯 Overview & Motivation

Russell & Norvig's *Artificial Intelligence: A Modern Approach (AIMA)* is the authoritative foundational text in modern university computer science curricula worldwide. However, its comprehensive 1,100+ page density often leaves students without rapid feedback loops, active recall drills, or systematic trap identification prior to midterms and qualifying exams.

**Mantiq** (Arabic: **منطق**, meaning *"Logic"* or *"Rational Reasoning"*) was developed to bridge this gap. Designed from a student's perspective for university AI courses, it connects theoretical proofs directly with interactive algorithm traces, tiered exam questions, and mathematically rigorous KaTeX formulations.

---

## 🚀 Core Features

- **🧠 Active Recall Over Passive Reading:** Replaces passive textbook skimming with structured retrieval practice and chapter-by-chapter drills.
- **🃏 43+ Chapter-Grouped Flashcards:** Comprehensive coverage across all 27 chapters, filterable by Part I–VII, topic pills, and a dedicated **⚠️ Traps Only (11 Cards)** filter for common exam pitfalls.
- **📐 Mathematical Precision via KaTeX:** Invariant rules and formal proofs rendered in high-contrast Citron Lime (`#C9F26B`) on Pitch Onyx (`#13211C`).
- **🏆 3-Tier Examination Quizzes:**
  - **Tier 1 (Foundation):** Core definitions, PEAS frameworks, environment properties.
  - **Tier 2 (Midterm Calculation):** Node expansion counts, Bayes network factorizations, heuristic consistency proofs.
  - **Tier 3 (Graduate Rigor):** Completeness proofs, Bellman invariants, and convergence bounds.
- **🔌 100% Offline-First Architecture:** Complete client-side functionality with zero mandatory network calls, full `localStorage` persistence, and portable cryptographic backup export.

---

## 📖 Complete 27-Chapter Curriculum

| Part | Chapters | Focus Areas | Key Exam Concepts |
| :--- | :--- | :--- | :--- |
| **Part I: Artificial Intelligence** | Ch. 1–2 | Rationality & Agents | PEAS Framework, Rationality vs Omniscience, Environment Types |
| **Part II: Problem-Solving** | Ch. 3–6 | Search, Heuristics & Games | $A^*$, Admissibility vs Consistency, Minimax, $\alpha$-$\beta$ Pruning, AC-3 |
| **Part III: Knowledge & Reasoning** | Ch. 7–11 | Logic, Resolution & Planning | CNF Conversion, Resolution, First-Order Logic Unification, PDDL |
| **Part IV: Uncertain Knowledge** | Ch. 12–17 | Probability, Bayes & MDPs | Bayes' Rule, D-Separation, HMM Forward-Backward, Bellman Optimality |
| **Part V: Machine Learning** | Ch. 18–21 | Supervised, Deep & RL | PAC Bounds, Backpropagation, CNN Convolutions, Q-Learning vs SARSA |
| **Part VI: Communicating & Acting** | Ch. 22–25 | NLP, Vision & Robotics | Multi-Head Self-Attention, Epipolar Geometry, SLAM Filtering |
| **Part VII: Philosophy & Ethics** | Ch. 26–27 | Limits & Future of AI | Chinese Room, Strong vs Weak AI, Value Alignment, Existential Safety |

---

## 🎓 Recommended Study Workflow

```mermaid
graph TD
    A["1. Read Chapter Summary<br/>(Reading Mode)"] --> B["2. Trace Worked Problems<br/>(Practice Mode)"]
    B --> C["3. Review Proofs & Invariants<br/>(Graduate Rigor Mode)"]
    C --> D["4. Drill Chapter Flashcards<br/>(Focus on ⚠️ Traps)"]
    D --> E["5. Take 3-Tier Chapter Quiz<br/>(Tier 1 ➔ 2 ➔ 3)"]
    E --> F["6. Export Safe Offline Backup<br/>(Cryptographically Verified Snapshot)"]
```

---

## 🎨 Design Tokens

Mantiq is styled specifically for distraction-free study sessions without eye strain:

| Color | Hex | Swatch | Purpose |
| :--- | :--- | :--- | :--- |
| **Pitch Onyx** | `#13211C` | `■` | Primary dark surface, code blocks, deep contrast |
| **Citron Lime** | `#C9F26B` | `■` | Active accents, math formula highlights, success indicators |
| **Ivory** | `#F3F5EF` | `■` | Clean reading typography and Zen mode background |
| **Deep Card** | `#1A2F27` | `■` | Elevated cards, quiz options, and flashcard reverse |

---

## 💻 Developer & Contributor Quickstart

### Setup
```bash
# Clone the repository
git clone https://github.com/noor202401938-netizen/mantiq.git
cd mantiq

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Running Tests (Superpowers TDD)
```bash
npm test            # Run all Vitest automated test suites
npm run test:watch  # Interactive TDD watch mode
npm run build       # Verify TypeScript types and production bundle
```

---

## 📚 Documentation Index

- **[Learner Guide](docs/USER_GUIDE.md):** Complete study tips, exam strategies, and backup walkthrough.
- **[Developer & Architecture Guide](docs/DEVELOPER_GUIDE.md):** Technical design, state context layout, and KaTeX rendering engine.
- **[Contributing Guidelines](CONTRIBUTING.md):** How to submit exam flashcards, report typos, or improve explanations.
- **[Code of Conduct](CODE_OF_CONDUCT.md):** Community standards.
- **[LLM Machine-Readable Index](public/llms.txt):** Summary file for AI assistants (Perplexity, ChatGPT, Claude) to cite Mantiq.

---

## 📄 License

Distributed under the **MIT License**.

---

<p align="center">
  <strong>An open-source educational project for university students and educators worldwide.</strong>
</p>
