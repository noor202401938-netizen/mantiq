import type { ChapterDeepDive } from './types';

export const DEEP_DIVE_CH12_14: Record<number, ChapterDeepDive> = {
  12: {
    1: {
      qa: [
        {
          question: `What makes a Bayesian Network such a compact representation of a joint probability distribution?`,
          answer: `A full joint probability distribution over $n$ binary variables requires storing $2^n - 1$ distinct probabilities, which scales exponentially and becomes unmanageable for even 30 variables ($10^9$ numbers).

A **Bayesian Network** factors the joint distribution by asserting that each variable $X_i$ is conditionally independent of its non-descendants given its immediate parents:
$$P(X_1, X_2, \\dots, X_n) = \\prod_{i=1}^{n} P(X_i \\mid \\text{Parents}(X_i))$$

If each node has at most $k$ parents, each Conditional Probability Table (CPT) requires at most $2^k$ entries. For the entire network of $n$ nodes, the total parameters stored is at most:
$$n \\cdot 2^k$$
For $n = 30$ with at most $k = 3$ parents per node, the parameters drop from $1,073,741,823$ down to just $30 \\times 8 = 240$ numbers! This exponential-to-linear compression makes probabilistic modeling computationally feasible.`,
        },
        {
          question: `What does the absence of an edge between two nodes in a Bayesian network mean?`,
          answer: `In a Bayesian Network, **edges represent direct dependencies**, but the **absence of an edge represents an assertion of conditional independence**.

A missing arrow between $A$ and $B$ does not mean $A$ and $B$ are completely uncorrelated. It means that any influence between them is mediated entirely through other intermediate variables. Missing edges are the source of all computational savings: every omitted edge removes parameters from the CPTs and enables graph-based pruning during inference.`,
        },
        {
          question: `Why must the graph structure of a Bayesian network be strictly acyclic (a DAG)?`,
          answer: `If a Bayesian network had a directed cycle (e.g., $A \\to B \\to C \\to A$), the chain rule factorization would become circular:
$$P(A, B, C) = P(A \\mid C) P(B \\mid A) P(C \\mid B)$$
This would mean $A$'s probability depends on $C$, which depends on $B$, which depends on $A$. Such circular definitions generally fail to integrate to 1 and do not define a valid, coherent joint probability distribution. A DAG guarantees that a topological ordering exists, ensuring that the chain rule of probability applies soundly.`,
        },
      ],
      workedExample: {
        title: 'Computing a Full Joint Probability in the Burglar Alarm Network',
        scenario: `Consider the classic Russell & Norvig Burglar Alarm network:
- $Burglary (B) \\to Alarm (A) \\leftarrow Earthquake (E)$
- $Alarm (A) \\to JohnCalls (J)$ and $Alarm (A) \\to MaryCalls (M)$
CPT values:
- $P(B) = 0.001$, $P(E) = 0.002$
- $P(A \\mid B, \\neg E) = 0.94$
- $P(J \\mid A) = 0.90$
- $P(M \\mid A) = 0.70$
Compute the exact probability of the event where there is a burglary, no earthquake, the alarm triggers, and both John and Mary call: $P(B, \\neg E, A, J, M)$.`,
        walkthrough: [
          `**Step 1: Apply the Bayesian Network factorization formula:**
$$P(B, \\neg E, A, J, M) = P(B) \\cdot P(\\neg E) \\cdot P(A \\mid B, \\neg E) \\cdot P(J \\mid A) \\cdot P(M \\mid A)$$`,
          `**Step 2: Look up values from the CPTs:**
- $P(B) = 0.001$
- $P(\\neg E) = 1 - P(E) = 1 - 0.002 = 0.998$
- $P(A \\mid B, \\neg E) = 0.94$
- $P(J \\mid A) = 0.90$
- $P(M \\mid A) = 0.70$`,
          `**Step 3: Multiply the terms:**
$$P = 0.001 \\times 0.998 \\times 0.94 \\times 0.90 \\times 0.70$$
$$P = 0.001 \\times 0.998 \\times 0.94 \\times 0.63$$
$$P = 0.001 \\times 0.5910156 = 0.0005910156 \\approx 5.91 \\times 10^{-4}$$`,
        ],
        takeaway: `Any complete atomic event's joint probability is obtained simply by multiplying the corresponding conditioned entries from each node's local CPT.`,
      },
    },

    2: {
      qa: [
        {
          question: `What is d-separation, and how does it determine whether two variables are conditionally independent?`,
          answer: `**d-separation** ("directed separation") is a graphical criterion that inspects the paths between two sets of nodes $X$ and $Y$ given an evidence set $E$.
If every undirected path between $X$ and $Y$ is **blocked** by $E$, then $X$ and $Y$ are guaranteed to be conditionally independent given $E$ ($X \\perp Y \\mid E$).

A path is **blocked** if it contains at least one node $Z$ that meets either of these conditions:
1. $Z$ is in a **chain** ($A \\to Z \\to B$) or a **fork** ($A \\leftarrow Z \\to B$), and $Z \\in E$ (the middle node is observed).
2. $Z$ is a **collider** ($A \\to Z \\leftarrow B$), and **neither $Z$ nor any of $Z$'s descendants** is in $E$.`,
        },
        {
          question: `What is the "Explaining Away" effect in colliders (common effects)?`,
          answer: `A **collider** occurs when two independent causes influence the same effect: $A \\to E \\leftarrow B$.
- Before $E$ is observed, $A$ and $B$ are **independent**: knowing the lawn is wet tells you nothing about whether it rained if you haven't looked at the sprinkler.
- Once $E$ is observed (we know the alarm went off), $A$ and $B$ become **conditionally dependent**!

If we observe that an earthquake just occurred ($B = \\text{true}$), this "explains away" why the alarm sounded, dramatically decreasing the probability that a burglar broke in ($A$). Because one cause accounts for the symptom, the other cause becomes less likely.`,
        },
        {
          question: `What is the Markov Blanket of a node, and why is it so important in Gibbs Sampling?`,
          answer: `The **Markov Blanket** of a variable $X$, denoted $MB(X)$, consists of:
1. $X$'s **parents**
2. $X$'s **children**
3. The **other parents of $X$'s children** (the co-parents)

*Fundamental Property:* A node $X$ is conditionally independent of **every other node in the entire network** given its Markov blanket:
$$P(X \\mid \\text{all other nodes}) = P(X \\mid MB(X))$$
This property is the foundation of **Gibbs sampling**: to resample variable $X$, the algorithm only needs to evaluate local CPTs belonging to $X$, its parents, its children, and its co-parents, ignoring the rest of a massive network.`,
        },
      ],
      workedExample: {
        title: 'Checking d-Separation and Active Paths',
        scenario: `Consider the graph: $A \\to B \\to C \\leftarrow D \\to E$.
1. Are $A$ and $E$ independent without evidence ($E = \\emptyset$)?
2. Are $A$ and $E$ conditionally independent given $C$ ($E = \\{C\\}$)?`,
        walkthrough: [
          `**Analysis of Path 1: $A \\to B \\to C \\leftarrow D \\to E$ with no evidence:**
Inspect node $C$ on the path:
$B \\to C \\leftarrow D$ is a **collider** (two arrows pointing into $C$).
Rule for colliders: A collider is **blocked** when neither it nor any of its descendants is in the evidence set.
Since $C \\notin \\emptyset$ and $C$ has no observed descendants, node $C$ **blocks the path**.
Because the only path between $A$ and $E$ is blocked, $A$ and $E$ are **d-separated** $\\implies A \\perp E$.`,
          `**Analysis of Path 2: $A \\to B \\to C \\leftarrow D \\to E$ given evidence $E = \\{C\\}$:**
Now $C$ is observed ($C \\in E$).
Rule for colliders: Observing a collider **opens (unblocks)** the path!
Now check other nodes on the path:
- $B$ is a chain ($A \\to B \\to C$), and $B \\notin E$ (not observed) $\\implies$ open.
- $D$ is a fork ($C \\leftarrow D \\to E$), and $D \\notin E$ (not observed) $\\implies$ open.
Every node along the path is unblocked.
Therefore, the path is **active (open)** $\\implies A$ and $E$ are **NOT d-separated** given $C$ $\\implies A \\not\\perp E \\mid C$.`,
        ],
        takeaway: `Observing a collider activates an otherwise blocked path, rendering previously independent causes dependent via explaining away.`,
      },
    },

    3: {
      qa: [
        {
          question: `How does Variable Elimination improve upon naive enumeration in Bayesian network inference?`,
          answer: `Naive enumeration evaluates a query $P(Q \\mid e)$ by summing the full joint distribution over all unobserved hidden variables $H$:
$$P(Q, e) = \\sum_{h_1} \\sum_{h_2} \\dots \\sum_{h_k} \\prod_{i} P(X_i \\mid \\text{Parents}(X_i))$$
This repeatedly recomputes the exact same intermediate products exponentially many times ($O(n \\cdot 2^n)$ work).

**Variable Elimination** avoids repeated computation using dynamic programming:
1. It treats CPTs as multidimensional matrices called **factors** $\\phi$.
2. It pushes summations inward through products using the distributive law ($a \\cdot b + a \\cdot c = a(b + c)$).
3. It eliminates hidden variables one by one by multiplying only the factors that mention that variable, summing it out, and saving the resulting smaller factor.`,
        },
        {
          question: `What governs the computational complexity of Variable Elimination, and what is "treewidth"?`,
          answer: `The computational complexity of Variable Elimination is:
$$O(n \\cdot d^{w^*})$$
where $n$ is the number of variables, $d$ is the maximum domain size, and $w^*$ is the **induced width (treewidth)** of the network under the chosen elimination ordering.

- The treewidth measures how densely connected and cyclic the graph is.
- In **singly-connected networks (polytrees)**, where at most one undirected path exists between any two nodes, treewidth is bounded by the max parents, and inference runs in **linear time $O(n)$**.
- In **multiply-connected networks** (networks with loops/cycles), finding the optimal elimination ordering is **NP-hard**, and worst-case inference is exponential.`,
        },
        {
          question: `What are Pointwise Product and Marginalization (Summing Out) operations on factors?`,
          answer: `- **Pointwise Product ($\\phi_1 \\times \\phi_2$):** Merges two factors whose variable scopes overlap. The resulting factor's scope is the union of variables, and each entry is the product of corresponding entries from $\\phi_1$ and $\\phi_2$.
- **Summing Out / Marginalization ($\\sum_X \\phi$):** Eliminates variable $X$ from factor $\\phi$. The resulting factor's scope removes $X$, and each entry is the sum over all possible values of $X$ for fixed values of the other variables.`,
        },
      ],
      workedExample: {
        title: 'Variable Elimination Trace on a Simple 3-Node Chain',
        scenario: `Consider the chain network: $A \\to B \\to C$, with all binary variables.
CPTs:
- $P(A) = \\langle 0.6, 0.4 \\rangle$ for $A = \\{t, f\\}$
- $P(B \\mid A)$: $P(b \\mid a) = 0.8$, $P(b \\mid \\neg a) = 0.1$
- $P(C \\mid B)$: $P(c \\mid b) = 0.9$, $P(c \\mid \\neg b) = 0.2$
Given evidence $C = c$, compute $P(A \\mid c)$ by eliminating variable $B$.`,
        walkthrough: [
          `**Step 1: Set up initial factors from CPTs incorporating evidence $C = c$:**
- Factor $\\phi_1(A) = P(A) = [0.6, 0.4]$
- Factor $\\phi_2(A, B) = P(B \\mid A)$:
  For $(a, b): 0.8$, for $(a, \\neg b): 0.2$
  For $(\\neg a, b): 0.1$, for $(\\neg a, \\neg b): 0.9$
- Factor $\\phi_3(B) = P(C = c \\mid B) = [0.9, 0.2]$ (conditioned on evidence $c$)`,
          `**Step 2: Eliminate hidden variable $B$:**
Multiply all factors containing $B$ (which are $\\phi_2(A, B)$ and $\\phi_3(B)$):
$$\\phi_4(A, B) = \\phi_2(A, B) \\times \\phi_3(B)$$
- $(a, b): 0.8 \\times 0.9 = 0.72$
- $(a, \\neg b): 0.2 \\times 0.2 = 0.04$
- $(\\neg a, b): 0.1 \\times 0.9 = 0.09$
- $(\\neg a, \\neg b): 0.9 \\times 0.2 = 0.18$`,
          `**Step 3: Sum out $B$ from $\\phi_4(A, B)$:**
$$\\phi_5(A) = \\sum_{B} \\phi_4(A, B)$$
- For $A = a$: $0.72 + 0.04 = 0.76$
- For $A = \\neg a$: $0.09 + 0.18 = 0.27$`,
          `**Step 4: Multiply by remaining factor $\\phi_1(A)$:**
$$\\phi_6(A) = \\phi_1(A) \\times \\phi_5(A)$$
- For $A = a$: $0.6 \\times 0.76 = 0.456$
- For $A = \\neg a$: $0.4 \\times 0.27 = 0.108$`,
          `**Step 5: Normalize:**
$$\\text{Normalizing constant } Z = 0.456 + 0.108 = 0.564$$
$$P(a \\mid c) = \\frac{0.456}{0.564} \\approx 0.8085 \\; (80.85\\%)$$
$$P(\\neg a \\mid c) = \\frac{0.108}{0.564} \\approx 0.1915 \\; (19.15\\%)$$`,
        ],
        takeaway: `Variable elimination pushes summations inward, summing out hidden variables locally to avoid materializing the exponential full joint distribution.`,
      },
    },

    4: {
      qa: [
        {
          question: `Why is Rejection Sampling inefficient when evidence is rare, and how does Likelihood Weighting fix it?`,
          answer: `In **Rejection Sampling**, samples are generated by walking down the network from root to leaf, drawing values according to prior CPTs. If the sample does not match the observed evidence $E = e$, **the entire sample is discarded**.
If evidence is rare (e.g., in medical diagnosis where a patient has a condition occurring in 1 in 10,000 people), $99.99\\%$ of all generated samples are rejected, wasting almost all computation!

**Likelihood Weighting** fixes this by:
1. **Never rejecting a sample:** Evidence variables are clamped to their observed values rather than sampled.
2. Only unobserved variables are sampled forward.
3. Each sample is assigned an importance **weight** equal to the likelihood of the evidence given the sampled parent values:
$$w = \\prod_{i \\in \\text{Evidence}} P(E_i = e_i \\mid \\text{Parents}(E_i))$$
All samples contribute to the final probability estimate, weighted by $w$.`,
        },
        {
          question: `How does Gibbs Sampling work, and why is it an instance of Markov Chain Monte Carlo (MCMC)?`,
          answer: `**Gibbs Sampling** generates a sequence of complete states where each state differs from the preceding one by changing exactly **one variable**:
1. Fix evidence variables to their observed values.
2. Initialize all other variables randomly.
3. Repeatedly cycle through the non-evidence variables. For variable $X_i$, sample its new value conditioned on the current values of its **Markov Blanket**:
$$X_i \\sim P(X_i \\mid MB(X_i))$$

Because the probability of transitioning to the next state depends only on the current state, this process forms a **Markov Chain**. The ergodic theorem guarantees that as the chain runs for enough steps (after a "burn-in" phase), the stationary distribution of the chain converges to the exact true posterior distribution $P(X \\mid e)$.`,
        },
      ],
      workedExample: {
        title: 'Likelihood Weighting Sample Calculation',
        scenario: `Consider the network: $Rain \\to WetGrass \\leftarrow Sprinkler$.
Evidence: $WetGrass = True$.
CPTs:
- $P(Rain) = 0.20$
- $P(Sprinkler) = 0.50$
- $P(WetGrass \\mid Rain, Sprinkler) = 0.99$
- $P(WetGrass \\mid Rain, \\neg Sprinkler) = 0.80$
- $P(WetGrass \\mid \\neg Rain, Sprinkler) = 0.90$
- $P(WetGrass \\mid \\neg Rain, \\neg Sprinkler) = 0.00$
Trace the generation and weighting of a single sample where $Rain$ samples True and $Sprinkler$ samples False.`,
        walkthrough: [
          `**Step 1: Sample root variable $Rain$:**
Draw random number $r_1$. Since $P(Rain) = 0.20$, suppose $r_1 < 0.20$.
Sample: $Rain = True$.`,
          `**Step 2: Sample root variable $Sprinkler$:**
Draw random number $r_2$. Since $P(Sprinkler) = 0.50$, suppose $r_2 \\ge 0.50$.
Sample: $Sprinkler = False$.`,
          `**Step 3: Handle evidence variable $WetGrass$:**
$WetGrass$ is an observed evidence variable, so we do **NOT** sample it.
Clamp $WetGrass = True$.`,
          `**Step 4: Compute the sample weight $w$:**
The weight is the probability of the evidence given its sampled parents:
$$w = P(WetGrass = True \\mid Rain = True, \\; Sprinkler = False)$$
Looking up in the CPT:
$$w = 0.80$$`,
          `**Resulting sample record:**
State: $\\langle Rain = True, \\; Sprinkler = False, \\; WetGrass = True \\rangle$ with weight $w = 0.80$.
This weighted vote is tallied in the accumulator for $Rain = True$.`,
        ],
        takeaway: `Likelihood weighting avoids wasting computation on rejected samples by forcing evidence to hold and reweighting the sample by the probability of that evidence occurring.`,
      },
    },
  },

  13: {
    1: {
      qa: [
        {
          question: `What is Tom Mitchell's formal definition of machine learning, and how does it map to AI agents?`,
          answer: `Tom Mitchell (1997) defined machine learning as:
*"A computer program is said to learn from experience E with respect to some class of tasks T and performance measure P, if its performance at tasks in T, as measured by P, improves with experience E."*

For an autonomous agent:
- **Task T:** The problem the agent solves (e.g., classifying medical images, predicting taxi demand, steering a vehicle).
- **Performance Measure P:** The objective metric evaluating success (e.g., accuracy, mean squared error, F1 score, cumulative reward).
- **Experience E:** The historical interaction data (labeled training examples, sensor logs, or trial-and-error reward signals).`,
        },
        {
          question: `What is an Inductive Bias, and why is learning impossible without one?`,
          answer: `**Inductive Bias** is the set of prior assumptions a machine learning algorithm makes about the target function in order to generalize from finite training data to unseen test instances. Examples:
- Linear models assume the boundary is a hyperplane.
- Decision trees assume the boundary is axis-aligned orthogonal splits.
- Occam's Razor assumes simpler explanations are more probable.

*Why learning is impossible without bias (The No Free Lunch Theorem):* If an algorithm makes no prior assumptions, every unobserved test point could take any arbitrary label without contradicting the training data. A totally unbiased learner can only memorize past data; it has no mathematical basis for predicting anything about the future.`,
        },
      ],
      workedExample: {
        title: 'Mapping Mitchell Learning Primitives to an Autonomous Driving Agent',
        scenario: `Define the Task T, Performance Measure P, and Experience E for an autonomous lane-following vehicle.`,
        walkthrough: [
          `**Task T:** Driving on public highways using steering wheel torque and throttle/brake commands while staying centered within the detected lane boundaries.`,
          `**Performance Measure P:** Average distance deviation from lane center (in centimeters), frequency of manual driver disengagements per 1,000 miles, and smoothness of passenger ride (minimizing jerk/acceleration variance).`,
          `**Experience E:** A dataset of 100,000 hours of synchronized video camera streams paired with human driver steering angles, accelerator positions, and GPS logs across diverse weather conditions.`,
        ],
        takeaway: `Clearly isolating Task, Performance Metric, and Experience prevents confusion between training loss optimization and real-world deployment goals.`,
      },
    },

    2: {
      qa: [
        {
          question: `What is Information Entropy, and why does it use base-2 logarithm?`,
          answer: `**Shannon Entropy** measures the uncertainty or impurity of a set of examples $S$:
$$H(S) = -\\sum_{i=1}^{c} p_i \\log_2(p_i)$$
where $p_i$ is the proportion of examples belonging to class $i$.

Using the base-2 logarithm measures information in **bits** (binary digits):
- If a coin is double-headed ($p_H = 1, p_T = 0$), $H(S) = -(1 \\log_2 1 + 0) = 0$ bits (zero uncertainty; learning the coin flip gives 0 bits of information).
- If a fair coin is flipped ($p_H = 0.5, p_T = 0.5$), $H(S) = -(0.5 \\log_2 0.5 + 0.5 \\log_2 0.5) = 1$ bit (maximum uncertainty; exactly 1 bit is needed to encode the outcome).`,
        },
        {
          question: `How does Information Gain determine the best attribute to split on in Decision Tree learning?`,
          answer: `**Information Gain** measures the expected reduction in entropy achieved by partitioning dataset $S$ according to attribute $A$:
$$\\text{Gain}(S, A) = H(S) - \\sum_{v \\in \\text{Values}(A)} \\frac{|S_v|}{|S|} H(S_v)$$
- $H(S)$ is the prior entropy of the parent node.
- $\\sum \\frac{|S_v|}{|S|} H(S_v)$ is the weighted average entropy of the child nodes.

The attribute with the **highest information gain** produces the purest child nodes, moving the decision tree most rapidly toward deterministic leaf classifications.`,
        },
      ],
      workedExample: {
        title: 'Calculating Entropy and Information Gain for a Binary Split',
        scenario: `A restaurant waiting dataset has 8 examples: 4 positive (WillWait = Yes) and 4 negative (WillWait = No).
Candidate attribute $Patrons$ partitions the 8 examples into two subsets:
- $Patrons = Full$ (6 examples: 4 Yes, 2 No)
- $Patrons = Some$ (2 examples: 0 Yes, 2 No)
Compute $Gain(S, Patrons)$.`,
        walkthrough: [
          `**Step 1: Compute parent entropy $H(S)$:**
$$p_+ = 4/8 = 0.5, \\quad p_- = 4/8 = 0.5$$
$$H(S) = -(0.5 \\log_2 0.5 + 0.5 \\log_2 0.5) = 1.000 \\text{ bit}$$`,
          `**Step 2: Compute entropy of child subset $S_{Some}$:**
Contains 0 Yes, 2 No ($p_+ = 0, p_- = 1$).
$$H(S_{Some}) = -(0 + 1 \\log_2 1) = 0.000 \\text{ bits (pure node!)}$$`,
          `**Step 3: Compute entropy of child subset $S_{Full}$:**
Contains 4 Yes, 2 No ($p_+ = 4/6 = 2/3, p_- = 2/6 = 1/3$).
$$H(S_{Full}) = -\\left( \\frac{2}{3} \\log_2 \\frac{2}{3} + \\frac{1}{3} \\log_2 \\frac{1}{3} \\right)$$
$$H(S_{Full}) = -\\left( 0.667 \\times (-0.585) + 0.333 \\times (-1.585) \\right)$$
$$H(S_{Full}) = -(-0.390 - 0.528) = 0.918 \\text{ bits}$$`,
          `**Step 4: Compute Information Gain:**
$$\\text{Gain}(S, Patrons) = H(S) - \\left( \\frac{2}{8} H(S_{Some}) + \\frac{6}{8} H(S_{Full}) \\right)$$
$$\\text{Gain}(S, Patrons) = 1.000 - \\left( 0.25 \\times 0 + 0.75 \\times 0.918 \\right)$$
$$\\text{Gain}(S, Patrons) = 1.000 - 0.6885 = 0.3115 \\text{ bits}$$`,
        ],
        takeaway: `Splitting on Patrons reduces impurity by 0.31 bits; comparing this against other attributes selects the optimal branch at each decision level.`,
      },
    },

    3: {
      qa: [
        {
          question: `What is the Bias-Variance Decomposition of prediction error?`,
          answer: `For any regression model trained on noisy data $y = f(x) + \\epsilon$ (where $\\epsilon \\sim \\mathcal{N}(0, \\sigma^2)$), the expected generalization error on an unseen point decomposes into three orthogonal terms:
$$\\mathbb{E}[(y - \\hat{f}(x))^2] = \\text{Bias}(\\hat{f}(x))^2 + \\text{Variance}(\\hat{f}(x)) + \\sigma^2$$

1. **Bias$^2$:** Error stemming from overly simplistic model assumptions (e.g., fitting a straight line to a sine wave). High bias causes **underfitting**.
2. **Variance:** Sensitivity of the model to random fluctuations in the training dataset. A high-degree polynomial fits training noise, varying wildly if retrained on different samples. High variance causes **overfitting**.
3. **Irreducible Error ($\\sigma^2$):** Noise inherent in the physical process that cannot be eliminated by any model.`,
        },
        {
          question: `What is the difference between L1 (Lasso) and L2 (Ridge) Regularization?`,
          answer: `Both penalize complex weights by adding a penalty term to the loss function:
- **L2 Regularization (Ridge):** Penalty $= \\lambda \\sum_j w_j^2$.
  - Shrinks weights smoothly toward zero, penalizing large weights heavily.
  - Keeps all features in the model; prevents any single feature from dominating.
- **L1 Regularization (Lasso):** Penalty $= \\lambda \\sum_j |w_j|$.
  - Due to the sharp diamond geometry of the L1 ball at coordinates, it drives many weights **exactly to zero**.
  - Produces **sparse models**, performing automatic feature selection.`,
        },
      ],
      workedExample: {
        title: 'Detecting Overfitting vs Underfitting from Validation Curves',
        scenario: `A machine learning model produces the following loss values across training epochs:
- Model A: Train Loss = 0.45, Validation Loss = 0.46
- Model B: Train Loss = 0.02, Validation Loss = 0.88
- Model C: Train Loss = 0.12, Validation Loss = 0.14
Diagnose each model and recommend the appropriate fix.`,
        walkthrough: [
          `**Diagnosing Model A:**
Train Loss is high, and Validation Loss is equally high. The model fails to fit the training data.
$\\implies$ **Underfitting (High Bias)**.
*Remedy:* Increase model capacity (add layers, features, polynomial terms) or reduce regularization $\\lambda$.`,
          `**Diagnosing Model B:**
Train Loss is near zero (memorizing data), while Validation Loss is high and diverging.
$\\implies$ **Overfitting (High Variance)**.
*Remedy:* Add regularization (dropout, L2 weight decay), collect more training data, or prune tree depth.`,
          `**Diagnosing Model C:**
Train Loss is low, and Validation Loss closely tracks Train Loss without diverging.
$\\implies$ **Optimal Generalization**.`,
        ],
        takeaway: `The gap between training and validation loss is the direct empirical signature of variance, while the baseline error of training loss reveals bias.`,
      },
    },

    4: {
      qa: [
        {
          question: `Why can't Linear Regression be used directly for binary classification?`,
          answer: `If we fit a linear regression line $h_w(x) = w^T x$ to binary targets ($y \\in \\{0, 1\\}$):
1. The predictions are unconstrained real numbers ($(-\\infty, \\infty)$), meaning the model routinely predicts nonsensical probabilities like $P(y=1) = 1.45$ or $-0.30$.
2. Linear regression minimizes squared error $(y - w^T x)^2$. An extreme outlier that is correctly classified with high confidence (e.g., $w^T x = 10$ for $y = 1$) generates a massive squared penalty $(1 - 10)^2 = 81$, which pulls the decision boundary away from its optimal position!

**Logistic Regression** fixes both issues by passing the linear output through the **sigmoid activation function** $\\sigma(z) = \\frac{1}{1 + e^{-z}}$, which strictly bounds outputs between 0 and 1, and optimizes cross-entropy loss.`,
        },
        {
          question: `What is Cross-Entropy (Log Loss) and why is it convex for Logistic Regression?`,
          answer: `For binary classification ($y \\in \\{0, 1\\}$), **Cross-Entropy Loss** is:
$$L(w) = - \\frac{1}{N} \\sum_{i=1}^{N} \\Big[ y_i \\ln(h_w(x_i)) + (1 - y_i) \\ln(1 - h_w(x_i)) \\Big]$$
- If true label $y = 1$, the loss is $-\\ln(h)$. As predicted probability $h \\to 1$, loss $\\to 0$. If $h \\to 0$, loss $\\to \\infty$.
- If true label $y = 0$, the loss is $-\\ln(1 - h)$.

*Convexity:* Unlike Mean Squared Error with a sigmoid (which creates non-convex local minima), Cross-Entropy loss is **strictly convex** with respect to the weights $w$. This guarantees that standard gradient descent will always converge to the unique global minimum.`,
        },
      ],
      workedExample: {
        title: 'Single-Step Gradient Descent Weight Update for Logistic Regression',
        scenario: `Single training example: $x = [1, 2]^T$ (where $x_0 = 1$ is bias), true label $y = 1$.
Current weights: $w = [0.1, -0.2]^T$. Learning rate: $\\alpha = 0.5$.
Perform one step of gradient descent.`,
        walkthrough: [
          `**Step 1: Compute linear combination $z = w^T x$:**
$$z = w_0 x_0 + w_1 x_1 = (0.1)(1) + (-0.2)(2) = 0.1 - 0.4 = -0.3$$`,
          `**Step 2: Compute predicted probability $\\hat{y} = \\sigma(z)$:**
$$\\hat{y} = \\frac{1}{1 + e^{-(-0.3)}} = \\frac{1}{1 + e^{0.3}} = \\frac{1}{1 + 1.34986} \\approx 0.4256$$`,
          `**Step 3: Compute prediction error $(\\hat{y} - y)$:**
$$\\text{Error} = 0.4256 - 1.0 = -0.5744$$`,
          `**Step 4: Compute gradient $\\nabla_w L = (\\hat{y} - y) x$:**
$$\\frac{\\partial L}{\\partial w_0} = (-0.5744)(1) = -0.5744$$
$$\\frac{\\partial L}{\\partial w_1} = (-0.5744)(2) = -1.1488$$`,
          `**Step 5: Apply weight update rule $w \\leftarrow w - \\alpha \\nabla_w L$:**
$$w_0 \\leftarrow 0.1 - 0.5(-0.5744) = 0.1 + 0.2872 = 0.3872$$
$$w_1 \\leftarrow -0.2 - 0.5(-1.1488) = -0.2 + 0.5744 = 0.3744$$`,
        ],
        takeaway: `Because the model underpredicted ($\hat{y} = 0.43$ vs true $1$), the negative gradient increased the weights, making the model more likely to predict 1 on similar inputs in the future.`,
      },
    },

    5: {
      qa: [
        {
          question: `Why does Bagging reduce Variance while Boosting reduces Bias?`,
          answer: `- **Bagging (Bootstrap Aggregation):** Trains multiple deep, independent models in parallel on random bootstrap samples of the training set and averages their predictions.
  - Since each model is deep and unconstrained, its individual bias is low, but its variance is high.
  - Averaging $M$ independent estimators with variance $\\sigma^2$ reduces variance to $\\frac{\\sigma^2}{M}$. Hence, bagging dramatically **reduces variance**.

- **Boosting (AdaBoost, Gradient Boosting):** Trains models sequentially. Each new shallow model focuses specifically on correcting the residual errors and misclassifications of the ensemble before it.
  - By chaining together complementary weak learners, boosting converts high-bias models into an expressive composite function, primarily **reducing bias**.`,
        },
        {
          question: `How does Random Forest improve upon standard Bagged Decision Trees?`,
          answer: `Standard bagging trains trees on bootstrap samples, but if there is one dominant feature in the dataset (e.g., strong medical marker), **every single tree will pick that feature for the root split**. This causes the trees to be highly correlated ($Cov(T_i, T_j) > 0$).
Averaging correlated estimators fails to reduce variance:
$$\\text{Var}\\left(\\frac{1}{M} \\sum T_i\\right) = \\rho \\sigma^2 + \\frac{1-\\rho}{M} \\sigma^2$$
As $M \\to \\infty$, variance does not go to zero; it is bounded by $\\rho \\sigma^2$.

**Random Forests** introduce **feature bagging**: at each candidate split in each tree, the algorithm considers only a random subset of $m \\approx \\sqrt{p}$ features. This decorrelates the trees (lowers $\\rho$), allowing averaging to drive variance down much further.`,
        },
      ],
      workedExample: {
        title: 'AdaBoost Round 1: Sample Weight Update and Classifier Weighting',
        scenario: `A dataset of 4 examples ($x_1, x_2, x_3, x_4$) initialized with equal weights $D_1 = [0.25, 0.25, 0.25, 0.25]$.
A weak classifier $h_1$ correctly classifies $x_1, x_2, x_3$, but misclassifies $x_4$.
Calculate the classifier weight $\\alpha_1$ and update the sample weights $D_2$.`,
        walkthrough: [
          `**Step 1: Compute weighted training error $\\epsilon_1$:**
$$\\epsilon_1 = \\sum_{i: h_1(x_i) \\neq y_i} D_1(i) = D_1(4) = 0.25$$`,
          `**Step 2: Compute classifier voting weight $\\alpha_1$:**
$$\\alpha_1 = \\frac{1}{2} \\ln\\left( \\frac{1 - \\epsilon_1}{\\epsilon_1} \\right) = \\frac{1}{2} \\ln\\left( \\frac{0.75}{0.25} \\right) = \\frac{1}{2} \\ln(3) = \\frac{1}{2} (1.0986) \\approx 0.5493$$`,
          `**Step 3: Update unnormalized sample weights:**
Rule: $D_{new}(i) = D_1(i) \\times e^{-\\alpha_1}$ if correct; $D_{new}(i) = D_1(i) \\times e^{+\\alpha_1}$ if incorrect.
Note that $e^{\\alpha_1} = \\sqrt{3} \\approx 1.732$, and $e^{-\\alpha_1} = 1/\\sqrt{3} \\approx 0.577$.
- For correct $x_1, x_2, x_3$: $0.25 \\times 0.577 = 0.1443$
- For incorrect $x_4$: $0.25 \\times 1.732 = 0.4330$`,
          `**Step 4: Normalize to ensure sum equals 1:**
$$\\text{Sum} = 3(0.1443) + 0.4330 = 0.4330 + 0.4330 = 0.8660$$
- $D_2(1, 2, 3) = \\frac{0.1443}{0.8660} \\approx 0.1667 \\; (16.7\\% \\text{ each})$
- $D_2(4) = \\frac{0.4330}{0.8660} \\approx 0.5000 \\; (50.0\\%)$`,
        ],
        takeaway: `The single misclassified example now constitutes 50% of the entire dataset's weight, forcing the next weak learner in round 2 to focus on getting that example right.`,
      },
    },
  },

  14: {
    1: {
      qa: [
        {
          question: `Why can't a single-layer Perceptron learn the XOR function, and what historical impact did this have?`,
          answer: `A single-layer Perceptron computes a linear combination of its inputs followed by a step function:
$$y = \\text{step}(w_1 x_1 + w_2 x_2 + b)$$
Geometrically, this defines a single straight line (hyperplane) dividing the 2D input plane into two decision regions.

The **XOR (Exclusive OR)** function has:
- $(0, 0) \\to 0$, $(1, 1) \\to 0$
- $(0, 1) \\to 1$, $(1, 0) \\to 1$

Plotting these four points reveals that they are **not linearly separable**: no single straight line can separate the two positive points from the two negative points.
In 1969, Marvin Minsky and Seymour Papert published *Perceptrons*, mathematically proving this limitation. Misinterpreting this to mean that neural networks in general were dead ends caused funding to collapse, triggering the first "AI Winter" until multilayer networks and backpropagation revitalized the field in the 1980s.`,
        },
        {
          question: `Why has ReLU (Rectified Linear Unit) replaced Sigmoid as the standard hidden layer activation function?`,
          answer: `The Sigmoid function $\\sigma(z) = \\frac{1}{1 + e^{-z}}$ suffers from the **Vanishing Gradient Problem**:
When $|z|$ is large (either positive or negative), the curve flattens out, and its derivative $\\sigma'(z) = \\sigma(z)(1 - \\sigma(z))$ approaches zero (max derivative is only $0.25$ at $z=0$). In a 10-layer network, multiplying 10 numbers smaller than $0.25$ yields gradients on the order of $10^{-7}$, halting learning in the earliest layers.

**ReLU (Rectified Linear Unit)**, defined as:
$$\\text{ReLU}(z) = \\max(0, z)$$
has a constant gradient of **1.0** for all positive inputs ($z > 0$). This allows gradients to flow backward through hundreds of layers without decaying, enabling the training of very deep architectures.`,
        },
      ],
      workedExample: {
        title: 'Single-Layer Perceptron Learning Rule Trace',
        scenario: `Train a single perceptron to learn the AND gate.
Initial weights: $w_1 = 0.0, w_2 = 0.0$, bias $b = 0.0$. Learning rate: $\\alpha = 1.0$.
Threshold activation: $\\hat{y} = 1$ if $w_1 x_1 + w_2 x_2 + b > 0$, else $0$.
Trace the update on example $(x_1=1, x_2=1, y=1)$ and then on $(x_1=1, x_2=0, y=0)$.`,
        walkthrough: [
          `**Step 1: First Example $(1, 1) \\to y=1$:**
Compute activation: $z = (0)(1) + (0)(1) + 0 = 0 \\le 0 \\implies \\hat{y} = 0$.
Prediction is wrong (error $e = y - \\hat{y} = 1 - 0 = +1$).
Update rule: $w_i \\leftarrow w_i + \\alpha (y - \\hat{y}) x_i$, $b \\leftarrow b + \\alpha (y - \\hat{y})$:
- $w_1 \\leftarrow 0.0 + 1.0(1)(1) = 1.0$
- $w_2 \\leftarrow 0.0 + 1.0(1)(1) = 1.0$
- $b \\leftarrow 0.0 + 1.0(1) = 1.0$`,
          `**Step 2: Second Example $(1, 0) \\to y=0$:**
Compute activation: $z = (1.0)(1) + (1.0)(0) + 1.0 = 2.0 > 0 \\implies \\hat{y} = 1$.
Prediction is wrong (error $e = 0 - 1 = -1$).
Update rule:
- $w_1 \\leftarrow 1.0 + 1.0(-1)(1) = 0.0$
- $w_2 \\leftarrow 1.0 + 1.0(-1)(0) = 1.0$
- $b \\leftarrow 1.0 + 1.0(-1) = 0.0$`,
        ],
        takeaway: `The perceptron learning rule incrementally shifts the decision boundary until all training examples in a linearly separable dataset are correctly classified.`,
      },
    },

    2: {
      qa: [
        {
          question: `What is the Universal Approximation Theorem, and what does it NOT say?`,
          answer: `The **Universal Approximation Theorem** (Hornik, Stinchcombe, and White, 1989; Cybenko, 1989) proves that:
*A feedforward neural network with a single hidden layer containing a finite number of non-linear neurons can approximate any continuous function on compact subsets of $\\mathbb{R}^n$ to arbitrary precision.*

*What it does NOT say:*
1. It does not say the single hidden layer can be trained in polynomial time (finding the weights might be NP-hard).
2. It does not say the required number of hidden neurons is reasonable (it may require an astronomically exponential number of neurons).
3. It does not guarantee generalization to unseen test data.

This is why modern deep learning uses **deep architectures** (many narrow layers) rather than one monstrously wide shallow layer: composition of hierarchical features requires exponentially fewer parameters.`,
        },
        {
          question: `Why is non-linearity strictly mandatory between layers in a deep neural network?`,
          answer: `If all activation functions were linear ($f(z) = z$), a multi-layer network with 1,000 layers would collapse to a single linear transformation!
Proof:
$$h_1 = W_1 x + b_1$$
$$h_2 = W_2 h_1 + b_2 = W_2 (W_1 x + b_1) + b_2 = (W_2 W_1) x + (W_2 b_1 + b_2) = W' x + b'$$
Because the product of two matrices is simply another matrix, no matter how many layers are stacked, a purely linear network can only compute linear decision boundaries. Non-linear activation functions (ReLU, Sigmoid) are what bend, fold, and warp the coordinate space, allowing deep networks to carve complex non-linear manifolds.`,
        },
      ],
      workedExample: {
        title: 'Solving XOR with a 2-Layer Neural Network by Hand',
        scenario: `Construct an exact Multi-Layer Perceptron (2 inputs, 2 hidden units, 1 output unit) that solves XOR using step activations.`,
        walkthrough: [
          `**Recall XOR Truth Table:**
- $x = (0, 0) \\to 0$
- $x = (1, 0) \\to 1$
- $x = (0, 1) \\to 1$
- $x = (1, 1) \\to 0$
Notice that $XOR(x_1, x_2) = (x_1 \\lor x_2) \\land \\neg (x_1 \\land x_2)$.`,
          `**Hidden Unit 1 ($h_1$ computes OR):**
Weights: $w_{11} = 1.0, w_{21} = 1.0$, bias $b_1 = -0.5$.
$h_1 = \\text{step}(x_1 + x_2 - 0.5)$.
- $(0, 0) \\implies -0.5 \\to 0$
- $(1, 0) \\implies 0.5 \\to 1$
- $(0, 1) \\implies 0.5 \\to 1$
- $(1, 1) \\implies 1.5 \\to 1$`,
          `**Hidden Unit 2 ($h_2$ computes NAND):**
Weights: $w_{12} = -1.0, w_{22} = -1.0$, bias $b_2 = 1.5$.
$h_2 = \\text{step}(-x_1 - x_2 + 1.5)$.
- $(0, 0) \\implies 1.5 \\to 1$
- $(1, 0) \\implies 0.5 \\to 1$
- $(0, 1) \\implies 0.5 \\to 1$
- $(1, 1) \\implies -0.5 \\to 0$`,
          `**Output Unit ($y$ computes AND on $h_1$ and $h_2$):**
Weights: $v_1 = 1.0, v_2 = 1.0$, bias $b_{out} = -1.5$.
$y = \\text{step}(h_1 + h_2 - 1.5)$.
- For $(0, 0)$: $h = (0, 1) \\implies 0 + 1 - 1.5 = -0.5 \\to 0$.
- For $(1, 0)$: $h = (1, 1) \\implies 1 + 1 - 1.5 = 0.5 \\to 1$.
- For $(0, 1)$: $h = (1, 1) \\implies 1 + 1 - 1.5 = 0.5 \\to 1$.
- For $(1, 1)$: $h = (1, 0) \\implies 1 + 0 - 1.5 = -0.5 \\to 0$.`,
        ],
        takeaway: `The hidden layer transforms the original non-linearly separable input space into a new intermediate representation $(h_1, h_2)$ that is linearly separable for the output layer.`,
      },
    },

    3: {
      qa: [
        {
          question: `How does the Backpropagation algorithm compute gradients in $O(W)$ time instead of $O(W^2)$?`,
          answer: `If we computed the partial derivative of the loss with respect to each weight $w_i$ using finite differences:
$$\\frac{\\partial L}{\\partial w_i} \\approx \\frac{L(w_i + \\epsilon) - L(w_i)}{\\epsilon}$$
evaluating $W$ weights would require $W + 1$ complete forward passes through the network. For modern networks with millions of parameters, this $O(W^2)$ cost is impossible.

**Backpropagation** leverages **reverse-mode automatic differentiation** via the chain rule of calculus:
1. In a single **Forward Pass**, it computes and caches all neuron activations.
2. In a single **Backward Pass**, it sweeps from the output layer back to the input layer, computing the error signals $\\delta^{[l]}$ and reusing downstream derivatives.
Every weight's gradient is evaluated in a single backward pass, achieving optimal **$O(W)$ linear computational complexity**.`,
        },
        {
          question: `What are the four fundamental equations of Backpropagation?`,
          answer: `For layer $l$ with activations $a^{[l]} = \\sigma(z^{[l]})$ where $z^{[l]} = W^{[l]} a^{[l-1]} + b^{[l]}$:

1. **Output layer error vector:**
   $$\\delta^{[L]} = \\nabla_{a^{[L]}} L \\odot \\sigma'(z^{[L]})$$
2. **Backpropagating error to preceding layer:**
   $$\\delta^{[l]} = ((W^{[l+1]})^T \\delta^{[l+1]}) \\odot \\sigma'(z^{[l]})$$
3. **Gradient with respect to bias:**
   $$\\frac{\\partial L}{\\partial b^{[l]}} = \\delta^{[l]}$$
4. **Gradient with respect to weight matrix:**
   $$\\frac{\\partial L}{\\partial W^{[l]}} = \\delta^{[l]} (a^{[l-1]})^T$$
(where $\\odot$ represents the Hadamard element-wise product).`,
        },
      ],
      workedExample: {
        title: 'Hand Calculation of a Complete Forward and Backward Pass',
        scenario: `A micro-network: 1 input $x=1.0$, 1 hidden neuron ($w_1 = 0.5, b_1 = 0.0$), 1 output neuron ($w_2 = 0.8, b_2 = 0.0$).
Activation function: Sigmoid $\\sigma(z) = 1/(1+e^{-z})$. Target label: $y = 1.0$.
Loss: Squared error $L = \\frac{1}{2}(\\hat{y} - y)^2$.
Compute $\\frac{\\partial L}{\\partial w_1}$ and $\\frac{\\partial L}{\\partial w_2}$.`,
        walkthrough: [
          `**Step 1: Forward Pass:**
- Hidden pre-activation: $z_1 = w_1 x + b_1 = (0.5)(1.0) + 0 = 0.5$.
- Hidden activation: $a_1 = \\sigma(0.5) = \\frac{1}{1 + e^{-0.5}} = 0.6225$.
- Output pre-activation: $z_2 = w_2 a_1 + b_2 = (0.8)(0.6225) + 0 = 0.4980$.
- Output prediction: $\\hat{y} = a_2 = \\sigma(0.4980) = \\frac{1}{1 + e^{-0.4980}} = 0.6220$.
- Loss: $L = \\frac{1}{2}(0.6220 - 1.0)^2 = \\frac{1}{2}(-0.3780)^2 = 0.0714$.`,
          `**Step 2: Backward Pass - Output Layer:**
Derivative of loss wrt prediction: $\\frac{\\partial L}{\\partial a_2} = a_2 - y = 0.6220 - 1.0 = -0.3780$.
Derivative of sigmoid: $\\sigma'(z_2) = a_2 (1 - a_2) = (0.6220)(0.3780) = 0.2351$.
Output error: $\\delta_2 = \\frac{\\partial L}{\\partial a_2} \\sigma'(z_2) = (-0.3780)(0.2351) = -0.0889$.
Weight gradient for $w_2$:
$$\\frac{\\partial L}{\\partial w_2} = \\delta_2 \\cdot a_1 = (-0.0889)(0.6225) = -0.0553$$`,
          `**Step 3: Backward Pass - Hidden Layer:**
Propagate error back through $w_2$:
$\\delta_1 = (\\delta_2 \\cdot w_2) \\cdot \\sigma'(z_1)$.
$\\delta_2 \\cdot w_2 = (-0.0889)(0.8) = -0.0711$.
$\\sigma'(z_1) = a_1 (1 - a_1) = (0.6225)(0.3775) = 0.2350$.
Hidden error: $\\delta_1 = (-0.0711)(0.2350) = -0.0167$.
Weight gradient for $w_1$:
$$\\frac{\\partial L}{\\partial w_1} = \\delta_1 \\cdot x = (-0.0167)(1.0) = -0.0167$$`,
        ],
        takeaway: `The chain rule cleanly decomposes output errors into layer-by-layer weight gradients, flowing error signals backward proportionally to weight magnitudes and activation derivatives.`,
      },
    },

    4: {
      qa: [
        {
          question: `What are the inductive biases of Convolutional Neural Networks (CNNs)?`,
          answer: `CNNs encode two fundamental physical properties of the visual world:
1. **Local Connectivity (Locality):** Pixels that are close together in space are strongly correlated, whereas distant pixels are not. Rather than connecting every neuron to every pixel, CNN filters operate only on small spatial receptive fields ($3 \\times 3$ or $5 \\times 5$).
2. **Translation Invariance (Weight Sharing):** A feature (like an edge, a corner, or an eye) has the exact same meaning whether it appears in the top-left corner or the bottom-right corner of an image. By sliding the identical filter with shared weights across the entire image, the number of parameters is cut by orders of magnitude, preventing overfitting.`,
        },
        {
          question: `Why did the Transformer architecture replace Recurrent Neural Networks (RNNs and LSTMs) for language modeling?`,
          answer: `RNNs and LSTMs process sequences sequentially, token by token:
$$h_t = f(h_{t-1}, x_t)$$
This recurrent bottleneck causes two fatal problems:
1. **Non-Parallelizable Training:** Step $t$ cannot be computed until step $t-1$ finishes. GPUs cannot be saturated with parallel computation across the sequence length.
2. **Vanishing Gradient over Long Horizons:** Information from token 1 must pass through hundreds of matrix multiplications to reach token 500, diluting context.

The **Transformer** (Vaswani et al., 2017) discarded recurrence in favor of **Self-Attention**:
$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{QK^T}{\\sqrt{d_k}} \\right) V$$
Every token attends directly to every other token in parallel in $O(1)$ sequential operations, allowing massive scaling on modern GPU clusters.`,
        },
      ],
      workedExample: {
        title: 'Calculating Output Dimensions and Parameter Count in a Conv2D Layer',
        scenario: `Input image: $224 \\times 224$ RGB image (3 channels).
Convolutional layer: 32 filters, kernel size $3 \\times 3$, stride $2$, padding $1$ (same padding).
Calculate:
1. Spatial dimensions of the output feature map.
2. Total number of trainable parameters in this layer.`,
        walkthrough: [
          `**Step 1: Compute Output Spatial Dimensions:**
Formula:
$$\\text{Output Dimension} = \\left\\lfloor \\frac{\\text{Input} - \\text{Kernel} + 2(\\text{Padding})}{\\text{Stride}} \\right\\rfloor + 1$$
For width and height:
$$\\text{Dim} = \\left\\lfloor \\frac{224 - 3 + 2(1)}{2} \\right\\rfloor + 1 = \\left\\lfloor \\frac{223}{2} \\right\\rfloor + 1 = 111 + 1 = 112$$
The output tensor has shape: $112 \\times 112 \\times 32$.`,
          `**Step 2: Compute Trainable Parameters:**
Each filter must span all 3 input channels:
$$\\text{Weights per filter} = \\text{Kernel Width} \\times \\text{Kernel Height} \\times \\text{Input Channels}$$
$$\\text{Weights per filter} = 3 \\times 3 \\times 3 = 27$$
Each filter also has 1 bias parameter:
$$\\text{Parameters per filter} = 27 + 1 = 28$$
For 32 filters:
$$\\text{Total Parameters} = 32 \\times 28 = 896 \\text{ parameters}$$`,
        ],
        takeaway: `Weight sharing keeps parameter counts remarkably tiny (896 parameters) even when processing large images, explaining why CNNs generalize efficiently.`,
      },
    },

    5: {
      qa: [
        {
          question: `How does Dropout prevent co-adaptation, and why must it be scaled at inference time?`,
          answer: `During training, **Dropout** randomly sets a fraction $p$ (e.g., $0.5$) of hidden unit activations to zero on each forward pass.
- *Mechanism:* Neurons cannot rely on specific other neurons to correct their mistakes ("co-adaptation"). Each neuron is forced to learn robust, independently useful representations.
- *Ensemble effect:* Dropping neurons randomly trains a different sub-network on each mini-batch, effectively simulating an ensemble of $2^N$ sub-architectures.

*Inference Time:* During testing, dropout is turned **OFF** to produce deterministic predictions. Because twice as many neurons are now active compared to training (if $p = 0.5$), the weights or activations must be scaled down by $(1 - p)$ (or alternatively, during training using **inverted dropout**, scaled up by $\\frac{1}{1-p}$) to keep the expected activation magnitude identical.`,
        },
        {
          question: `How does Batch Normalization accelerate training and stabilize deep networks?`,
          answer: `As neural network weights update during training, the distribution of activations entering each layer shifts constantly—a phenomenon known as **Internal Covariate Shift**. Layers must continually re-adapt to shifting input distributions.

**Batch Normalization** fixes this by explicitly standardizing the activations across each mini-batch $B$:
$$\\hat{x} = \\frac{x - \\mu_B}{\\sqrt{\\sigma_B^2 + \\epsilon}}$$
$$y = \\gamma \\hat{x} + \\beta$$
where $\\gamma$ (scale) and $\\beta$ (shift) are learned parameters that allow the network to restore the optimal representation if needed.
Batch norm allows significantly higher learning rates, reduces sensitivity to initial weight distributions, and acts as a mild regularizer.`,
        },
      ],
      workedExample: {
        title: 'Tracing the Adam Optimizer Weight Update',
        scenario: `A parameter has current gradient $g_t = 0.40$.
Adam hyperparameters: $\\beta_1 = 0.9, \\beta_2 = 0.999, \\epsilon = 10^{-8}$, learning rate $\\alpha = 0.01$.
Previous moment estimates at step $t=1$: $m_0 = 0, v_0 = 0$.
Compute the first step update for the weight.`,
        walkthrough: [
          `**Step 1: Update biased first moment (momentum):**
$$m_1 = \\beta_1 m_0 + (1 - \\beta_1) g_1 = (0.9)(0) + (0.1)(0.40) = 0.040$$`,
          `**Step 2: Update biased second moment (RMSProp variance):**
$$v_1 = \\beta_2 v_0 + (1 - \\beta_2) g_1^2 = (0.999)(0) + (0.001)(0.40^2) = (0.001)(0.16) = 0.00016$$`,
          `**Step 3: Compute bias-corrected moments:**
Because $m_0, v_0$ were initialized at 0, early estimates are biased toward zero.
$$\\hat{m}_1 = \\frac{m_1}{1 - \\beta_1^1} = \\frac{0.040}{1 - 0.9} = \\frac{0.040}{0.1} = 0.40$$
$$\\hat{v}_1 = \\frac{v_1}{1 - \\beta_2^1} = \\frac{0.00016}{1 - 0.999} = \\frac{0.00016}{0.001} = 0.16$$`,
          `**Step 4: Compute parameter update step:**
$$\\Delta w_1 = - \\alpha \\frac{\\hat{m}_1}{\\sqrt{\\hat{v}_1} + \\epsilon} = - 0.01 \\frac{0.40}{\\sqrt{0.16} + 10^{-8}} = - 0.01 \\frac{0.40}{0.40} = - 0.01$$`,
        ],
        takeaway: `Bias correction counteracts zero-initialization, while dividing by the root-mean-square of past gradients normalizes the step size, making Adam invariant to gradient scale.`,
      },
    },
  },
};
