// Dynamic Parameterized Problem Engine for Mantiq
// Generates randomized numerical variants for AI hand-calculation exam problems

export interface DynamicVariant {
  seed: number;
  chapterId: number;
  parameters: Record<string, string | number>;
  problemStatement: string;
  stepCalculations: {
    stepNumber: number;
    action: string;
    calculation: string;
    result: string;
  }[];
  finalAnswer: string;
  examTakeaway: string;
  checkQuestions?: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export function generateDynamicProblem(chapterId: number, seed?: number): DynamicVariant {
  const currentSeed = seed !== undefined ? seed : Math.floor(Math.random() * 1000) + 1;
  const randInt = (min: number, max: number, offset: number = 0) => {
    const pseudo = Math.abs(Math.sin(currentSeed + offset));
    return Math.floor(pseudo * (max - min + 1)) + min;
  };

  switch (chapterId) {
    case 3:
    case 4: {
      // Informed Search / A* Evaluation
      const g_A = randInt(2, 6, 1);
      const h_A = randInt(6, 12, 2);
      const g_B = randInt(4, 9, 3);
      const h_B = randInt(1, 5, 4);
      const f_A = g_A + h_A;
      const f_B = g_B + h_B;
      const chosen = f_A < f_B ? 'Node A' : f_B < f_A ? 'Node B' : 'Tie (Arbitrary)';

      return {
        seed: currentSeed,
        chapterId,
        parameters: {
          'Node A cost g(A)': `${g_A}`,
          'Node A heuristic h(A)': `${h_A}`,
          'Node B cost g(B)': `${g_B}`,
          'Node B heuristic h(B)': `${h_B}`,
          'Search Strategy': 'A* Graph Search'
        },
        problemStatement: `You have two unexpanded frontier nodes A and B in A* search. With path costs $g(A) = ${g_A}$, $g(B) = ${g_B}$ and heuristic estimates $h(A) = ${h_A}$, $h(B) = ${h_B}$, determine which node the priority queue expands next and compute its evaluation function value $f(n)$.`,
        stepCalculations: [
          {
            stepNumber: 1,
            action: 'Evaluate f-score for Node A',
            calculation: `f(A) = g(A) + h(A) = ${g_A} + ${h_A} = ${f_A}`,
            result: `f(A) = ${f_A}`
          },
          {
            stepNumber: 2,
            action: 'Evaluate f-score for Node B',
            calculation: `f(B) = g(B) + h(B) = ${g_B} + ${h_B} = ${f_B}`,
            result: `f(B) = ${f_B}`
          },
          {
            stepNumber: 3,
            action: 'Compare priority queue minimum',
            calculation: `min(f(A), f(B)) = min(${f_A}, ${f_B}) = ${Math.min(f_A, f_B)}`,
            result: `${chosen} has the lower evaluation cost and will be popped first.`
          }
        ],
        finalAnswer: `${chosen} expanded next with priority f = ${Math.min(f_A, f_B)}`,
        examTakeaway: 'In A* search, nodes are expanded strictly in non-decreasing order of f(n) = g(n) + h(n). Ties are broken by lowest h(n) or FIFO.',
        checkQuestions: {
          prompt: `Based on your calculations above, what is the exact f(A) value?`,
          options: [`f(A) = ${f_A}`, `f(A) = ${f_A + 2}`, `f(A) = ${f_A - 1}`, `f(A) = ${g_A * h_A}`],
          correctIndex: 0,
          explanation: `f(A) is strictly the sum of known cost g(A) (${g_A}) and remaining heuristic h(A) (${h_A}) = ${f_A}.`
        }
      };
    }

    case 5: {
      // Adversarial Minimax with Alpha-Beta Pruning
      const val1 = randInt(2, 9, 1);
      const val2 = randInt(1, 8, 2);
      const val3 = randInt(4, 12, 3);
      const minLeft = Math.min(val1, val2);
      const willPrune = minLeft >= val3;

      return {
        seed: currentSeed,
        chapterId,
        parameters: {
          'Left Leaf Values': `[${val1}, ${val2}]`,
          'Right First Child': `${val3}`,
          'Root Type': 'MAX',
          'Children Type': 'MIN'
        },
        problemStatement: `In a 2-ply zero-sum game tree, the MAX root has two MIN children. The left MIN node evaluates children with utility values ${val1} and ${val2}. The right MIN node's first child evaluates to ${val3}. Compute the backed-up values and determine if alpha-beta pruning triggers for the right subtree.`,
        stepCalculations: [
          {
            stepNumber: 1,
            action: 'Compute left MIN node utility and update Root Alpha',
            calculation: `v_left = min(${val1}, ${val2}) = ${minLeft}. Root updates alpha = max(-∞, ${minLeft}) = ${minLeft}.`,
            result: `alpha = ${minLeft}, beta = +∞ passed to right branch.`
          },
          {
            stepNumber: 2,
            action: 'Evaluate right MIN node first leaf',
            calculation: `Right node receives alpha = ${minLeft}, sees first child = ${val3}. Updates beta = min(+∞, ${val3}) = ${val3}.`,
            result: `Current bounds at right child: [alpha=${minLeft}, beta=${val3}].`
          },
          {
            stepNumber: 3,
            action: 'Check Alpha-Beta Pruning Condition (alpha >= beta)',
            calculation: `Check: ${minLeft} >= ${val3}? ${willPrune ? `YES (${minLeft} >= ${val3})` : `NO (${minLeft} < ${val3})`}.`,
            result: willPrune
              ? `Pruning TRIGGERED! The remaining children of the right MIN node can be safely skipped.`
              : `No pruning yet. The right MIN node must evaluate its remaining child.`
          }
        ],
        finalAnswer: `Root value guaranteed ≥ ${minLeft}. Pruning condition: ${willPrune ? 'Branch PRUNED' : 'Continue evaluation'}.`,
        examTakeaway: 'Alpha pruning occurs at a MIN node whenever beta <= alpha, because MAX will never choose a path yielding less than alpha.',
        checkQuestions: {
          prompt: `What is the value of alpha passed to the right MIN node?`,
          options: [`alpha = ${minLeft}`, `alpha = ${val1}`, `alpha = +∞`, `alpha = 0`],
          correctIndex: 0,
          explanation: `Alpha is updated at the root to max(-∞, left_val) = ${minLeft} and passed down to subsequent branches.`
        }
      };
    }

    case 17: {
      // MDPs / Bellman Equation Update
      const r = randInt(-1, 2, 1);
      const gamma = 0.9;
      const u_s1 = randInt(5, 15, 2);
      const u_s2 = randInt(2, 8, 3);
      const p1 = 0.8;
      const p2 = 0.2;
      const expectedNext = Number((p1 * u_s1 + p2 * u_s2).toFixed(2));
      const updatedValue = Number((r + gamma * expectedNext).toFixed(2));

      return {
        seed: currentSeed,
        chapterId,
        parameters: {
          'Immediate Reward R(s)': `${r}`,
          'Discount Factor γ': `${gamma}`,
          'Transition P(s1|s,a)': `${p1} with U(s1)=${u_s1}`,
          'Transition P(s2|s,a)': `${p2} with U(s2)=${u_s2}`
        },
        problemStatement: `An agent in state $s$ executes action $a$, receiving reward $R(s) = ${r}$. With probability $0.8$ the agent transitions to $s_1$ (where $U(s_1) = ${u_s1}$) and with probability $0.2$ to $s_2$ (where $U(s_2) = ${u_s2}$). Using discount factor $\\gamma = ${gamma}$, compute the one-step Bellman update $U_{k+1}(s)$.`,
        stepCalculations: [
          {
            stepNumber: 1,
            action: 'Compute expected future utility E[U(s\')]',
            calculation: `E[U(s\')] = 0.8 · ${u_s1} + 0.2 · ${u_s2} = ${(0.8 * u_s1).toFixed(2)} + ${(0.2 * u_s2).toFixed(2)} = ${expectedNext}`,
            result: `Expected future utility = ${expectedNext}`
          },
          {
            stepNumber: 2,
            action: 'Apply discount factor gamma = 0.9',
            calculation: `γ · E[U(s\')] = ${gamma} · ${expectedNext} = ${(gamma * expectedNext).toFixed(2)}`,
            result: `Discounted expectation = ${(gamma * expectedNext).toFixed(2)}`
          },
          {
            stepNumber: 3,
            action: 'Add immediate reward R(s)',
            calculation: `U_{k+1}(s) = R(s) + γ · E[U(s\')] = ${r} + ${(gamma * expectedNext).toFixed(2)} = ${updatedValue}`,
            result: `Updated State Utility = ${updatedValue}`
          }
        ],
        finalAnswer: `U_{k+1}(s) = ${updatedValue}`,
        examTakeaway: 'The Bellman backup contracts state value errors by factor γ on every iteration, guaranteeing convergence to optimal utility U*.',
        checkQuestions: {
          prompt: `What is the expected future utility before discounting?`,
          options: [`${expectedNext}`, `${(expectedNext * 0.9).toFixed(2)}`, `${u_s1 + u_s2}`, `${(u_s1 * 0.8).toFixed(2)}`],
          correctIndex: 0,
          explanation: `Expected future utility is strictly p1 · U(s1) + p2 · U(s2) = 0.8(${u_s1}) + 0.2(${u_s2}) = ${expectedNext}.`
        }
      };
    }

    // Default / General Case for other chapters
    default: {
      const b = randInt(2, 5, 1);
      const d = randInt(3, 6, 2);
      const totalLeaves = Math.pow(b, d);
      const uniformCostTime = totalLeaves;
      const alphaBetaBestCase = Math.pow(b, Math.ceil(d / 2));

      return {
        seed: currentSeed,
        chapterId,
        parameters: {
          'Branching Factor b': `${b}`,
          'Target Depth d': `${d}`,
          'Tree Nodes Bound': `b^d = ${b}^${d}`,
          'Asymptotic Regime': 'Worst-case time complexity O(b^d)'
        },
        problemStatement: `For Chapter ${chapterId}'s state-space formulation, analyze a search tree with uniform branching factor $b = ${b}$ and solution depth $d = ${d}$. Calculate the total frontier states at depth $d$ and evaluate the asymptotic reduction when effective pruning (or greedy heuristic guidance) reduces depth to $d/2$.`,
        stepCalculations: [
          {
            stepNumber: 1,
            action: 'Calculate full search tree leaves at depth d',
            calculation: `Leaves = b^d = ${b}^${d} = ${totalLeaves.toLocaleString()}`,
            result: `Full exploration requires visiting ${totalLeaves.toLocaleString()} states.`
          },
          {
            stepNumber: 2,
            action: 'Compute effective optimal pruning bound b^(d/2)',
            calculation: `Pruned Tree = b^(ceil(d/2)) = ${b}^${Math.ceil(d / 2)} = ${alphaBetaBestCase.toLocaleString()}`,
            result: `Optimal heuristic pruning visits only ${alphaBetaBestCase.toLocaleString()} states.`
          },
          {
            stepNumber: 3,
            action: 'Compute efficiency speedup ratio',
            calculation: `Speedup = ${totalLeaves} / ${alphaBetaBestCase} = ${(totalLeaves / alphaBetaBestCase).toFixed(1)}x`,
            result: `Pruning delivers a ${(totalLeaves / alphaBetaBestCase).toFixed(1)}x computational speedup.`
          }
        ],
        finalAnswer: `Full states: ${totalLeaves.toLocaleString()} vs Pruned states: ${alphaBetaBestCase.toLocaleString()} (${(totalLeaves / alphaBetaBestCase).toFixed(1)}x faster).`,
        examTakeaway: 'Exponential branching b^d cannot be solved by brute force. Heuristics or pruning bound the effective depth to d/2, doubling searchable horizons.',
        checkQuestions: {
          prompt: `What is the total number of unpruned leaf nodes at depth d=${d} with b=${b}?`,
          options: [`${totalLeaves.toLocaleString()}`, `${(b * d).toLocaleString()}`, `${(totalLeaves / 2).toLocaleString()}`, `${(totalLeaves + b).toLocaleString()}`],
          correctIndex: 0,
          explanation: `In a tree of uniform branching factor b and depth d, the number of leaf nodes is strictly b^d = ${b}^${d} = ${totalLeaves.toLocaleString()}.`
        }
      };
    }
  }
}
