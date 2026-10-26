import type { ChapterDeepDive } from './types';

export const DEEP_DIVE_CH05: Record<number, ChapterDeepDive> = {
  5: {
    1: {
      qa: [
        {
          question: `Why can't I treat the opponent as just another part of the environment, the way Chapter 3 did?`,
          answer: `In Chapter 3 the environment was indifferent: a road map does not try to make your route fail. An opponent is different, because its move is chosen to work against you. If you model it as random, you may pick a move that looks good on average and still lose to the one reply the opponent actually finds.

**Micro-example.** Move A leads to replies worth +10 or -2 for you, so the average is +4. Move B always gives +1. An average-based planner picks A. A rational opponent who finds the -2 reply makes A a losing choice, while B (worst case +1) is the safe move.

That is why minimax uses the **worst case over opponent replies** rather than the average. The worst case is a guarantee: whatever the opponent does, you get at least that value.`,
        },
        {
          question: `What does "zero-sum" actually buy us, and what breaks without it?`,
          answer: `Zero-sum means $U_{\\text{MAX}} + U_{\\text{MIN}} = \\text{constant}$. What one player gains, the other loses. That lets one number describe the whole game: MAX pushes it up, MIN pushes it down. This single utility is why the minimax recursion can simply alternate between max and min without needing a second utility function.

Without zero-sum, each player has its own utility, and outcomes can be good (or bad) for both. Two players can both win through cooperation, or both lose through conflict. "The opponent minimizes my utility" no longer means "the opponent is hurting me as much as possible," so the plain max/min backup does not apply directly. Game theory replaces it with equilibrium concepts such as Nash equilibrium.

**Practical check:** write the payoffs in a table. If the cells in each row do not sum to the same constant, minimax is the wrong tool. Chess, checkers, and Go pass this test; a negotiation over a shared surplus does not.`,
        },
        {
          question: `Why does nobody just search the whole chess tree?`,
          answer: `Do the arithmetic. Using the figures in the lesson, chess has about $b \\approx 35$ legal moves per position and games last about $m \\approx 80$ plies. The tree then has roughly $35^{80} \\approx 10^{123.5}$ leaves.

Compare that with two numbers:
- Atoms in the observable universe: about $10^{80}$
- A machine searching a billion positions per second for a full year: about $3 \\times 10^{16}$

Even a very fast machine covers a negligible fraction of $10^{123.5}$. Tic-tac-toe is tiny by comparison (its full game tree has roughly 550,000 nodes), which is why a complete search solves it instantly.

So chess engines need two tricks: **pruning** (Step 3) to skip branches that cannot affect the decision, and **evaluation at a depth cutoff** (Step 4) instead of playing every game to its end.`,
        },
        {
          question: `Does "perfect information" rule out poker?`,
          answer: `Yes. Perfect information means every player can see the complete game state. Chess, checkers, and Go have it. Poker does not: you cannot see your opponent's cards, and the shuffled deck adds chance. Either property breaks the deterministic, perfect-information framework used in this step.

So the minimax recursion here does not apply to poker as written. AIMA handles chance with the expectiminimax idea in its stochastic-games section (Section 5.5), and hidden information needs further methods beyond this step.

**Quick test:** ask whether the opponent's hidden information could change your best move. If yes, the game is imperfect-information, and the tree you draw has to account for what you do not know.`,
        },
      ],
      workedExample: {
        title: 'Nim with 4 stones: writing a game in the AIMA framework',
        scenario: `Two players alternate removing 1 or 2 stones from a pile that starts with 4 stones. Whoever takes the last stone wins. MAX moves first. A state is written as (stones left, player to move). UTILITY is +1 if MAX wins and -1 if MIN wins.`,
        walkthrough: [
          `**Initial state:** (4, MAX). **ACTIONS** at a state with $n$ stones are "remove 1" or "remove 2" (only if $n$ is large enough). **RESULT** subtracts the stones and switches the player to move.`,
          `**Terminal test:** $n = 0$. The player to move at 0 stones has lost, because the opponent took the last stone. So (0, MIN) has UTILITY +1 for MAX, and (0, MAX) has UTILITY -1.`,
          `**Leaves and near-leaves:** (1, MIN) must remove 1, reaching (0, MAX) = -1. (1, MAX) removes 1 to reach (0, MIN) = +1. (2, MAX) can remove 2 to reach (0, MIN) = +1, or remove 1 to reach (1, MIN) = -1.`,
          `**Middle states:** (2, MIN) can reach (0, MAX) = -1 or (1, MAX) = +1, so MIN picks -1. (3, MIN) can reach (2, MAX) = +1 or (1, MAX) = +1, so MIN is stuck at +1.`,
          `**Root:** (4, MAX) can reach (3, MIN) = +1 by removing 1, or (2, MIN) = -1 by removing 2. MAX picks "remove 1", which guarantees a win.`,
        ],
        takeaway: `Writing the game as states, actions, a terminal test, and a utility is all the framework requires, and the same bottom-up evaluation then identifies a guaranteed winning move from 4 stones.`,
      },
    },

    2: {
      qa: [
        {
          question: `Minimax assumes a perfect opponent. What if my opponent is weak?`,
          answer: `Minimax is a defensive, worst-case plan. It does not predict the opponent's choices; it assumes the opponent picks whatever is worst for you. The guarantee is one-sided: if the opponent plays a suboptimal move, you do at least as well as the minimax value, and often better. AIMA states this directly: against a suboptimal opponent, MAX does even better.

**Concrete case:** in the worked example below, MAX moves into branch B, where the minimax value is 5. A perfect MIN replies with B1 (value 5). If MIN blunders into B2 (value 9), MAX ends with 9.

The catch: a strategy built to exploit one specific weak opponent (opponent modeling) can beat that opponent more often, but it may do worse against a strong player. Misconception to avoid: "minimax is always the best way to beat a beginner." It is the safe choice, not necessarily the most profitable one.`,
        },
        {
          question: `Why back up with max and min instead of averages?`,
          answer: `An average assumes the outcome is random, with known probabilities. Minimax assumes an adversary who chooses the outcome. Averaging can therefore recommend a move that a clever opponent punishes.

**Micro-example.** The root (MAX) chooses X or Y. Choice X leads to a MIN node with leaves 10 and -2; the average of those leaves is 4. Choice Y leads to a single leaf worth 1. Averaging picks X (4 > 1). Minimax takes the worst reply: X is worth min(10, -2) = -2, and Y is worth 1, so minimax picks Y.

If the opponent is a real player, the -2 reply is the one they will find. Averaging is the right tool only when chance (dice, card shuffles) decides the outcome. That is the expectiminimax idea covered in Section 5.5 of AIMA.`,
        },
        {
          question: `How do I trace a minimax tree by hand without making errors?`,
          answer: `Use a fixed procedure:

1. Write the type of every level (MAX or MIN) and alternate them going down from the root.
2. Fill in the leaf utilities first.
3. Work upward one level at a time: MAX nodes take the **maximum** of their children, MIN nodes take the **minimum**.
4. At each MAX node, note which child won. Following those choices from the root gives the plan.
5. Sanity check: the root's value must equal one of the leaf values in the tree.

**Common errors:**
- Taking the max at a MIN level, usually because the player switch was forgotten.
- Starting at the wrong player at the root.
- Ignoring terminal states that appear at shallower depths when the tree is unbalanced.

The worked example below follows exactly this procedure, so you can check your own answer against it.`,
        },
        {
          question: `What does minimax cost in time and memory, and why is the space only O(bm)?`,
          answer: `**Time is $O(b^m)$.** Minimax visits every node of the tree. With uniform branching factor $b$ and depth $m$, that is about $b^m$ nodes.

**Space is $O(bm)$.** Minimax can run depth-first. At any moment it holds only the current path from the root (length $m$) and, for each node on that path, its unexpanded siblings (at most $b$ each). It never stores the whole tree. That is why minimax fits in memory. If the search were breadth-first, it would have to keep whole levels, which grows like $b^m$.

**Misconception:** cheap memory does not make minimax practical. Time is the bottleneck. A binary tree of depth 3 has 8 leaves, which is trivial. A chess tree with $b = 35$ and $m = 80$ has about $10^{123.5}$ leaves, as shown in Step 1.`,
        },
      ],
      workedExample: {
        title: 'Minimax on a depth-3 tree',
        scenario: `MAX sits at the root R and chooses branch B or C. MIN then chooses a child, and MAX chooses again one level down. All leaves are utilities for MAX.

- B (MIN) has children B1 (MAX) with leaves 3 and 5, and B2 (MAX) with leaves 6 and 9.
- C (MIN) has children C1 (MAX) with leaves 1 and 2, and C2 (MAX) with leaves 4 and 7.`,
        walkthrough: [
          `**Leaves** are given utilities. Work bottom-up, one level at a time.`,
          `**MAX nodes just above the leaves:** B1 = max(3, 5) = 5; B2 = max(6, 9) = 9; C1 = max(1, 2) = 2; C2 = max(4, 7) = 7.`,
          `**MIN nodes:** B = min(5, 9) = 5; C = min(2, 7) = 2.`,
          `**Root (MAX):** R = max(5, 2) = 5, so MAX chooses the move into B.`,
          `**Check the play:** after MAX enters B, MIN's best reply is B1 (value 5). If MIN blunders into B2 instead, MAX gets 9. Minimax assumed MIN plays well, so MAX's guarantee is 5.`,
          `**Cost:** the full algorithm evaluates all 8 leaves and all 7 internal nodes before the root decision is final.`,
        ],
        takeaway: `Minimax values alternate between max and min one level at a time, and the root chooses the branch whose minimax value is largest.`,
      },
    },

    3: {
      qa: [
        {
          question: `Why does alpha-beta return exactly the same value as minimax?`,
          answer: `Alpha-beta only skips subtrees that cannot change the decision at the root. The bounds come from the path: **α** is the best value MAX can already guarantee on the path, and **β** is the best value MIN can already guarantee. A MIN node whose value falls to α or below is useless to MAX, because MAX already has at least α somewhere else. MAX will never choose into that node, so its remaining children cannot matter.

In the worked example below, once B gives MAX 5, the node C (MIN) finds the value 2, which is at most 5. Its second child C2 is skipped, and the root's answer is unchanged.

**Common misconception:** the value a pruned node returns is not its true minimax value. B2 returned 6, but its real value is 9. The root's value and move are still exactly minimax's, because the pruned values were never going to be selected.`,
        },
        {
          question: `What do α and β mean, and how do I remember the two cutoffs?`,
          answer: `Think of α and β as the window of values that still matter. **α is MAX's floor**: MAX can already get α, so it only cares about values above α. **β is MIN's ceiling**: MIN can already hold the score to β, so it only cares about values below β.

- **At a MIN node, prune when v ≤ α.** MIN has found a value so low that MAX, which already has α elsewhere, would never pick this node.
- **At a MAX node, prune when v ≥ β.** MAX has found a value so high that MIN, which already has β elsewhere, would never walk into this node.

**Memory aid:** a node is pruned when its value lies outside the window that matters to the player above it. The MIN cut uses α because α is the value MAX already holds; the MAX cut uses β because β is the value MIN already holds. Both cuts are mirror images, so learn one and you have the other.`,
        },
        {
          question: `Why does move ordering matter so much, and can I always order perfectly?`,
          answer: `Pruning depends on finding good values early. With perfect ordering, alpha-beta examines about $O(b^{m/2})$ nodes instead of $O(b^m)$, so the effective branching factor drops from $b$ to $\\sqrt{b}$. For chess that is about 6 instead of 35. With random ordering the cost is roughly $O(b^{3m/4})$. A simple chess ordering (captures first, then threats, then forward moves) gets within about a factor of two of the best case.

**Concrete demonstration:** in the worked example, search C first (a worse move). Its value of 2 becomes the root's α before B is explored, so B's nodes prune less. The search evaluates 6 leaves (1, 2, 4, 3, 5, 6) instead of 5. Good ordering finds the best move early, and that saves work.

Perfect ordering is impossible, as AIMA notes: if you could order perfectly, the ordering itself would play perfectly. Practical helpers are captures first, killer moves, transposition tables, and iterative deepening, where the best move from a shallow search is tried first at the next depth.`,
        },
        {
          question: `Does alpha-beta ever change my move?`,
          answer: `Not in the sense that matters. Alpha-beta returns the same root value as full minimax, so the chosen move has the same value. Only the choice among moves that tie for the best value can depend on implementation details, such as the order in which moves are examined.

**Exam wording to memorize:** alpha-beta gives the same answer as minimax, just with far less computation. Pruning is purely an optimization of the search. It does not change the strategy, and it does not change the value at the root.

If a question asks about the number of nodes examined, the answer depends on the move order. If it asks about the value or the decision, the answer is always the same as minimax's (with the same tie-breaking rule).`,
        },
      ],
      workedExample: {
        title: 'Alpha-beta on the same tree: which leaves are never examined',
        scenario: `Same tree as the minimax example: B = (B1: 3, 5; B2: 6, 9) and C = (C1: 1, 2; C2: 4, 7), under a MAX root. Leaves are examined left to right. The root starts with $\\alpha = -\\infty$ and $\\beta = +\\infty$.`,
        walkthrough: [
          `**Visit B (MIN)** with window $\\alpha = -\\infty$, $\\beta = +\\infty$. Descend to B1 (MAX) with the same window. Leaf 3 gives v = 3, so $\\alpha$ becomes 3. Leaf 5 gives v = 5, so $\\alpha$ becomes 5. B1 returns 5 exactly.`,
          `**Back in B (MIN):** v = min(+∞, 5) = 5, so $\\beta$ becomes 5. Now B2 (MAX) is called with window $(-\\infty, 5)$.`,
          `**B2 (MAX), window $(-\\infty, 5)$:** leaf 6 gives v = 6, and since 6 ≥ β = 5, B2 cuts off. **Leaf 9 is pruned.** Reason: MIN at B already holds 5 from B1, and B2 can only be 6 or more, so MIN would never choose B2. B2 returns 6, a bound (its true value is 9). Then B = min(5, 6) = 5.`,
          `**Root (MAX):** v = max(-∞, 5) = 5, so $\\alpha$ becomes 5. Visit C (MIN) with window $(5, +\\infty)$.`,
          `**C1 (MAX), window $(5, +\\infty)$:** leaf 1 gives v = 1 and $\\alpha$ stays 5; leaf 2 gives v = 2 and $\\alpha$ stays 5. C1 returns 2.`,
          `**Back in C (MIN):** v = min(+∞, 2) = 2. Since 2 ≤ α = 5, MIN cuts off. **C2 is pruned**, so leaves 4 and 7 are never examined. Reason: the root already has 5 guaranteed through B, and C can only be 2 or less, so MAX would never choose C.`,
          `**Result:** root = max(5, 2) = 5, with the move into B, the same as minimax. Leaves examined: 3, 5, 6, 1, 2 (5 of 8). Pruned leaves: 9, 4, and 7.`,
        ],
        takeaway: `Alpha-beta returns the same root value and move as full minimax (5, via B) while skipping 3 of the 8 leaves, and a pruned node may return a bound rather than its true value without changing the root.`,
      },
    },

    4: {
      qa: [
        {
          question: `What makes a good evaluation function, and why can't it just be the utility?`,
          answer: `At a cutoff, EVAL(s) stands in for the minimax value of the subtree below s. Its job is to rank positions correctly. It must (1) agree with UTILITY on terminal states, (2) be fast, because it runs on a huge number of nodes, and (3) track real winning chances in the middle of a game.

You cannot simply use UTILITY, because it is defined only at the end: win, loss, or draw. At a cutoff the game is still in progress, and no such value exists yet.

Shannon's classic form is $\\text{EVAL}(s) = \\sum_i w_i f_i(s)$, a weighted sum of features such as material, king safety, and mobility. The weights are not part of the rules of chess; they come from human experience or from learning. AIMA points out a weakness: a plain sum assumes each feature contributes independently. A bishop is worth more in the endgame, and a pair of bishops is worth more than twice one bishop. Real programs therefore use nonlinear combinations. Applying learning methods to chess has confirmed that a bishop is worth about three pawns.`,
        },
        {
          question: `What exactly is the horizon effect, and why doesn't a deeper search simply fix it?`,
          answer: `The horizon effect happens when serious damage lies just beyond the depth cutoff. The program evaluates the leaf, sees nothing alarming, and believes the line is safe. In the toy example below, a depth-2 program grabs a pawn and walks into a queen loss it cannot see.

A deeper search helps only partly. It moves the horizon rather than removing it. A determined opponent can again delay the damage past the new limit, and the cost grows exponentially with depth. AIMA's chess example shows Black checking with pawns to force captures that push the loss of a bishop beyond its 8-ply horizon. Each check looks like a delaying tactic, so the program keeps rating those moves as good.

That is why the standard fixes are targeted extensions (quiescence and singular extensions), which add depth only where the position is unstable, rather than uniformly increasing depth everywhere.`,
        },
        {
          question: `How do quiescence search and singular extensions differ, and when should I use each?`,
          answer: `**Quiescence search** keeps expanding past the cutoff only in non-quiescent (tactically volatile) positions, such as positions where favorable captures are available. AIMA's example: a position where White's next move captures Black's queen. A static evaluation would call it a probable Black win, but one more ply reverses the result. Quiescence expands those captures until the position is quiet, and only then calls EVAL.

**Singular extensions** handle a different case. If one move is clearly better than all the others, the search extends that move's depth when it reaches the depth limit. There are usually few such moves, so the tree grows only slightly.

**Quick rule:** quiescence fits "the position is still changing" (capture chains). Singular extensions fit "one move is clearly critical and needs more depth." An exam answer should name the trigger for each: volatile positions for quiescence, and a single clearly-best move for singular extensions.`,
        },
        {
          question: `Is AlphaZero still alpha-beta search with a neural network?`,
          answer: `No. The lesson's shorthand needs care. It says AlphaZero "replaced hand-crafted EVAL" with a neural network. That part is true: a learned value estimate replaces the handcrafted evaluation. But AlphaZero also replaced alpha-beta with **Monte Carlo Tree Search (MCTS)**, guided by a network that outputs move preferences and position values. Silver et al. (2017 and 2018) describe this approach, which learns through self-play.

Géron's *Hands-On Machine Learning* describes AlphaGo as a policy-gradient-style learner combined with Monte Carlo Tree Search, and says the MCTS part is beyond the scope of that book. That fits this picture: learned evaluation and learned move preferences guide a sampling-based search, instead of a fixed-depth alpha-beta search.

The lesson's main point still holds: an evaluation function can be learned from experience instead of written by hand. For an exam, name the search and the learned parts separately.`,
        },
      ],
      workedExample: {
        title: 'The horizon effect in a toy material-count game',
        scenario: `**All numbers are hypothetical, for teaching only.** MAX is us and moves first. A **ply** is one move by one player. The search depth is 2 plies (MAX's move, then MIN's reply), and then EVAL is applied. EVAL is the material difference in pawn units, with a queen worth 9.

At the root, MAX can "Grab pawn" (+1 material) or "Defend pawn" (0). After "Grab pawn", MIN has two replies: "Quiet A", which sets up a fork that wins MAX's queen at ply 4, and "Quiet B", which is harmless. After "Defend pawn", both MIN replies leave material equal.`,
        walkthrough: [
          `**Depth-2 search.** Grab pawn: EVAL after Quiet A = +1 and after Quiet B = +1, so MIN's choice gives +1. Defend pawn: both replies give EVAL 0. The program prefers Grab pawn (+1 > 0).`,
          `**The horizon.** The fork is decided at ply 3 and 4, beyond the depth-2 cutoff. At the leaf after Quiet A, the program sees only +1 material, so the queen threat is invisible to it.`,
          `**Deeper search (depth 4), same numbers.** After Grab pawn → Quiet A, MAX loses the queen (-9) for the pawn (+1), a net of -8. After Grab pawn → Quiet B, the value is +1. MIN picks min(-8, +1) = -8. Defend pawn still gives 0.`,
          `**Verdict.** The depth-4 search chooses Defend pawn (0 > -8). The depth-2 choice was a mistake the program could not see.`,
          `**Fix and its limit.** Quiescence extends volatile positions past the cutoff, which is how AIMA's queen-capture example is caught. This toy's threat is a quiet move, though, and a capture-only quiescence search would miss it. That is why engines combine several techniques rather than relying on one.`,
        ],
        takeaway: `The horizon effect means damage just past the cutoff is invisible, so a depth-limited search can rate a losing line as its best move.`,
      },
    },
  },
};
