import { BookPart, Badge } from '../types';

export const AIMA_PARTS: BookPart[] = [
  {
    id: 1,
    title: 'Part I: Artificial Intelligence',
    description: 'Foundations of rational agents, philosophical origins, and environment taxonomy (PEAS).',
    color: '#6366f1',
    iconName: 'Bot',
    chapters: [
      {
        id: 1,
        partId: 1,
        title: 'Introduction',
        subtitle: 'What is AI? Foundations, history, and state of the art',
        pageRange: 'pp. 1–33',
        examWeight: 'Medium',
        sections: [
          '1.1 What Is AI? (Thinking Humanly, Acting Humanly, Thinking Rationally, Acting Rationally)',
          '1.2 The Foundations of Artificial Intelligence (Philosophy, Mathematics, Economics, Neuroscience, Psychology, Computer Engineering, Control Theory, Linguistics)',
          '1.3 The History of Artificial Intelligence (1943–present: Genesis, Dartmouth workshop, Great expectations, AI Winters, Deep Learning revolution)',
          '1.4 The State of the Art (Robotic cars, speech recognition, autonomous planning, machine translation)',
          '1.5 Summary, Bibliographical and Historical Notes'
        ],
        summary: 'Russell & Norvig frame AI along two dimensions: Thought processes vs. Behavior, and Fidelity to human performance vs. Rationality. The book centers on Acting Rationally—the Rational Agent approach—because it is more mathematically grounded than human imitation.',
        keyConcepts: [
          {
            title: 'The Four Approaches to AI',
            summary: 'Thinking Humanly (cognitive modeling), Acting Humanly (Turing Test), Thinking Rationally (laws of thought/logic), and Acting Rationally (rational agents).',
            deepDive: [
              'Turing Test (1950): operational definition of intelligence based on indistinguishability from humans in text communication.',
              'Total Turing Test: adds visual perception and robotic manipulation capabilities.',
              'Cognitive Science: combines computer models from AI and experimental techniques from psychology to construct testable theories of human mind.',
              'The Rational Agent Approach: an agent acts to achieve the best outcome or, when there is uncertainty, the best expected outcome.'
            ],
            examTip: 'Exam trap: Do not confuse a rational agent with an omniscient agent. Rationality maximizes EXPECTED performance based on current percepts, not actual performance with future clairvoyance.'
          },
          {
            title: 'Foundations of AI',
            summary: 'Contributions from Philosophy, Mathematics, Economics, Neuroscience, Psychology, and Linguistics.',
            deepDive: [
              'Philosophy: Dualism vs. Materialism, Empiricism, Induction, logical positivism.',
              'Mathematics: Formal logic (Boole, Frege), Incompleteness theorem (Gödel), Computability (Turing), Intractability (NP-completeness, Cook).',
              'Economics: Decision theory, Utility theory (von Neumann & Morgenstern), Game theory (Nash equilibria), Satisficing (Herbert Simon).'
            ]
          }
        ]
      },
      {
        id: 2,
        partId: 1,
        title: 'Intelligent Agents',
        subtitle: 'Agents, environments, rationality, and agent architectures',
        pageRange: 'pp. 34–63',
        examWeight: 'Essential',
        hasSimulation: true,
        simulationType: 'vacuum',
        sections: [
          '2.1 Agents and Environments (Sensors, actuators, percepts, actions, agent function)',
          '2.2 Good Behavior: The Concept of Rationality (Performance measures, omniscience vs rationality)',
          '2.3 The Nature of Environments (PEAS: Performance, Environment, Actuators, Sensors)',
          '2.4 The Structure of Agents (Simple reflex, Model-based, Goal-based, Utility-based, Learning agents)',
          '2.5 Summary and Exercises'
        ],
        summary: 'An agent is anything that perceives its environment through sensors and acts upon it via actuators. A rational agent selects an action that is expected to maximize its performance measure, given the percept sequence and built-in knowledge.',
        keyConcepts: [
          {
            title: 'PEAS Specification',
            summary: 'Performance Measure, Environment, Actuators, Sensors. The mandatory first step in specifying any AI agent.',
            deepDive: [
              'Automated Taxi: Performance (safety, speed, legality, comfort, profits), Environment (roads, traffic, pedestrians, weather), Actuators (steering, accelerator, brake, display), Sensors (cameras, radar, GPS, speedometer).',
              'Medical Diagnosis: Performance (healthy patient, minimized costs, no malpractice), Environment (patient, hospital, staff), Actuators (display questions, tests, prescriptions), Sensors (symptoms, patient history, test results).'
            ],
            examTip: 'Always design the performance measure according to what is genuinely wanted in the environment, NOT according to how the agent should behave (e.g., reward a clean floor, not sweeping actions).'
          },
          {
            title: 'Environment Properties Taxonomy',
            summary: 'Six fundamental axes that dictate algorithmic complexity for agents.',
            deepDive: [
              'Fully Observable vs. Partially Observable: agent sensors give complete access to world state at any time.',
              'Single Agent vs. Multi-Agent: competitive (chess) or cooperative (taxi on road).',
              'Deterministic vs. Stochastic: next state completely determined by current state and agent action (if non-agent events cause uncertainty: strategic).',
              'Episodic vs. Sequential: agent experience divided into atomic episodes where action quality depends only on current episode.',
              'Static vs. Dynamic: environment changes while the agent is deliberating (semidynamic: score drops with time).',
              'Discrete vs. Continuous: distinct states, time steps, percepts, actions vs continuous intervals.'
            ],
            examTip: 'The hardest environment is: Partially Observable, Multi-agent, Stochastic, Sequential, Dynamic, and Continuous (e.g., real-world driving or financial trading).'
          },
          {
            title: 'The Five Agent Architectures',
            summary: 'From simple condition-action rules to full learning agents.',
            deepDive: [
              'Simple Reflex Agent: acts only on current percept (if-then rules). Fails in partially observable environments due to infinite loops.',
              'Model-Based Reflex Agent: maintains internal state (how the world evolves and how agent actions affect the world).',
              'Goal-Based Agent: combines internal state with explicit goal descriptions to select actions (search & planning).',
              'Utility-Based Agent: uses a utility function mapping states to real numbers to measure preference under trade-offs and uncertainty.',
              'Learning Agent: separated into Learning Element (makes improvements), Critic (evaluates based on performance standard), Performance Element (selects external actions), and Learning Goals / Problem Generator (suggests exploratory actions).'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Part II: Problem-Solving',
    description: 'Uninformed and heuristic search algorithms, local optimization, adversarial game trees, and CSPs.',
    color: '#0ea5e9',
    iconName: 'Search',
    chapters: [
      {
        id: 3,
        partId: 2,
        title: 'Solving Problems by Searching',
        subtitle: 'State spaces, BFS, DFS, Uniform Cost, Greedy, and A* Search',
        pageRange: 'pp. 64–119',
        examWeight: 'Essential',
        hasSimulation: true,
        simulationType: 'search',
        sections: [
          '3.1 Problem-Solving Agents (Well-defined problems, state-space formulation)',
          '3.2 Example Problems (Toy problems: 8-puzzle, 8-queens; Real-world: route-finding, TSP)',
          '3.3 Searching for Solutions (Tree-search vs Graph-search, Frontier, Explored set)',
          '3.4 Uninformed Search Strategies (BFS, Uniform-cost, DFS, Depth-limited, Iterative deepening, Bidirectional)',
          '3.5 Informed (Heuristic) Search Strategies (Greedy best-first, A*, Memory-bounded: IDA*, RBFS)',
          '3.6 Heuristic Functions (Admissibility, Consistency, Dominance, Generating heuristics from relaxed problems)'
        ],
        summary: 'Formulating problems as state-space graphs. Uninformed search uses no domain knowledge beyond problem definition. Informed (heuristic) search uses an evaluation function f(n) guided by heuristic h(n) estimating cost to goal.',
        keyConcepts: [
          {
            title: 'Formal Problem Formulation',
            summary: 'Initial state, Actions(s), Result(s, a), GoalTest(s), and PathCost(c(s, a, s’)).',
            deepDive: [
              'State Space: set of all states reachable from initial state by any sequence of actions.',
              'Step Cost: c(s, a, s’), non-negative cost of taking action a in state s to reach s’.',
              'Optimal Solution: path with the lowest path cost among all solutions.'
            ]
          },
          {
            title: 'Uninformed Search Comparison',
            summary: 'Time, Space, Completeness, and Optimality across uninformed methods.',
            deepDive: [
              'BFS: Complete (if b is finite), Time O(b^d), Space O(b^d) [Frontier holds entire level], Optimal if step costs are identical.',
              'Uniform-Cost Search (Dijkstra): Complete (if step costs >= epsilon > 0), Time & Space O(b^(1 + floor(C*/epsilon))), Optimal for arbitrary step costs.',
              'DFS: Not complete in infinite-depth spaces, Complete in finite spaces with graph-search. Time O(b^m), Space O(bm) [linear space!], Not optimal.',
              'Iterative Deepening Search (IDS): Complete, Time O(b^d), Space O(bd). Combines benefits of DFS linear space and BFS optimality!'
            ],
            examTip: 'IDS is the preferred uninformed search method when state space is large and depth of solution is unknown. Do not worry about repeated work at top levels: b^d dominates sum of b^(d-1) etc.'
          },
          {
            title: 'A* Search and Heuristics',
            summary: 'f(n) = g(n) + h(n), where g(n) is exact cost from start to n, and h(n) is estimated cost from n to goal.',
            deepDive: [
              'Admissibility: h(n) <= h*(n) for all n, where h*(n) is true optimal cost to goal. Never overestimates! Guarantees tree-search optimality.',
              'Consistency (Monotonicity): h(n) <= c(n, a, n’) + h(n’) with h(Goal) = 0. Triangle inequality. Guarantees graph-search optimality without reopening closed nodes.',
              'Every consistent heuristic is admissible, but not vice versa!',
              'Dominance: If h2(n) >= h1(n) for all n (and both admissible), h2 dominates h1 and expands strictly fewer or equal nodes.'
            ],
            keyFormula: {
              latex: 'f(n) = g(n) + h(n) \\quad \\text{with} \\quad h(n) \\le c(n, a, n\') + h(n\')',
              description: 'A* evaluation function and consistency condition (triangle inequality).'
            },
            examTip: 'Graph-search A* with an INCONSISTENT but admissible heuristic is NOT guaranteed to find the optimal path unless you re-open nodes in the explored set!'
          }
        ],
        algorithms: [
          {
            name: 'A*-SEARCH',
            inputs: 'problem, heuristic function h',
            returns: 'solution path or failure',
            steps: [
              'Initialize frontier with PriorityQueue ordered by f(n) = g(n) + h(n), containing node(problem.INITIAL_STATE).',
              'Initialize explored set to empty.',
              'Loop: if frontier is empty return failure.',
              'node = frontier.pop() [lowest f(n)].',
              'if problem.GOAL_TEST(node.STATE) return SOLUTION(node).',
              'Add node.STATE to explored set.',
              'For each child in EXPAND(problem, node):',
              '  if child.STATE not in explored and not in frontier: frontier.insert(child)',
              '  else if child.STATE in frontier with higher g: replace with child'
            ],
            timeComplexity: 'O(b^(epsilon * d)) where error is (h* - h)/h*',
            spaceComplexity: 'O(b^d) keeps all generated nodes in memory',
            optimality: 'Optimal with admissible (tree) or consistent (graph) heuristic',
            completeness: 'Complete on finite graphs (with positive edge costs)'
          }
        ]
      },
      {
        id: 4,
        partId: 2,
        title: 'Beyond Classical Search',
        subtitle: 'Local search, simulated annealing, genetic algorithms, and continuous spaces',
        pageRange: 'pp. 120–160',
        examWeight: 'High',
        sections: [
          '4.1 Local Search Algorithms and Optimization Problems (Hill-climbing, Simulated annealing, Local beam search, Genetic algorithms)',
          '4.2 Local Search in Continuous Spaces (Gradient descent, Newton-Raphson)',
          '4.3 Searching with Nondeterministic Actions (AND-OR search trees, contingency plans)',
          '4.4 Searching with Partial Observations (Belief states, sensorless/conformant planning)',
          '4.5 Online Search Agents and Unknown Environments (LRTA*)'
        ],
        summary: 'When path to goal does not matter and only the destination state matters (e.g., 8-Queens, VLSI design), local search operates using a single current state and moves only to neighbors. Extremely memory-efficient (O(1) memory).',
        keyConcepts: [
          {
            title: 'Hill Climbing & Its Failure Modes',
            summary: 'Greedy local search that moves in direction of increasing value/decreasing cost.',
            deepDive: [
              'Local Maxima: peak that is higher than neighboring states but lower than global maximum.',
              'Ridges: series of local maxima connected together, extremely slow for greedy steps.',
              'Plateaux / Shoulders: flat area of state space where evaluation function is constant.'
            ]
          },
          {
            title: 'Simulated Annealing',
            summary: 'Combines hill climbing with random walk. Escapes local maxima by allowing downhill moves with probability decreasing with temperature T.',
            deepDive: [
              'P(accept bad move) = exp(Delta E / T).',
              'If T drops slowly enough according to annealing schedule, algorithm is guaranteed to converge to global optimum.'
            ],
            keyFormula: {
              latex: 'P(\\text{accept}) = e^{\\frac{\\Delta E}{T}}',
              description: 'Boltzmann acceptance probability for downhill moves with energy delta and temperature T.'
            }
          },
          {
            title: 'Genetic Algorithms (GAs)',
            summary: 'Successor states generated by combining two parent states (crossover) plus random mutations, mimicking biological evolution.',
            deepDive: [
              'Population of k randomly generated states represented as strings.',
              'Fitness function evaluates goodness of each individual.',
              'Selection: probability of reproduction proportional to fitness.',
              'Crossover: exchange substrings at random crossover point.',
              'Mutation: flip random characters with small probability.'
            ]
          }
        ]
      },
      {
        id: 5,
        partId: 2,
        title: 'Adversarial Search',
        subtitle: 'Games, minimax algorithm, alpha-beta pruning, and imperfect decisions',
        pageRange: 'pp. 161–201',
        examWeight: 'Essential',
        hasSimulation: true,
        simulationType: 'minimax',
        sections: [
          '5.1 Games (Deterministic, zero-sum, complete information games)',
          '5.2 Optimal Decisions in Games (Minimax algorithm, game trees)',
          '5.3 Alpha-Beta Pruning (Pruning theorem, move ordering)',
          '5.4 Imperfect Real-Time Decisions (Evaluation functions, cutting off search, quiescence search, horizon effect)',
          '5.5 Stochastic Games (Expectiminimax, chance nodes)',
          '5.6 Partially Observable Games (Card games, Kriegspiel)'
        ],
        summary: 'Competitive multi-agent environments with deterministic, turn-taking, two-player, zero-sum games with perfect information (Chess, Checkers, Go). The Minimax value gives the best achievable payoff against an optimal adversary.',
        keyConcepts: [
          {
            title: 'The Minimax Principle',
            summary: 'MAX seeks to maximize utility; MIN seeks to minimize utility.',
            deepDive: [
              'Minimax(s) = Utility(s) if Terminal-Test(s)',
              '= max_{a in Actions(s)} Minimax(Result(s, a)) if Player(s) = MAX',
              '= min_{a in Actions(s)} Minimax(Result(s, a)) if Player(s) = MIN',
              'Time complexity: O(b^m), Space complexity: O(bm) with DFS.'
            ]
          },
          {
            title: 'Alpha-Beta Pruning',
            summary: 'Eliminates branches from search tree that cannot possibly influence the final decision.',
            deepDive: [
              'alpha = highest-value choice found so far along any path for MAX.',
              'beta = lowest-value choice found so far along any path for MIN.',
              'Prune at MIN node if value v <= alpha (MAX already has a better option elsewhere).',
              'Prune at MAX node if value v >= beta (MIN already has a better option elsewhere).',
              'With perfect move ordering, time complexity drops from O(b^m) to O(b^(m/2))—doubles search depth!'
            ],
            examTip: 'Exam question staple: Alpha-beta pruning NEVER alters the minimax value computed at the root. It returns the exact same move as standard minimax, just faster.'
          },
          {
            title: 'Heuristic Evaluation & Horizon Effect',
            summary: 'Evaluation functions estimate expected utility when search must be truncated at depth cutoff.',
            deepDive: [
              'Weighted linear function: Eval(s) = w1*f1(s) + w2*f2(s) + ... + wn*fn(s).',
              'Quiescence Search: continue search past depth limit in non-quiescent states (tactical situations like piece captures).',
              'Horizon Effect: postponing an unavoidable loss by delaying tactics beyond search horizon.'
            ]
          }
        ],
        algorithms: [
          {
            name: 'ALPHA-BETA-SEARCH',
            inputs: 'state',
            returns: 'an action',
            steps: [
              'v = MAX-VALUE(state, -infinity, +infinity)',
              'return the action in ACTIONS(state) with value v',
              'function MAX-VALUE(state, alpha, beta):',
              '  if TERMINAL-TEST(state) return UTILITY(state)',
              '  v = -infinity',
              '  for each a in ACTIONS(state):',
              '    v = max(v, MIN-VALUE(RESULT(state, a), alpha, beta))',
              '    if v >= beta return v [Beta Cutoff]',
              '    alpha = max(alpha, v)',
              '  return v',
              'function MIN-VALUE(state, alpha, beta):',
              '  if TERMINAL-TEST(state) return UTILITY(state)',
              '  v = +infinity',
              '  for each a in ACTIONS(state):',
              '    v = min(v, MAX-VALUE(RESULT(state, a), alpha, beta))',
              '    if v <= alpha return v [Alpha Cutoff]',
              '    beta = min(beta, v)',
              '  return v'
            ],
            timeComplexity: 'O(b^(m/2)) with optimal move ordering, O(b^m) worst case',
            spaceComplexity: 'O(bm) linear memory via depth-first recursion',
            optimality: 'Identical to Minimax (guaranteed optimal against optimal opponent)',
            completeness: 'Complete on finite game trees'
          }
        ]
      },
      {
        id: 6,
        partId: 2,
        title: 'Constraint Satisfaction Problems',
        subtitle: 'Variables, domains, AC-3 constraint propagation, and backtracking search',
        pageRange: 'pp. 202–233',
        examWeight: 'Essential',
        hasSimulation: true,
        simulationType: 'csp',
        sections: [
          '6.1 Defining CSPs (Variables X, Domains D, Constraints C; Cryptarithmetic, Map coloring)',
          '6.2 Constraint Propagation: Inference in CSPs (Node consistency, Arc consistency / AC-3, Path consistency, k-consistency)',
          '6.3 Backtracking Search for CSPs (MRV heuristic, Degree heuristic, Least Constraining Value, Forward checking)',
          '6.4 Local Search for CSPs (Min-conflicts heuristic)',
          '6.5 The Structure of Problems (Independent subproblems, Tree-structured CSPs O(n*d^2))'
        ],
        summary: 'CSPs represent states with factored variables and discrete/continuous domains. The goal is to find an assignment of values to variables satisfying all constraints. Inference (arc consistency) prunes domains before and during search.',
        keyConcepts: [
          {
            title: 'Constraint Propagation and AC-3 Algorithm',
            summary: 'Directed arc (Xi, Xj) is arc-consistent if for every value x in Di there exists some allowed value y in Dj.',
            deepDive: [
              'AC-3 initializes queue with all binary arcs in the problem.',
              'Pops arc (Xi, Xj); if Di is pruned to maintain consistency, all neighbors (Xk, Xi) are re-added to queue.',
              'Complexity: O(c * d^3) where c is number of binary constraints and d is max domain size.'
            ],
            keyFormula: {
              latex: '\\forall x \\in D_i, \\; \\exists y \\in D_j \\; \\text{such that} \\; (x, y) \\in C_{ij}',
              description: 'Condition for arc consistency of directed arc (Xi -> Xj).'
            }
          },
          {
            title: 'Backtracking Search Heuristics',
            summary: 'Three universal heuristics that accelerate CSP solving by factors of 1000x.',
            deepDive: [
              'Minimum Remaining Values (MRV / "Fail-First"): choose variable with the fewest legal values remaining.',
              'Degree Heuristic (Tie-breaker for MRV): choose variable with most constraints on other unassigned variables.',
              'Least Constraining Value (LCV / "Fail-Last"): given variable, choose value that rules out the fewest values in neighboring variables.'
            ],
            examTip: 'Notice the dichotomy: Pick the most constrained variable first (Fail-First to detect dead ends early), but pick the least constraining value (Fail-Last to leave maximum flexibility for remaining variables).'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Part III: Knowledge, Reasoning, and Planning',
    description: 'Propositional and First-Order Logic, inference via resolution, forward/backward chaining, and classical planning.',
    color: '#8b5cf6',
    iconName: 'BrainCircuit',
    chapters: [
      {
        id: 7,
        partId: 3,
        title: 'Logical Agents',
        subtitle: 'Knowledge-based agents, Wumpus World, propositional logic, and DPLL',
        pageRange: 'pp. 234–284',
        examWeight: 'Essential',
        hasSimulation: true,
        simulationType: 'wumpus',
        sections: [
          '7.1 Knowledge-Based Agents (Knowledge Base KB, TELL, ASK, inference engine)',
          '7.2 The Wumpus World (Environment PEAS, pits, breezes, stench, gold)',
          '7.3 Logic (Syntax, semantics, entailment KB |= alpha, models M(alpha))',
          '7.4 Propositional Logic (Connectives, truth tables, validity, satisfiability)',
          '7.5 Propositional Theorem Proving (Inference rules, Modus Ponens, Resolution, Horn clauses)',
          '7.6 Effective Propositional Model Checking (DPLL algorithm, WalkSAT)',
          '7.7 Agents Based on Propositional Logic (Tracking location, state estimation)'
        ],
        summary: 'Knowledge-based agents combine explicit declarative representations of sentences with general inference mechanisms. Entailment KB |= alpha means alpha is true in all models where KB is true. Propositional resolution theorem proving is refutation-complete.',
        keyConcepts: [
          {
            title: 'Entailment vs Derivation',
            summary: 'KB |= alpha (semantic entailment) vs KB |- alpha (syntactic derivation by algorithm).',
            deepDive: [
              'Soundness: an inference algorithm derives only entailed sentences (truth-preserving).',
              'Completeness: an inference algorithm can derive any sentence that is entailed.',
              'Model Checking: enumerates all possible models to check if M(KB) is a subset of M(alpha).'
            ]
          },
          {
            title: 'Propositional Resolution Theorem Proving',
            summary: 'Proof by contradiction: KB |= alpha if and only if (KB and not alpha) is unsatisfiable.',
            deepDive: [
              'Convert KB and not alpha into Conjunctive Normal Form (CNF).',
              'Resolution rule: (l1 or ... or lk or P) and (m1 or ... or mn or not P) resolves to (l1 or ... or lk or m1 or ... or mn).',
              'If the empty clause () is derived, the theorem is proved.'
            ],
            keyFormula: {
              latex: '\\text{KB} \\models \\alpha \\iff (\\text{KB} \\land \\neg \\alpha) \\models \\text{False}',
              description: 'Proof by contradiction theorem (Refutation completeness).'
            }
          },
          {
            title: 'DPLL (Davis-Putnam-Logemann-Loveland)',
            summary: 'Recursive depth-first backtracking search over models with three crucial optimizations.',
            deepDive: [
              'Early termination: a clause is satisfied if any literal is true; entire sentence false if any clause is empty.',
              'Pure symbol heuristic: symbol that always appears with same sign (+ or -) in all remaining clauses.',
              'Unit clause heuristic: clause with only one unassigned literal; literal must be true to satisfy clause.'
            ]
          }
        ]
      },
      {
        id: 8,
        partId: 3,
        title: 'First-Order Logic',
        subtitle: 'Syntax, semantics, quantifiers, and ontological commitments',
        pageRange: 'pp. 285–321',
        examWeight: 'High',
        sections: [
          '8.1 Representation Revisited (Ontological and epistemological commitments of logics)',
          '8.2 Syntax and Semantics of First-Order Logic (Constants, predicates, functions, variables, quantifiers)',
          '8.3 Using First-Order Logic (Kinship domain, numbers, sets, lists)',
          '8.4 Knowledge Engineering in First-Order Logic (Ontology construction, domain concepts)'
        ],
        summary: 'Propositional logic assumes facts only (world contains facts that hold or do not hold). First-Order Logic (FOL) commits to an ontology of objects and relations (properties of individual objects or relations between them), unlocking immense expressive power with universal (forall) and existential (exists) quantifiers.',
        keyConcepts: [
          {
            title: 'Universal vs Existential Quantifiers & Common Traps',
            summary: 'Proper pairing of connectives with quantifiers.',
            deepDive: [
              'Universal (forall x) is almost always paired with implication: forall x (King(x) => Person(x)). Using conjunction (forall x (King(x) and Person(x))) asserts everyone is a King and a Person!',
              'Existential (exists x) is almost always paired with conjunction: exists x (Crown(x) and OnHead(x, John)). Using implication (exists x (Crown(x) => OnHead(x, John))) is vacuously true if anything is NOT a crown!'
            ],
            examTip: 'Exam question favorite: "forall x P(x) => Q(x)" vs "exists x P(x) and Q(x)". Remember: "forall" pairs with "=>", "exists" pairs with "and".'
          }
        ]
      },
      {
        id: 9,
        partId: 3,
        title: 'Inference in First-Order Logic',
        subtitle: 'Unification, Generalized Modus Ponens, Forward/Backward chaining, and Resolution',
        pageRange: 'pp. 322–365',
        examWeight: 'High',
        sections: [
          '9.1 Propositional vs. First-Order Inference (Universal and Existential instantiation, Skolemization)',
          '9.2 Unification and Lifting (Most General Unifier MGU, occurs-check)',
          '9.3 Forward Chaining (First-Order definite clauses, semi-naive evaluation, Rete algorithm)',
          '9.4 Backward Chaining (Logic programming, Prolog, SLD resolution, infinite loops)',
          '9.5 Resolution (CNF conversion, Skolemization, lifting resolution, factors)'
        ],
        summary: 'Inference can be done by propositionalization (often intractable) or by lifted inference directly on FOL sentences using Unification. Generalized Modus Ponens operates efficiently on definite clauses.',
        keyConcepts: [
          {
            title: 'Unification & Most General Unifier (MGU)',
            summary: 'UNIFY(p, q) = theta where Subst(theta, p) = Subst(theta, q).',
            deepDive: [
              'Occurs check: variable x cannot be unified with a term containing x (e.g., UNIFY(x, f(x)) must fail; Prolog notoriously omits this for speed, causing unsoundness).',
              'Standardizing apart: renaming variables in two clauses so they do not share variable names.'
            ]
          },
          {
            title: 'Skolemization',
            summary: 'Eliminating existential quantifiers by introducing Skolem constants or Skolem functions.',
            deepDive: [
              'exists x Crown(x) -> Crown(C1) [Skolem constant C1].',
              'forall x exists y Heart(y, x) -> forall x Heart(h(x), x) [Skolem function h(x) depends on universally quantified x].'
            ]
          }
        ]
      },
      {
        id: 10,
        partId: 3,
        title: 'Classical Planning',
        subtitle: 'STRIPS, PDDL, state-space search for planning, and planning graphs',
        pageRange: 'pp. 366–400',
        examWeight: 'High',
        sections: [
          '10.1 Definition of Classical Planning (PDDL: Planning Domain Definition Language)',
          '10.2 Algorithms for Planning as State-Space Search (Forward state-space / progression, Backward search / regression)',
          '10.3 Planning Graphs (Mutual exclusion / mutex relations, GraphPlan algorithm)',
          '10.4 Other Classical Planning Approaches (Planning as SAT / SATPlan)',
          '10.5 Analysis of Planning Approaches'
        ],
        summary: 'Planning represents states, goals, and actions with open declarative structures. An action schema in PDDL consists of action name, parameter list, precondition, and effect (add-list and delete-list).',
        keyConcepts: [
          {
            title: 'PDDL Action Representation',
            summary: 'Action(Fly(p, from, to), PRECOND: At(p, from) and Plane(p) and Airport(from) and Airport(to), EFFECT: not At(p, from) and At(p, to)).',
            deepDive: [
              'Progression (Forward search): start at initial state, apply applicable actions, search forward.',
              'Regression (Backward search): start at goal state, invert relevant actions that contribute to goal without violating preconditions, search backward.'
            ]
          },
          {
            title: 'Planning Graphs & Mutex Relations',
            summary: 'Polynomial-time disjunctive graph of alternating state levels S_i and action levels A_i.',
            deepDive: [
              'Mutex between actions: Inconsistent effects, Interference, Competing needs.',
              'Mutex between literals: Inconsistent support (all actions producing one are mutex with all actions producing other).'
            ]
          }
        ]
      },
      {
        id: 11,
        partId: 3,
        title: 'Planning and Acting in the Real World',
        subtitle: 'Time, schedules, resources, hierarchical planning (HTN), and contingent planning',
        pageRange: 'pp. 401–436',
        examWeight: 'Medium',
        sections: [
          '11.1 Time, Schedules, and Resources (Critical Path Method, job-shop scheduling)',
          '11.2 Hierarchical Planning (Hierarchical Task Networks HTN, high-level actions HLA)',
          '11.3 Planning and Acting in Nondeterministic Domains (Sensorless planning, contingent planning, online replanning)',
          '11.4 Multiagent Planning'
        ],
        summary: 'Extending classical planning to handle numeric resource limits (fuel, crew), temporal durations, hierarchical task abstractions, and execution monitoring with replanning in stochastic worlds.',
        keyConcepts: [
          {
            title: 'Critical Path Method (CPM)',
            summary: 'Identifies sequence of dependent tasks that determines the minimal project completion time.',
            deepDive: [
              'Earliest Start (ES) and Earliest Finish (EF).',
              'Latest Start (LS) and Latest Finish (LF).',
              'Slack = LS - ES: activities with zero slack lie on the Critical Path.'
            ]
          }
        ]
      },
      {
        id: 12,
        partId: 3,
        title: 'Knowledge Representation',
        subtitle: 'Ontological engineering, categories, semantic networks, and description logics',
        pageRange: 'pp. 437–479',
        examWeight: 'Medium',
        sections: [
          '12.1 Ontological Engineering (Upper ontologies, general frameworks)',
          '12.2 Categories and Objects (Subclass relations, taxonomy, reification)',
          '12.3 Events (Fluents, Situation Calculus, Event Calculus)',
          '12.4 Mental Events and Mental Objects (Belief, knowledge modal logic)',
          '12.5 Reasoning Systems for Categories (Semantic Networks, Description Logics OWL)',
          '12.6 Reasoning with Default Information (Circumscription, default logic)'
        ],
        summary: 'How to structure vast domains of knowledge. Semantic networks provide graphical aids for inheritance; Description Logics provide formal, decidable subsets of FOL tailored for reasoning about categories.',
        keyConcepts: [
          {
            title: 'Situation Calculus & The Frame Problem',
            summary: 'Representing changing worlds in logic.',
            deepDive: [
              'Fluents: functions or predicates that vary from situation to situation.',
              'The Frame Problem: how to represent what DOES NOT change when an action occurs (successor-state axioms solve this).'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Part IV: Uncertain Knowledge and Reasoning',
    description: 'Probability theory, Bayes networks, temporal inference (HMMs/Kalman), utility theory, and MDPs.',
    color: '#10b981',
    iconName: 'Network',
    chapters: [
      {
        id: 13,
        partId: 4,
        title: 'Quantifying Uncertainty',
        subtitle: 'Probability axioms, joint distributions, conditional probability, and Bayes’ Rule',
        pageRange: 'pp. 480–509',
        examWeight: 'Essential',
        hasSimulation: true,
        simulationType: 'bayes',
        sections: [
          '13.1 Acting under Uncertainty (Why logic fails in real medicine/agents: qualification problem, laziness, theoretical ignorance)',
          '13.2 Basic Probability Notation (Random variables, prior probability, conditional probability)',
          '13.3 Inference Using Full Joint Distributions (Marginalization, conditioning)',
          '13.4 Independence (Marginal independence P(A, B) = P(A)P(B))',
          '13.5 Bayes’ Rule and Its Use (Diagnostic vs causal directions, conditional independence, Naive Bayes)',
          '13.6 The Wumpus World Revisited (Probabilistic reasoning over pits)'
        ],
        summary: 'Agents face uncertainty due to incomplete information and partial observability. Probability provides a coherent numerical framework for degrees of belief. Bayes’ rule allows causal knowledge P(Effect|Cause) to invert into diagnostic probability P(Cause|Effect).',
        keyConcepts: [
          {
            title: 'Axioms of Probability (Kolmogorov)',
            summary: '0 <= P(A) <= 1, P(True) = 1, P(A or B) = P(A) + P(B) - P(A and B).',
            deepDive: [
              'Conditional probability definition: P(A|B) = P(A and B) / P(B).',
              'Product rule: P(A and B) = P(A|B) * P(B) = P(B|A) * P(A).'
            ]
          },
          {
            title: 'Bayes’ Rule & Diagnostic Inference',
            summary: 'P(Cause|Effect) = [P(Effect|Cause) * P(Cause)] / P(Effect).',
            deepDive: [
              'With normalization constant alpha: P(Cause|Effect) = alpha * P(Effect|Cause) * P(Cause).',
              'Causal direction is more stable, objective, and easier to estimate than diagnostic direction.'
            ],
            keyFormula: {
              latex: 'P(Y \\mid X) = \\frac{P(X \\mid Y) P(Y)}{P(X)} = \\alpha P(X \\mid Y) P(Y)',
              description: 'Bayes’ Rule formulation with normalization factor.'
            },
            examTip: 'Classic Medical Exam Problem: Disease prevalence 1/1000, Test sensitivity 99%, False positive rate 5%. A positive test gives only ~2% chance of disease, NOT 99%! Always compute with prior base rate!'
          },
          {
            title: 'Conditional Independence',
            summary: 'X and Y are conditionally independent given Z if P(X, Y | Z) = P(X|Z) * P(Y|Z).',
            deepDive: [
              'Reduces exponential complexity of joint probability distributions to linear complexity.',
              'Foundation of Naive Bayes models and Bayesian Networks.'
            ]
          }
        ]
      },
      {
        id: 14,
        partId: 4,
        title: 'Probabilistic Reasoning',
        subtitle: 'Bayesian networks, conditional distributions, exact and approximate inference',
        pageRange: 'pp. 510–558',
        examWeight: 'Essential',
        hasSimulation: true,
        simulationType: 'bayes',
        sections: [
          '14.1 Representing Knowledge in an Uncertain Domain (Directed Acyclic Graph DAG, conditional probability tables CPT)',
          '14.2 The Semantics of Bayesian Networks (Joint distribution factorization, Markov blanket, d-separation)',
          '14.3 Efficient Representation of Conditional Distributions (Noisy-OR, continuous variables)',
          '14.4 Exact Inference in Bayesian Networks (Inference by enumeration, Variable elimination)',
          '14.5 Approximate Inference in Bayesian Networks (Prior sampling, Rejection sampling, Likelihood weighting, Gibbs sampling MCMC)'
        ],
        summary: 'A Bayesian Network represents a joint probability distribution over a set of random variables using a DAG and Conditional Probability Tables (CPTs). Each node is conditionally independent of its non-descendants given its parents.',
        keyConcepts: [
          {
            title: 'Joint Distribution Factorization',
            summary: 'P(x1, ..., xn) = Product_{i=1}^n P(xi | Parents(Xi)).',
            deepDive: [
              'Drastically reduces parameters: from 2^n - 1 in full joint to sum of 2^(k_i) where k_i is parent count.'
            ],
            keyFormula: {
              latex: 'P(x_1, \\dots, x_n) = \\prod_{i=1}^n P(x_i \\mid \\text{Parents}(X_i))',
              description: 'Chain rule factorization for Bayesian Networks.'
            }
          },
          {
            title: 'Markov Blanket & d-separation',
            summary: 'A node is conditionally independent of all other nodes in the network given its Markov Blanket.',
            deepDive: [
              'Markov Blanket consists of: its parents, its children, and its children’s other parents.',
              'd-separation determines conditional independence by path blocking: linear chain blocked by conditioned node, common cause blocked by conditioned node, common effect (collider/v-structure) open ONLY if collider or its descendant is conditioned!'
            ],
            examTip: 'Exam trap on colliders (X -> Z <- Y): Unconditioned collider blocks the path! Conditioning on Z OPENS the path between X and Y (explaining away phenomenon).'
          },
          {
            title: 'Variable Elimination vs Sampling',
            summary: 'Exact inference (NP-hard in general) vs approximate sampling.',
            deepDive: [
              'Variable Elimination: factors evaluated in dynamic programming order, intermediate matrices cached.',
              'Likelihood Weighting: fixes evidence variables, weights each sample by the probability of the evidence given parents. Avoids rejecting samples!'
            ]
          }
        ]
      },
      {
        id: 15,
        partId: 4,
        title: 'Probabilistic Reasoning over Time',
        subtitle: 'Hidden Markov Models, filtering, prediction, smoothing, and Viterbi algorithm',
        pageRange: 'pp. 559–599',
        examWeight: 'High',
        hasSimulation: true,
        simulationType: 'hmm',
        sections: [
          '15.1 Time and Uncertainty (States X_t, Evidence E_t, Markov assumption, Sensor model)',
          '15.2 Inference in Temporal Models (Filtering P(X_t|e_{1:t}), Prediction P(X_{t+k}|e_{1:t}), Smoothing P(X_k|e_{1:t}), Most likely sequence / Viterbi)',
          '15.3 Hidden Markov Models (Matrix formulation, Forward-Backward algorithm)',
          '15.4 Kalman Filters (Continuous linear Gaussian temporal models)',
          '15.5 Dynamic Bayesian Networks (DBNs, particle filtering)'
        ],
        summary: 'Temporal models track changing worlds over discrete time slices. An HMM has a single discrete state variable X_t and observation E_t. The four fundamental tasks are: Filtering (tracking), Prediction, Smoothing (hindsight), and Most Likely Sequence (Viterbi decoding).',
        keyConcepts: [
          {
            title: 'The Four Fundamental Temporal Inference Tasks',
            summary: 'Formulas and purposes of temporal inference.',
            deepDive: [
              'Filtering: P(X_t | e_{1:t}), current belief state given all history to date.',
              'Prediction: P(X_{t+k} | e_{1:t}) for k > 0, forecasting future states.',
              'Smoothing: P(X_k | e_{1:t}) for 0 <= k < t, improved estimate of past states using subsequent observations.',
              'Most Likely Explanation: argmax_{x_{1:t}} P(x_{1:t} | e_{1:t}), decoded using dynamic programming (Viterbi).'
            ]
          },
          {
            title: 'Viterbi Algorithm',
            summary: 'Finds the most probable sequence of hidden states given a sequence of observations.',
            deepDive: [
              'Maintains trellis of highest probabilities m_t[x_t] = max_{x_{1:t-1}} P(x_{1:t-1}, x_t, e_{1:t}).',
              'Backpointers stored at each step to reconstruct optimal path.'
            ],
            keyFormula: {
              latex: 'm_t[j] = P(e_t \\mid j) \\cdot \\max_i \\left( P(j \\mid i) \\cdot m_{t-1}[i] \\right)',
              description: 'Viterbi trellis update recurrence.'
            }
          }
        ]
      },
      {
        id: 16,
        partId: 4,
        title: 'Making Simple Decisions',
        subtitle: 'Utility theory, decision networks, and the Value of Information',
        pageRange: 'pp. 600–644',
        examWeight: 'Medium',
        sections: [
          '16.1 Combining Beliefs and Desires under Uncertainty (Maximum Expected Utility principle MEU)',
          '16.2 The Basis of Utility Theory (Axioms of utility: orderability, transitivity, continuity, substitutability, monotonicity, decomposability)',
          '16.3 Utility Functions (Risk-averse, risk-neutral, risk-seeking, certainty equivalent)',
          '16.4 Multiattribute Utility Functions (Dominance, preference independence)',
          '16.5 Decision Networks (Chance nodes, decision nodes, utility nodes)',
          '16.6 The Value of Information (VPI, nonnegative, nonadditive)'
        ],
        summary: 'Preferences under uncertainty are quantified by a real-valued utility function U(s). The Principle of Maximum Expected Utility (MEU) states a rational agent should choose the action that maximizes expected utility EU(a) = sum_s’ P(Result(a)=s’) * U(s’).',
        keyConcepts: [
          {
            title: 'Value of Perfect Information (VPI)',
            summary: 'The expected gain in utility from acquiring knowledge of evidence variable E_j before choosing an action.',
            deepDive: [
              'VPI(E_j) = [sum_k P(E_j = e_{jk}) * EU(alpha_{e_{jk}} | e_{jk})] - EU(alpha).',
              'Properties of VPI: Non-negative (VPI >= 0), Non-additive in general, Order-independent.'
            ]
          }
        ]
      },
      {
        id: 17,
        partId: 4,
        title: 'Making Complex Decisions',
        subtitle: 'Markov Decision Processes (MDPs), Bellman equation, Value and Policy Iteration',
        pageRange: 'pp. 645–692',
        examWeight: 'Essential',
        hasSimulation: true,
        simulationType: 'mdp',
        sections: [
          '17.1 Sequential Decision Problems (MDP definition: S, A, T(s, a, s’), R(s, a, s’), discount factor gamma)',
          '17.2 Value Iteration (Bellman equation, contraction mapping, convergence)',
          '17.3 Policy Iteration (Policy evaluation, policy improvement)',
          '17.4 Partially Observable MDPs (POMDPs, belief state MDP)',
          '17.5 Decisions with Multiple Agents: Game Theory (Nash equilibrium, dominant strategies, prisoner’s dilemma)',
          '17.6 Mechanism Design (Auctions, Vickrey auction)'
        ],
        summary: 'MDPs model sequential decisions in stochastic environments with rewards. The solution is an optimal policy pi*(s) mapping every state to the optimal action. Value Iteration computes state utilities using the Bellman update.',
        keyConcepts: [
          {
            title: 'The Bellman Equation',
            summary: 'The utility of a state is the immediate reward plus the discounted expected utility of the next state assuming optimal action.',
            deepDive: [
              'Discount factor gamma in [0, 1): prevents infinite utility in infinite-horizon worlds.',
              'Value iteration converges to unique fixed point because the Bellman operator is a contraction with factor gamma.'
            ],
            keyFormula: {
              latex: 'U^*(s) = R(s) + \\gamma \\max_{a \\in A(s)} \\sum_{s\'} P(s\' \\mid s, a) U^*(s\')',
              description: 'The Bellman Equation for optimal state utility.'
            },
            examTip: 'Exam highlight: Value Iteration updates utilities in O(|S|^2 * |A|) per iteration. Policy Iteration alternates policy evaluation and policy improvement; it often converges in far fewer iterations because policies become optimal long before utilities converge numerically!'
          },
          {
            title: 'Policy Iteration',
            summary: 'Alternates Policy Evaluation (solving linear equations for current policy) and Policy Improvement (greedy update).',
            deepDive: [
              'Policy Evaluation: U_i(s) = R(s) + gamma * sum_s’ P(s’ | s, pi_i(s)) * U_i(s’) [linear system!].',
              'Policy Improvement: pi_{i+1}(s) = argmax_a sum_s’ P(s’ | s, a) * U_i(s’).'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Part V: Learning',
    description: 'Supervised learning, decision trees, neural networks, SVMs, statistical learning, and Reinforcement Learning.',
    color: '#f59e0b',
    iconName: 'GraduationCap',
    chapters: [
      {
        id: 18,
        partId: 5,
        title: 'Learning from Examples',
        subtitle: 'Supervised learning, decision trees, linear models, neural nets, SVMs, and ensembles',
        pageRange: 'pp. 693–767',
        examWeight: 'Essential',
        hasSimulation: true,
        simulationType: 'decisiontree',
        sections: [
          '18.1 Forms of Learning (Supervised, unsupervised, reinforcement)',
          '18.2 Supervised Learning (Hypothesis space, inductive learning, Occam’s razor)',
          '18.3 Learning Decision Trees (Entropy, Information Gain, ID3/C4.5, pruning)',
          '18.4 Evaluating and Choosing the Best Hypothesis (Cross-validation, bias-variance tradeoff)',
          '18.5 The Theory of Learning (PAC learning, sample complexity)',
          '18.6 Regression and Classification with Linear Models (Gradient descent, logistic regression)',
          '18.7 Artificial Neural Networks (Perceptrons, multi-layer feedforward networks, backpropagation)',
          '18.8 Nonparametric Models (k-NN, kernel regression)',
          '18.9 Support Vector Machines (Maximum margin hyperplane, kernel trick)',
          '18.10 Ensemble Learning (Bagging, Random Forests, Boosting / AdaBoost)'
        ],
        summary: 'Learning creates an approximation hypothesis h from training examples. Decision trees use Information Gain to recursively partition data. Backpropagation trains multi-layer neural networks via gradient descent on loss.',
        keyConcepts: [
          {
            title: 'Entropy and Information Gain',
            summary: 'Measures of information content and uncertainty in data subsets.',
            deepDive: [
              'Entropy: B(q) = - (q log2 q + (1 - q) log2(1 - q)).',
              'Remainder(A): weighted average entropy of child subsets partitioned by attribute A.',
              'Information Gain(A) = Entropy(Parent) - Remainder(A).'
            ],
            keyFormula: {
              latex: '\\text{Gain}(A) = H(S) - \\sum_{v \\in \\text{Values}(A)} \\frac{|S_v|}{|S|} H(S_v)',
              description: 'Information Gain formula used in ID3 and C4.5 Decision Trees.'
            }
          },
          {
            title: 'Bias-Variance Tradeoff & Overfitting',
            summary: 'The central dilemma of statistical machine learning.',
            deepDive: [
              'Bias: error from erroneous assumptions in learning algorithm (high bias -> underfitting).',
              'Variance: error from sensitivity to small fluctuations in training set (high variance -> overfitting).',
              'Cross-validation (k-fold): splits training data into k equal folds to reliably measure generalization error.'
            ]
          },
          {
            title: 'Support Vector Machines (SVM)',
            summary: 'Finds the maximum margin hyperplane separating classes.',
            deepDive: [
              'Support vectors: the data points closest to the separating boundary.',
              'Kernel trick: implicit mapping of input data to high-dimensional feature space using dot products K(x, z) without explicitly computing coordinates.'
            ]
          }
        ]
      },
      {
        id: 19,
        partId: 5,
        title: 'Knowledge in Learning',
        subtitle: 'Explanation-based learning and Inductive Logic Programming (ILP)',
        pageRange: 'pp. 768–797',
        examWeight: 'Medium',
        sections: [
          '19.1 A Logical Formulation of Learning',
          '19.2 Knowledge in Learning (Prior knowledge speedup)',
          '19.3 Explanation-Based Learning (EBL, operationality)',
          '19.4 Learning Using Relevance Information',
          '19.5 Inductive Logic Programming (ILP, inverse resolution)'
        ],
        summary: 'Combining domain knowledge with empirical induction. Inductive Logic Programming learns first-order logic rules directly from relational databases and examples.',
        keyConcepts: [
          {
            title: 'Inductive Logic Programming (ILP)',
            summary: 'Learns a hypothesis H in first-order logic such that Background and H entails Examples.',
            deepDive: [
              'Combines expressive relational representations with machine learning inductive generalizations.'
            ]
          }
        ]
      },
      {
        id: 20,
        partId: 5,
        title: 'Learning Probabilistic Models',
        subtitle: 'Maximum likelihood estimation, Bayesian parameter learning, and EM algorithm',
        pageRange: 'pp. 798–829',
        examWeight: 'High',
        sections: [
          '20.1 Statistical Learning (Bayesian parameter learning vs Maximum Likelihood)',
          '20.2 Learning with Complete Data (Counting, Laplace smoothing)',
          '20.3 Learning with Hidden Variables: The EM Algorithm (Expectation step, Maximization step, Gaussian mixtures)'
        ],
        summary: 'Statistical learning estimates parameters theta of probability distributions. Maximum Likelihood Estimation (MLE) maximizes log-likelihood of data. When latent (hidden) variables exist, the Expectation-Maximization (EM) algorithm guarantees convergence to local maximum.',
        keyConcepts: [
          {
            title: 'The EM Algorithm',
            summary: 'Alternates calculating expected values of hidden variables (E-step) and re-optimizing parameters (M-step).',
            deepDive: [
              'E-step: compute expected value of hidden variables under current parameters theta.',
              'M-step: find new parameters theta’ that maximize expected log-likelihood found in E-step.'
            ]
          }
        ]
      },
      {
        id: 21,
        partId: 5,
        title: 'Reinforcement Learning',
        subtitle: 'Passive and active RL, Temporal Difference TD(0), Q-learning, SARSA, and policy search',
        pageRange: 'pp. 830–869',
        examWeight: 'Essential',
        hasSimulation: true,
        simulationType: 'qlearn',
        sections: [
          '21.1 Introduction (Agent learning by trial and error from rewards)',
          '21.2 Passive Reinforcement Learning (Direct utility estimation, Adaptive Dynamic Programming ADP, Temporal-Difference learning TD)',
          '21.3 Active Reinforcement Learning (Exploration vs exploitation, Q-learning, SARSA)',
          '21.4 Generalization in Reinforcement Learning (Function approximation, deep Q-networks)',
          '21.5 Policy Search (Policy gradient methods)',
          '21.6 Applications of Reinforcement Learning (Backgammon, Helicopter flight)'
        ],
        summary: 'The agent learns an optimal behavior policy through trial-and-error interactions with an environment, guided only by scalar reward signals. Model-free approaches like Q-learning learn optimal action-values without knowing transition dynamics.',
        keyConcepts: [
          {
            title: 'TD-Learning vs Q-Learning',
            summary: 'Passive utility evaluation vs active off-policy control.',
            deepDive: [
              'TD(0) update: U(s) <- U(s) + alpha * [R(s) + gamma * U(s’) - U(s)].',
              'Q-Learning update: Q(s, a) <- Q(s, a) + alpha * [R(s) + gamma * max_{a’} Q(s’, a’) - Q(s, a)].',
              'Q-learning is OFF-POLICY: updates Q-values toward the greedy maximum action regardless of which exploratory action was actually taken.'
            ],
            keyFormula: {
              latex: 'Q(s, a) \\leftarrow Q(s, a) + \\alpha \\left[ r + \\gamma \\max_{a\'} Q(s\', a\') - Q(s, a) \\right]',
              description: 'Off-policy Q-Learning update rule with learning rate alpha and discount gamma.'
            },
            examTip: 'Exam core distinction: Q-learning is Off-Policy (learns Q* of optimal policy while following epsilon-greedy exploration). SARSA is On-Policy (updates using the action a’ actually chosen by current policy, making it more conservative near cliffs).'
          },
          {
            title: 'Exploration vs Exploitation',
            summary: 'The exploration dilemma in active RL.',
            deepDive: [
              'Epsilon-greedy: choose random exploratory action with probability epsilon, else greedy action with 1 - epsilon.',
              'Exploration function f(u, n): encourages visiting states with low visit counts n.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 6,
    title: 'Part VI: Communicating, Perceiving, and Acting',
    description: 'Natural Language Processing, grammars, computer vision/perception, and robotics.',
    color: '#ec4899',
    iconName: 'Eye',
    chapters: [
      {
        id: 22,
        partId: 6,
        title: 'Natural Language Processing',
        subtitle: 'N-gram language models, text classification, information retrieval, and extraction',
        pageRange: 'pp. 860–903',
        examWeight: 'High',
        sections: [
          '22.1 Language Models (Unigrams, bigrams, perplexity, smoothing)',
          '22.2 Text Classification (Bag-of-words, spam filtering, sentiment analysis)',
          '22.3 Information Retrieval (TF-IDF, PageRank, vector space models)',
          '22.4 Information Extraction (Named Entity Recognition NER, relation extraction)'
        ],
        summary: 'Probabilistic models of text and language. Language models predict probability distributions over sequences of words. Vector space models and TF-IDF power search and text classification.',
        keyConcepts: [
          {
            title: 'N-gram Models & Perplexity',
            summary: 'Markov chain approximations of sentence probability.',
            deepDive: [
              'Bigram: P(w1, ..., wn) = Product P(wi | wi-1).',
              'Perplexity: reciprocal of geometric mean probability; lower perplexity indicates superior predictive power.'
            ]
          },
          {
            title: 'TF-IDF (Term Frequency - Inverse Document Frequency)',
            summary: 'Measures how important a word is to a document within a collection.',
            deepDive: [
              'TF(t, d) = count of t in d.',
              'IDF(t, D) = log(Total documents / Documents containing t).',
              'High TF-IDF indicates a word is frequent in target document but rare across corpus (high discriminative power).'
            ]
          }
        ]
      },
      {
        id: 23,
        partId: 6,
        title: 'Natural Language for Communication',
        subtitle: 'Phrase structure grammars, syntactic parsing, CYK algorithm, and machine translation',
        pageRange: 'pp. 904–945',
        examWeight: 'Medium',
        sections: [
          '23.1 Phrase Structure Grammars (Context-Free Grammars CFG)',
          '23.2 Syntactic Analysis / Parsing (Chart parsing, CYK algorithm, PCFGs)',
          '23.3 Augmented Grammars and Semantic Interpretation',
          '23.4 Machine Translation (Statistical MT, word alignment, BLEU score)',
          '23.5 Speech Recognition (Acoustic models, phonemes)'
        ],
        summary: 'Grammars and formal syntax parse human language. Probabilistic Context-Free Grammars (PCFGs) resolve syntactic ambiguities (e.g. prepositional phrase attachment).',
        keyConcepts: [
          {
            title: 'CYK Algorithm (Cocke-Younger-Kasami)',
            summary: 'Dynamic programming parsing algorithm operating on grammars in Chomsky Normal Form (CNF) in O(n^3) time.',
            deepDive: [
              'Builds parse table bottom-up by combining smaller constituent subtrees.',
              'Guarantees polynomial-time parsing for ambiguous context-free grammars.'
            ]
          }
        ]
      },
      {
        id: 24,
        partId: 6,
        title: 'Perception',
        subtitle: 'Image formation, edge detection, object recognition, and 3D reconstruction',
        pageRange: 'pp. 946–994',
        examWeight: 'Medium',
        sections: [
          '24.1 Image Formation (Pinhole camera model, perspective projection)',
          '24.2 Early Image-Processing Operations (Convolution, edge detection, Canny edge detector)',
          '24.3 Object Recognition by Appearance (Appearance models, Haar wavelets, HOG)',
          '24.4 Reconstructing the 3D World (Stereo vision, optical flow, shape from shading)'
        ],
        summary: 'Vision converts photons into actionable representations of the 3D world. Linear spatial filtering (convolution) highlights edges, textures, and features for downstream classifiers.',
        keyConcepts: [
          {
            title: 'Convolution & Edge Detection',
            summary: 'Applying a 2D kernel filter to an image matrix to detect discontinuities in intensity (gradients).',
            deepDive: [
              'Sobel and Prewitt operators approximate image intensity derivatives.',
              'Canny Edge Detector uses Gaussian smoothing, gradient calculation, non-maximum suppression, and hysteresis thresholding.'
            ]
          }
        ]
      },
      {
        id: 25,
        partId: 6,
        title: 'Robotics',
        subtitle: 'Robot hardware, perception, motion planning, configuration space, and SLAM',
        pageRange: 'pp. 995–1043',
        examWeight: 'High',
        sections: [
          '25.1 Introduction (Sensors, effectors, degrees of freedom DOF)',
          '25.2 Robotic Perception (Localization, Monte Carlo localization, SLAM)',
          '25.3 Planning to Move (Configuration space C-space, potential fields, PRM, RRT)',
          '25.4 Robotic Software Architectures (Subsumption architecture, hybrid deliberative/reactive)'
        ],
        summary: 'Robots are physical agents that manipulate the environment. They operate in continuous, noisy, dynamic, and partially observable physical spaces using localization algorithms like Particle Filtering (Monte Carlo Localization) and simultaneous mapping (SLAM).',
        keyConcepts: [
          {
            title: 'Configuration Space (C-space) & Motion Planning',
            summary: 'Transforms a robot with physical dimensions into a single point in kinematic coordinate space.',
            deepDive: [
              'Obstacles in physical workspace are expanded into C-obstacles.',
              'Rapidly-exploring Random Trees (RRT) and Probabilistic Roadmaps (PRM) sample C-space to find collision-free paths in high DOF robots.'
            ]
          },
          {
            title: 'SLAM (Simultaneous Localization and Mapping)',
            summary: 'The chicken-and-egg problem: mapping requires knowing position, but localization requires a map! Solved via Extended Kalman Filters (EKF-SLAM) or particle filtering (FastSLAM).',
            deepDive: [
              'Joint estimation of robot pose vector and landmark locations.',
              'Loop closure detection corrects cumulative drift in trajectory estimation.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 7,
    title: 'Part VII: Conclusions',
    description: 'Philosophical foundations (Turing, Searle), ethics, safety, and the future of AI.',
    color: '#64748b',
    iconName: 'ShieldAlert',
    chapters: [
      {
        id: 26,
        partId: 7,
        title: 'Philosophical Foundations',
        subtitle: 'Weak AI, Strong AI, Chinese Room, consciousness, and the ethics of AI',
        pageRange: 'pp. 1044–1077',
        examWeight: 'Medium',
        sections: [
          '26.1 Weak AI: Can Machines Act Intelligently? (Turing test objections, Lady Lovelace objection)',
          '26.2 Strong AI: Can Machines Really Think? (Searle’s Chinese Room argument, intentionality, qualia)',
          '26.3 The Ethics and Risks of Developing Artificial Intelligence (Bias, autonomous weapons, labor displacement, superintelligence alignment)'
        ],
        summary: 'Weak AI claims machines can act as if they were intelligent. Strong AI claims a running machine brain literally has a mind. John Searle’s Chinese Room Gedankenexperiment argues syntactic symbol manipulation can never yield semantic understanding.',
        keyConcepts: [
          {
            title: 'Searle’s Chinese Room Argument',
            summary: 'A person following English lookup rules for Chinese characters produces correct responses without understanding a word of Chinese.',
            deepDive: [
              'Searle argues syntax is not sufficient for semantics; therefore formal symbol manipulation cannot produce understanding.',
              'Systems Reply: while the man inside does not understand Chinese, the entire system (man + rulebook + room) does.'
            ]
          }
        ]
      },
      {
        id: 27,
        partId: 7,
        title: 'AI: The Present and Future',
        subtitle: 'Agent components, architectures, superintelligence, and directions of AI research',
        pageRange: 'pp. 1078–1094',
        examWeight: 'Medium',
        sections: [
          '27.1 Agent Components (Sensors, knowledge bases, planners, learning loops)',
          '27.2 Agent Architectures (Unified cognitive architectures, SOAR, ACT-R)',
          '27.3 Are We Going in the Right Direction?',
          '27.4 What If AI Does Succeed? (Existential risk, value alignment, provably beneficial AI)'
        ],
        summary: 'Synthesizing all components into unified cognitive agents. Russell emphasizes that the traditional definition of AI—creating machines that optimize their own fixed objectives—must be replaced with machines that are provably beneficial, optimizing human preferences under uncertainty about what those preferences are.',
        keyConcepts: [
          {
            title: 'The Value Alignment Problem',
            summary: 'Ensuring autonomous intelligent systems pursue objectives that are beneficial to human values rather than literal misaligned goals.',
            deepDive: [
              'Inverse Reinforcement Learning (IRL): inferring underlying reward functions from human expert demonstrations.',
              'Cooperative Inverse Reinforcement Learning (CIRL): two-player game aligning machine assistance with uncertain human utility.'
            ]
          }
        ]
      }
    ]
  }
];

export const ALL_BADGES: Badge[] = [
  {
    id: 'first_quiz',
    name: 'Initiate Agent',
    description: 'Complete your first AIMA chapter quiz with a passing score.',
    icon: 'Sparkles',
    category: 'mastery',
    requirement: 'Pass 1 quiz'
  },
  {
    id: 'search_maestro',
    name: 'Search Maestro',
    description: 'Master Part II by solving Graph Search and A* problems.',
    icon: 'Compass',
    category: 'search',
    requirement: 'Pass Chapters 3, 4, 5, 6 quizzes'
  },
  {
    id: 'logic_oracle',
    name: 'Inference Engine',
    description: 'Master Propositional and First-Order Logic theorem proving.',
    icon: 'Key',
    category: 'logic',
    requirement: 'Pass Chapters 7, 8, 9 quizzes'
  },
  {
    id: 'bayesian_prophet',
    name: 'Bayesian Sage',
    description: 'Conquer uncertainty, Bayesian networks, and HMMs.',
    icon: 'Shield',
    category: 'probability',
    requirement: 'Pass Chapters 13, 14, 15 quizzes'
  },
  {
    id: 'rl_grandmaster',
    name: 'Bellman Architect',
    description: 'Master MDPs, Value Iteration, and Reinforcement Learning.',
    icon: 'Zap',
    category: 'learning',
    requirement: 'Pass Chapters 17 and 21 quizzes'
  },
  {
    id: 'streak_3',
    name: 'Consistent Deliberator',
    description: 'Maintain an active daily study streak for 3 consecutive days.',
    icon: 'Flame',
    category: 'streak',
    requirement: '3-day streak'
  },
  {
    id: 'streak_7',
    name: 'Rational Mindset',
    description: 'Maintain an active daily study streak for 7 consecutive days.',
    icon: 'Award',
    category: 'streak',
    requirement: '7-day streak'
  },
  {
    id: 'exam_ready',
    name: 'Exam Ready',
    description: 'Achieve an overall exam readiness score greater than 80%.',
    icon: 'Trophy',
    category: 'mastery',
    requirement: '80%+ exam score'
  }
];
