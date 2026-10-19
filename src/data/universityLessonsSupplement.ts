import { DetailedLesson, LessonStep, AIMA_DETAILED_LESSONS } from './aimaLessonsData';
import { AIMA_PARTS } from './aimaBookData';

// ============================================================================
// UNIVERSITY-GRADE EXTENSIONS FOR ARTIFICIAL INTELLIGENCE COURSEWARE
// Benchmark: UC Berkeley CS188, Stanford CS221, MIT 6.034/6.036, CMU 15-381
// ============================================================================

export interface FormalProof {
  theorem: string;
  statement: string;
  assumptions: string[];
  proofSteps: string[];
  conclusion: string;
}

export interface WorkedProblem {
  title: string;
  problemStatement: string;
  givenData: Record<string, string>;
  steps: {
    stepNumber: number;
    action: string;
    formula?: string;
    calculation: string;
    result: string;
  }[];
  finalAnswer: string;
  examTakeaway: string;
}

export interface PythonImplementation {
  title: string;
  code: string;
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface UniversityEnrichment {
  proof?: FormalProof;
  workedProblem?: WorkedProblem;
  pythonCode?: PythonImplementation;
  midtermTraps?: { trap: string; counterexampleOrProof: string }[];
}

// ----------------------------------------------------------------------------
// UNIVERSITY LESSONS FOR CHAPTERS 15, 16, 17, 21 & COMPREHENSIVE CURRICULUM
// ----------------------------------------------------------------------------

export const UNIVERSITY_SUPPLEMENTAL_LESSONS: Record<number, DetailedLesson> = {
  // ==========================================================================
  // CHAPTER 15 — Probabilistic Reasoning over Time (HMMs & Temporal Models)
  // AIMA pp. 559–599
  // ==========================================================================
  15: {
    chapterId: 15,
    partId: 4,
    topicId: 'temporal-models-hmm',
    title: 'Probabilistic Reasoning over Time',
    subtitle: 'Markov models, Hidden Markov Models (HMMs), Filtering, and the Viterbi Algorithm',
    estimatedMinutes: 70,
    bookPages: 'AIMA Ch. 15, pp. 559–599',
    xpReward: 85,
    steps: [
      {
        stepNumber: 1,
        title: 'Stationary Processes & Markov Assumptions',
        subtitle: 'Transition model, sensor model, and first-order Markov independence',
        conceptType: 'math',
        visualType: 'belief_state',
        contentMarkdown: `### The Temporal World
In static worlds, probabilities remain fixed. In a **dynamic world**, state evolves over discrete time slices $t = 0, 1, 2, \\dots$.

At each time step:
- $X_t$: set of unobservable state variables at time $t$
- $E_t$: set of observable evidence variables at time $t$
- $e_{1:t} = (e_1, e_2, \\dots, e_t)$: history of evidence up to current time $t$

### The First-Order Markov Assumption
The future state depends **only on the current state**, not on past history:
$$\\mathbf{P}(X_t \\mid X_{0:t-1}) = \\mathbf{P}(X_t \\mid X_{t-1})$$

### The Sensor (Observation) Markov Assumption
Current evidence depends **only on the current state**:
$$\\mathbf{P}(E_t \\mid X_{0:t}, E_{1:t-1}) = \\mathbf{P}(E_t \\mid X_t)$$

### Stationary Process Assumption
The laws governing state transitions and sensor readings do not drift over time:
- $\\mathbf{P}(X_t \\mid X_{t-1})$ is identical for all $t$.
- $\\mathbf{P}(E_t \\mid X_t)$ is identical for all $t$.

Together, these allow representing an infinitely long temporal process using only two compact probability matrices!`,
        mathBlock: {
          formula: 'P(X_{0:t}, E_{1:t}) = P(X_0) \\prod_{i=1}^t P(X_i \\mid X_{i-1}) P(E_i \\mid X_i)',
          explanation: 'The full joint distribution of a temporal Markov model factors completely into the prior, transition model, and sensor model.'
        },
        keyPoints: [
          'Markov property: current state d-separates the past from the future',
          'Stationary assumption keeps model parameters constant across all time slices',
          'Complete temporal model requires only: Prior P(X₀), Transition P(X_t|X_{t-1}), Sensor P(E_t|X_t)'
        ]
      },
      {
        stepNumber: 2,
        title: 'The Four Fundamental Temporal Inference Tasks',
        subtitle: 'Filtering, Prediction, Smoothing, and Most Likely Explanation',
        conceptType: 'algorithm',
        visualType: 'belief_state',
        contentMarkdown: `### The 4 Core Temporal Inference Tasks

| Task | Formal Query | Practical Example | Time Complexity |
|---|---|---|---|
| **Filtering (Tracking)** | $\\mathbf{P}(X_t \\mid e_{1:t})$ | Tracking a self-driving car's position right now | $O(|S|^2)$ per step |
| **Prediction** | $\\mathbf{P}(X_{t+k} \\mid e_{1:t}), k > 0$ | Forecasting tomorrow's weather given history | $O(k |S|^2)$ |
| **Smoothing (Hindsight)** | $\\mathbf{P}(X_k \\mid e_{1:t}), 0 \\le k < t$ | Post-flight black-box flight recorder analysis | $O(t |S|^2)$ |
| **Most Likely Sequence** | $\\arg\\max_{x_{1:t}} P(x_{1:t} \\mid e_{1:t})$ | Speech recognition / DNA gene sequencing (Viterbi) | $O(t |S|^2)$ |

### The Recursive Filtering Equation
Filtering is the workhorse of robotics and perception:
$$\\mathbf{P}(X_{t+1} \\mid e_{1:t+1}) = \\alpha \\underbrace{\\mathbf{P}(e_{t+1} \\mid X_{t+1})}_{\\text{Sensor Update}} \\sum_{x_t} \\underbrace{\\mathbf{P}(X_{t+1} \\mid x_t)}_{\\text{Transition Update}} \\underbrace{P(x_t \\mid e_{1:t})}_{\\text{Prior Belief at } t}$$
where $\\alpha = 1 / P(e_{t+1} \\mid e_{1:t})$ is the normalization constant.`,
        mathBlock: {
          formula: 'f_{1:t+1} = \\alpha \\cdot \\text{FORWARD}(f_{1:t}, e_{t+1})',
          explanation: 'Forward recursive step in HMM filtering, updating the belief vector in constant memory O(|S|).'
        },
        keyPoints: [
          'Filtering is online and recursive: belief state at t+1 computed directly from belief state at t',
          'Smoothing uses future evidence to refine past estimates (always has lower or equal variance than filtering)',
          'Prediction degrades to the stationary distribution as horizon k → ∞'
        ]
      },
      {
        stepNumber: 3,
        title: 'The Viterbi Algorithm & Trellis Decoding',
        subtitle: 'Dynamic programming for finding the optimal sequence of hidden states',
        conceptType: 'algorithm',
        visualType: 'search_tree',
        contentMarkdown: `### The Most Likely Explanation vs Independent Filtering
**Crucial Distinction**: Finding the sequence of most likely states $\\arg\\max_{x_k} P(X_k \\mid e_{1:t})$ at each time step is **NOT** the same as finding the **most likely sequence** $\\arg\\max_{x_{1:t}} P(x_{1:t} \\mid e_{1:t})$.
The sequence of pointwise maximums might even have zero transition probability ($P(x_{t+1} \\mid x_t) = 0$)!

### The Viterbi Recurrence
Let $m_t[j]$ be the probability of the most likely path reaching state $j$ at time $t$ given evidence $e_{1:t}$:
$$\\boxed{m_t[j] = P(e_t \\mid X_t = j) \\cdot \\max_{i} \\left( P(X_t = j \\mid X_{t-1} = i) \\cdot m_{t-1}[i] \\right)}$$

### Backpointers
To recover the actual sequence (not just its probability), maintain backpointers:
$$b_t[j] = \\arg\\max_{i} \\left( P(X_t = j \\mid X_{t-1} = i) \\cdot m_{t-1}[i] \\right)$$

At time $T$, pick $x_T^* = \\arg\\max_j m_T[j]$, and trace backward: $x_{t-1}^* = b_t[x_t^*]$.`,
        keyPoints: [
          'Viterbi avoids exponential search (O(|S|^T)) by pruning sub-optimal prefixes in O(T · |S|²)',
          'Operates in log-space in practice to prevent floating-point underflow',
          'Foundation of modern cellular communications (Viterbi decoding) and speech recognition'
        ]
      }
    ],
    quiz: [
      {
        question: 'In a Hidden Markov Model, why does the most likely sequence of states NOT equal the sequence of individually most likely states?',
        options: [
          'Because the Viterbi algorithm uses approximation sampling instead of exact inference',
          'Because individual smoothing ignores transition constraints, which could result in a sequence with zero transition probability P(x_{t+1}|x_t) = 0',
          'Because the Markov assumption only holds backwards in time',
          'Because filtering has higher computational complexity than the Viterbi algorithm'
        ],
        correctIndex: 1,
        explanation: 'Individually maximizing P(X_t | e_{1:T}) at each step can easily select states x_t and x_{t+1} between which no legal transition exists (P(x_{t+1}|x_t) = 0). Viterbi guarantees a globally valid joint trajectory maximizing P(x_{1:T} | e_{1:T}).',
        difficulty: 'hard'
      }
    ]
  },

  // ==========================================================================
  // CHAPTER 16 — Making Simple Decisions (Utility Theory & VPI)
  // AIMA pp. 600–644
  // ==========================================================================
  16: {
    chapterId: 16,
    partId: 4,
    topicId: 'utility-theory-vpi',
    title: 'Making Simple Decisions',
    subtitle: 'Utility axioms, Maximum Expected Utility (MEU), and Value of Perfect Information (VPI)',
    estimatedMinutes: 50,
    bookPages: 'AIMA Ch. 16, pp. 600–644',
    xpReward: 75,
    steps: [
      {
        stepNumber: 1,
        title: 'Axioms of Utility & The MEU Principle',
        subtitle: 'von Neumann-Morgenstern utility theorem and preference rationality',
        conceptType: 'math',
        visualType: 'decision_boundary',
        contentMarkdown: `### Preferences and Lotteries
Let $A \\succ B$ denote that an agent prefers outcome $A$ over $B$, and $A \\sim B$ denote indifference.
A **lottery** $L = [p, A; (1-p), B]$ yields prize $A$ with probability $p$ and $B$ with probability $(1-p)$.

### The 6 von Neumann-Morgenstern (VNM) Axioms
Rational preferences must obey:
1. **Orderability**: Exactly one of $(A \\succ B)$, $(B \\succ A)$, or $(A \\sim B)$ holds.
2. **Transitivity**: $(A \\succ B) \\land (B \\succ C) \\implies (A \\succ C)$.
3. **Continuity**: If $A \\succ B \\succ C$, there exists $p \\in [0, 1]$ such that $[p, A; (1-p), C] \\sim B$.
4. **Substitutability**: If $A \\sim B$, then for any $C$ and $p$, $[p, A; (1-p), C] \\sim [p, B; (1-p), C]$.
5. **Monotonicity**: If $A \\succ B$, then $[p, A; (1-p), B] \\succ [q, A; (1-q), B]$ if and only if $p > q$.
6. **Decomposability**: Compound lotteries can be reduced by the laws of probability.

### Principle of Maximum Expected Utility (MEU)
A rational agent faced with uncertainty must choose the action $a^*$ that maximizes expected utility:
$$\\boxed{a^* = \\arg\\max_{a} \\sum_{s'} P(\\text{Result}(a) = s') \\cdot U(s')}$$`,
        mathBlock: {
          formula: 'EU(a) = \\sum_{s\'} P(\\text{Result}(a) = s\' \\mid a, e) U(s\')',
          explanation: 'Expected Utility equation: weighting the utility of each reachable future world by its posterior probability.'
        },
        keyPoints: [
          'VNM Theorem: If an agent satisfies the 6 axioms, there exists a real-valued utility function U unique up to positive affine transformation',
          'Money ≠ Utility: diminishing marginal utility explains risk aversion',
          'A rational agent acts as if maximizing expected utility'
        ]
      },
      {
        stepNumber: 2,
        title: 'Value of Perfect Information (VPI)',
        subtitle: 'Quantifying the economic value of evidence before making a decision',
        conceptType: 'math',
        visualType: 'decision_boundary',
        contentMarkdown: `### When is Information Worth Paying For?
Before executing an action, should the agent buy a sensor measurement or consult an expert?

Let current evidence be $e$, current optimal action $\\alpha$, and current expected utility:
$$EU(\\alpha \\mid e) = \\max_a \\sum_{s'} P(s' \\mid a, e) U(s')$$

If we observe variable $E_j$, having possible values $e_{jk}$:
- With $E_j = e_{jk}$ observed, the agent picks action $\\alpha_{e_{jk}}$ with expected utility $EU(\\alpha_{e_{jk}} \\mid e, e_{jk})$.
- But before observing $E_j$, its outcome is uncertain, weighted by $P(E_j = e_{jk} \\mid e)$.

### The VPI Formula
$$\\boxed{\\text{VPI}(E_j) = \\left( \\sum_{k} P(E_j = e_{jk} \\mid e) \\cdot EU(\\alpha_{e_{jk}} \\mid e, e_{jk}) \\right) - EU(\\alpha \\mid e)}$$

### Fundamental Properties of VPI (University Exam Core)
1. **Non-negativity**: $\\text{VPI}(E_j) \\ge 0$ always! Information can never harm expected utility on average.
2. **Non-additivity**: $\\text{VPI}(E_j, E_k) \\ne \\text{VPI}(E_j) + \\text{VPI}(E_k)$ in general (information can be redundant or synergistic).
3. **Order-independence**: The total value of observing multiple independent variables does not depend on the order of disclosure.`,
        keyPoints: [
          'VPI >= 0: Rational agents never pay to avoid free information',
          'VPI = 0 when the new information would never change the chosen action in any outcome',
          'An agent should acquire evidence E_j whenever Cost(E_j) < VPI(E_j)'
        ]
      }
    ],
    quiz: [
      {
        question: 'Under what exact condition is the Value of Perfect Information VPI(E_j) equal to zero?',
        options: [
          'When the evidence variable E_j is conditionally independent of all parent nodes',
          'When the optimal action chosen given evidence E_j = e_{jk} is identical to the current optimal action for ALL possible outcomes e_{jk}',
          'When the cost of the sensor exceeds the maximum possible utility',
          'When the agent is strictly risk-seeking'
        ],
        correctIndex: 1,
        explanation: 'If the new information will not change the chosen action regardless of what value E_j takes, then EU(alpha_{e_{jk}} | e, e_{jk}) = EU(alpha | e, e_{jk}), and the expected gain is exactly zero.',
        difficulty: 'medium'
      }
    ]
  },

  // ==========================================================================
  // CHAPTER 17 — Making Complex Decisions (MDPs & Bellman Equations)
  // AIMA pp. 645–692
  // ==========================================================================
  17: {
    chapterId: 17,
    partId: 4,
    topicId: 'mdps-bellman',
    title: 'Making Complex Decisions (MDPs)',
    subtitle: 'Markov Decision Processes, Bellman Optimality, Value Iteration, and Policy Iteration',
    estimatedMinutes: 80,
    bookPages: 'AIMA Ch. 17, pp. 645–692',
    xpReward: 90,
    steps: [
      {
        stepNumber: 1,
        title: 'Markov Decision Processes (MDP) Formulation',
        subtitle: 'The 5-tuple defining sequential decision making under uncertainty',
        conceptType: 'math',
        visualType: 'search_tree',
        contentMarkdown: `### The MDP Formal 5-Tuple $(S, A, P, R, \\gamma)$
A sequential decision problem in a stochastic, fully observable environment is defined by:

1. **State Space $S$**: Set of states the agent can occupy.
2. **Action Space $A(s)$**: Set of legal actions in state $s$.
3. **Transition Model $P(s' \\mid s, a)$**: Probability of transitioning to state $s'$ given action $a$ in $s$.
4. **Reward Function $R(s)$ or $R(s, a, s')$**: Immediate real-valued reward received.
5. **Discount Factor $\\gamma \\in [0, 1)$**: Factor modeling preference for immediate over delayed rewards:
$$U([s_0, s_1, s_2, \\dots]) = \\sum_{t=0}^{\\infty} \\gamma^t R(s_t)$$

### Policy and Value
- **Policy $\\pi(s)$**: A mapping from every state $s \\in S$ to an action $a \\in A(s)$.
- **Optimal Policy $\\pi^*(s)$**: The policy that maximizes expected discounted utility from state $s$.
- **Stationary Policy**: A policy that depends only on the state $s$, independent of time step $t$.`,
        mathBlock: {
          formula: 'U^\\pi(s) = \\mathbb{E}\\left[ \\sum_{t=0}^\\infty \\gamma^t R(s_t) \\;\\Bigg|\\; s_0 = s, \\pi \\right]',
          explanation: 'The expected discounted sum of rewards when starting in state s and following policy pi thereafter.'
        },
        keyPoints: [
          'Discount factor gamma < 1 guarantees utility remains finite in infinite-horizon MDPs: max U <= R_max / (1 - gamma)',
          'Because transition is Markovian, the optimal policy is stationary: pi*(s) depends only on current state s'
        ]
      },
      {
        stepNumber: 2,
        title: 'The Bellman Equations',
        subtitle: 'Bellman Expectation and Bellman Optimality recurrences',
        conceptType: 'math',
        visualType: 'search_tree',
        contentMarkdown: `### The Bellman Optimality Equation
The utility of a state under the optimal policy is the immediate reward plus the discounted expected utility of the successor state, **assuming the agent acts optimally from then on**:

$$\\boxed{U^*(s) = R(s) + \\gamma \\max_{a \\in A(s)} \\sum_{s'} P(s' \\mid s, a) \\cdot U^*(s')}$$

Notice that for $|S|$ states, this yields a system of $|S|$ simultaneous non-linear equations (due to the $\\max$ operator). We cannot solve them directly with linear algebra!

### Optimal Policy Extraction
Once optimal utilities $U^*(s)$ are known, the optimal policy $\\pi^*(s)$ is obtained by a one-step greedy lookahead:
$$\\boxed{\\pi^*(s) = \\arg\\max_{a \\in A(s)} \\sum_{s'} P(s' \\mid s, a) \\cdot U^*(s')}$$`,
        mathBlock: {
          formula: 'U_{i+1}(s) \\leftarrow R(s) + \\gamma \\max_{a} \\sum_{s\'} P(s\' \\mid s, a) U_i(s\')',
          explanation: 'Value Iteration backup update rule applied synchronously to all states in each pass.'
        },
        keyPoints: [
          'Bellman equation is non-linear because of the max operator',
          'Value Iteration applies the Bellman backup iteratively until convergence',
          'Policy extraction requires only a 1-step lookahead using the learned utilities'
        ]
      },
      {
        stepNumber: 3,
        title: 'Value Iteration vs Policy Iteration',
        subtitle: 'Contraction mapping theorem, convergence, and solving linear systems',
        conceptType: 'algorithm',
        visualType: 'search_tree',
        contentMarkdown: `### Comparison of the Two Algorithms

| Property | Value Iteration | Policy Iteration |
|---|---|---|
| **Core Idea** | Updates state utilities iteratively via Bellman backup | Alternates Policy Evaluation and Policy Improvement |
| **Inner Step** | $O(|A| \\cdot |S|^2)$ per pass | Solves linear system $O(|S|^3)$ or modified iterative evaluation |
| **Iteration Count** | Slower numerical convergence ($O(\\log(1/\\epsilon) / (1-\\gamma))$) | Very fast policy convergence (often < 10 iterations) |
| **Policy Optimal?** | Policy often becomes optimal long before $U(s)$ converges! | Directly guarantees policy optimality when $\\pi_{i+1} = \\pi_i$ |

### Policy Iteration Steps
1. **Policy Evaluation**: For fixed policy $\\pi_i$, the $\\max$ operator disappears! We solve $|S|$ **linear equations**:
$$U_i(s) = R(s) + \\gamma \\sum_{s'} P(s' \\mid s, \\pi_i(s)) U_i(s')$$
2. **Policy Improvement**: Update policy greedily using current utilities:
$$\\pi_{i+1}(s) = \\arg\\max_a \\sum_{s'} P(s' \\mid s, a) U_i(s')$$
3. **Termination**: If $\\pi_{i+1} = \\pi_i$ for all states, STOP. The policy is optimal!`,
        keyPoints: [
          'Policy Iteration converges faster in practice because the discrete policy space (|A|^|S|) is finite',
          'Contraction Mapping: ||B(U) - B(V)||_inf <= gamma ||U - V||_inf guarantees unique fixed point for Value Iteration',
          'Stopping criterion for Value Iteration: if ||U_{i+1} - U_i||_inf < epsilon(1 - gamma)/gamma, error ||U_i - U*||_inf < epsilon'
        ]
      }
    ],
    quiz: [
      {
        question: 'Why does Policy Iteration frequently terminate in far fewer iterations than Value Iteration?',
        options: [
          'Because Policy Iteration avoids evaluating transitions',
          'Because the discrete space of policies is finite, and policies typically become optimal long before the continuous utility values numerically converge',
          'Because Policy Iteration uses heuristic estimates like A*',
          'Because the discount factor gamma is set to 1 in Policy Iteration'
        ],
        correctIndex: 1,
        explanation: 'There are only |A|^|S| distinct policies. The policy choice depends only on the relative ordering of action values, which stabilizes very quickly—long before the numerical utility vector converges to within an epsilon tolerance.',
        difficulty: 'hard'
      }
    ]
  },

  // ==========================================================================
  // CHAPTER 21 — Reinforcement Learning
  // AIMA pp. 830–860
  // ==========================================================================
  21: {
    chapterId: 21,
    partId: 5,
    topicId: 'reinforcement-learning',
    title: 'Reinforcement Learning',
    subtitle: 'Model-free control, Temporal Difference TD(0), Q-Learning, and SARSA',
    estimatedMinutes: 85,
    bookPages: 'AIMA Ch. 21, pp. 830–860',
    xpReward: 95,
    steps: [
      {
        stepNumber: 1,
        title: 'The Reinforcement Learning Paradigm',
        subtitle: 'Passive vs active learning, model-based vs model-free methods',
        conceptType: 'intuition',
        visualType: 'neural_net_overview',
        contentMarkdown: `### Learning Without a Teacher
In standard supervised learning, the agent is given $(x, y)$ input-target pairs.
In **Reinforcement Learning (RL)**, the agent receives **only sparse reward signals** $R(s)$ from the environment:
- No explicit transition model $P(s' \\mid s, a)$ is provided beforehand.
- The agent must balance **Exploration** (trying unknown actions to find better rewards) and **Exploitation** (taking known high-reward actions).

### Core Taxonomy of RL

| Dimension | Option A | Option B |
|---|---|---|
| **Environment Model** | **Model-Based**: Learns $\\hat{P}(s' \\mid s, a)$ and $\\hat{R}$, then runs Value Iteration | **Model-Free**: Learns action values $Q(s, a)$ directly without building an explicit transition model |
| **Target Policy** | **On-Policy (SARSA)**: Learns value of policy being executed, including its exploratory mistakes | **Off-Policy (Q-Learning)**: Learns value of optimal policy $\\pi^*$ while executing an exploratory policy |
| **Agent Autonomy** | **Passive**: Policy $\\pi$ is fixed; agent only evaluates utilities | **Active**: Agent chooses actions to improve its own policy |`,
        keyPoints: [
          'Model-Free RL is memory-efficient: it avoids storing an |S|² × |A| transition tensor',
          'Credit Assignment Problem: rewards may arrive hundreds of steps after the decisive action',
          'Exploration-Exploitation tradeoff: pure exploitation leads to sub-optimal local traps'
        ]
      },
      {
        stepNumber: 2,
        title: 'Temporal Difference Learning: TD(0)',
        subtitle: 'Bootstrapping utility estimates from subsequent state estimates',
        conceptType: 'algorithm',
        visualType: 'search_tree',
        contentMarkdown: `### The Temporal Difference Principle
When transition $(s, a, r, s')$ is observed, the observed sample estimate of $s$'s utility is:
$$\\text{Sample} = r + \\gamma V(s')$$

The difference between the sample estimate and the current utility estimate is the **TD Error**:
$$\\delta_t = \\underbrace{r + \\gamma V(s')}_{\\text{Target}} - \\underbrace{V(s)}_{\\text{Current Estimate}}$$

### TD(0) Update Rule
$$\\boxed{V(s) \\leftarrow V(s) + \\alpha \\left( r + \\gamma V(s') - V(s) \\right)}$$
where $\\alpha \\in (0, 1]$ is the learning rate.

### TD vs Monte Carlo (MC)
- **Monte Carlo**: Waits until episode completion, then updates $V(s)$ using actual return $G_t$. Zero bias, high variance.
- **TD(0)**: Updates immediately at the very next step by **bootstrapping** from $V(s')$. Mild bias initially, but **much lower variance** and works online in continuing tasks!`,
        mathBlock: {
          formula: 'V(s) \\leftarrow (1 - \\alpha) V(s) + \\alpha (r + \\gamma V(s\'))',
          explanation: 'TD(0) computes an exponentially decaying moving average of bootstrapped returns.'
        },
        keyPoints: [
          'TD(0) updates states immediately without waiting for episode termination',
          'Convergence theorem (Robbins-Monro): converges to true utilities if sum(alpha_t) = inf and sum(alpha_t^2) < inf'
        ]
      },
      {
        stepNumber: 3,
        title: 'Q-Learning & SARSA',
        subtitle: 'Off-policy vs on-policy temporal difference control',
        conceptType: 'algorithm',
        visualType: 'neural_net_overview',
        contentMarkdown: `### Q-Learning (Off-Policy TD Control) ⭐
Discovered by Chris Watkins (1989). Learns the quality function $Q(s, a)$ for state-action pairs:

$$\\boxed{Q(s, a) \\leftarrow Q(s, a) + \\alpha \\left[ r + \\gamma \\max_{a'} Q(s', a') - Q(s, a) \\right]}$$

**Why Off-Policy?** The target uses $\\max_{a'} Q(s', a')$—the best action according to the greedy policy—regardless of what exploratory action the agent actually selects in state $s'$!

### SARSA (On-Policy TD Control)
Name comes from tuple: $(s, a, r, s', a')$. Updates using the action $a'$ actually chosen by current policy:

$$\\boxed{Q(s, a) \\leftarrow Q(s, a) + \\alpha \\left[ r + \\gamma Q(s', a') - Q(s, a) \\right]}$$

### Critical University Exam Difference: The Cliff Walking Problem
- In a gridworld with a cliff along the edge:
  - **Q-Learning** learns the optimal dangerous path hugging the cliff (because it assumes greedy action at test time).
  - **SARSA** learns the safe detour path away from the cliff (because during training, $\\varepsilon$-greedy exploration occasionally falls off the cliff, and SARSA accounts for its own exploratory mistakes!).`,
        keyPoints: [
          'Q-Learning converges to Q* regardless of exploration policy (provided all state-actions are visited infinitely often)',
          'SARSA is safer during online training in real robots where falling off cliffs destroys hardware',
          'Epsilon-greedy exploration: with probability 1 - eps pick argmax Q(s,a); with probability eps pick uniform random action'
        ]
      }
    ],
    quiz: [
      {
        question: 'Why does Q-Learning converge to the optimal policy even if the agent acts completely randomly (uniform random exploration)?',
        options: [
          'Because random exploration eliminates bias in the transition probability tensor',
          'Because Q-learning is off-policy: the update target always uses the greedy maximum max_{a\'} Q(s\', a\') regardless of what action was actually taken',
          'Because the discount factor gamma converges to 1 under random walks',
          'Because random exploration reduces variance to zero'
        ],
        correctIndex: 1,
        explanation: 'Q-learning updates Q(s, a) toward r + gamma * max_{a\'} Q(s\', a\'). The max operator directly approximates the Bellman optimality equation for the optimal policy, making the learning rule independent of the exploratory behavioral policy (as long as all pairs continue to be visited).',
        difficulty: 'hard'
      }
    ]
  }
};

// ----------------------------------------------------------------------------
// FORMAL PROOFS, WORKED PROBLEMS & PYTHON CODE FOR UNIVERSITY RIGOR
// ----------------------------------------------------------------------------

export const UNIVERSITY_ENRICHMENTS: Record<number, UniversityEnrichment> = {
  // CHAPTER 3: Search (A* Tree-Search Optimality Proof & Python Code)
  3: {
    proof: {
      theorem: 'Optimality of A* Tree-Search with Admissible Heuristics',
      statement: 'If the heuristic function h(n) is admissible (h(n) ≤ h*(n) for all n), A* tree-search is guaranteed to return an optimal solution.',
      assumptions: [
        'h(n) is admissible: h(n) ≤ h*(n) where h*(n) is the true optimal cost from n to goal.',
        'Step costs are strictly positive: c(n, a, n\') ≥ ε > 0.',
        'Branching factor b is finite.'
      ],
      proofSteps: [
        'Let C* be the cost of the optimal solution path, and let G be an optimal goal state (so f(G) = g(G) = C* since h(G) = 0).',
        'Suppose for contradiction that A* terminates and selects a sub-optimal goal state G2 from the frontier, where g(G2) > C*.',
        'Since G2 is a goal state, h(G2) = 0, so f(G2) = g(G2) + h(G2) = g(G2) > C*.',
        'Now consider any unexpanded node n on the frontier that lies along the true optimal path to G.',
        'By definition, f(n) = g(n) + h(n). Since h is admissible, h(n) ≤ h*(n), so: f(n) ≤ g(n) + h*(n) = C*.',
        'Combining the inequalities: f(n) ≤ C* < f(G2).',
        'Since A* expands the node with minimum f-value on the frontier, node n must be selected before G2.',
        'This holds for all nodes on the optimal path up to and including optimal goal G.',
        'Therefore, G2 cannot be selected before G, contradicting our initial assumption. A* must return an optimal solution. Q.E.D.'
      ],
      conclusion: 'A* tree-search is guaranteed to find an optimal solution path whenever h(n) is admissible.'
    },
    workedProblem: {
      title: 'A* Execution Trace on Romania Map (Arad to Bucharest)',
      problemStatement: 'Trace A* search from Arad to Bucharest using straight-line distance (SLD) heuristics. Identify node expansions, g(n), h(n), and f(n) values.',
      givenData: {
        'SLD to Bucharest': 'Arad: 366, Sibiu: 253, Timisoara: 329, Zerind: 374, Fagaras: 176, Rimnicu Vilcea: 193, Pitesti: 100, Bucharest: 0',
        'Step costs': 'Arad-Sibiu: 140, Arad-Timisoara: 118, Arad-Zerind: 75, Sibiu-Fagaras: 99, Sibiu-Rimnicu: 80, Rimnicu-Pitesti: 97, Pitesti-Bucharest: 101, Fagaras-Bucharest: 211'
      },
      steps: [
        {
          stepNumber: 1,
          action: 'Expand initial state Arad',
          calculation: 'Frontier: {Arad (g=0, h=366, f=366)}',
          result: 'Expand Arad. Add children: Sibiu (g=140, h=253, f=393), Timisoara (g=118, h=329, f=447), Zerind (g=75, h=374, f=449).'
        },
        {
          stepNumber: 2,
          action: 'Select minimum f node: Sibiu (f=393)',
          calculation: 'Expand Sibiu. Add children: Fagaras (g=140+99=239, h=176, f=415), Rimnicu Vilcea (g=140+80=220, h=193, f=413).',
          result: 'Frontier: {Rimnicu (413), Fagaras (415), Timisoara (447), Zerind (449)}'
        },
        {
          stepNumber: 3,
          action: 'Select minimum f node: Rimnicu Vilcea (f=413)',
          calculation: 'Expand Rimnicu. Add Pitesti (g=220+97=317, h=100, f=417).',
          result: 'Frontier: {Fagaras (415), Pitesti (417), Timisoara (447), Zerind (449)}'
        },
        {
          stepNumber: 4,
          action: 'Select minimum f node: Fagaras (f=415)',
          calculation: 'Expand Fagaras. Add Bucharest (g=239+211=450, h=0, f=450).',
          result: 'Frontier: {Pitesti (417), Timisoara (447), Bucharest (450), Zerind (449)}'
        },
        {
          stepNumber: 5,
          action: 'Select minimum f node: Pitesti (f=417)',
          calculation: 'Expand Pitesti. Add Bucharest (g=317+101=418, h=0, f=418).',
          result: 'Frontier: {Bucharest via Pitesti (418), Timisoara (447), Bucharest via Fagaras (450), Zerind (449)}'
        },
        {
          stepNumber: 6,
          action: 'Select minimum f node: Bucharest via Pitesti (f=418)',
          calculation: 'Goal test is evaluated when Bucharest is EXPANDED (popped from frontier), not when generated!',
          result: 'Bucharest popped. Goal reached! Optimal cost = 418 km.'
        }
      ],
      finalAnswer: 'Optimal path: Arad → Sibiu → Rimnicu Vilcea → Pitesti → Bucharest with total cost 418 km.',
      examTakeaway: 'Always apply the goal test when a node is REMOVED from the frontier, never when generated. Fagaras generated Bucharest at cost 450, but Pitesti later found the true optimal path at cost 418!'
    },
    pythonCode: {
      title: 'Python 3 / PriorityQueue Implementation of A* Graph Search',
      timeComplexity: 'O(b^d) where d is solution depth and b is branching factor',
      spaceComplexity: 'O(b^d) storing explored set and frontier priority queue',
      explanation: 'Production-ready Python implementation with heapq priority queue and tie-breaking count.',
      code: `import heapq
from typing import Dict, List, Tuple, Optional, Callable

def astar_search(
    initial_state: str,
    goal_test: Callable[[str], bool],
    get_successors: Callable[[str], List[Tuple[str, float]]],
    heuristic: Callable[[str], float]
) -> Optional[Tuple[List[str], float]]:
    """
    A* Graph Search algorithm.
    Returns (path, total_cost) if solution found, else None.
    """
    # Priority queue stores (f_cost, counter, state, g_cost, path)
    counter = 0
    frontier = []
    heapq.heappush(frontier, (heuristic(initial_state), counter, initial_state, 0.0, [initial_state]))
    
    # Explored set maps state -> lowest g_cost seen so far
    explored: Dict[str, float] = {}

    while frontier:
        f, _, state, g, path = heapq.heappop(frontier)

        # Goal test when node is expanded
        if goal_test(state):
            return path, g

        if state in explored and explored[state] <= g:
            continue
        explored[state] = g

        for next_state, step_cost in get_successors(state):
            new_g = g + step_cost
            if next_state in explored and explored[next_state] <= new_g:
                continue
            
            new_f = new_g + heuristic(next_state)
            counter += 1
            heapq.heappush(frontier, (new_f, counter, next_state, new_g, path + [next_state]))

    return None  # No solution found`
    },
    midtermTraps: [
      {
        trap: 'Testing for goal state when generating a child node instead of when popping from frontier.',
        counterexampleOrProof: 'If you goal-test at generation, A* may return a sub-optimal path. In Romania, Bucharest was generated via Fagaras (cost 450) before Pitesti generated the optimal 418 path. Testing at expansion guarantees optimality.'
      },
      {
        trap: 'Assuming an admissible heuristic guarantees graph-search A* optimality without consistency.',
        counterexampleOrProof: 'If h is admissible but inconsistent (monotonicity violated), the first path found to a state is NOT guaranteed to be optimal. You must allow re-opening nodes in the explored set, degrading graph search performance.'
      }
    ]
  },

  // CHAPTER 5: Adversarial Search (Alpha-Beta Pruning Cutoff Proof & Numerical Trace)
  5: {
    proof: {
      theorem: 'Alpha-Beta Pruning Correctness & Optimal Complexity O(b^{d/2})',
      statement: 'Alpha-Beta pruning computes the exact same minimax decision as standard Minimax while reducing time complexity from O(b^d) to O(b^{d/2}) under optimal move ordering.',
      assumptions: [
        'Two-player zero-sum discrete game with alternating moves.',
        'alpha is the highest utility found so far along the path for MAX.',
        'beta is the lowest utility found so far along the path for MIN.'
      ],
      proofSteps: [
        'At any MIN node n with parent MAX node m: MAX already has an alternative move guaranteeing score >= alpha.',
        'If MIN node n finds a child with score v <= alpha, MIN will never pick an action yielding more than v <= alpha.',
        'Since MAX will always prefer its already secured score alpha over v, MAX will never choose the branch leading to n.',
        'Therefore, remaining children of n cannot influence the minimax value of m or the root, and can be safely pruned.',
        'Symmetrically, at a MAX node with v >= beta, the parent MIN node will never allow this branch, pruning remaining children.',
        'With perfect move ordering (best moves examined first), each node needs only evaluate its best move and examine opponents\' best moves: depth d requires branching factor sqrt(b). Total nodes = 2 * b^{d/2} - 1 = O(b^{d/2}). Q.E.D.'
      ],
      conclusion: 'Alpha-Beta pruning doubles the effective search horizon for games (e.g. from 6 ply to 12 ply in chess).'
    },
    workedProblem: {
      title: 'Alpha-Beta Numerical Cutoff Trace',
      problemStatement: 'Trace Alpha-Beta on a depth-3 tree with branching factor b=2. Leaf values left-to-right: [3, 5, 6, 9, 1, 2, 0, -1]. Identify exact cutoffs.',
      givenData: {
        'Leaf values': 'Node A children: (B, C). B children: (D, E). C children: (F, G). D leaves: [3, 5]. E leaves: [6, 9]. F leaves: [1, 2]. G leaves: [0, -1].'
      },
      steps: [
        {
          stepNumber: 1,
          action: 'Evaluate leaf 3, leaf 5 under MIN node D',
          calculation: 'D receives min(inf, 3) = 3, then min(3, 5) = 3. D returns 3.',
          result: 'MAX node B updates: alpha = max(-inf, 3) = 3.'
        },
        {
          stepNumber: 2,
          action: 'Evaluate leaf 6 under MIN node E',
          calculation: 'E receives min(inf, 6) = 6. But B has alpha=3, and beta for E is inf.',
          result: 'Evaluate leaf 9. E returns min(6, 9) = 6. B updates max(3, 6) = 6.'
        },
        {
          stepNumber: 3,
          action: 'Root MAX node A updates',
          calculation: 'A receives 6 from B. A sets alpha = 6. Root alpha = 6.',
          result: 'A passes alpha=6, beta=inf down to MIN node C.'
        },
        {
          stepNumber: 4,
          action: 'Evaluate node F under C',
          calculation: 'F evaluates leaves 1 and 2. F returns min(1, 2) = 1.',
          result: 'C receives 1 from F. C updates beta = min(inf, 1) = 1.'
        },
        {
          stepNumber: 5,
          action: 'Alpha-Beta Cutoff Check at Node C',
          calculation: 'At node C: alpha = 6, beta = 1. Condition alpha >= beta (6 >= 1) is SATISFIED!',
          result: 'CUTOFF TRIGGERED! Entire subtree under node G ([0, -1]) is PRUNED!'
        }
      ],
      finalAnswer: 'Leaves [0, -1] under node G are completely pruned without ever being evaluated. Root value = 6.',
      examTakeaway: 'Whenever alpha >= beta at any node, stop searching its remaining children immediately.'
    },
    pythonCode: {
      title: 'Python Alpha-Beta Minimax Implementation',
      timeComplexity: 'O(b^{d/2}) best case with perfect move ordering; O(b^d) worst case',
      spaceComplexity: 'O(d) recursion stack depth',
      explanation: 'Clean recursive Alpha-Beta implementation with cutoff checks.',
      code: `def alpha_beta_search(state, depth, alpha, beta, maximizing_player, get_actions, result, is_terminal, evaluate):
    """
    Alpha-Beta Minimax search.
    alpha: Best choice so far for MAX (initially -infinity)
    beta: Best choice so far for MIN (initially +infinity)
    """
    if depth == 0 or is_terminal(state):
        return evaluate(state), None

    best_action = None

    if maximizing_player:
        max_eval = float('-inf')
        for action in get_actions(state):
            child_eval, _ = alpha_beta_search(
                result(state, action), depth - 1, alpha, beta, False,
                get_actions, result, is_terminal, evaluate
            )
            if child_eval > max_eval:
                max_eval = child_eval
                best_action = action
            alpha = max(alpha, child_eval)
            if beta <= alpha:
                break  # Beta cutoff (prune)
        return max_eval, best_action
    else:
        min_eval = float('inf')
        for action in get_actions(state):
            child_eval, _ = alpha_beta_search(
                result(state, action), depth - 1, alpha, beta, True,
                get_actions, result, is_terminal, evaluate
            )
            if child_eval < min_eval:
                min_eval = child_eval
                best_action = action
            beta = min(beta, child_eval)
            if beta <= alpha:
                break  # Alpha cutoff (prune)
        return min_eval, best_action`
    }
  },

  // CHAPTER 13: Quantifying Uncertainty (Bayes Diagnostic Worked Problem)
  13: {
    proof: {
      theorem: 'Bayes Rule Derivation from Product Rule of Conditional Probability',
      statement: 'P(Cause | Effect) = [P(Effect | Cause) · P(Cause)] / P(Effect)',
      assumptions: [
        'Definition of conditional probability: P(A | B) = P(A ∧ B) / P(B) for P(B) > 0.',
        'Symmetry of conjunction: P(A ∧ B) = P(B ∧ A).'
      ],
      proofSteps: [
        'From product rule: P(A ∧ B) = P(A | B) · P(B).',
        'Similarly: P(B ∧ A) = P(B | A) · P(A).',
        'Since P(A ∧ B) = P(B ∧ A), equating right-hand sides yields: P(A | B) · P(B) = P(B | A) · P(A).',
        'Dividing both sides by P(B) (assuming P(B) > 0): P(A | B) = [P(B | A) · P(A)] / P(B).',
        'Expanding denominator via total probability over mutually exclusive causes: P(B) = sum_i P(B | A_i) · P(A_i). Q.E.D.'
      ],
      conclusion: 'Bayes rule enables diagnostic inference P(Cause | Symptom) using causal models P(Symptom | Cause).'
    },
    workedProblem: {
      title: 'Rare Disease Diagnosis & The Base-Rate Fallacy',
      problemStatement: 'A disease affects 1 in 10,000 people. A lab test has 99% sensitivity (true positive) and 1% false positive rate. A patient tests positive. What is the probability they actually have the disease?',
      givenData: {
        'Prior P(D)': '0.0001 (0.01%)',
        'Prior P(¬D)': '0.9999 (99.99%)',
        'Sensitivity P(+ | D)': '0.99',
        'False Positive P(+ | ¬D)': '0.01'
      },
      steps: [
        {
          stepNumber: 1,
          action: 'Calculate joint probability P(+ ∧ D)',
          calculation: 'P(+ | D) · P(D) = 0.99 · 0.0001 = 0.000099',
          result: '0.000099'
        },
        {
          stepNumber: 2,
          action: 'Calculate joint probability P(+ ∧ ¬D)',
          calculation: 'P(+ | ¬D) · P(¬D) = 0.01 · 0.9999 = 0.009999',
          result: '0.009999'
        },
        {
          stepNumber: 3,
          action: 'Calculate total probability of testing positive P(+)',
          calculation: 'P(+) = P(+ ∧ D) + P(+ ∧ ¬D) = 0.000099 + 0.009999 = 0.010098',
          result: '0.010098 (~1.01% of all people test positive)'
        },
        {
          stepNumber: 4,
          action: 'Apply Bayes Rule: P(D | +) = P(+ ∧ D) / P(+)',
          calculation: '0.000099 / 0.010098 ≈ 0.009804 (0.98%)',
          result: 'P(D | +) ≈ 0.98% (~1 in 102)'
        }
      ],
      finalAnswer: 'Despite a 99% accurate test, a positive result means only a ~0.98% chance of having the disease!',
      examTakeaway: 'When the prior probability (base rate) is extremely low, the overwhelming majority of positive test results are false positives! This is the single most tested probability problem in CS AI exams.'
    },
    pythonCode: {
      title: 'Python Bayes Inference & Normalization Routine',
      timeComplexity: 'O(k) where k is the number of hypotheses',
      spaceComplexity: 'O(k) probability distribution dictionary',
      explanation: 'Numerically stable discrete Bayesian update with alpha normalization.',
      code: `from typing import Dict

def bayes_update(prior: Dict[str, float], likelihood: Dict[str, float]) -> Dict[str, float]:
    """
    Computes posterior probability P(H | E) = alpha * P(E | H) * P(H)
    """
    unnormalized = {}
    for hypothesis, p_prior in prior.items():
        p_likelihood = likelihood.get(hypothesis, 0.0)
        unnormalized[hypothesis] = p_prior * p_likelihood

    total_prob = sum(unnormalized.values())
    if total_prob == 0:
        raise ValueError("Evidence has 0 probability under all hypotheses!")

    # Normalize by alpha = 1 / total_prob
    return {h: p / total_prob for h, p in unnormalized.items()}`
    }
  },

  // CHAPTER 17: MDPs (Contraction Mapping Theorem Proof & Python Value Iteration)
  17: {
    proof: {
      theorem: 'Contraction Mapping Theorem for Value Iteration Convergence',
      statement: 'The Bellman backup operator B is a contraction mapping in the infinity norm with contraction factor gamma < 1. Therefore, Value Iteration converges to a unique optimal fixed point.',
      assumptions: [
        'Discount factor gamma satisfies 0 <= gamma < 1.',
        'Infinity norm ||U - V||_inf = max_s |U(s) - V(s)|.',
        'Bellman operator: (B U)(s) = R(s) + gamma * max_a sum_{s\'} P(s\'|s, a) U(s\').'
      ],
      proofSteps: [
        'Let U and V be any two arbitrary bounded utility vectors on state space S.',
        'Consider |(B U)(s) - (B V)(s)| for any state s:',
        '|(B U)(s) - (B V)(s)| = |gamma * max_a sum_{s\'} P(s\'|s, a) U(s\') - gamma * max_{a\'} sum_{s\'} P(s\'|s, a\') V(s\')|.',
        'Using the mathematical inequality |max_a f(a) - max_a g(a)| <= max_a |f(a) - g(a)|:',
        '|(B U)(s) - (B V)(s)| <= gamma * max_a |sum_{s\'} P(s\'|s, a) (U(s\') - V(s\'))|.',
        'By triangle inequality and knowing P(s\'|s, a) >= 0 and sum_{s\'} P(s\'|s, a) = 1:',
        'sum_{s\'} P(s\'|s, a) |U(s\') - V(s\')| <= sum_{s\'} P(s\'|s, a) ||U - V||_inf = ||U - V||_inf.',
        'Taking the maximum over all states s: ||B U - B V||_inf <= gamma ||U - V||_inf.',
        'By Banach Fixed-Point Theorem, repeated application of B converges to a UNIQUE fixed point U* satisfying B U* = U*. Q.E.D.'
      ],
      conclusion: 'Value Iteration is guaranteed to converge to the true optimal utilities regardless of initial values U_0.'
    },
    workedProblem: {
      title: 'Value Iteration Backup on a 2-State MDP',
      problemStatement: '2 states S = {Clean, Dirty}, actions A = {Clean, Idle}, gamma = 0.9. R(Clean) = +1, R(Dirty) = -1. Compute U_1 from U_0 = [0, 0].',
      givenData: {
        'Transitions for Clean state': 'Action Clean: P(Clean|Clean, Clean) = 1.0. Action Idle: P(Clean|Clean, Idle) = 0.2, P(Dirty|Clean, Idle) = 0.8.',
        'Transitions for Dirty state': 'Action Clean: P(Clean|Dirty, Clean) = 0.9, P(Dirty|Dirty, Clean) = 0.1. Action Idle: P(Dirty|Dirty, Idle) = 1.0.'
      },
      steps: [
        {
          stepNumber: 1,
          action: 'Compute U_1(Clean)',
          calculation: 'Q(Clean, Clean) = 1 + 0.9·[1.0·0] = 1.0. Q(Clean, Idle) = 1 + 0.9·[0.2·0 + 0.8·0] = 1.0.',
          result: 'U_1(Clean) = max(1.0, 1.0) = 1.0'
        },
        {
          stepNumber: 2,
          action: 'Compute U_1(Dirty)',
          calculation: 'Q(Dirty, Clean) = -1 + 0.9·[0.9·0 + 0.1·0] = -1.0. Q(Dirty, Idle) = -1 + 0.9·[1.0·0] = -1.0.',
          result: 'U_1(Dirty) = max(-1.0, -1.0) = -1.0'
        },
        {
          stepNumber: 3,
          action: 'Compute U_2(Clean) with U_1 = [1.0, -1.0]',
          calculation: 'Q(Clean, Clean) = 1 + 0.9·(1.0·1.0) = 1.9. Q(Clean, Idle) = 1 + 0.9·(0.2·1.0 + 0.8·(-1.0)) = 1 + 0.9·(-0.6) = 0.46.',
          result: 'U_2(Clean) = max(1.9, 0.46) = 1.9 (Action Clean dominates Idle)'
        }
      ],
      finalAnswer: 'U_1 = [1.0, -1.0], U_2(Clean) = 1.9, optimal action in Clean state is Clean.',
      examTakeaway: 'Notice how action differentiation emerges immediately in iteration 2 once non-zero utilities propagate back.'
    },
    pythonCode: {
      title: 'Python MDP Value Iteration Implementation with Bellman Contraction Check',
      timeComplexity: 'O(|A| · |S|² · K) where K is number of iterations to convergence',
      spaceComplexity: 'O(|S|) state utility vectors',
      explanation: 'Production implementation with convergence threshold epsilon * (1 - gamma) / gamma.',
      code: `from typing import Dict, List, Tuple

def value_iteration(
    states: List[str],
    actions: List[str],
    transitions: Dict[Tuple[str, str, str], float],  # (s, a, s') -> prob
    rewards: Dict[str, float],                       # s -> reward
    gamma: float = 0.9,
    epsilon: float = 1e-4
) -> Tuple[Dict[str, float], Dict[str, str]]:
    """
    Computes optimal utilities U* and optimal policy pi* via Value Iteration.
    """
    U = {s: 0.0 for s in states}
    threshold = epsilon * (1 - gamma) / gamma if gamma < 1 else epsilon

    while True:
        delta = 0.0
        U_new = {}
        for s in states:
            q_values = []
            for a in actions:
                expected_future = sum(
                    prob * U[s_prime]
                    for (curr, act, s_prime), prob in transitions.items()
                    if curr == s and act == a
                )
                q_values.append(rewards[s] + gamma * expected_future)
            
            U_new[s] = max(q_values) if q_values else rewards[s]
            delta = max(delta, abs(U_new[s] - U[s]))
            
        U = U_new
        if delta < threshold:
            break

    # Extract optimal policy via 1-step lookahead
    policy = {}
    for s in states:
        best_a, best_val = None, float('-inf')
        for a in actions:
            val = sum(
                prob * U[s_prime]
                for (curr, act, s_prime), prob in transitions.items()
                if curr == s and act == a
            )
            if val > best_val:
                best_val, best_a = val, a
        policy[s] = best_a

    return U, policy`
    }
  }
};

// ----------------------------------------------------------------------------
// CANONICAL LESSON RESOLVER (ENSURES NO CHAPTER EVER FALLS BACK TO CH 1!)
// ----------------------------------------------------------------------------

export function getCanonicalLesson(chapterId: number): DetailedLesson {
  // 1. Direct supplemental lessons (Ch 15, 16, 17, 21)
  if (UNIVERSITY_SUPPLEMENTAL_LESSONS[chapterId]) {
    return UNIVERSITY_SUPPLEMENTAL_LESSONS[chapterId];
  }

  // 2. Direct mapping from AIMA_DETAILED_LESSONS
  if (AIMA_DETAILED_LESSONS[chapterId]) {
    // If it's chapter 11 (which had Uncertainty in old schema), alias appropriately
    return AIMA_DETAILED_LESSONS[chapterId];
  }

  // 3. Smart aliasing for canonical AIMA chapter numbers:
  // Ch 13 in AIMA is Uncertainty -> old key 11
  if (chapterId === 13 && AIMA_DETAILED_LESSONS[11]) {
    return {
      ...AIMA_DETAILED_LESSONS[11],
      chapterId: 13,
      partId: 4,
      title: 'Quantifying Uncertainty',
      bookPages: 'AIMA Ch. 13, pp. 480–526'
    };
  }
  // Ch 14 in AIMA is Probabilistic Reasoning -> old key 12
  if (chapterId === 14 && AIMA_DETAILED_LESSONS[12]) {
    return {
      ...AIMA_DETAILED_LESSONS[12],
      chapterId: 14,
      partId: 4,
      title: 'Probabilistic Reasoning (Bayesian Networks)',
      bookPages: 'AIMA Ch. 14, pp. 510–558'
    };
  }
  // Ch 18 in AIMA is Learning from Examples -> old key 13
  if (chapterId === 18 && AIMA_DETAILED_LESSONS[13]) {
    return {
      ...AIMA_DETAILED_LESSONS[13],
      chapterId: 18,
      partId: 5,
      title: 'Learning from Examples (Supervised Learning)',
      bookPages: 'AIMA Ch. 18, pp. 693–750'
    };
  }
  // Ch 19 in AIMA -> Deep Learning from old key 14
  if (chapterId === 19 && AIMA_DETAILED_LESSONS[14]) {
    return {
      ...AIMA_DETAILED_LESSONS[14],
      chapterId: 19,
      partId: 5,
      title: 'Neural Networks & Deep Learning',
      bookPages: 'AIMA Ch. 18/19 & Goodfellow DL Ch. 6'
    };
  }

  // 4. Dynamically generate high-rigor lesson from AIMA_PARTS for any other chapter
  for (const part of AIMA_PARTS) {
    const ch = part.chapters.find((c) => c.id === chapterId);
    if (ch) {
      const generatedSteps: LessonStep[] = ch.keyConcepts.map((kc, idx) => ({
        stepNumber: idx + 1,
        title: kc.title,
        subtitle: kc.summary,
        conceptType: idx === 0 ? 'intuition' : idx === 1 ? 'algorithm' : 'math',
        visualType: 'neural_net_overview',
        bookCitation: `AIMA 4th Ed. (2020), ${ch.pageRange}`,
        contentMarkdown: `### ${kc.title}
${kc.summary}

#### In-Depth Architectural & Mathematical Principles
${kc.deepDive.map((d) => `- ${d}`).join('\n')}

${kc.examTip ? `> **University Exam Note**: ${kc.examTip}` : ''}

### Syllabus Context & Theoretical Boundaries
This section covers formal principles from **${ch.title}** (${ch.pageRange}).
In university curricula, this material establishes the analytical foundation for rational agent behavior.`,
        keyPoints: kc.deepDive,
        examTip: kc.examTip,
        mathBlock: kc.keyFormula
          ? {
              formula: kc.keyFormula.latex,
              explanation: kc.keyFormula.description
            }
          : undefined
      }));

      return {
        chapterId: ch.id,
        partId: ch.partId,
        topicId: `topic-${ch.id}`,
        title: ch.title,
        subtitle: ch.subtitle,
        estimatedMinutes: 45,
        bookPages: ch.pageRange,
        xpReward: 60,
        steps: generatedSteps.length > 0 ? generatedSteps : [
          {
            stepNumber: 1,
            title: ch.title,
            subtitle: ch.subtitle,
            conceptType: 'intuition',
            visualType: 'neural_net_overview',
            contentMarkdown: `### ${ch.title}\n\n${ch.summary}\n\n${(ch.sections || []).map((s) => `- ${s}`).join('\n')}`,
            keyPoints: ch.sections
          }
        ]
      };
    }
  }

  // Absolute fallback
  return AIMA_DETAILED_LESSONS[1];
}
