import { Flashcard } from '../types';

export const FLASHCARDS_DATA: Flashcard[] = [
  {
    id: 'fc_1',
    chapterId: 1,
    partId: 1,
    category: 'Foundations',
    front: 'What are the 4 historical definitions of AI?',
    back: '1. Thinking Humanly (Cognitive Modeling)\n2. Acting Humanly (Turing Test)\n3. Thinking Rationally (Laws of Thought / Formal Logic)\n4. Acting Rationally (Rational Agents - Primary focus of AIMA)'
  },
  {
    id: 'fc_2',
    chapterId: 2,
    partId: 1,
    category: 'Agents',
    front: 'What does PEAS stand for and why is it used?',
    back: 'Performance measure, Environment, Actuators, Sensors.\nIt is the mandatory first formal step in specifying an intelligent agent before selecting an architecture or algorithm.'
  },
  {
    id: 'fc_3',
    chapterId: 2,
    partId: 1,
    category: 'Agents',
    front: 'What are the 5 core agent architectures in AIMA?',
    back: '1. Simple Reflex Agent\n2. Model-Based Reflex Agent (maintains internal state)\n3. Goal-Based Agent (search & planning)\n4. Utility-Based Agent (trade-offs under uncertainty)\n5. Learning Agent (critic, learning element, performance element, problem generator)'
  },
  {
    id: 'fc_4',
    chapterId: 3,
    partId: 2,
    category: 'Search',
    front: 'What is an Admissible Heuristic vs a Consistent Heuristic?',
    back: 'Admissible: h(n) <= h*(n). Never overestimates true cost to goal. Guarantees optimality in Tree Search.\nConsistent: h(n) <= c(n, a, n\') + h(n\'). Satisfies triangle inequality. Guarantees optimality in Graph Search without reopening closed nodes.',
    formula: 'h(n) <= c(n, a, n\') + h(n\')'
  },
  {
    id: 'fc_5',
    chapterId: 3,
    partId: 2,
    category: 'Search',
    front: 'Why is Iterative Deepening Search (IDS) often preferred over BFS and DFS?',
    back: 'IDS combines the memory efficiency of DFS (O(bd) linear space) with the completeness and shallow-goal optimality of BFS (O(b^d) time).'
  },
  {
    id: 'fc_6',
    chapterId: 5,
    partId: 2,
    category: 'Games',
    front: 'What is the Alpha-Beta pruning condition at a MIN node?',
    back: 'Prune when v <= alpha, where alpha is the highest-value choice found so far along any path for MAX. MAX already has a better choice elsewhere and will never allow this branch to be chosen.',
    formula: 'v <= \\alpha \\implies \\text{Prune branch}'
  },
  {
    id: 'fc_7',
    chapterId: 6,
    partId: 2,
    category: 'CSP',
    front: 'Explain MRV and LCV heuristics in CSPs.',
    back: 'MRV (Minimum Remaining Values): Pick the variable with the FEWEST legal values remaining ("Fail-First" to prune dead ends early).\nLCV (Least Constraining Value): Pick the value that rules out the FEWEST values in neighboring variables ("Fail-Last" to leave maximum flexibility).'
  },
  {
    id: 'fc_8',
    chapterId: 7,
    partId: 3,
    category: 'Logic',
    front: 'How is Propositional Resolution used for theorem proving?',
    back: 'Proof by refutation (contradiction): To prove KB |= alpha, convert (KB and not alpha) to CNF and repeatedly resolve clauses until the empty clause () is derived, indicating a contradiction.'
  },
  {
    id: 'fc_9',
    chapterId: 13,
    partId: 4,
    category: 'Probability',
    front: 'State Bayes’ Rule with the normalization constant alpha.',
    back: 'P(Cause | Effect) = alpha * P(Effect | Cause) * P(Cause)\nAllows inverting causal knowledge (diagnostic reasoning).',
    formula: 'P(Y \\mid X) = \\alpha P(X \\mid Y) P(Y)'
  },
  {
    id: 'fc_10',
    chapterId: 14,
    partId: 4,
    category: 'Bayes Nets',
    front: 'What is the Markov Blanket of a variable in a Bayesian Network?',
    back: 'Its parents, its children, and its children’s other parents. Conditioned on its Markov Blanket, a node is conditionally independent of all other nodes in the network.'
  },
  {
    id: 'fc_11',
    chapterId: 17,
    partId: 4,
    category: 'MDPs',
    front: 'State the Bellman Equation for optimal state utility U*(s).',
    back: 'U*(s) = R(s) + gamma * max_a sum_{s\'} P(s\'|s, a) * U*(s\')\nThe utility of a state is the immediate reward plus the discounted expected utility of the next state under optimal action.',
    formula: 'U^*(s) = R(s) + \\gamma \\max_{a} \\sum_{s\'} P(s\' \\mid s, a) U^*(s\')'
  },
  {
    id: 'fc_12',
    chapterId: 21,
    partId: 5,
    category: 'Reinforcement Learning',
    front: 'What is the Q-Learning update rule and why is it Off-Policy?',
    back: 'Q(s, a) <- Q(s, a) + alpha * [r + gamma * max_{a\'} Q(s\', a\') - Q(s, a)]\nIt is off-policy because the target uses the maximum greedy action max_{a\'} Q(s\', a\'), regardless of which exploratory action the agent actually executed.',
    formula: 'Q(s, a) \\leftarrow Q(s, a) + \\alpha [r + \\gamma \\max_{a\'} Q(s\', a\') - Q(s, a)]'
  }
];
