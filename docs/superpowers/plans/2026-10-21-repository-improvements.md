# Repository Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the three core improvements identified in the repository review:
1. Add Vitest automated testing harness.
2. Harden `SyncManager` with robust import checksum verification via TDD.
3. Add unit test suites for `SyncManager` and `mathRenderer`.
4. Validate full test suite and production build.

---

### Task 1: Install Vitest & Configure Test Environment

- [x] **Step 1.1:** Add `vitest` and `jsdom` to devDependencies.
- [x] **Step 1.2:** Add `"test": "vitest run"` script to `package.json`.
- [x] **Step 1.3:** Create `vitest.config.ts` configured for React/TypeScript and jsdom.
- [x] **Step 1.4:** Verify test runner executes.

---

### Task 2: Implement TDD Checksum Verification for SyncManager

- [x] **Step 2.1:** Write failing tests in `tests/syncManager.test.ts` for:
  - Valid payload import with matching checksum.
  - Corrupted/tampered payload import rejecting invalid checksum.
  - Missing checksum or corrupted JSON structure rejection.
- [x] **Step 2.2:** Run `npm test` and watch the checksum validation tests fail (RED).
- [x] **Step 2.3:** Implement checksum validation in `src/utils/syncManager.ts` `parseImport`.
- [x] **Step 2.4:** Run `npm test` and confirm all tests pass (GREEN).

---

### Task 3: Unit Tests for Math Renderer (`mathRenderer.test.ts`)

- [x] **Step 3.1:** Write unit tests in `tests/mathRenderer.test.ts` for:
  - KaTeX rendering with sanitized double backslashes.
  - Inline math (`$...$`) and display math (`$$...$$`) parsing.
  - Fallback handling for malformed LaTeX syntax.
- [x] **Step 3.2:** Run `npm test` to confirm all math rendering tests pass.

---

### Task 4: Full Verification & Commit

- [x] **Step 4.1:** Run `npm test` and verify 0 failures (13/13 tests pass).
- [x] **Step 4.2:** Run `npm run build` (`tsc && vite build`) and verify 0 errors.
- [x] **Step 4.3:** Commit changes and push to `origin main`.
