import type { ChapterDeepDive } from './types';

export const DEEP_DIVE_CH06_07: Record<number, ChapterDeepDive> = {
  6: {
    1: {
      qa: [
        {
          question: `Why model a problem as a CSP instead of a plain search problem?`,
          answer: `A plain search problem treats each state as a black box: the solver knows only the start, the actions, and the goal test. A CSP exposes the inside of each state as variables, domains, and constraints, so general algorithms can exploit that structure.

Scale makes the difference. Australia has 7 regions and 3 colors, so there are $3^7 = 2{,}187$ complete assignments. A black-box search must discover which ones are legal. A CSP solver checks constraints locally and prunes whole families of assignments early, which is why the same ideas work for scheduling, timetabling, and Sudoku.`,
        },
        {
          question: `Do I need unary, binary, and higher-order constraints, or can I simplify?`,
          answer: `**Unary** constraints restrict one variable (for example $V \\neq \\text{Green}$), so you can delete those values from the domain before search begins. **Binary** constraints such as $WA \\neq NT$ are the common case and map directly onto a constraint graph.

**Higher-order** constraints involve three or more variables. An ALLDIFF over $n$ variables can always be written as $\\binom{n}{2}$ pairwise $\\neq$ constraints, so any CSP can be reduced to binary constraints, usually with auxiliary variables. Keep a global ALLDIFF when your solver supports it, since it can prune more than its pairwise expansion.`,
        },
        {
          question: `Does every CSP have a solution?`,
          answer: `No. Take three mutually adjacent regions. Each must differ from the other two, so the triangle needs three colors. With only two colors, every complete assignment violates some constraint, so the CSP is unsatisfiable.

With three colors the same triangle has $3 \\cdot 2 \\cdot 1 = 6$ solutions: 3 choices for the first region, then 2, then 1. Note the distinction from the lesson's vocabulary: an assignment that is **complete** (every variable has a value) can still be **inconsistent** (some constraint fails). Only an assignment that is both is a solution.`,
        },
      ],
      workedExample: {
        title: 'Checking candidate assignments for a 4-region map',
        scenario: `Regions WA, NT, SA, and Q; colors {Red, Green, Blue} for each. Constraints (adjacent regions differ): WA $\\neq$ NT, WA $\\neq$ SA, NT $\\neq$ SA, NT $\\neq$ Q, SA $\\neq$ Q. Two candidate assignments are proposed.`,
        walkthrough: [
          `**Formulation:** variables {WA, NT, SA, Q}; each domain {R, G, B}; five binary constraints as listed.`,
          `**Candidate 1:** WA=R, NT=R, SA=G, Q=B. It is complete, but WA $\\neq$ NT fails (R = R). It is not a solution.`,
          `**Candidate 2:** WA=R, NT=G, SA=B, Q=R. It is complete. Check the five constraints: R vs G ✓, R vs B ✓, G vs B ✓, G vs R ✓, B vs R ✓. All hold, so it is a solution.`,
        ],
        takeaway: `A CSP solution must be complete and consistent; a full assignment that breaks even one constraint is still a failure.`,
      },
    },

    2: {
      qa: [
        {
          question: `If AC-3 does not find a solution, why run it?`,
          answer: `AC-3 is cheap inference that shrinks domains before and during search. Every value it removes is a branch the solver never tries. It also detects trouble early: if any domain becomes empty, the current partial assignment cannot be extended, and the solver backtracks at once.

The cost is bounded at $O(cd^3)$ for $c$ binary constraints with maximum domain size $d$. You trade polynomial work for a potentially exponential reduction in search. In the worked example below, AC-3 alone finds the full solution with no branching at all.`,
        },
        {
          question: `Can a CSP be arc-consistent and still be unsolvable?`,
          answer: `Yes. Take three mutually adjacent regions X, Y, Z, each with domain {Red, Green}, and constraints X $\\neq$ Y, Y $\\neq$ Z, X $\\neq$ Z.

Check arc $(X, Y)$: for X = Red there is Y = Green, and for X = Green there is Y = Red. Every arc has the same structure, so no value is ever removed. Yet no assignment works, because a triangle needs three colors.

Arc consistency is a **necessary** condition for a solution, not a sufficient one. When it leaves domains intact, backtracking search is still required.`,
        },
        {
          question: `Why does removing a value re-queue neighboring arcs?`,
          answer: `Each arc $(X_k, X_i)$ checks every value of $X_k$ against the current domain of $X_i$. When $X_i$ loses a value, a value of $X_k$ may lose its only support, so that arc must be checked again. That is why AC-3 re-adds $(X_k, X_i)$ for every neighbor $X_k$ of $X_i$.

The one neighbor it skips is the $X_j$ that caused the revision. This is safe: a removed value $x$ had no support in $D_j$ at all, so it supported no $y \\in D_j$, and removing it cannot weaken $X_j$'s values.`,
        },
      ],
      workedExample: {
        title: 'AC-3 on a triangle: solving by pruning alone',
        scenario: `Regions WA, NT, SA, pairwise adjacent. Domains: WA {Red}, NT {Red, Green}, SA {Red, Green, Blue}. Constraints: WA $\\neq$ NT, WA $\\neq$ SA, NT $\\neq$ SA. The queue starts with all six arcs.`,
        walkthrough: [
          `**REVISE(NT, WA):** NT's Red needs WA $\\neq$ Red, but WA's only value is Red. Remove Red, so NT = {Green}. NT changed, so re-queue (SA, NT).`,
          `**REVISE(SA, WA):** SA's Red has no partner in WA. Remove it, so SA = {Green, Blue}. SA changed, so re-queue (NT, SA).`,
          `**REVISE(SA, NT):** NT is now {Green}, so SA's Green has no partner. Remove it, so SA = {Blue}. Re-queue (WA, SA).`,
          `**Remaining arcs:** (NT, SA) checks Green against {Blue}, fine. (WA, SA) checks Red against Blue, fine. Nothing else changes, and the queue empties. No domain is empty, so there is no failure.`,
          `**Result:** every domain is a singleton: WA = Red, NT = Green, SA = Blue. All three differ, so this is the solution, found with zero search.`,
        ],
        takeaway: `When pruning reduces every domain to one value, inference alone solves the CSP; an empty domain at any point would instead signal that backtracking is needed.`,
      },
    },

    3: {
      qa: [
        {
          question: `Why choose the variable with the fewest values, not the one with the most constraints?`,
          answer: `MRV ("fail-first") is the primary rule. A variable with few legal values is the most likely to run out, and discovering that early keeps the search tree small. The degree heuristic is only the tie-breaker: it counts constraints on unassigned neighbors, and assigning a high-degree variable shrinks many neighboring domains at once.

In the worked example below, Q has only one legal value, so MRV selects it before any choice is made. That forced move then shrinks the domains of NT and SA.`,
        },
        {
          question: `If I only need one solution, why does LCV matter?`,
          answer: `LCV does not change whether a solution exists. It changes how quickly search finds one. Choosing the value that rules out the fewest neighbor values keeps the most options open, so later variables are less likely to hit an empty domain.

If the first value leads to a dead end, the solver backtracks and tries another, so the ordering affects only the amount of work. For an unsolvable CSP every value is eventually tried, and LCV cannot help.`,
        },
        {
          question: `What is forward checking, and how does it differ from AC-3?`,
          answer: `**Forward checking** runs after each assignment. It removes values from the domains of the assigned variable's unassigned neighbors that conflict with the new value. It looks only one step outward.

**AC-3** propagates removals further through the constraint graph, and combining it with search (often called MAC, maintaining arc consistency) prunes more. Forward checking is cheaper per node, while stronger propagation prunes more but costs more at each step. Both detect an empty domain and trigger backtracking.`,
        },
      ],
      workedExample: {
        title: 'MRV and forward checking with a forced region',
        scenario: `Regions WA, NT, SA, Q with colors {R, G, B}. Edges: WA-NT, WA-SA, NT-SA, NT-Q, SA-Q. Unary constraint: Q must be Red, so Q's domain is {R}. All other domains are {R, G, B}.`,
        walkthrough: [
          `**Select:** domain sizes are WA 3, NT 3, SA 3, Q 1. MRV picks Q. Assign Q = R.`,
          `**Forward check:** NT and SA are neighbors of Q, so each loses Red. Now NT = {G, B}, SA = {G, B}, WA = {R, G, B}.`,
          `**Select:** NT and SA tie on MRV with size 2. Each has two unassigned neighbors, so the degree tie-breaker also ties. Take NT.`,
          `**Order values:** Green rules out Green from WA and SA (2 values). Blue rules out Blue from WA and SA (2 values). Tie, so take Green. Assign NT = G.`,
          `**Forward check:** WA loses Green, so WA = {R, B}. SA loses Green, so SA = {B}.`,
          `**Select:** SA has size 1, so assign SA = B. Forward check: WA loses Blue, so WA = {R}. Assign WA = R.`,
          `**Verify:** WA=R, NT=G, SA=B, Q=R. Constraints: R≠G, R≠B, G≠B, G≠R, B≠R, all satisfied. No backtracking was needed.`,
        ],
        takeaway: `MRV selects the most constrained variable first, and forward checking converts each assignment into forced moves, so the solver reaches a solution without trying dead ends.`,
      },
    },
  },
  7: {
    1: {
      qa: [
        {
          question: `What do TELL and ASK do, and why does KB-AGENT call both?`,
          answer: `**TELL** adds a sentence to the knowledge base as an assertion. **ASK** asks the inference engine whether a sentence follows from what is already stored. Each cycle of KB-AGENT does three things: TELL the percept for this time step, ASK for the best action, then TELL the chosen action back into the KB.

The last TELL matters. Without it, the KB would not record what the agent has already decided, so later queries could not reason about the agent's own past moves. ASK never searches through sequences of actions. It answers one question about entailment, and the inference engine is a general procedure that works for any KB.`,
        },
        {
          question: `How is a knowledge-based agent different from a reflex agent or a search agent?`,
          answer: `A **reflex agent** maps the current percept directly to an action through condition-action rules, so it cannot go beyond the rules it was given. A **search agent** plans a sequence of actions toward a goal, but it treats the world as a black box and does not record why a move is safe.

A **knowledge-based agent** stores facts as sentences. When it senses a stench, it can derive that a Wumpus is adjacent, and it can derive that other squares are safe, without trying them first. Its decisions can be explained by pointing to the sentences that entail them. The cost is that knowledge must be written in a formal language, and inference can be expensive.`,
        },
        {
          question: `What is the difference between the knowledge level and the implementation level?`,
          answer: `The **knowledge level** describes what the agent knows, for example "there is a pit in [2,2] or [3,1]", without mentioning data structures. The **implementation level** describes how those sentences are stored (as clauses, bit vectors, or trees) and which algorithm answers ASK.

The same knowledge-level description can be implemented by truth-table enumeration, resolution, or DPLL. Separating the two levels lets you check correctness (does the agent know the right things?) separately from speed (how fast can it answer?).`,
        },
      ],
      workedExample: {
        title: 'One KB-AGENT cycle at the start of the Wumpus World',
        scenario: `The agent starts at [1,1] facing East. Its KB holds the world rules: $B_{x,y} \\Leftrightarrow (P_{x+1,y} \\lor P_{x-1,y} \\lor P_{x,y+1} \\lor P_{x,y-1})$ and the matching rule linking $S_{x,y}$ to Wumpus positions $W$. The percept at [1,1] is empty: no breeze, stench, glitter, bump, or scream. The query is whether [2,1] is safe.`,
        walkthrough: [
          `**TELL percept:** Add $\\neg B_{1,1} \\land \\neg S_{1,1}$ to the KB, meaning no breeze and no stench at [1,1].`,
          `**Apply the rules:** Only [1,2] and [2,1] are adjacent to [1,1] inside the grid. The breeze rule gives $\\neg B_{1,1} \\Leftrightarrow \\neg P_{1,2} \\land \\neg P_{2,1}$, so neither square has a pit. The stench rule gives $\\neg W_{1,2} \\land \\neg W_{2,1}$, so neither has the Wumpus.`,
          `**ASK:** Does the KB entail $\\neg P_{2,1} \\land \\neg W_{2,1}$? Yes. Every model of the KB makes both literals false, so the query is true in every model. The inference is a check over all models, not a search over moves.`,
          `**Act:** Choose Forward into [2,1]. TELL the chosen action into the KB, increase t to 1, and run the next cycle with the new percept.`,
        ],
        takeaway: `ASK can answer yes because the answer holds in every model of the KB, so the agent can enter [2,1] safely without testing it first.`,
      },
    },
    2: {
      qa: [
        {
          question: `Why can the agent conclude that [1,2] is safe from the first percept alone?`,
          answer: `An empty percept at [1,1] means there is no breeze and no stench there. A breeze at [1,1] would come from a pit in a neighbor, and the only neighbors of [1,1] are [1,2] and [2,1]. The missing breeze gives $\\neg P_{1,2} \\land \\neg P_{2,1}$. The missing stench gives $\\neg W_{1,2} \\land \\neg W_{2,1}$.

So both squares are free of pits and of the Wumpus, which makes them safe. This is a deduction from a negative percept, and it is often as informative as a positive one.`,
        },
        {
          question: `Does a breeze tell me which neighbor holds the pit?`,
          answer: `No. A breeze in [x,y] means at least one neighbor has a pit. That is a **disjunction**, not a location. A breeze at [2,1] gives $P_{1,1} \\lor P_{2,2} \\lor P_{3,1}$.

The disjunction shrinks when other percepts rule out options. Here, the agent is alive at [1,1], so there is no pit there. A single percept rarely settles the question, so the agent has to combine percepts from several squares.`,
        },
        {
          question: `What do Glitter, Bump, and Scream tell the agent, and do they follow the same rules as breeze and stench?`,
          answer: `They do not follow the same adjacency rules. **Glitter** means gold is in the current square, so the agent should Grab it. **Bump** means the agent tried to walk into a wall, so it stays where it is. **Scream** means an arrow has killed the Wumpus, which the agent hears anywhere in the cave.

Breeze and stench describe the neighbors of a square and feed the pit and Wumpus rules. Glitter, bump, and scream describe the current square or the last action. A scream also removes the Wumpus constraint from the KB, because the Wumpus is no longer a threat.`,
        },
      ],
      workedExample: {
        title: 'Locating the Wumpus and a pit from three percepts',
        scenario: `The agent is at [1,1] and reports: [1,1] empty; [2,1] breeze only (no stench); [1,2] stench only (no breeze). Use $P_{x,y}$ for pits and $W_{x,y}$ for the Wumpus. Find which squares are safe and where the hazards are.`,
        walkthrough: [
          `**Negative percept at [1,1]:** no breeze and no stench, so $\\neg P_{1,2}$, $\\neg P_{2,1}$, $\\neg W_{1,2}$, and $\\neg W_{2,1}$. Both [1,2] and [2,1] are safe.`,
          `**Breeze at [2,1]:** the pit rule gives $P_{1,1} \\lor P_{2,2} \\lor P_{3,1}$. The agent is alive at [1,1], so $\\neg P_{1,1}$, and the disjunction reduces to $P_{2,2} \\lor P_{3,1}$.`,
          `**Stench at [1,2]:** the Wumpus rule gives $W_{1,1} \\lor W_{1,3} \\lor W_{2,2}$. The agent is alive at [1,1], so $\\neg W_{1,1}$, leaving $W_{1,3} \\lor W_{2,2}$.`,
          `**No breeze at [1,2]:** the neighbors of [1,2] are [1,1], [1,3], and [2,2]. The pit rule gives $\\neg P_{1,3} \\land \\neg P_{2,2}$, so [2,2] has no pit.`,
          `**Combine the pit facts:** from step 2 and step 4, $P_{3,1}$ must be true. The pit is at [3,1].`,
          `**No stench at [2,1]:** the neighbors of [2,1] are [1,1], [3,1], and [2,2]. None of them has the Wumpus, so $\\neg W_{2,2}$. Step 3 then leaves $W_{1,3}$ as the only option. The Wumpus is at [1,3].`,
          `**Verify:** a stench at [1,2] needs the Wumpus next to [1,2], and [1,3] is. A breeze at [2,1] needs a pit next to [2,1], and [3,1] is. No stench at [2,1] holds because [1,3] is not adjacent to [2,1]. No breeze at [1,2] holds because [3,1] is not adjacent to [1,2].`,
        ],
        takeaway: `Negative percepts and the adjacency rules together prove that [2,2] is safe, while [1,3] holds the Wumpus and [3,1] holds a pit, so the agent can plan a safe route without trying a square.`,
      },
    },
    3: {
      qa: [
        {
          question: `What is the difference between entailment ($\\models$) and derivation ($\\vdash$)?`,
          answer: `**Entailment** is semantic: $KB \\models \\alpha$ means that $\\alpha$ is true in every model where the KB is true. **Derivation** is syntactic: $KB \\vdash_i \\alpha$ means that inference procedure $i$ produces $\\alpha$ by applying rules to sentences.

Soundness connects the two (derived sentences are entailed), and completeness goes the other way (entailed sentences can be derived). Entailment is a fact about models, whether or not you know any rules. Derivation is a procedure you can run, which is why the two must be linked by soundness and completeness.`,
        },
        {
          question: `How many models are there, and why does model checking get expensive?`,
          answer: `With $n$ proposition symbols there are $2^n$ models, one for each row of the truth table. Three symbols give $2^3 = 8$ models, but 20 symbols give $2^{20} = 1{,}048{,}576$.

Truth-table enumeration is sound and complete, but its cost doubles with each new symbol. Many rows are irrelevant to the query, and the algorithms in the next steps (resolution and DPLL) work to avoid visiting them.`,
        },
        {
          question: `Is the symbol $\\models$ the same as the connective $\\Rightarrow$?`,
          answer: `No. $\\Rightarrow$ is a connective that builds a sentence, and $P \\Rightarrow Q$ is true or false in each model. $\\models$ is a relation between a KB and a sentence, and it is a claim about all models at once.

The deduction theorem links them: $KB \\models \\alpha$ holds exactly when $KB \\Rightarrow \\alpha$ is valid (true in every model). This is why an entailment question can be turned into a validity or satisfiability question.`,
        },
      ],
      workedExample: {
        title: 'Entailment by enumerating all eight models',
        scenario: `Let KB = $(\\neg P \\lor Q) \\land (\\neg Q \\lor R)$, which encodes $P \\Rightarrow Q$ and $Q \\Rightarrow R$. The query is $\\alpha = \\neg P \\lor R$, which is $P \\Rightarrow R$. Decide whether $KB \\models \\alpha$, and whether $KB \\models P$.`,
        walkthrough: [
          `**Set up:** three symbols give $2^3 = 8$ models. Each row below assigns truth values to P, Q, and R, then evaluates the KB and the query.

| P | Q | R | $\\neg P \\lor Q$ | $\\neg Q \\lor R$ | KB | $\\alpha = \\neg P \\lor R$ |
|---|---|---|---|---|---|---|
| T | T | T | T | T | T | T |
| T | T | F | T | F | F | F |
| T | F | T | F | T | F | T |
| T | F | F | F | T | F | F |
| F | T | T | T | T | T | T |
| F | T | F | T | F | F | T |
| F | F | T | T | T | T | T |
| F | F | F | T | T | T | T |`,
          `**Filter:** the KB is true in four rows: TTT, FTT, FFT, and FFF. The other four rows are excluded because KB is false there.`,
          `**Check the query:** $\\alpha$ is true in all four KB-true rows. Every model of the KB is a model of $\\alpha$, so $KB \\models \\alpha$.`,
          `**Check $P$:** $KB \\models P$ fails. Row FFF makes the KB true and P false, so it is a countermodel. One countermodel is enough to rule out entailment.`,
        ],
        takeaway: `To prove entailment, every KB-true model must satisfy the query; to refute it, a single KB-true model that falsifies the query is enough.`,
      },
    },
    4: {
      qa: [
        {
          question: `Why does resolution negate the query before it starts?`,
          answer: `Resolution is a **refutation** procedure. It derives contradictions, not conclusions. To show $KB \\models \\alpha$, add $\\neg\\alpha$ to the KB and show that $KB \\land \\neg\\alpha$ is unsatisfiable. Deriving the empty clause $\\square$ is exactly that contradiction.

If the empty clause appears, the assumption $\\neg\\alpha$ leads to a contradiction, so $\\alpha$ must be true. Negating the query is what turns the goal into something resolution can reach. Propositional resolution is refutation-complete, so if $KB \\models \\alpha$, the procedure will find the empty clause.`,
        },
        {
          question: `How do I convert a sentence to CNF?`,
          answer: `Apply the four steps in order. For $P \\Leftrightarrow Q$: eliminating $\\Leftrightarrow$ gives $(P \\Rightarrow Q) \\land (Q \\Rightarrow P)$; eliminating $\\Rightarrow$ gives $(\\neg P \\lor Q) \\land (\\neg Q \\lor P)$, which is already CNF.

For $\\neg(P \\land (Q \\lor R))$: moving the negation inward gives $\\neg P \\lor (\\neg Q \\land \\neg R)$. Distributing $\\lor$ over $\\land$ gives $(\\neg P \\lor \\neg Q) \\land (\\neg P \\lor \\neg R)$, which is CNF with two clauses.`,
        },
        {
          question: `Can modus ponens alone prove everything resolution can?`,
          answer: `No. Modus ponens needs an implication whose premise is already known, so it cannot use disjunctions. Take KB = $(P \\lor Q)$, $(\\neg P \\lor R)$, and $(\\neg Q \\lor R)$. The KB entails $R$, since $P$ forces $R$ and $\\neg P$ forces $Q$, which forces $R$.

Modus ponens has no premise to fire: none of the three sentences is an implication with a known antecedent. Resolution handles this directly. Resolving $(P \\lor Q)$ with $(\\neg P \\lor R)$ gives $(Q \\lor R)$, and resolving that with $(\\neg Q \\lor R)$ gives $R$.`,
        },
      ],
      workedExample: {
        title: 'Proving P ⇒ Q, P ⊨ Q by resolution',
        scenario: `KB = $\\{P \\Rightarrow Q,\\; P\\}$. Query $\\alpha = Q$. Show $KB \\models Q$ by refutation. The KB has only one model, so this is easy to check by hand.`,
        walkthrough: [
          `**Negate the goal:** add $\\neg Q$ to the KB. In CNF the clauses are $C_1 = \\neg P \\lor Q$ (from $P \\Rightarrow Q$), $C_2 = P$, and $C_3 = \\neg Q$.`,
          `**Resolve $C_1$ and $C_3$ on Q:** $C_1$ contains $Q$ and $C_3$ contains $\\neg Q$. Cancel both and keep the rest: $C_4 = \\neg P$.`,
          `**Resolve $C_4$ and $C_2$ on P:** $C_4$ contains $\\neg P$ and $C_2$ contains $P$. Cancel both and keep the rest. Nothing remains, so $C_5 = \\square$, the empty clause.`,
          `**Conclude:** the empty clause is a contradiction, so $KB \\land \\neg Q$ is unsatisfiable. Therefore $KB \\models Q$.`,
          `**Check by models:** $P$ must be true, and then $P \\Rightarrow Q$ forces $Q$ to be true. The only KB-true model has $Q = T$, which agrees with the proof.`,
        ],
        takeaway: `Resolution proves an entailment by adding the negated query and cancelling complementary literals until the empty clause appears, so each step is a sound rule application rather than a search over models.`,
      },
    },
    5: {
      qa: [
        {
          question: `Why is DPLL faster than checking every row of a truth table?`,
          answer: `A truth table over $n$ symbols has $2^n$ rows, and it checks each row in full. DPLL stops work as soon as a clause is falsified by the partial assignment, so every branch it cuts removes a whole subtree of rows at once. With 20 symbols the truth table has $2^{20} \\approx 10^6$ rows, but a DPLL search can often finish after a few hundred nodes because early termination and unit propagation cut most of the tree.

The saving is not guaranteed. In the worst case DPLL still explores an exponential tree, which fits the NP-completeness of SAT.`,
        },
        {
          question: `If SAT is NP-complete, why do real SAT solvers work at all?`,
          answer: `NP-completeness is a worst-case result. Practical instances, such as hardware verification or planning encodings, have structure that unit propagation and pure-symbol reasoning exploit. Random instances are a different story: for random 3-SAT the hardest problems cluster at a clause-to-variable ratio of about 4.26, where roughly half of the instances are satisfiable and the search is most difficult.

So solver performance depends on the instance family, not only on the input size.`,
        },
        {
          question: `Why is it safe to set a pure symbol without branching?`,
          answer: `Suppose $P$ appears only as a positive literal. Every clause containing $P$ is already satisfied when $P = \\text{true}$, so setting $P$ true cannot falsify any clause. Removing those clauses leaves a smaller formula, and any model of that smaller formula extends to a model of the original by adding $P = \\text{true}$.

No other choice can do better, so no branch is needed. The same argument works for a negative pure symbol with $P = \\text{false}$.`,
        },
        {
          question: `When would I use WalkSAT instead of DPLL?`,
          answer: `DPLL is **complete**: it always answers SAT or UNSAT. WalkSAT is **incomplete**. It starts from a random assignment, repeatedly flips a variable from an unsatisfied clause, and sometimes makes a random move to escape plateaus. It can find a model quickly for a satisfiable instance, but it can never prove that an instance is unsatisfiable.

Use DPLL when you need a proof of unsatisfiability, such as verifying that a circuit is correct. Use WalkSAT when you only need a satisfying assignment and expect one to exist.`,
        },
      ],
      workedExample: {
        title: 'DPLL on four clauses: unit propagation finds a model',
        scenario: `CNF over symbols A, B, C, D with four clauses: (not A or B), (not B or C), (not C or not D), (A or D). Run DPLL with symbol order A, B, C, D and try TRUE first.`,
        walkthrough: [
          `**Pure symbols:** A appears both negated and positive, so it is not pure. B, C, and D also appear with both signs. No pure symbol exists.`,
          `**Unit clauses:** every clause has two literals, so none is unit. No forced move exists yet, and DPLL must branch.`,
          `**Branch on A = true:** (not A or B) becomes (B), a unit clause. (A or D) is already satisfied by A.`,
          `**Unit propagation, B = true:** (not B or C) becomes (C), so C = true. Clause (not A or B) is now satisfied.`,
          `**Unit propagation, C = true:** (not C or not D) becomes (not D), so D = false.`,
          `**Check:** (not A or B) holds by B, (not B or C) by C, (not C or not D) by not D, and (A or D) by A. Every clause is true, so DPLL returns true with model A = T, B = T, C = T, D = F, and no backtracking was needed.`,
        ],
        takeaway: `Unit propagation turns one decision into a chain of forced assignments, so DPLL often reaches a model or a contradiction after very few real choices.`,
      },
    },
  },
};
