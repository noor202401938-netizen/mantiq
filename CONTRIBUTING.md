# Contributing to Mantiq

Thank you for your interest in improving **Mantiq**! Whether you are an educator, student, researcher, or developer, we welcome your contributions.

---

## Code of Conduct

All contributors and participants are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat all scholars with respect, empathy, and professional integrity.

---

## How Can You Contribute?

1. **Adding University Exam Flashcards:**
   - Enrich `src/data/aimaExamFlashcardsData.ts` with real midterms/finals questions from accredited computer science universities.
   - Include KaTeX mathematical formulations and explicit exam trap warnings.
2. **Improving Mathematical Proofs & Lesson Content:**
   - Add worked examples, proofs, or algorithm traces in `src/data/aimaLessonsData.ts`.
3. **Enhancing Testing & Quality:**
   - Add new test coverage in `tests/` using Vitest.
4. **Fixing Bugs or UI Flaws:**
   - Check open issues or propose fixes adhering to the designated design tokens.

---

## Development & Pull Request Workflow

We follow the **Superpowers** engineering framework:

1. **Fork & Branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Follow Test-Driven Development (TDD):**
   - If fixing a bug or adding algorithmic logic, write the failing test first in `tests/`.
   - Run `npm test` to verify the test fails.
   - Implement the minimal code change to pass the test.
3. **Verify Locally:**
   ```bash
   npm test        # All tests must pass
   npm run build   # TypeScript and Vite bundle must compile cleanly
   ```
4. **Submit Your Pull Request:**
   - Provide a clear summary of your changes.
   - Reference any relevant chapters or exam topics.
   - Ensure the CI deployment test gate passes.
