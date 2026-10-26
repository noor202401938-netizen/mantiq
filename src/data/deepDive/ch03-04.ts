import type { ChapterDeepDive } from './types';

export const DEEP_DIVE_CH03_04: Record<number, ChapterDeepDive> = {
  3: {
    1: {
      qa: [
        {
          question: `Is a state the same thing as a node in the search tree?`,
          answer: `No. A **state** is a description of the world, such as In(Sibiu). A **node** is a bookkeeping record that stores the state, a parent pointer, the action that produced it, and the path cost g(n).

The same state can appear in several nodes when it is reached by different paths. For example, In(Sibiu) can be reached directly from Arad (g = 140) or through Zerind and Oradea (g = 75 + 71 + 151 = 297). Those are two nodes with one state. The problem definition talks only about states; the search algorithm works on nodes.`,
        },
        {
          question: `Does a finite state space guarantee that a solution exists?`,
          answer: `No. Finiteness only means the state space is bounded. If no state that passes the goal test is reachable from the initial state, the search has nothing to find and must return failure. A goal on an unreachable island of the map is one example.

Completeness is the property that matters here: a complete algorithm finds a solution whenever one exists. That property belongs to the algorithm, so it has to be checked separately for each strategy in Step 3.`,
        },
        {
          question: `Does the goal have to be a single state?`,
          answer: `No. The goal test is any predicate that a state can satisfy. In the vacuum world the goal is "both rooms clean," and two different states satisfy it (the agent can end in either room). In a chess problem the goal is "checkmate," which covers a very large set of positions.

What matters for the algorithm is that GOAL-TEST(s) can be evaluated for any state s. The set of goal states can be as large as the problem requires.`,
        },
      ],
      workedExample: {
        title: 'Formulating a two-jug problem: measure exactly 4 litres',
        scenario: `You have an empty 3-litre jug A and an empty 5-litre jug B, and no markings. The goal is to have exactly 4 litres in jug B. A state is written (a, b), where a and b are the litres in A and B. Each action costs 1.`,
        walkthrough: [
          `**The five components:** initial state (0, 0). ACTIONS: fill A, fill B, empty A, empty B, pour A into B, pour B into A. RESULT: fill sets one jug to its capacity, empty sets one jug to 0, and a pour moves water until the source is empty or the target is full. GOAL-TEST: b = 4. PATH-COST: 1 per action.`,
          `**Breadth-first expansion by depth:** depth 1 gives (3, 0) and (0, 5). Depth 2 adds (3, 5), (0, 3), and (3, 2). Depth 3 adds (3, 3) and (0, 2). Depth 4 adds (1, 5) and (2, 0). Depth 5 adds (1, 0) and (2, 5).`,
          `**First goal state:** depth 6 gives (3, 4), reached by pouring B into A from (2, 5), which leaves A full at 3 and B holding 4. No state with b = 4 appears at depths 1 to 5.`,
          `**The plan:** (0, 0), fill B, (0, 5), pour B into A, (3, 2), empty A, (0, 2), pour B into A, (2, 0), fill B, (2, 5), pour B into A, (3, 4). That is 6 actions, and it is optimal because every action costs 1.`,
        ],
        takeaway: `Once the five components are written down, the search algorithm can solve the puzzle without any knowledge of jugs, because the formulation is all it needs.`,
      },
    },

    2: {
      qa: [
        {
          question: `Why does graph search need an explored set when tree search does not?`,
          answer: `Tree search treats every path as a separate branch. If the state space contains a cycle, such as A to B and B back to A, the search can keep moving around the cycle and generate new nodes forever.

Graph search records every state it has expanded in the explored set and never expands that state again. The cost is memory: the explored set grows with the number of distinct states, which can be enormous. That trade-off is why graph search is the usual choice when states repeat.`,
        },
        {
          question: `What is the frontier, and why does changing SELECT-FROM change the algorithm?`,
          answer: `The **frontier** holds nodes that have been generated but not yet expanded. The only line that varies between strategies is the choice of which frontier node to expand next:

- FIFO queue: breadth-first search
- LIFO stack: depth-first search
- Priority queue ordered by g(n): uniform-cost search
- Priority queue ordered by f(n) = g(n) + h(n): A*

The goal test, the expansion step, and the explored set are the same in all four. That is why the generic algorithm is written once and specialized by a single line.`,
        },
        {
          question: `When a child state is already in the frontier and the new path is cheaper, what should happen?`,
          answer: `The pseudocode in this step simply skips the child, which is safe for breadth-first search with unit costs, where the first path found is the shortest. For uniform-cost search and A*, skipping can produce a suboptimal solution. The cheaper path must replace the existing frontier entry (often called decrease-key).

The worked example in Step 3 shows this exact case: state B is first reached at cost 4, then cheaper at cost 3, and the cheaper entry is the one that leads to the optimal answer.`,
        },
      ],
      workedExample: {
        title: 'Graph search on a cycle: the explored set in action',
        scenario: `Four states are connected by undirected edges: S-A, S-B, A-B, and B-G. The start is S and the goal is G. Use breadth-first graph search, with the frontier as a FIFO queue and the explored set as described in the lesson.`,
        walkthrough: [
          `**Start:** frontier [S], explored {}. Pop S, add it to explored, and generate children A and B. Frontier is [A, B].`,
          `**Pop A:** explored is {S, A}. Child S is already explored, so it is skipped. Child B is already in the frontier, so it is not added again. Frontier is [B].`,
          `**Pop B:** explored is {S, A, B}. Children S and A are explored and skipped. Child G is new, so it joins the frontier. Frontier is [G].`,
          `**Pop G:** the goal test succeeds. The path is S, B, G, found after only three expansions.`,
          `**Without the explored set:** popping A would generate a second copy of S, and popping that copy would generate A again. On a cycle, a depth-first version of this loop never terminates.`,
        ],
        takeaway: `The explored set guarantees that each state is expanded at most once, which is what keeps graph search finite on any finite state space.`,
      },
    },

    3: {
      qa: [
        {
          question: `Why is breadth-first search optimal only when all step costs are equal?`,
          answer: `Breadth-first search finds the solution with the fewest actions, and fewest actions is not the same as lowest cost. A two-step path with costs 9 and 4 (total 13) is found before a four-step path with costs 1, 2, 1, and 3 (total 7).

The worked example below has exactly this situation. Breadth-first search returns the 13-cost path, while uniform-cost search returns the 7-cost path. Uniform-cost search orders the frontier by g(n), so it always expands the cheapest path so far.`,
        },
        {
          question: `Why is iterative deepening worth it if it repeats work?`,
          answer: `Iterative deepening runs depth-limited search with limits 0, 1, 2, and so on, so it re-expands the shallow levels each time. The repeated work is small relative to the total, because the deepest level dominates.

With b = 10 and d = 6, breadth-first search generates 1 + 10 + ... + 10^6 = 1,111,111 nodes. Iterative deepening generates the sum of these level totals, which is 1 + 11 + 111 + 1,111 + 11,111 + 111,111 + 1,111,111 = 1,234,567 nodes. The ratio is about 1.11, which matches the b/(b-1) overhead. The same search needs memory proportional to d, not b^d.`,
        },
        {
          question: `Why does depth-first search use so little memory, and what does it cost?`,
          answer: `Depth-first search keeps only the current path plus the unexpanded siblings along it, which is O(bm) memory for maximum depth m. It never has to store the whole frontier.

The cost is completeness and optimality. In an infinite state space, depth-first search can follow one infinite branch and never return. Even in a finite graph, without an explored set it can cycle forever. It also commits to the first deep path it finds, which may be far more expensive than a shallow one.`,
        },
      ],
      workedExample: {
        title: 'Five-node weighted graph: breadth-first versus uniform-cost search',
        scenario: `Five states S, A, B, C, and G are connected by these undirected edges with costs: S-A 1, S-B 4, A-B 2, A-C 5, B-C 1, C-G 3, B-G 9. Find the cheapest path from S to G.`,
        walkthrough: [
          `**The true answer:** S-A-B-C-G costs 1 + 2 + 1 + 3 = 7. Other candidates are S-B-C-G (8), S-A-C-G (9), S-A-B-G (12), and S-B-G (13). The optimal cost is 7.`,
          `**Breadth-first search (FIFO, goal test on dequeue):** queue [S]. Pop S, queue [A, B]. Pop A, which adds C, queue [B, C]. Pop B, which adds G, queue [C, G]. Pop C, which adds nothing new, queue [G]. Pop G, which is the goal. The path is S-B-G with cost 13.`,
          `**Uniform-cost search (priority by g, goal test on dequeue):** start {S:0}. Pop S and push A:1 and B:4. Pop A (1): B improves to 3 and C is pushed at 6. Pop B (3): C improves to 4 and G is pushed at 12. Pop C (4): G improves to 7. Pop G (7), which is the goal.`,
          `**Result:** uniform-cost search returns S-A-B-C-G with cost 7 and expands S, A, B, C, G in that order. Breadth-first search returns cost 13 because it counts edges, not costs.`,
        ],
        takeaway: `Breadth-first search minimizes the number of actions and uniform-cost search minimizes total cost, and with unequal step costs those two goals can give different answers.`,
      },
    },

    4: {
      qa: [
        {
          question: `Why does greedy search fail on the Romania map when A* succeeds?`,
          answer: `Greedy search ranks nodes only by h(n), the straight-line distance to Bucharest. At Sibiu it compares Fagaras (h = 176) with Rimnicu Vilcea (h = 193), chooses Fagaras because its estimate is smaller, and reaches Bucharest by a route of 450 km.

A* ranks by f(n) = g(n) + h(n). At Sibiu, f(Rimnicu Vilcea) = 220 + 193 = 413, while f(Fagaras) = 239 + 176 = 415. A* prefers Rimnicu Vilcea because the cost already paid counts. The correct answer, 418 km, runs through Rimnicu Vilcea and Pitesti.`,
        },
        {
          question: `What is the difference between an admissible and a consistent heuristic?`,
          answer: `A heuristic is **admissible** if it never overestimates the true cost to a goal: h(n) ≤ h*(n) for every n. It is **consistent** if h(n) ≤ c(n, a, n') + h(n') for every step, which is the triangle inequality applied to the heuristic.

Every consistent heuristic is admissible, but not every admissible heuristic is consistent. Admissibility is enough for A* on a tree search to return an optimal solution. For graph search, consistency is what guarantees that the first expansion of a state uses its cheapest path, so the explored set never discards the optimal route.`,
        },
        {
          question: `Why does A* test for the goal when a node is removed from the frontier, not when it is generated?`,
          answer: `A goal generated early may have a high cost compared with other frontier nodes that have not been checked yet. If the goal were accepted at generation, the algorithm could return a suboptimal path.

The Romania example makes this concrete. Bucharest is first generated via Fagaras with f = 450. A cheaper route via Pitesti generates Bucharest with f = 418, which replaces the earlier entry. The 418 entry is removed from the frontier first, and only then is the goal accepted. Checking at removal guarantees that no cheaper goal is still waiting in the frontier.`,
        },
      ],
      workedExample: {
        title: 'A* from Arad to Bucharest: tracing f = g + h with the straight-line heuristic',
        scenario: `The map distances are Arad-Sibiu 140, Arad-Timisoara 118, Arad-Zerind 75, Sibiu-Fagaras 99, Sibiu-Rimnicu Vilcea 80, Rimnicu Vilcea-Pitesti 97, Fagaras-Bucharest 211, and Pitesti-Bucharest 101. The straight-line heuristic h to Bucharest is Arad 366, Sibiu 253, Timisoara 329, Zerind 374, Fagaras 176, Rimnicu Vilcea 193, Pitesti 100, and Bucharest 0.`,
        walkthrough: [
          `**Start:** expand Arad (g = 0, f = 366). Children: Sibiu (g = 140, f = 393), Timisoara (g = 118, f = 447), Zerind (g = 75, f = 449). The lowest frontier entry is Sibiu.`,
          `**Expand Sibiu (f = 393):** children Fagaras (g = 239, f = 415) and Rimnicu Vilcea (g = 220, f = 413). Oradea (f = 671) is also added but never matters. The lowest frontier entry is now Rimnicu Vilcea (413).`,
          `**Expand Rimnicu Vilcea (f = 413):** children Pitesti (g = 317, f = 417) and Craiova (g = 366, f = 526). The lowest frontier entry is Fagaras (415).`,
          `**Expand Fagaras (f = 415):** child Bucharest (g = 450, f = 450) enters the frontier. The lowest entry is now Pitesti (417).`,
          `**Expand Pitesti (f = 417):** child Bucharest is reached with g = 317 + 101 = 418, so f = 418. This cheaper entry replaces the 450 entry.`,
          `**Goal:** the lowest frontier entry is Bucharest (418), ahead of Timisoara (447) and Zerind (449). The goal test passes. The answer is 418 km via Arad, Sibiu, Rimnicu Vilcea, Pitesti, Bucharest.`,
        ],
        takeaway: `A* returns the 418 km route, not the 450 km route, because f = g + h keeps the cheaper partial path alive until it is the lowest entry in the frontier. Note that the lesson's claim that the Fagaras route (f = 450) is optimal is incorrect.`,
      },
    },

    5: {
      qa: [
        {
          question: `How do I know that a heuristic is admissible?`,
          answer: `The usual method is a **relaxed problem**: drop a constraint from the original problem and solve the easier version exactly. The relaxed optimum can only be cheaper than or equal to the real optimum, so it is an admissible heuristic.

For the 8-puzzle, letting a tile jump to any square gives the misplaced-tiles count, and letting it move to any adjacent square (ignoring blockers) gives the Manhattan distance. Straight-line distance is admissible for the same reason: a road can never be shorter than the straight line between two points.`,
        },
        {
          question: `What does dominance buy in practice, and how large is the gain?`,
          answer: `If h2(n) ≥ h1(n) for every n and both are admissible, A* with h2 never expands more nodes than A* with h1, and usually expands far fewer. The better heuristic prunes more of the search.

AIMA reports averages over random 8-puzzle instances (Fig. 3.29, quoted from memory here, so check the table before citing it). At solution depth 12, iterative deepening generates about 3.6 million nodes, A* with misplaced tiles about 227, and A* with Manhattan distance about 73. The lesson's figures of about 13 and 130,000 do not match that table.`,
        },
        {
          question: `Why take the maximum of several heuristics instead of their sum?`,
          answer: `The maximum of admissible heuristics is admissible, because each component is at most h*(n), so their maximum is too. The sum is not guaranteed to be admissible. If two heuristics both count the same move toward the goal, adding them counts that move twice and can overestimate the true cost.

The maximum is also at least as informed as every component, so it dominates them all. If you want more informative estimates, use the maximum; a sum needs a separate argument that no cost is double-counted.`,
        },
      ],
      workedExample: {
        title: 'Computing h1 and h2 for one 8-puzzle state',
        scenario: `Goal board, with blank in the bottom-right corner:
1 2 3
4 5 6
7 8 blank

Current board:
8 2 3
4 blank 6
7 1 5

Tile 8 is at row 1, column 1 (goal: row 3, column 2). Tile 1 is at row 3, column 2 (goal: row 1, column 1). Tile 5 is at row 3, column 3 (goal: row 2, column 2). The other tiles are already in place.`,
        walkthrough: [
          `**Solvability check:** reading the tiles row by row gives 8, 2, 3, 4, 6, 7, 1, 5. Counting inversions gives 14, which is even, so the board can reach the goal on a 3 by 3 board.`,
          `**h1 (misplaced tiles):** tiles 8, 1, and 5 are out of place, so h1 = 3.`,
          `**h2 (Manhattan distance):** tile 8 moves |1 - 3| + |1 - 2| = 3 steps, tile 1 moves |3 - 1| + |2 - 1| = 3 steps, and tile 5 moves |3 - 2| + |3 - 2| = 2 steps. So h2 = 3 + 3 + 2 = 8.`,
          `**Comparison:** h2 = 8 ≥ h1 = 3 at this state, as dominance requires. Both are true lower bounds because the true solution needs at least 8 tile moves, and each move shifts one tile by one square.`,
        ],
        takeaway: `The Manhattan heuristic gives a much tighter estimate of the remaining cost than the misplaced-tiles count, and that tighter estimate is what lets A* prune the search.`,
      },
    },
  },
  4: {
    1: {
      qa: [
        {
          question: `If A* finds the optimal path, why would I ever use local search?`,
          answer: `Because many problems only care about the final state, not the route to it. In 8-queens, the order in which queens were placed is irrelevant; only the final board matters. A* must store every frontier node and its path, which can exhaust memory. Local search keeps a **single current state** and moves to neighbors, so its memory use is O(1). The trade-off is that local search gives **no optimality guarantee**: it can stop at a local optimum. Use it when a good solution found quickly matters more than a proven best one, as with VLSI layout or TSP tours on large instances.`,
        },
        {
          question: `What are the three failure modes of hill climbing, and how do I recognize each?`,
          answer: `**Local maxima** occur when every neighbor is lower but the peak is not the global best, so the search halts below the true optimum. **Ridges** are narrow uphill paths that run diagonally to the allowed moves, so each single step is downhill or nearly flat and the search zigzags without progress. **Plateaux** are regions where neighbors have equal value, giving no gradient; the search either wanders randomly or stalls. A practical symptom of all three is that the search terminates with a value that is poor compared to a known or estimated optimum. Sideways moves and random restarts are the standard remedies.`,
        },
        {
          question: `Does random-restart hill climbing eventually find the global optimum?`,
          answer: `It does, provided each restart has a nonzero chance of reaching the global optimum, because restarts are independent. If one run succeeds with probability $p$, then after $k$ restarts the chance that at least one succeeded is $1 - (1 - p)^k$. For example, with $p = 0.2$ and $k = 5$, the success probability is $1 - 0.8^5 = 1 - 0.32768 \\approx 0.672$. Doubling to $k = 10$ gives $1 - 0.8^{10} \\approx 0.893$. The probability approaches 1 as $k$ grows, but the number of restarts needed can be large when $p$ is small, so restarts help most when local optima are not too common.`,
        },
      ],
      workedExample: {
        title: `Hill Climbing Gets Stuck, Random Restart Escapes`,
        scenario: `A one-dimensional landscape has seven states indexed 0 to 6 with values v = [2, 5, 3, 1, 4, 7, 6] (maximize). The global maximum is 7 at index 5. The neighbors of index i are i - 1 and i + 1 when they exist. Steepest-ascent hill climbing moves to the best neighbor only if that neighbor is strictly higher than the current state.`,
        walkthrough: [
          `**Run 1, start at index 0 (value 2).** The only neighbor is index 1 (value 5). Since 5 > 2, move to index 1.`,
          `**Index 1 (value 5).** Neighbors are index 0 (value 2) and index 2 (value 3). The best is 3, which is not higher than 5, so the search halts at value 5. This is a local maximum, and run 1 made one move.`,
          `**Run 2, random restart at index 3 (value 1).** Neighbors are index 2 (value 3) and index 4 (value 4). The best is 4 at index 4, so move there.`,
          `**Index 4 (value 4).** Neighbors are index 3 (value 1) and index 5 (value 7). The best is 7 > 4, so move to index 5.`,
          `**Index 5 (value 7).** Neighbors are index 4 (value 4) and index 6 (value 6). Both are lower, so the search halts at the global maximum 7.`,
          `**Summary.** Run 1 returned 5, which is 2 below the optimum. Run 2 returned 7 after two moves. Changing only the starting state changed the outcome.`,
        ],
        takeaway: `Hill climbing sees only its neighbors, so its result depends on where it starts; random restarts give an unlucky run a fresh chance to reach the global peak.`,
      },
    },
    2: {
      qa: [
        {
          question: `Why would I ever accept a worse move? Isn't that just random?`,
          answer: `It is random, but the randomness is controlled. When every neighbor is lower, a strictly greedy rule can never cross a valley, so accepting a worse move is the only way to leave a local maximum. The probability $e^{\\Delta E / T}$ makes small losses more likely to be accepted than large ones, so the search stays near good regions. When $T$ is large, nearly every move is accepted and the search behaves like a random walk. When $T$ is small, nearly every bad move is rejected and the search behaves like hill climbing.`,
        },
        {
          question: `How should I choose the temperature?`,
          answer: `The temperature must be on the same scale as the typical loss $|\\Delta E|$ in your problem. For a move with $\\Delta E = -2$:

| Temperature $T$ | $P(\\text{accept})= e^{-2/T}$ |
|---|---|
| 10 | $\\approx 0.819$ |
| 1 | $\\approx 0.135$ |
| 0.1 | $\\approx 2.1 \\times 10^{-9}$ |

If $T$ is much larger than typical losses, almost nothing is rejected. If $T$ is much smaller, nothing is explored. Common practice is to start at a temperature where a sizable fraction of typical bad moves are accepted, then cool geometrically: $T_{t+1} = \\alpha T_t$ with $\\alpha$ near $0.99$.`,
        },
        {
          question: `Does simulated annealing always find the global optimum?`,
          answer: `Not in practice. The guarantee holds only for a sufficiently slow schedule. Theory says that logarithmic cooling, roughly $T_t = c / \\log t$ for a suitable constant $c$, makes the chance of ending at a global optimum approach 1. That schedule is far too slow for real problems, so implementations use faster geometric cooling and accept a very good answer rather than a guaranteed best one. Running several independent annealing runs and keeping the best is a common hedge.`,
        },
      ],
      workedExample: {
        title: `Escaping a Local Maximum with Annealing`,
        scenario: `Maximize a landscape with values v = [2, 5, 3, 1, 4, 7, 6] at indices 0 to 6. The global maximum is 7 at index 5. The search starts at index 1 (value 5), a local maximum where hill climbing would stop. Each step proposes one neighbor (index minus 1 or plus 1). A draw u is then compared with the acceptance probability. The schedule is $T = 2$ for steps 1 and 2, $T = 1$ for steps 3 to 5, and $T = 0.5$ for step 6.`,
        walkthrough: [
          `**t = 1, T = 2, at index 1 (value 5).** Propose index 2 (value 3). $\\Delta E = 3 - 5 = -2$, so $P = e^{-2/2} = e^{-1} \\approx 0.368$. The draw $u = 0.20$ is below 0.368, so **accept** the bad move and move to index 2. Hill climbing would have stayed at index 1.`,
          `**t = 2, T = 2, at index 2 (value 3).** Propose index 3 (value 1). $\\Delta E = -2$, so $P \\approx 0.368$. The draw $u = 0.70$ is above 0.368, so **reject** and stay at index 2.`,
          `**t = 3, T = 1, at index 2 (value 3).** Propose index 3 (value 1). $\\Delta E = -2$, so $P = e^{-2} \\approx 0.135$. The draw $u = 0.05$ is below 0.135, so **accept** and move to index 3. At this temperature the search is willing to drop well below its current value.`,
          `**t = 4, T = 1, at index 3 (value 1).** Propose index 4 (value 4). $\\Delta E = +3$, so the move is always accepted. Move to index 4.`,
          `**t = 5, T = 1, at index 4 (value 4).** Propose index 5 (value 7). $\\Delta E = +3$, so accept. Move to index 5, the global maximum.`,
          `**t = 6, T = 0.5, at index 5 (value 7).** Propose index 6 (value 6). $\\Delta E = -1$, so $P = e^{-1/0.5} = e^{-2} \\approx 0.135$. The draw $u = 0.90$ is above 0.135, so **reject** and stay at index 5.`,
          `**Summary.** The run ends at value 7. Hill climbing from index 1 would have returned 5. The accepted bad moves at t = 1 and t = 3 carried the search across the valley. A different sequence of draws could have produced a different path, so the result is random.`,
        ],
        takeaway: `Simulated annealing accepts downhill moves with probability $e^{\\Delta E / T}$, so high temperature lets the search cross valleys that trap hill climbing, while lower temperature makes it settle.`,
      },
    },
    3: {
      qa: [
        {
          question: `Crossover just mixes strings. Why does it help more than mutation alone?`,
          answer: `Crossover combines partial solutions. If one parent has a good arrangement in its first five positions and the other has a good arrangement in its last three, the child can inherit both. Mutation changes one position at a time, so good pieces found in different individuals never combine. Mutation is still needed: it introduces values that no current individual has, which keeps the population from converging too early.`,
        },
        {
          question: `How is the fitness of 24748552 computed, and why does 24 matter?`,
          answer: `Fitness is the number of **non-attacking** pairs of queens. There are $\\binom{8}{2} = 28$ pairs. Two queens in columns $i < j$ attack each other if they share a row, or if $|r_i - r_j| = j - i$ on a diagonal. For 24748552 the attacking pairs are (1,8) on row 2, (2,4) on row 4, (3,8) on a diagonal (rows 7 and 2, column gap 5), and (6,7) on row 5. That gives $28 - 4 = 24$. A fitness of 28 means no pair attacks, which is a solution. The number 24 means the board is close but not solved.`,
        },
        {
          question: `Why does a GA need an encoding such as a digit string?`,
          answer: `Crossover and mutation work on the representation, not on the problem directly. A string of digits gives a natural cut point for crossover and a natural single-position change for mutation. A poor encoding makes these operators produce mostly invalid or unrelated offspring, so choosing the representation is often the hardest design decision in a GA.`,
        },
      ],
      workedExample: {
        title: `One Crossover and Mutation Step for 8-Queens`,
        scenario: `Two parents from an 8-queens population are P1 = 24748552 (fitness 24) and P2 = 32752411 (fitness 23). Fitness counts non-attacking pairs out of 28. Crossover splits after position 5. Mutation then changes position 6 of the child.`,
        walkthrough: [
          `**Check P1 = 24748552.** Attacking pairs: (1,8), (2,4), (3,8), (6,7). Fitness $= 28 - 4 = 24$.`,
          `**Check P2 = 32752411.** Attacking pairs: (1,2) on a diagonal, (2,5) on row 2, (3,6) on a diagonal, (4,8) on a diagonal, (7,8) on row 1. Fitness $= 28 - 5 = 23$.`,
          `**Selection.** With these two parents, fitness-proportional selection gives P1 probability $24/47 \\approx 0.51$ and P2 probability $23/47 \\approx 0.49$. The fitter parent is favored only slightly here.`,
          `**Crossover after position 5.** Take the first five digits of P1 and the last three of P2: $24748 \\,|\\, 411 = 24748411$.`,
          `**Mutation at position 6.** Change the digit in position 6 from 4 to 3: $24748411 \\to 24748311$.`,
          `**Check the child = 24748311.** Attacking pairs: (2,4) on row 4, (4,7) on a diagonal, (6,8) on a diagonal, (7,8) on row 1. Fitness $= 28 - 4 = 24$. The child matches the better parent and beats the weaker one.`,
        ],
        takeaway: `Crossover can pass a good arrangement from each parent into one child, and mutation can change a single position to create variation that neither parent had.`,
      },
    },
    4: {
      qa: [
        {
          question: `Why not run ordinary search over physical states when the agent is sensorless?`,
          answer: `Because the agent does not know which physical state it is in, it cannot pick a different plan for each state. It needs one action sequence that works from every state it might occupy. Searching over belief states turns this into a normal search: each node is a belief state, and the goal test asks whether the belief state is contained in the goal set. The cost is size. With $N$ physical states there can be up to $2^N$ belief states, so 8 physical states give up to 256.`,
        },
        {
          question: `Does a conformant plan always exist?`,
          answer: `No. A conformant plan exists only if some action sequence drives every state in the belief state into the goal. If it does not, the agent needs sensors, and then the problem becomes contingency planning, where the next action depends on what the agent observes.`,
        },
        {
          question: `How does this relate to probabilistic filtering in later chapters?`,
          answer: `A belief state here is a set: each physical state is either possible or not. Chapter 15 replaces the set with a probability distribution over states, and the same predict-then-update cycle becomes Bayesian filtering. The sets give a yes-or-no picture of what is possible, while the distribution also tells you how likely each possibility is.`,
        },
      ],
      workedExample: {
        title: `Conformant Plan in the Sensorless Vacuum World`,
        scenario: `The vacuum world has eight physical states. The robot is in room A in states 1, 3, 5, and 7, and in room B in states 2, 4, 6, and 8. The goal is state 7: the robot is in A and both rooms are clean. The agent has no sensors, so its initial belief state is $\\{1, 2, 3, 4, 5, 6, 7, 8\\}$, and UPDATE never removes anything because there are no percepts.`,
        walkthrough: [
          `**Right.** PREDICT moves every state to room B. The result is $\\{2, 4, 6, 8\\}$. The belief state shrank because pairs of states (1 and 2, 3 and 4, and so on) now coincide.`,
          `**Suck.** In states 2 and 6, room B is dirty and gets cleaned, giving states 4 and 8. States 4 and 8 are unchanged. The result is $\\{4, 8\\}$.`,
          `**Left.** The robot moves to room A: 4 becomes 3 and 8 becomes 7. The result is $\\{3, 7\\}$.`,
          `**Suck.** In state 3, room A is dirty and gets cleaned, giving state 7. State 7 is unchanged. The result is $\\{7\\}$, which is the goal.`,
          `**Summary.** The plan $[\\text{Right}, \\text{Suck}, \\text{Left}, \\text{Suck}]$ reaches the goal from every initial state, and no sensor readings were needed.`,
        ],
        takeaway: `A conformant plan is found by searching over belief states: one action sequence must work for every physical state the agent might occupy.`,
      },
    },
  },
};
