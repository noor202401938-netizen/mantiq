# Mantiq User & Learner Guide

Welcome to **Mantiq**! This guide is written for university students, self-taught scholars, and researchers using Mantiq to study for midterm, final, or qualifying exams on *Artificial Intelligence: A Modern Approach (AIMA)*.

---

## 1. Getting Started

When you launch Mantiq at [https://noor202401938-netizen.github.io/mantiq/](https://noor202401938-netizen.github.io/mantiq/):
1. **Choose Your Study Mode:**
   - **Guest / Instant Scholar:** Immediate local access. All data stays in your browser's `localStorage`. No cloud account required.
   - **University Scholar Account:** Sign in to sync your streak, XP, and notes across devices.
2. **Theme Switcher:**
   - Toggle between **Pitch Onyx Dark** (optimized for low-light night study) and **Ivory Light** (daytime reading) via the sun/moon icon in the navigation bar.

---

## 2. Active Recall Flashcards

Mantiq provides **43+ high-yield flashcards** across all 27 chapters:
- **Chapter Grouping:** Click the chapter dropdown in the flashcard header to drill down into a single chapter (e.g., *Chapter 14: Bayesian Networks*) or review entire book parts.
- **Topic Quick Pills:** Jump between core AI paradigms: *Search*, *Games*, *Logic*, *Planning*, *Probability*, *MDP & RL*, *Learning*, *NLP & Vision*, and *Ethics*.
- **⚠️ Traps Only (11 Cards):** Filters directly for the trickiest theoretical questions asked on university exams (e.g. why $A^*$ tree search requires admissibility while graph search requires consistency, or why $\alpha$-$\beta$ pruning order changes tree evaluations from $O(b^{d/2})$ to $O(b^d)$).
- **Contextual Drilling:** When reading any chapter lesson, click the **"🃏 Drill Flashcards"** button in the header or footer to automatically open the deck pre-filtered to that chapter.

---

## 3. Chapter Lessons & Mathematical Rigor

Every chapter lesson features three distinct modes:
1. **Reading Mode:** Clear, structured summaries of textbook sections with companion textbook cross-references (Goodfellow's *Deep Learning*, Sutton & Barto's *Reinforcement Learning*, Jurafsky & Martin's *Speech and Language Processing*).
2. **Practice Mode:** Worked problem breakdowns with step-by-step arithmetic (e.g. manual trace of AC-3 arc consistency, Minimax values, or Bellman value iteration).
3. **Graduate Rigor Mode:** Full theorem formulations, invariant rules, and mathematical proofs rendered via KaTeX.

---

## 4. Chapter Quizzes & Level Progression

- **Functional Chapter Unlocking:** Chapters are unlocked sequentially as you read and complete preceding chapters.
- **Three Question Tiers:**
  - **Tier 1 (Foundation):** Core terminology, PEAS definitions, agent environments.
  - **Tier 2 (Midterm Calculation):** Search tree node counting, probability calculations, heuristic values.
  - **Tier 3 (Graduate Invariants):** Convergence proofs, admissibility bounds, completeness theorems.
- **Instant Diagnostic Feedback:** Explanations detail *why* the correct answer holds and *what trap* made alternative options misleading.

---

## 5. Offline Backups & Data Protection

Mantiq is completely offline-first. To prevent loss of progress during browser data clearing:
1. Open the **Sync / Backup** modal (`Cloud` icon in navigation).
2. Click **Download Backup Snapshot** (`aima-study-backup.json`).
3. Each backup includes a **cryptographic checksum** that verifies file integrity when imported. If a backup file is modified or corrupted, Mantiq alerts you and rejects the import to protect your study streak.
