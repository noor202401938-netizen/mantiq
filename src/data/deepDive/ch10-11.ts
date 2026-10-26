import type { ChapterDeepDive } from './types';

export const DEEP_DIVE_CH10_11: Record<number, ChapterDeepDive> = {
  10: {
    1: {
      qa: [
        {
          question: `Why did AI develop domain-independent planning rather than simply using standard graph search (like A* on states)?`,
          answer: `Standard search algorithms (Chapters 3–4) require three hand-crafted components for every single domain: a state data structure, a successor function that generates neighboring states, and an admissible heuristic function ($h(n)$).

In **domain-independent planning**, the agent is given a **declarative description** of the world and action schemas using a standard formal language like PDDL:
- States are sets of logical predicates: $At(Plane1, JFK) \\land In(Cargo2, Plane1)$.
- Actions have explicit preconditions and effects.

Because the physics of actions is declared transparently in logic, a general-purpose planning algorithm can **automatically analyze the problem structure and synthesize its own heuristics** (such as planning graphs or delete-relaxation) without human guidance. The exact same planner can schedule satellites, control chemical plant valves, or guide a Mars rover.`,
        },
        {
          question: `What are the defining assumptions of "Classical Planning", and when do they break down?`,
          answer: `Classical planning rests on eight foundational assumptions:
1. **Fully Observable:** The agent's sensors capture the complete current state (no hidden information).
2. **Deterministic:** Every action has exactly one predictable outcome (no chance or probability).
3. **Static:** The world only changes when the agent acts (no exogenous events or dynamic rivals).
4. **Discrete:** States, actions, and time are discrete entities.
5. **Sequential:** Actions are executed in a strictly ordered sequence, one at a time.
6. **Finite:** State and action spaces are finite.
7. **Single Agent:** The planning agent is the only entity acting in the environment.
8. **Goal-directed:** Success is satisfying a boolean goal condition (no continuous utility trade-offs).

When these fail, we must move to generalized planning: partial observability requires **belief-state planning** (Ch. 4 & 15), stochastic outcomes require **MDPs** (Ch. 16), and dynamic environments require **online replanning or reinforcement learning** (Ch. 21).`,
        },
        {
          question: `How does PDDL cleanly separate the Domain Definition from the Problem Instance?`,
          answer: `PDDL (Planning Domain Definition Language) separates planning into two files:
1. **Domain File:** Defines the universal ontology of the environment that does not change between instances. It declares the predicate signatures ($At(?x, ?y)$, $Clear(?x)$) and the parameterized action schemas with their preconditions and effects ($Move(?x, ?from, ?to)$).
2. **Problem File:** Defines the specific task instance. It lists the concrete objects ($BlockA, BlockB, Table$), the initial ground state ($On(BlockA, Table) \\land Clear(BlockA)$), and the target goal specification ($On(BlockA, BlockB)$).

This separation mirrors the database separation of schema versus database records. One domain definition can support millions of distinct planning problems.`,
        },
      ],
      workedExample: {
        title: 'Specifying an Air Cargo Logistics Problem in PDDL',
        scenario: `Two airports: $SFO$ and $JFK$. One aircraft $P_1$. Two cargo packages $C_1$ and $C_2$.
Initially: $C_1$ and $P_1$ are at $SFO$; $C_2$ is at $JFK$.
Goal: Transport $C_1$ to $JFK$ and $C_2$ to $SFO$.
Define the PDDL action schemas and solve the task.`,
        walkthrough: [
          `**Predicates:**
- $At(c, a)$: cargo $c$ or plane $p$ is at airport $a$.
- $In(c, p)$: cargo $c$ is loaded inside plane $p$.
- Types: $Cargo(c)$, $Plane(p)$, $Airport(a)$.`,
          `**Action 1: Load(c, p, a)**
- *Precondition:* $At(c, a) \\land At(p, a)$
- *Effect:* $In(c, p) \\land \\neg At(c, a)$`,
          `**Action 2: Unload(c, p, a)**
- *Precondition:* $In(c, p) \\land At(p, a)$
- *Effect:* $At(c, a) \\land \\neg In(c, p)$`,
          `**Action 3: Fly(p, from, to)**
- *Precondition:* $At(p, from)$
- *Effect:* $At(p, to) \\land \\neg At(p, from)$`,
          `**Synthesizing the 6-step plan:**
1. $Load(C_1, P_1, SFO)$
2. $Fly(P_1, SFO, JFK)$
3. $Unload(C_1, P_1, JFK)$ (sub-goal 1 achieved!)
4. $Load(C_2, P_1, JFK)$
5. $Fly(P_1, JFK, SFO)$
6. $Unload(C_2, P_1, SFO)$ (sub-goal 2 achieved!)`,
        ],
        takeaway: `PDDL action schemas declare preconditions and effects using variables, allowing the planner to mechanically chain actions by matching added effects to unsatisfied preconditions.`,
      },
    },

    2: {
      qa: [
        {
          question: `How does the STRIPS representation differ from Situation Calculus, and what computational advantage does it gain?`,
          answer: `In **Situation Calculus** (Chapter 9), every fluent carries an explicit situation term ($At(Robot, RoomA, s)$), and reasoning about the next situation requires first-order theorem proving with complex successor-state axioms.

In **STRIPS**:
- States are simply sets of positive ground literals ($On(A, B), Clear(A), HandEmpty$).
- Any literal not in the state is assumed false (Closed-World Assumption).
- An action operates via set transformation:
$$\\text{NewState} = (\\text{CurrentState} \\setminus \\text{DeleteList}) \\cup \\text{AddList}$$

This reduces action application from full first-order logical deduction to blindingly fast **set subtraction and union operations**, speeding up forward state simulation by orders of magnitude.`,
        },
        {
          question: `What is the famous "Sussman Anomaly", and why did it confound early linear planners?`,
          answer: `The **Sussman Anomaly** (identified by Gerald Sussman in 1973) is a classic Blocks World problem that exposed the flaw in early planners that solved subgoals independently and concatenated the plans.

- Initial State: Block $C$ is on $A$; Block $B$ is on the table; Block $A$ is on the table.
- Goal: $On(A, B) \\land On(B, C)$ (a tower with $A$ on $B$ on $C$).

If the planner solves Subgoal 1 ($On(A, B)$) first:
1. It un-stacks $C$ from $A$ and puts $C$ on the table.
2. It stacks $A$ on $B$. Subgoal 1 is achieved!
3. Now it attacks Subgoal 2 ($On(B, C)$). To move $B$ onto $C$, $B$ must be clear. But $A$ is on $B$! So it must un-stack $A$ from $B$, completely **destroying the first subgoal**!

If the planner tries Subgoal 2 ($On(B, C)$) first, it stacks $B$ on $C$, but then cannot pick up $A$ without first moving $C$ away.
The anomaly proved that subgoals **interleave**: actions from different subgoals must be interleaved non-linearly.`,
        },
        {
          question: `Why must a STRIPS goal be treated as a partial state rather than a complete state?`,
          answer: `A state in STRIPS is a complete model of the world (everything unmentioned is false under CWA).

A **goal** is a specification of desirable conditions, typically containing only a tiny fraction of the state literals (e.g., $At(Plane1, JFK)$). It does not specify whether $Cargo5$ is at Paris, or whether the pilot's seat is reclined.
Therefore, a state $s$ satisfies a goal $g$ if:
$$g \\subseteq s$$
Treating goals as partial states is what enables **backward regression search**: the planner regresses only the specific literals demanded by the goal, rather than guessing complete world configurations.`,
        },
      ],
      workedExample: {
        title: 'Resolving the Sussman Anomaly through Interleaved Actions',
        scenario: `Blocks World with blocks A, B, C.
Initial state: $On(C, A), OnTable(A), OnTable(B), Clear(C), Clear(B), ArmEmpty$.
Goal: $On(A, B) \\land On(B, C)$.
Show the optimal interleaved sequence of actions that achieves both subgoals without infinite backtracking.`,
        walkthrough: [
          `**Analysis of conflicts:**
Goal literal $G_1 = On(A, B)$ requires $Clear(B)$.
Goal literal $G_2 = On(B, C)$ requires $Clear(C)$.
Notice that initially $C$ is on $A$, so $A$ is NOT clear! Neither $A$ nor $B$ can be placed until $C$ is moved.`,
          `**Step 1: Unstack C from A (preparatory enabling step):**
Action: $Unstack(C, A)$
- Removes $On(C, A), ArmEmpty, Clear(C)$.
- Adds $Holding(C), Clear(A)$.`,
          `**Step 2: Clear the arm by placing C on the table:**
Action: $PutDown(C)$
- Removes $Holding(C)$.
- Adds $OnTable(C), Clear(C), ArmEmpty$.
Now all three blocks $A, B, C$ are on the table and all are clear!`,
          `**Step 3: Solve Subgoal 2 first ($On(B, C)$):**
Action: $PickUp(B)$
Action: $Stack(B, C)$
- Removes $Clear(C), Holding(B)$.
- Adds $On(B, C), Clear(B), ArmEmpty$.
$G_2 = On(B, C)$ is now achieved. Furthermore, $B$ is clear!`,
          `**Step 4: Solve Subgoal 1 ($On(A, B)$) on top of the foundation:**
Action: $PickUp(A)$
Action: $Stack(A, B)$
- Removes $Clear(B), Holding(A)$.
- Adds $On(A, B), Clear(A), ArmEmpty$.
Both $On(A, B)$ and $On(B, C)$ are simultaneously true!`,
        ],
        takeaway: `Correct planning requires recognizing that preparing the components of one goal (unstacking C) must precede finalizing the other goal (stacking B on C), demonstrating why subgoals cannot be planned as independent linear sequences.`,
      },
    },

    3: {
      qa: [
        {
          question: `What are the trade-offs between Forward Planning (Progression) and Backward Planning (Regression)?`,
          answer: `- **Forward Progression Search:**
  - Starts at the complete initial state $S_0$ and searches forward toward the goal.
  - *Advantage:* At every node, the complete state is known, making heuristic evaluation and state maintenance straightforward.
  - *Disadvantage:* High branching factor. Many actions can be taken that are completely irrelevant to the goal (e.g., in a flight planner, moving unrelated luggage around the airport).

- **Backward Regression Search:**
  - Starts at the partial goal state $g$ and works backward toward $S_0$.
  - *Advantage:* Highly goal-directed. It only considers actions whose add-effects directly achieve at least one unsatisfied goal literal.
  - *Disadvantage:* States are **partial states** (sets of constraints). Checking whether an action is valid requires computing the *weakest precondition*, and handling negative effects requires careful consistency checks.`,
        },
        {
          question: `What is the "Ignore-Delete-Lists" relaxation ($h^+$), and why is finding the optimal $h^+$ itself NP-hard?`,
          answer: `The **ignore-delete-lists relaxation** removes the delete list from every action schema ($EFFECT^- = \\emptyset$).
In this relaxed world, actions only **add** facts and never destroy anything. Once a fact becomes true, it stays true forever.

- *Admissibility:* Because actions cannot undo previous work, any plan in the real world is also a valid plan in the relaxed world. Therefore, the optimal relaxed plan length $h^+(s)$ is a guaranteed **admissible lower bound** on the true cost to the goal.
- *Computational Catch:* Finding the *optimal* minimum-step plan even in a delete-free world is still **NP-hard** (equivalent to minimum set cover).
- *Practical Solution:* Modern planners like FF (FastForward) do not find the *optimal* delete-free plan; instead, they find a *suboptimal* delete-free plan in polynomial time using a planning graph, yielding an exceptionally fast and accurate heuristic $h_{FF}$.`,
        },
        {
          question: `How do additive heuristics ($h_{add}$) compare to max heuristics ($h_{max}$) in forward search?`,
          answer: `Given a set of goal literals $g = \\{g_1, g_2, \\dots, g_k\\}$:
- **Max Heuristic ($h_{max}$):**
  $$h_{max}(s) = \\max_{i} \\text{cost}(s, g_i)$$
  It assumes all subgoals can be achieved in parallel, so the cost is determined by the single hardest subgoal. $h_{max}$ is **strictly admissible** (never overestimates), but can be very weak and pessimistic.
- **Additive Heuristic ($h_{add}$):**
  $$h_{add}(s) = \\sum_{i} \\text{cost}(s, g_i)$$
  It assumes subgoals are completely independent and their costs sum up. While $h_{add}$ is **inadmissible** (it overestimates when actions achieve multiple subgoals simultaneously or share common sub-plans), it is far more informative in guiding greedy search toward the goal.`,
        },
      ],
      workedExample: {
        title: 'Step-by-Step Regression of a Goal State',
        scenario: `Initial state $S_0$: $At(Truck, Boston) \\land In(Package, Truck)$.
Goal $g$: $At(Package, Concord)$.
Action schema: $Unload(p, t, loc)$
- PRECOND: $At(t, loc) \\land In(p, t)$
- EFFECT+: $At(p, loc)$
- EFFECT-: $In(p, t)$
Compute the regressed goal state $g'$ when applying $Unload(Package, Truck, Concord)$ backward from $g$.`,
        walkthrough: [
          `**Step 1: Check relevance:**
Action $a = Unload(Package, Truck, Concord)$ has $EFFECT^+ = \\{At(Package, Concord)\\}$.
Since $At(Package, Concord) \\in g$, the action is **relevant** to achieving the goal.`,
          `**Step 2: Check consistency (conflict detection):**
An action cannot be regressed if its $EFFECT^-$ deletes any literal in the goal $g$.
$EFFECT^- = \\{In(Package, Truck)\\}$.
Since $In(Package, Truck) \\notin g$, the action does not contradict the goal. The action is **consistent**.`,
          `**Step 3: Compute the weakest precondition $g'$:**
The formula for regression is:
$$g' = (g \\setminus EFFECT^+(a)) \\cup PRECOND(a)$$
1. Strip achieved goal literals:
   $g \\setminus EFFECT^+ = \\{At(Package, Concord)\\} \\setminus \\{At(Package, Concord)\\} = \\emptyset$.
2. Add action preconditions:
   $PRECOND(a) = \\{At(Truck, Concord), \\; In(Package, Truck)\\}$.
3. Combine:
   $$g' = \\{At(Truck, Concord), \\; In(Package, Truck)\\}$$`,
          `**Step 4: Interpret the new sub-goal:**
To have the package at Concord via an unload action, the agent's new sub-goal is: have the truck at Concord with the package inside it. The planner can now regress this new goal through a $Drive(Truck, Boston, Concord)$ action.`,
        ],
        takeaway: `Regression works backward by removing what the action achieved and appending what the action requires, focusing search exclusively on goal-relevant antecedents.`,
      },
    },

    4: {
      qa: [
        {
          question: `What is a Planning Graph, and why does it avoid the exponential state explosion of standard search trees?`,
          answer: `A **Planning Graph** (introduced by Avrim Blum and Merrick Furst in 1995 for Graphplan) is an alternating sequence of levels:
$$S_0, A_0, S_1, A_1, S_2, A_2, \\dots, S_k$$
- **State/Literal Levels ($S_i$):** Contain all propositions that *could possibly* be true at time step $i$.
- **Action Levels ($A_i$):** Contain all actions whose preconditions are present in $S_i$.

Crucially, a planning graph does not branch on alternative choices. If action A and action B can both be executed, **both are placed in $A_i$ simultaneously**, and all their effects are placed in $S_{i+1}$. Conflicting choices are tracked via polynomial-time **mutex (mutual exclusion) relations** rather than branching trees.

Thus, a planning graph can be constructed in **polynomial time $O(n(a + l)^2)$**, while an explicit state search tree explodes exponentially.`,
        },
        {
          question: `What are the four distinct types of Mutex (Mutual Exclusion) relations in Graphplan?`,
          answer: `Graphplan defines two action mutexes and two literal mutexes:

1. **Inconsistent Effects (Action Mutex):** One action negates an effect of another action (e.g., Action 1 adds $CleanHands$, Action 2 adds $\\neg CleanHands$).
2. **Interference (Action Mutex):** One action deletes a precondition of another action (e.g., Action 1 deletes $At(Plane, JFK)$, while Action 2 requires $At(Plane, JFK)$ to load cargo).
3. **Competing Needs (Action Mutex):** A precondition of Action 1 and a precondition of Action 2 are marked as mutex in the preceding literal level.
4. **Inconsistent Support (Literal Mutex):** Two literals $P$ and $Q$ at level $S_i$ are mutex if **every possible action** in $A_{i-1}$ that produces $P$ is mutex with **every possible action** that produces $Q$.`,
        },
        {
          question: `What are "Persistence Actions" (No-Ops), and why are they mandatory in planning graphs?`,
          answer: `In a planning graph, a literal at level $S_i$ does not automatically carry over to level $S_{i+1}$ unless an action carries it forward.
To represent inertia (the fact that a property can persist unchanged over time), Graphplan creates a **Persistence Action** (or no-op) for every literal $P$:
- Precondition: $P$
- Effect: $P$

Persistence actions compete with regular actions via mutexes. If regular action $Cook$ adds $\\neg CleanHands$, it will be mutex with the persistence action for $CleanHands$ due to inconsistent effects. This allows the graph to represent change and preservation uniformly.`,
        },
      ],
      workedExample: {
        title: 'Building a Planning Graph Level and Identifying Mutexes: The Dinner Date Problem',
        scenario: `Initial level $S_0$: $\\{CleanHands, \\; Quiet, \\; Garbage\\}$.
Actions:
1. $Cook$: Precond: $CleanHands$; Effect+: $Dinner$.
2. $Wrap$: Precond: $Quiet$; Effect+: $Present$.
3. $CarryOut$: Precond: none; Effect+: none; Effect-: $\\neg Garbage, \\; \\neg CleanHands$.
Construct level $A_0$ and identify which actions are Mutex.`,
        walkthrough: [
          `**Step 1: Identify applicable actions for $A_0$:**
Check preconditions against $S_0$:
- $Cook$: precondition $CleanHands \\in S_0 \\implies$ APPLICABLE.
- $Wrap$: precondition $Quiet \\in S_0 \\implies$ APPLICABLE.
- $CarryOut$: no preconditions $\\implies$ APPLICABLE.
- Persistence actions (no-ops): $NoOp(CleanHands), NoOp(Quiet), NoOp(Garbage)$.`,
          `**Step 2: Check for Inconsistent Effects:**
- $CarryOut$ deletes $CleanHands$ (adds $\\neg CleanHands$).
- $NoOp(CleanHands)$ preserves $CleanHands$.
$\\implies$ $CarryOut$ and $NoOp(CleanHands)$ have inconsistent effects $\\implies$ **MUTEX**.`,
          `**Step 3: Check for Interference:**
- $CarryOut$ deletes $CleanHands$.
- $Cook$ requires $CleanHands$ as a precondition.
$\\implies$ $CarryOut$ deletes a precondition of $Cook$ $\\implies$ $CarryOut$ and $Cook$ **INTERFERE $\\implies$ MUTEX**.`,
          `**Step 4: Check for Competing Needs:**
- $Cook$ requires $CleanHands$.
- $Wrap$ requires $Quiet$.
At level $S_0$, $CleanHands$ and $Quiet$ are both present and NOT mutex.
$\\implies$ $Cook$ and $Wrap$ are **NOT mutex**; they can occur in parallel!`,
          `**Step 5: Literal level $S_1$:**
$S_1$ contains: $CleanHands, Quiet, Garbage, Dinner, Present$.
In $S_1$, $Dinner$ and $\\neg Garbage$ are mutex because the only actions producing them ($Cook$ and $CarryOut$) are mutex in $A_0$ (Inconsistent Support).`,
        ],
        takeaway: `Graphplan explicitly encodes conflict constraints between actions as mutex arcs without branching, establishing whether goals are achievable in $k$ steps.`,
      },
    },
  },

  11: {
    1: {
      qa: [
        {
          question: `What are the three fundamental causes of uncertainty in real-world intelligent systems?`,
          answer: `Russell & Norvig categorize uncertainty into three roots (AIMA Section 13.1):
1. **Laziness:** It is too much work to list the complete set of antecedents or consequents needed to ensure an exception-free rule. In medical diagnosis, writing a purely logical rule $Toothache \\Rightarrow Cavity$ requires hundreds of qualifications (gum disease, abscess, trauma, sinus infection, candy stuck in teeth).
2. **Theoretical Ignorance:** Science does not have a complete theoretical model for the domain. We do not fully understand human physiology, macroeconomic behavior, or atmospheric turbulence.
3. **Practical Ignorance:** Even if the complete deterministic physical laws were known, the agent lacks the sensors or compute to observe all initial conditions (e.g., the exact microbial state in a patient's mouth, or every air molecule around an airplane).

Probability theory provides a rigorous mathematical language for summarizing this ignorance into numerical degrees of belief.`,
        },
        {
          question: `What is the "Dutch Book Argument", and why does it prove that probability is the only rational measure of uncertainty?`,
          answer: `The **Dutch Book Theorem** (proven independently by Frank Ramsey and Bruno de Finetti) states that:
*If an agent's degrees of belief violate any of the standard axioms of probability (Kolmogorov axioms), there exists a combination of bets that an opponent can construct which will guarantee the agent loses money, regardless of which outcome occurs.*

For example, if an agent assigns $P(A) = 0.7$ and $P(\\neg A) = 0.5$ (violating $P(A) + P(\\neg A) = 1$), a bookmaker can sell the agent two bets such that the agent pays $\$1.20$ upfront to receive $\$1.00$ on whichever event occurs—a guaranteed $\$0.20$ loss every time!

Therefore, adhering to probability theory is not an arbitrary preference; it is a mathematical prerequisite for avoiding self-contradictory, exploitable behavior.`,
        },
        {
          question: `How do the Frequentist and Bayesian interpretations of probability differ, and which does modern AI adopt?`,
          answer: `- **Frequentist Interpretation:** Probability represents the relative frequency of an event in the limit of an infinitely repeated experiment under identical conditions (e.g., flipping a fair coin $10^6$ times yields heads $50\\%$ of the time).
  - *Limitation in AI:* Many AI events cannot be repeated. What is the probability that "The stock market will crash tomorrow" or "This patient has pancreatic cancer"? Tomorrow happens only once.
- **Bayesian (Subjective / Epistemic) Interpretation:** Probability represents an agent's **degree of belief** in a proposition given its current state of evidence:
$$P(\\text{Hypothesis} \\mid \\text{Evidence})$$
Beliefs are updated dynamically as new percepts arrive using Bayes' Rule.

Modern AI overwhelmingly adopts the Bayesian view, because rational agents must make decisions under incomplete, non-repeatable evidence.`,
        },
      ],
      workedExample: {
        title: 'The Dutch Book Argument: Exploiting Incoherent Beliefs',
        scenario: `An agent assigns subjective probabilities to an upcoming election between Candidate A and Candidate B (assuming only two outcomes):
Belief that A wins: $P(A) = 0.65$
Belief that B wins (which is $\\neg A$): $P(B) = 0.55$
Notice that $P(A) + P(B) = 1.20 > 1.0$.
Construct a set of bets that forces the agent to lose money guaranteed.`,
        walkthrough: [
          `**Understanding odds and fair bets:**
If an agent believes $P(E) = p$, it considers a bet paying $\$1.00$ if $E$ occurs to be worth $\$p$. It will willingly buy this ticket for $\$p$, or sell it for $\$p$.`,
          `**Constructing the bookmaker's bets:**
1. The bookmaker sells Bet 1 to the agent: "Pays $\$1.00$ if Candidate A wins."
   The agent willingly pays $\$0.65$.
2. The bookmaker sells Bet 2 to the agent: "Pays $\$1.00$ if Candidate B wins."
   The agent willingly pays $\$0.55$.`,
          `**Analyzing cash flow at time of purchase:**
The agent pays total cash upfront:
$$\\text{Total Paid} = \\$0.65 + \\$0.55 = \\$1.20$$`,
          `**Analyzing the payout after the election:**
- *Case 1: Candidate A wins.*
  Bet 1 pays $\$1.00$. Bet 2 pays $\$0.00$. Total payout to agent = $\$1.00$.
  Agent profit = $\\$1.00 - \\$1.20 = -\\$0.20$ (Loss).
- *Case 2: Candidate B wins.*
  Bet 1 pays $\$0.00$. Bet 2 pays $\$1.00$. Total payout to agent = $\$1.00$.
  Agent profit = $\\$1.00 - \\$1.20 = -\\$0.20$ (Loss).`,
          `**Conclusion:**
In every possible state of the world, the agent loses exactly $\$0.20$.`,
        ],
        takeaway: `Any agent whose degrees of belief deviate from Kolmogorov's axioms can be forced into guaranteed losses, proving that probability is the unique rational calculus of belief.`,
      },
    },

    2: {
      qa: [
        {
          question: `What is Bayes' Rule, and why is it considered the foundation of modern probabilistic AI?`,
          answer: `Bayes' Rule relates conditional probabilities by inverting the direction of dependency:
$$P(H \\mid E) = \\frac{P(E \\mid H) \\, P(H)}{P(E)}$$

- $P(H)$: **Prior** probability of hypothesis $H$ before observing evidence.
- $P(E \\mid H)$: **Likelihood** of observing evidence $E$ if hypothesis $H$ were true.
- $P(E)$: **Marginal probability** of evidence (normalizing constant $\\sum_h P(E \\mid h) P(h)$).
- $P(H \\mid E)$: **Posterior** probability of hypothesis $H$ given observed evidence $E$.

*Why it matters in AI:* In the real world, **causes produce symptoms** (causal direction $P(Symptom \\mid Disease)$ is stable and measurable in medical studies). But an agent needs to perform **diagnosis** (diagnostic direction $P(Disease \\mid Symptom)$). Bayes' Rule provides the mathematical bridge to turn stable causal models into diagnostic inference engines.`,
        },
        {
          question: `What is Base Rate Neglect, and how does it lead humans to make catastrophic diagnostic errors?`,
          answer: `**Base Rate Neglect** is the cognitive bias where people assess the probability of a condition based solely on test accuracy, while ignoring the prior prevalence (base rate) of the condition in the population.

Suppose a rare disease affects 1 in 10,000 people ($P(D) = 0.0001$). A test has $99\\%$ accuracy (true positive rate $0.99$, false positive rate $0.01$). If a patient tests positive, most people guess their probability of having the disease is $99\\%$.

In reality, in a population of 10,000 people:
- 1 person has the disease and tests positive.
- 9,999 healthy people take the test, and $1\\%$ of them test positive $\\approx 100$ false positives!
Out of 101 total positive tests, only 1 person actually has the disease ($P(D \\mid +) \\approx 1/101 \\approx 0.99\\%$). Bayes' Rule mechanically incorporates the prior to prevent this error.`,
        },
        {
          question: `What is Marginalization (Summing Out), and how does it extract specific distributions from a Joint Distribution?`,
          answer: `The **Full Joint Distribution** specifies the probability of every possible assignment to all random variables.
To find the probability of a subset of variables $Y$, we sum over all possible values of the remaining unobserved variables $Z$ (called "hidden" or "nuisance" variables):
$$P(Y) = \\sum_{z} P(Y, Z = z)$$
Alternatively, using conditional probabilities (the Law of Total Probability):
$$P(Y) = \\sum_{z} P(Y \\mid Z = z) P(Z = z)$$
Marginalization is the fundamental operation used by probabilistic inference engines to eliminate variables that the user did not query.`,
        },
      ],
      workedExample: {
        title: 'Medical Diagnosis Using Bayes Rule and Likelihood Ratio Normalization',
        scenario: `A rare medical condition $M$ has a prior prevalence of $P(M) = 0.008$ (0.8%).
A laboratory test has:
- Sensitivity (True Positive Rate): $P(+ \\mid M) = 0.98$
- False Positive Rate: $P(+ \\mid \\neg M) = 0.03$
A patient receives a positive test result (+). Calculate the posterior probability $P(M \\mid +)$.`,
        walkthrough: [
          `**Step 1: Identify given probabilities:**
- Prior: $P(M) = 0.008 \\implies P(\\neg M) = 1 - 0.008 = 0.992$
- Likelihood for $M$: $P(+ \\mid M) = 0.98$
- Likelihood for $\\neg M$: $P(+ \\mid \\neg M) = 0.03$`,
          `**Step 2: Compute unnormalized posterior weights:**
$$P(M, +) = P(+ \\mid M) \\times P(M) = 0.98 \\times 0.008 = 0.00784$$
$$P(\\neg M, +) = P(+ \\mid \\neg M) \\times P(\\neg M) = 0.03 \\times 0.992 = 0.02976$$`,
          `**Step 3: Compute the marginal probability of evidence $P(+)$:**
$$P(+) = P(M, +) + P(\\neg M, +) = 0.00784 + 0.02976 = 0.03760$$`,
          `**Step 4: Normalize to obtain posterior probabilities:**
$$P(M \\mid +) = \\frac{P(M, +)}{P(+)} = \\frac{0.00784}{0.03760} \\approx 0.2085 \\; (20.85\\%)$$
$$P(\\neg M \\mid +) = \\frac{P(\\neg M, +)}{P(+)} = \\frac{0.02976}{0.03760} \\approx 0.7915 \\; (79.15\\%)$$`,
          `**Conclusion:**
Even after a positive test result from a $98\\%$ sensitive test, there is only an approximate $\\approx 21\\%$ chance the patient actually has the condition, because healthy false positives outnumber diseased true positives roughly 4 to 1.`,
        ],
        takeaway: `Bayes' Rule rigorously combines diagnostic likelihood with prior prevalence, revealing why positive test results for rare conditions often carry surprisingly low posterior probabilities.`,
      },
    },

    3: {
      qa: [
        {
          question: `Why is the Full Joint Probability Distribution computationally intractable for real-world domains?`,
          answer: `For a domain with $n$ discrete random variables, each taking $d$ possible values, the full joint probability table contains:
$$d^n - 1 \\text{ independent parameters}$$

If we have 30 binary variables (a very modest medical diagnostic model with 30 symptoms and diseases):
$$2^{30} - 1 = 1,073,741,823 \\text{ probabilities}$$

Storing this requires gigabytes of memory, and estimating one billion parameters from real patient data is statistically impossible (requiring astronomical sample sizes).
To build practical AI, we must find **structural independences** that factor this joint distribution into small, manageable pieces.`,
        },
        {
          question: `What is the difference between Absolute Independence and Conditional Independence?`,
          answer: `- **Absolute Independence:** Variables $X$ and $Y$ are independent ($X \\perp Y$) if knowing $Y$ gives zero information about $X$:
  $$P(X \\mid Y) = P(X) \\iff P(X, Y) = P(X) P(Y)$$
  Absolute independence is rare in connected systems. Dentists know that *Toothache* and *Cavity Probe Catch* are strongly correlated, so they are not absolutely independent.

- **Conditional Independence:** Variables $X$ and $Y$ are independent **given a third variable $Z$** ($X \\perp Y \\mid Z$):
  $$P(X \\mid Y, Z) = P(X \\mid Z) \\iff P(X, Y \\mid Z) = P(X \\mid Z) P(Y \\mid Z)$$
  In our dental domain: *Toothache* and *Catch* are conditionally independent given *Cavity*. Once we know whether a cavity is present, knowing that the patient has a toothache adds no new information about whether the probe will catch in the tooth.`,
        },
        {
          question: `How does the Naive Bayes model exploit conditional independence to classify text in linear time?`,
          answer: `In **Naive Bayes**, we assume that all observed feature variables $X_1, X_2, \\dots, X_n$ (e.g., words in an email) are **mutually conditionally independent given the target class $C$** (Spam vs. Ham):
$$P(X_1, X_2, \\dots, X_n \\mid C) = \\prod_{i=1}^{n} P(X_i \\mid C)$$

Using Bayes' Rule, the posterior probability of class $C$ given the document is:
$$P(C \\mid X_1, \\dots, X_n) = \\alpha \\, P(C) \\prod_{i=1}^{n} P(X_i \\mid C)$$

This collapses an exponential $O(2^n)$ joint estimation problem into $n$ separate, simple $O(1)$ counting problems! Even though words in natural language are not truly independent (e.g., "Hong" strongly predicts "Kong"), Naive Bayes works remarkably well because classification only requires getting the **ranking** of the highest class right, not perfect calibrated probabilities.`,
        },
      ],
      workedExample: {
        title: 'Naive Bayes Spam Classification: Step-by-Step Calculation',
        scenario: `Classify an incoming email containing two words: "Winner" and "Cash".
Training set priors:
- $P(Spam) = 0.20$
- $P(Ham) = 0.80$
Word Likelihoods:
- $P(Winner \\mid Spam) = 0.05$, $P(Winner \\mid Ham) = 0.001$
- $P(Cash \\mid Spam) = 0.10$, $P(Cash \\mid Ham) = 0.002$
Using the Naive Bayes assumption, determine if the email is Spam or Ham.`,
        walkthrough: [
          `**Step 1: Compute unnormalized posterior score for Spam:**
$$\\text{Score}(Spam) = P(Spam) \\times P(Winner \\mid Spam) \\times P(Cash \\mid Spam)$$
$$\\text{Score}(Spam) = 0.20 \\times 0.05 \\times 0.10 = 0.00100$$`,
          `**Step 2: Compute unnormalized posterior score for Ham:**
$$\\text{Score}(Ham) = P(Ham) \\times P(Winner \\mid Ham) \\times P(Cash \\mid Ham)$$
$$\\text{Score}(Ham) = 0.80 \\times 0.001 \\times 0.002 = 0.0000016$$`,
          `**Step 3: Normalize to get exact probabilities:**
$$\\text{Total Sum} = 0.00100 + 0.0000016 = 0.0010016$$
$$P(Spam \\mid Winner, Cash) = \\frac{0.00100}{0.0010016} \\approx 0.9984 \\; (99.84\\%)$$
$$P(Ham \\mid Winner, Cash) = \\frac{0.0000016}{0.0010016} \\approx 0.0016 \\; (0.16\\%)$$`,
          `**Decision:**
The posterior probability of Spam is $99.84\\%$. The classifier flags the email as **SPAM**.`,
        ],
        takeaway: `The conditional independence factorization decomposes complex multi-feature inference into a product of simple prior and likelihood ratios, yielding robust classification.`,
      },
    },

    4: {
      qa: [
        {
          question: `What is the Principle of Maximum Expected Utility (MEU), and why does it define rational agent behavior?`,
          answer: `A rational agent cannot simply pick the action that leads to the best possible outcome, because that outcome might be almost impossible (e.g., buying a lottery ticket). Nor should it pick the action with the best worst-case outcome (which is overly paranoid).

The **Maximum Expected Utility (MEU) Principle** asserts that an agent is rational if and only if it chooses the action that maximizes the **expected (probability-weighted) utility**:
$$a^* = \\arg\\max_{a} EU(a \\mid \\mathbf{e}) = \\arg\\max_{a} \\sum_{s'} P(Result(a) = s' \\mid a, \\mathbf{e}) \\, U(s')$$

This unifies **beliefs** (probabilities $P$) and **desires/preferences** (utilities $U$) into a single, mathematically sound objective function.`,
        },
        {
          question: `What are the von Neumann-Morgenstern (VNM) Axioms of Utility?`,
          answer: `John von Neumann and Oskar Morgenstern proved in 1944 that if an agent's preferences over lotteries satisfy 6 intuitive rationality axioms, there **must exist** a real-valued utility function $U$ such that the agent acts as if maximizing expected utility:

1. **Orderability:** Exactly one of $A \\succ B$, $B \\succ A$, or $A \\sim B$ holds.
2. **Transitivity:** If $A \\succ B$ and $B \\succ C$, then $A \\succ C$.
3. **Continuity:** If $A \\succ B \\succ C$, there exists a probability $p$ such that the agent is indifferent between $B$ and the lottery $[p, A; (1-p), C]$.
4. **Substitutability:** If $A \\sim B$, then for any lottery containing $A$, substituting $B$ for $A$ leaves the agent indifferent.
5. **Monotonicity:** If $A \\succ B$ and $p > q$, then $[p, A; (1-p), B] \\succ [q, A; (1-q), B]$.
6. **Decomposability:** Compound lotteries can be reduced to simple lotteries using the rules of probability.`,
        },
        {
          question: `What is Risk Aversion, and why is human utility for money typically concave?`,
          answer: `An agent is **risk-averse** if it prefers a guaranteed payoff of $\$x$ over an uncertain gamble with an expected payout of $\$x$. For example, choosing a guaranteed $\$50$ rather than a coin flip between $\$0$ and $\$100$.

Risk aversion occurs when the utility function $U(m)$ over wealth $m$ is **concave** (its second derivative $U''(m) < 0$, reflecting diminishing marginal utility of wealth):
$$U(50) > 0.5 \\, U(0) + 0.5 \\, U(100)$$
Because the first $\$50,000$ buys food, shelter, and survival, its utility gain is massive. An additional $\$50,000$ on top of $\$10,000,000$ adds very little marginal satisfaction. Insurance companies exist precisely because human utility functions are concave: people gladly pay a guaranteed premium to eliminate catastrophic low-probability losses.`,
        },
      ],
      workedExample: {
        title: 'Airport Commute Decision under Risk: Evaluating Expected Utility',
        scenario: `An agent must reach the airport for an international flight.
- Action 1 ($Subway$): Guaranteed travel time of 50 minutes. No risk.
- Action 2 ($Taxi$): If highway traffic is clear (probability 0.75), travel time is 25 minutes. If highway traffic jams (probability 0.25), travel time is 80 minutes, causing the agent to miss the flight.
Utility function over travel time $t$:
- Arriving on time ($t \\le 60$ mins): $U(t) = 100 - t$
- Missing the flight ($t > 60$ mins): $U(t) = -500$ (severe penalty)
Which action should the rational MEU agent choose?`,
        walkthrough: [
          `**Step 1: Calculate Expected Utility for Action 1 (Subway):**
Subway arrival time is deterministic: $t = 50$ minutes.
Since $t = 50 \\le 60$:
$$U(Subway) = 100 - 50 = +50$$
$$EU(Subway) = 1.0 \\times 50 = +50$$`,
          `**Step 2: Calculate Utilities for Taxi outcomes:**
- *Outcome 1 (Clear traffic, $p = 0.75$):*
  $t = 25$ minutes $\\le 60$.
  $U(t=25) = 100 - 25 = +75$.
- *Outcome 2 (Traffic jam, $p = 0.25$):*
  $t = 80$ minutes $> 60$ (missed flight).
  $U(t=80) = -500$.`,
          `**Step 3: Calculate Expected Utility for Action 2 (Taxi):**
$$EU(Taxi) = P(Clear) \\times U(25) + P(Jam) \\times U(80)$$
$$EU(Taxi) = (0.75 \\times 75) + (0.25 \\times -500)$$
$$EU(Taxi) = 56.25 - 125.00 = -68.75$$`,
          `**Step 4: Apply the MEU Decision Rule:**
$$EU(Subway) = +50 > EU(Taxi) = -68.75$$
$$\\text{Optimal Action } a^* = Subway$$`,
        ],
        takeaway: `Even though the taxi is on average faster (expected time $0.75(25) + 0.25(80) = 38.75$ mins vs 50 mins), the severe non-linear penalty for missing the flight makes the subway the rational choice under Expected Utility.`,
      },
    },
  },
};
