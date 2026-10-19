import { QuizQuestion } from '../types';

export const QUIZZES_DATA: Record<number, QuizQuestion[]> = {
  // Chapter 1: Introduction
  1: [
    {
      id: 'q1_1',
      question: 'Which definition of Artificial Intelligence is primarily adopted by Russell & Norvig throughout AIMA?',
      options: [
        'Systems that think like humans (Cognitive Modeling)',
        'Systems that act like humans (Turing Test approach)',
        'Systems that think rationally (Laws of Thought / Logicism)',
        'Systems that act rationally (Rational Agent approach)'
      ],
      correctIndex: 3,
      explanation: 'Russell & Norvig adopt the "Acting Rationally" (Rational Agent) approach. Rational behavior does not necessarily require human-like cognitive quirks or fallacies, but rather focuses on expected utility maximization based on available percepts.',
      bookReference: 'AIMA Section 1.1, pp. 4–5',
      difficulty: 'easy'
    },
    {
      id: 'q1_2',
      question: 'What is the primary difference between a "rational agent" and an "omniscient agent"?',
      options: [
        'A rational agent maximizes expected performance; an omniscient agent knows the actual future outcome.',
        'A rational agent has infinite computational power; an omniscient agent has bounded rationality.',
        'A rational agent never makes an error; an omniscient agent can fail probabilistically.',
        'There is no difference in formal decision theory.'
      ],
      correctIndex: 0,
      explanation: 'Omniscience means knowing the actual outcome of actions with 100% certainty (impossible in the real world). Rationality, by contrast, depends on maximizing EXPECTED performance given the agent\'s prior knowledge and percept sequence.',
      bookReference: 'AIMA Section 2.2, p. 38',
      difficulty: 'medium'
    },
    {
      id: 'q1_3',
      question: 'Which famous result in mathematical logic established that there are true statements in arithmetic whose truth cannot be proven by any algorithm?',
      options: [
        'Church-Turing Thesis (1936)',
        'Gödel\'s Incompleteness Theorem (1931)',
        'Cook\'s Theorem on NP-Completeness (1971)',
        'Shannon\'s Information Capacity Theorem (1948)'
      ],
      correctIndex: 1,
      explanation: 'Kurt Gödel proved that in any formal language capable of expressing basic arithmetic, there exist true statements that cannot be proved by any deductive algorithm within that system.',
      bookReference: 'AIMA Section 1.2, p. 9',
      difficulty: 'medium'
    }
  ],

  // Chapter 2: Intelligent Agents
  2: [
    {
      id: 'q2_1',
      question: 'In the PEAS framework for specifying an automated taxi driver agent, which of the following is an Actuator?',
      options: [
        'Speedometer',
        'Steering wheel / accelerator',
        'Minimizing trip duration and safety risk',
        'Pavement surface and other vehicles'
      ],
      correctIndex: 1,
      explanation: 'In PEAS: Performance = safety, trip time, profits; Environment = roads, traffic, pedestrians; Actuators = steering wheel, accelerator, brake, display; Sensors = cameras, radar, GPS, speedometer.',
      bookReference: 'AIMA Section 2.3, p. 42',
      difficulty: 'easy'
    },
    {
      id: 'q2_2',
      question: 'Why does a simple reflex agent fail in an environment that is only partially observable?',
      options: [
        'Because reflex agents lack actuators.',
        'Because reflex agents cannot execute condition-action rules.',
        'Because the agent cannot disambiguate states that share the same current percept, often causing infinite loops.',
        'Because reflex agents require infinite memory to store the percept history.'
      ],
      correctIndex: 2,
      explanation: 'A simple reflex agent selects actions based ONLY on the current percept. In a partially observable world, two radically different world states can produce identical sensor inputs, causing reflex agents to fall into infinite loops unless randomness or internal state is introduced.',
      bookReference: 'AIMA Section 2.4, p. 49',
      difficulty: 'medium'
    },
    {
      id: 'q2_3',
      question: 'Which combination of environment properties represents the most difficult challenge for designing an AI agent?',
      options: [
        'Fully observable, deterministic, episodic, static, discrete, single-agent',
        'Partially observable, stochastic, sequential, dynamic, continuous, multi-agent',
        'Fully observable, stochastic, episodic, static, continuous, single-agent',
        'Partially observable, deterministic, sequential, static, discrete, single-agent'
      ],
      correctIndex: 1,
      explanation: 'The hardest possible environment is partially observable (hidden state), stochastic (noisy transitions), sequential (actions affect future rewards), dynamic (world changes while thinking), continuous (infinite states/actions), and multi-agent (adversarial or coordinating entities).',
      bookReference: 'AIMA Section 2.3, pp. 44–46',
      difficulty: 'medium'
    }
  ],

  // Chapter 3: Solving Problems by Searching
  3: [
    {
      id: 'q3_1',
      question: 'What is the maximum space complexity of Breadth-First Search (BFS) if the branching factor is b and the shallowest goal is at depth d?',
      options: [
        'O(b * d)',
        'O(b^d)',
        'O(d^b)',
        'O(1)'
      ],
      correctIndex: 1,
      explanation: 'BFS stores every generated node in memory (in the frontier queue). At depth d, there are O(b^d) nodes in the frontier, making space—not time—the true bottleneck for BFS.',
      bookReference: 'AIMA Section 3.4.1, p. 82',
      difficulty: 'easy'
    },
    {
      id: 'q3_2',
      question: 'Under what condition is A* graph search guaranteed to return an optimal solution?',
      options: [
        'When the heuristic h(n) is admissible (h(n) <= h*(n)).',
        'When the heuristic h(n) is consistent (monotonic).',
        'When the heuristic h(n) >= h*(n) everywhere.',
        'When the step costs are all equal to 1.'
      ],
      correctIndex: 1,
      explanation: 'For tree search, admissibility is sufficient for A* optimality. But for GRAPH search (which discards repeated states once explored), the heuristic MUST be consistent (h(n) <= c(n, a, n\') + h(n\')) to guarantee that the first time a state is expanded, the path to it is already optimal.',
      bookReference: 'AIMA Section 3.5.2, pp. 94–97',
      difficulty: 'hard'
    },
    {
      id: 'q3_3',
      question: 'Suppose h1(n) and h2(n) are both admissible heuristics. Consider h3(n) = max(h1(n), h2(n)). Which of the following is true?',
      options: [
        'h3(n) is not admissible because taking the max can overestimate cost.',
        'h3(n) is admissible and dominates both h1 and h2, expanding fewer or equal nodes than either.',
        'h3(n) is admissible but expands more nodes than h1(n).',
        'h3(n) is only admissible if h1(n) = h2(n).'
      ],
      correctIndex: 1,
      explanation: 'Since both h1(n) <= h*(n) and h2(n) <= h*(n), their maximum max(h1, h2) is also <= h*(n) and therefore admissible. Since h3(n) >= h1(n) and h3(n) >= h2(n), h3 dominates both and will never expand more nodes than either.',
      bookReference: 'AIMA Section 3.6, p. 104',
      difficulty: 'medium'
    }
  ],

  // Chapter 4: Beyond Classical Search
  4: [
    {
      id: 'q4_1',
      question: 'In Simulated Annealing, what is the probability of accepting a worsening move with energy delta Delta E < 0 at temperature T?',
      options: [
        '0 (worsening moves are never accepted)',
        '1 (random walk)',
        'exp(Delta E / T)',
        '1 - exp(-T / Delta E)'
      ],
      correctIndex: 2,
      explanation: 'Simulated annealing accepts downhill moves with probability e^(Delta E / T). As temperature T decreases according to the cooling schedule, the probability of accepting worse moves gradually approaches zero.',
      bookReference: 'AIMA Section 4.1.2, p. 126',
      difficulty: 'medium'
    },
    {
      id: 'q4_2',
      question: 'What is the key advantage of Local Beam Search with k states over running k random restarts of Hill Climbing in parallel?',
      options: [
        'Local Beam Search uses less memory than random restarts.',
        'Local Beam Search shares information between threads: the k best successors are chosen globally from all successors across all k states.',
        'Local Beam Search is guaranteed to be polynomial time.',
        'Local Beam Search always finds the global optimum.'
      ],
      correctIndex: 1,
      explanation: 'In k random restarts, each hill-climbing search runs in isolation. In Local Beam Search, information is shared: states pass information to each other because the algorithm chooses the top k successors from the COMBINED pool of all successors.',
      bookReference: 'AIMA Section 4.1.3, p. 128',
      difficulty: 'medium'
    }
  ],

  // Chapter 5: Adversarial Search
  5: [
    {
      id: 'q5_1',
      question: 'How does Alpha-Beta pruning affect the minimax value computed at the root of a game tree?',
      options: [
        'It produces an approximate value within an error epsilon.',
        'It never changes the minimax value; it returns the exact same move as minimax.',
        'It can overestimate the value if the cutoff occurs too early.',
        'It only works for games with branching factor b <= 2.'
      ],
      correctIndex: 1,
      explanation: 'Alpha-Beta pruning removes branches that are provably irrelevant to the final decision. It does NOT approximate: the minimax value and optimal move returned at the root are 100% identical to full Minimax.',
      bookReference: 'AIMA Section 5.3, pp. 167–170',
      difficulty: 'medium'
    },
    {
      id: 'q5_2',
      question: 'With optimal move ordering, what is the effective time complexity of Alpha-Beta search on a tree of depth m and branching factor b?',
      options: [
        'O(b^m)',
        'O(b^(m/2))',
        'O(m^b)',
        'O(b * m)'
      ],
      correctIndex: 1,
      explanation: 'With perfect move ordering (best moves evaluated first), alpha-beta pruning evaluates O(b^(m/2)) leaf nodes instead of O(b^m). This effectively doubles the searchable depth in the same amount of CPU time.',
      bookReference: 'AIMA Section 5.3, p. 169',
      difficulty: 'hard'
    },
    {
      id: 'q5_3',
      question: 'What is the "Horizon Effect" in game-playing programs?',
      options: [
        'Running out of memory because the search tree is too broad.',
        'Postponing an unavoidable catastrophic damage by making delaying moves that push the damage just beyond the search horizon.',
        'A heuristic that prioritizes horizon nodes over interior nodes.',
        'The maximum depth reachable in 1 second.'
      ],
      correctIndex: 1,
      explanation: 'The horizon effect occurs when the program delays a serious damage (like losing a queen) by sacrificing other minor pieces, simply because the loss of the queen is pushed past the fixed depth cutoff.',
      bookReference: 'AIMA Section 5.4.2, p. 176',
      difficulty: 'hard'
    }
  ],

  // Chapter 6: Constraint Satisfaction Problems
  6: [
    {
      id: 'q6_1',
      question: 'In CSP backtracking search, what is the role of the Minimum Remaining Values (MRV) heuristic?',
      options: [
        'It picks the value that rules out the fewest options for neighboring variables.',
        'It picks the variable with the fewest legal values remaining in its domain ("Fail-First").',
        'It checks whether all binary constraints are symmetric.',
        'It guarantees zero backtracks.'
      ],
      correctIndex: 1,
      explanation: 'MRV (also called the "most constrained variable" or "fail-first" heuristic) picks the variable most likely to cause a failure quickly, pruning dead-end branches high up the tree.',
      bookReference: 'AIMA Section 6.3.1, p. 216',
      difficulty: 'medium'
    },
    {
      id: 'q6_2',
      question: 'When is a directed arc (Xi, Xj) considered arc-consistent?',
      options: [
        'If the domains of Xi and Xj have no common values.',
        'If for every value x in Domain(Xi), there exists at least one value y in Domain(Xj) that satisfies the binary constraint between Xi and Xj.',
        'If Xi and Xj are not connected by any constraint.',
        'If every value in Domain(Xi) equals a value in Domain(Xj).'
      ],
      correctIndex: 1,
      explanation: 'A variable Xi is arc-consistent with respect to Xj if for every value x in Di, there is some allowed value y in Dj that satisfies the binary constraint on arc (Xi, Xj).',
      bookReference: 'AIMA Section 6.2.2, p. 209',
      difficulty: 'medium'
    }
  ],

  // Chapter 7: Logical Agents
  7: [
    {
      id: 'q7_1',
      question: 'In propositional logic, what does KB |= alpha (entailment) strictly mean?',
      options: [
        'There exists at least one model where both KB and alpha are true.',
        'alpha is true in every model in which KB is true.',
        'alpha can be derived syntactically from KB using resolution.',
        'KB and alpha have the exact same truth table columns.'
      ],
      correctIndex: 1,
      explanation: 'Entailment (KB |= alpha) is a semantic relationship: sentence alpha is entailed by KB if and only if in every possible world (model) where KB is true, alpha is also true (M(KB) subset of M(alpha)).',
      bookReference: 'AIMA Section 7.3, p. 240',
      difficulty: 'medium'
    },
    {
      id: 'q7_2',
      question: 'How does Propositional Resolution prove that KB |= alpha?',
      options: [
        'By showing that (KB or alpha) is valid.',
        'By showing that (KB and not alpha) is unsatisfiable (deriving the empty clause).',
        'By enumerating only the truth assignments where alpha is false.',
        'By converting alpha into Horn clause format.'
      ],
      correctIndex: 1,
      explanation: 'Resolution theorem proving is a proof by contradiction (refutation): KB entails alpha if and only if (KB and not alpha) is unsatisfiable. Repeatedly applying the resolution rule to clauses until the empty clause () is derived proves the theorem.',
      bookReference: 'AIMA Section 7.5.2, p. 253',
      difficulty: 'hard'
    }
  ],

  // Chapter 13: Quantifying Uncertainty
  13: [
    {
      id: 'q13_1',
      question: 'Suppose a disease has prevalence P(D) = 0.001. A test has true positive rate P(+|D) = 0.99 and false positive rate P(+|not D) = 0.05. If a patient tests positive, what is P(D|+)?',
      options: [
        'Approximately 99%',
        'Approximately 50%',
        'Approximately 2% (0.0194)',
        'Approximately 0.1%'
      ],
      correctIndex: 2,
      explanation: 'By Bayes\' Rule: P(D|+) = [P(+|D)*P(D)] / [P(+|D)*P(D) + P(+|~D)*P(~D)] = [0.99 * 0.001] / [0.99 * 0.001 + 0.05 * 0.999] = 0.00099 / (0.00099 + 0.04995) = 0.00099 / 0.05094 ~= 0.0194 (under 2%). The low prior base rate dominates!',
      bookReference: 'AIMA Section 13.5.2, p. 497',
      difficulty: 'hard'
    },
    {
      id: 'q13_2',
      question: 'What is the definition of Conditional Independence between variables X and Y given Z?',
      options: [
        'P(X, Y) = P(X) * P(Y)',
        'P(X, Y | Z) = P(X | Z) * P(Y | Z)',
        'P(X | Y, Z) = P(Y | X, Z)',
        'P(X | Z) = P(Y | Z)'
      ],
      correctIndex: 1,
      explanation: 'X and Y are conditionally independent given Z if and only if learning Y provides no additional information about X once Z is already known: P(X|Y, Z) = P(X|Z), which equivalently factors as P(X, Y | Z) = P(X|Z) * P(Y|Z).',
      bookReference: 'AIMA Section 13.5.3, p. 498',
      difficulty: 'medium'
    }
  ],

  // Chapter 14: Probabilistic Reasoning
  14: [
    {
      id: 'q14_1',
      question: 'What nodes constitute the Markov Blanket of a node X in a Bayesian Network?',
      options: [
        'Its parents and its children only.',
        'Its parents, its children, and its children\'s other parents.',
        'All ancestor and descendant nodes in the DAG.',
        'All nodes directly adjacent to X in the moralized graph.'
      ],
      correctIndex: 1,
      explanation: 'The Markov Blanket of node X consists of: (1) its parents, (2) its children, and (3) its children\'s other parents. Conditioned on its Markov Blanket, X is conditionally independent of all other nodes in the network.',
      bookReference: 'AIMA Section 14.2.2, p. 517',
      difficulty: 'hard'
    },
    {
      id: 'q14_2',
      question: 'In a v-structure (collider) X -> Z <- Y where X and Y have no direct arc, are X and Y independent if Z is NOT observed and none of Z\'s descendants are observed?',
      options: [
        'Yes, X and Y are marginally independent (path is blocked).',
        'No, X and Y are dependent even without observing Z.',
        'They are only independent if the network is a tree.',
        'It depends on whether X and Y are continuous variables.'
      ],
      correctIndex: 0,
      explanation: 'In a collider X -> Z <- Y, if neither Z nor any of its descendants is observed, the collider blocks the path and X and Y are marginally independent. Observing Z opens the path, creating conditional dependence (explaining away).',
      bookReference: 'AIMA Section 14.2.2, p. 518',
      difficulty: 'hard'
    }
  ],

  // Chapter 15: Probabilistic Reasoning over Time
  15: [
    {
      id: 'q15_1',
      question: 'In temporal models (HMMs), what is the difference between "Filtering" and "Smoothing"?',
      options: [
        'Filtering estimates future states; Smoothing estimates current states.',
        'Filtering computes P(X_t | e_{1:t}) for the current time; Smoothing computes P(X_k | e_{1:t}) for past time k < t using subsequent evidence.',
        'Filtering is exact; Smoothing is always approximate sampling.',
        'Filtering uses Kalman filters; Smoothing only uses Viterbi.'
      ],
      correctIndex: 1,
      explanation: 'Filtering tracks current belief P(X_t | e_{1:t}) given evidence up to today. Smoothing computes past state belief P(X_k | e_{1:t}) for k < t using all evidence up to the present (hindsight estimation).',
      bookReference: 'AIMA Section 15.2, p. 570',
      difficulty: 'medium'
    },
    {
      id: 'q15_2',
      question: 'Which algorithm uses dynamic programming to find the single most likely sequence of hidden states in an HMM?',
      options: [
        'Forward-Backward algorithm',
        'Viterbi algorithm',
        'Kalman filter',
        'Gibbs sampling'
      ],
      correctIndex: 1,
      explanation: 'The Viterbi algorithm computes the most probable path (sequence of states) argmax P(x_{1:t} | e_{1:t}) by maintaining a trellis of maximum probabilities and backpointers at each time step in O(|S|^2 * T) time.',
      bookReference: 'AIMA Section 15.2.4, p. 574',
      difficulty: 'medium'
    }
  ],

  // Chapter 17: Making Complex Decisions
  17: [
    {
      id: 'q17_1',
      question: 'What is the Bellman Equation for the optimal utility U*(s) of state s in an MDP with discount factor gamma?',
      options: [
        'U*(s) = R(s) + gamma * max_a sum_{s\'} P(s\'|s, a) U*(s\')',
        'U*(s) = max_a [ R(s, a) + sum_{s\'} U*(s\') ]',
        'U*(s) = R(s) * gamma^t',
        'U*(s) = sum_a P(a|s) * R(s, a)'
      ],
      correctIndex: 0,
      explanation: 'The Bellman equation states that the utility of state s equals its immediate reward R(s) plus the discounted expected utility of the successor state under the optimal action: U*(s) = R(s) + gamma * max_a sum_{s\'} P(s\'|s, a) U*(s\').',
      bookReference: 'AIMA Section 17.2, p. 652',
      difficulty: 'medium'
    },
    {
      id: 'q17_2',
      question: 'Why does Value Iteration converge to a unique optimal set of utilities?',
      options: [
        'Because the state space is always finite.',
        'Because the Bellman backup operator is a contraction mapping with factor gamma < 1.',
        'Because rewards are strictly positive.',
        'Because the policy is updated before utilities are computed.'
      ],
      correctIndex: 1,
      explanation: 'By the contraction mapping theorem, applying the Bellman update shrinks the maximum distance between any two utility vectors by at least gamma per iteration: ||B(U) - B(V)||_inf <= gamma * ||U - V||_inf. Since gamma < 1, it is guaranteed to converge to a unique fixed point.',
      bookReference: 'AIMA Section 17.2.1, p. 654',
      difficulty: 'hard'
    }
  ],

  // Chapter 18: Learning from Examples
  18: [
    {
      id: 'q18_1',
      question: 'In Decision Tree Learning, how is Information Gain(A) of an attribute A defined?',
      options: [
        'Information Gain(A) = Entropy(Parent) - Remainder(A)',
        'Information Gain(A) = Remainder(A) / Entropy(Parent)',
        'Information Gain(A) = Gini(Parent) + Entropy(Child)',
        'Information Gain(A) = Variance(A) * Depth(Tree)'
      ],
      correctIndex: 0,
      explanation: 'Information Gain equals the reduction in entropy achieved by partitioning the dataset according to attribute A: Gain(A) = Entropy(Parent) - Remainder(A), where Remainder(A) is the weighted average entropy of the child nodes.',
      bookReference: 'AIMA Section 18.3.4, p. 704',
      difficulty: 'medium'
    },
    {
      id: 'q18_2',
      question: 'What is the "Kernel Trick" in Support Vector Machines (SVMs)?',
      options: [
        'Using linear regression to initialize weights.',
        'Replacing inner products of high-dimensional feature vectors with an efficient kernel function K(x, z) evaluated directly in the input space.',
        'Pruning nodes that do not reduce classification error.',
        'A method to eliminate support vectors that lie too close to the boundary.'
      ],
      correctIndex: 1,
      explanation: 'The kernel trick allows an SVM to find a linear maximum-margin hyperplane in a very high-dimensional (or infinite-dimensional) feature space without ever explicitly computing the transformed coordinates, computing only K(x, z) = phi(x) dot phi(z).',
      bookReference: 'AIMA Section 18.9, p. 744',
      difficulty: 'hard'
    }
  ],

  // Chapter 21: Reinforcement Learning
  21: [
    {
      id: 'q21_1',
      question: 'Why is Q-Learning classified as an "Off-Policy" reinforcement learning algorithm?',
      options: [
        'Because it does not require a policy during training.',
        'Because it learns the optimal action-value function Q* using the maximum possible next-state action max_{a\'} Q(s\', a\'), regardless of what exploratory action the agent actually executed.',
        'Because it requires an offline dataset and cannot learn in real time.',
        'Because it updates values only when an episode terminates.'
      ],
      correctIndex: 1,
      explanation: 'Q-learning is off-policy because the target value in the update rule uses max_{a\'} Q(s\', a\')—the action dictated by the greedy policy—independent of the behavioral policy (e.g., epsilon-greedy) that the agent used to choose its actual exploratory action.',
      bookReference: 'AIMA Section 21.3.2, p. 844',
      difficulty: 'hard'
    },
    {
      id: 'q21_2',
      question: 'What is the fundamental difference between Temporal-Difference (TD) learning and standard Dynamic Programming (Value Iteration)?',
      options: [
        'TD learning requires a known transition probability model P(s\'|s, a); Dynamic Programming does not.',
        'TD learning is model-free (learns directly from observed environmental transitions); Dynamic Programming requires complete knowledge of transition and reward models.',
        'TD learning cannot handle discounted rewards.',
        'Dynamic programming is only applicable to robotics.'
      ],
      correctIndex: 1,
      explanation: 'Value Iteration (Dynamic Programming) requires knowing the complete transition model P(s\'|s, a) and reward function R(s). TD learning is model-free: it samples transitions directly through experience and updates utilities toward successor state estimates.',
      bookReference: 'AIMA Section 21.2.3, p. 836',
      difficulty: 'medium'
    }
  ]
};
