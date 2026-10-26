import type { ChapterDeepDive } from './types';

export const DEEP_DIVE_CH08_09: Record<number, ChapterDeepDive> = {
  8: {
    1: {
      qa: [
        {
          question: `Why does propositional logic scale so poorly when representing facts about objects and relationships?`,
          answer: `Propositional logic treats the world as atomic facts without internal structure. A proposition like $P$ is either true or false; it cannot inspect parts of $P$.

When describing relations among $n$ objects, say $Loves(x, y)$, propositional logic must create an entirely distinct proposition for every pair: $Loves\_John\_Mary$, $Loves\_Mary\_John$, $Loves\_John\_John$, and so on ($n^2$ propositions for a binary relation).

Worse, universal assertions cannot be stated in one rule. To state "Squares adjacent to pits are breezy" in a $4 \\times 4$ Wumpus World requires 16 separate biconditional propositions. In a $100 \\times 100$ grid, it requires 10,000 distinct sentences. First-Order Logic (FOL) solves this by separating **objects**, **relations (predicates)**, and **quantifiers**, allowing the entire rule to be written as a single sentence:
$$\\forall s \\; (Breezy(s) \\iff \\exists s' \\; (Adjacent(s, s') \\land Pit(s')))$$`,
        },
        {
          question: `What are ontological commitments versus epistemological commitments?`,
          answer: `Russell & Norvig contrast formal languages along two philosophical axes (AIMA Table 8.1):

1. **Ontological commitment**: what the language assumes exists in the nature of reality.
   - Propositional logic assumes the world consists of **atomic facts** that hold or do not hold.
   - First-Order Logic assumes the world consists of **objects** (with identity) and **relations** (predicates and functions) between them.
   - Temporal logic adds **time intervals** or points.
   - Probability theory assumes facts with numerical degrees of likelihood.

2. **Epistemological commitment**: what an agent can believe about those facts.
   - Both propositional and FOL commit to a three-valued belief state: an agent can believe a sentence to be **true**, **false**, or **unknown** (degree of belief = 1, 0, or agnostic).
   - Fuzzy logic allows degrees of truth between 0 and 1.
   - Probability theory allows an agent to hold continuous **degrees of belief** from 0 to 1 based on evidence ($P(A \\mid \\mathbf{e}) = 0.72$).`,
        },
        {
          question: `What can Higher-Order Logic do that First-Order Logic cannot, and why do we stick to FOL?`,
          answer: `First-Order Logic allows quantification only over **domain objects**:
$$\\forall x \\; (Man(x) \\Rightarrow Mortal(x))$$
You cannot quantify over relations or predicates themselves. For example, you cannot write in standard FOL:
$$\\forall P \\; (P(x) \\Rightarrow P(y))$$
(which would assert that $x$ and $y$ share every property, the Leibniz definition of identity).

**Higher-Order Logic (HOL)** allows quantification over sets, predicates, and functions. However, Gödel showed that while First-Order Logic is **complete** (any sentence entailed by a KB can be derived in finite steps by a sound proof system like resolution), Higher-Order Logic is fundamentally **incomplete**: no sound proof procedure can prove all valid second-order sentences. FOL sits at the sweet spot of high expressive power and complete deductive inference.`,
        },
      ],
      workedExample: {
        title: 'Translating a Wumpus World breeze rule: Propositional vs First-Order Logic',
        scenario: `Consider stating the rule: "Any square adjacent to a pit is breezy" in a grid world. Compare the propositional encoding with the first-order logic encoding across grid sizes.`,
        walkthrough: [
          `**Propositional representation ($4 \\times 4$ grid):** For each square $(x,y)$, let $B_{x,y}$ mean breezy and $P_{x,y}$ mean pit. We must write a custom sentence for every coordinate:
$B_{1,1} \\iff (P_{1,2} \\lor P_{2,1})$
$B_{1,2} \\iff (P_{1,1} \\lor P_{1,3} \\lor P_{2,2})$
... and so on for all 16 squares. Each corner has 2 neighbors, each edge has 3, and each interior square has 4.`,
          `**Scaling to $100 \\times 100$:** Propositional logic requires 10,000 separate sentences, defining over 40,000 literals. If the grid expands dynamically, all formulas must be rewritten.`,
          `**First-Order Logic representation:** Introduce objects for squares $s, s'$ and predicates $Breezy(s)$, $Pit(s)$, and $Adjacent(s, s')$. The entire general law is captured in one invariant sentence:
$$\\forall s \\; (Breezy(s) \\iff \\exists s' \\; (Adjacent(s, s') \\land Pit(s')))$$`,
          `**Domain independence:** The FOL sentence is completely independent of grid size. It holds for a $4 \\times 4$ grid, a $100 \\times 100$ grid, or an infinite hexagonal grid. The specific topology is isolated inside the $Adjacent$ relation.`,
        ],
        takeaway: `FOL abstracts away problem scale by expressing invariants over relations rather than enumerating individual ground propositions.`,
      },
    },

    2: {
      qa: [
        {
          question: `Why does the universal quantifier ∀ almost always pair with implication ⇒ rather than conjunction ∧?`,
          answer: `Consider the intended statement: "All kings are mortal."
The correct formalization is:
$$\\forall x \\; (King(x) \\Rightarrow Mortal(x))$$
This says: "For every object $x$ in the domain, IF $x$ is a king, THEN $x$ is mortal." For any object that is not a king (e.g., John's crown, a teacup, or the number 7), $King(x)$ is false, which makes the implication $False \\Rightarrow \\dots$ **vacuously true**. Thus, the sentence correctly focuses only on kings.

If you mistakenly write:
$$\\forall x \\; (King(x) \\land Mortal(x))$$
this asserts that **every single entity in the entire universe** is simultaneously a king AND mortal! A single teacup in the universe refutes the sentence because $King(teacup)$ is false.`,
        },
        {
          question: `Why does the existential quantifier ∃ almost always pair with conjunction ∧ rather than implication ⇒?`,
          answer: `Consider the intended statement: "There is a king who is greedy."
The correct formalization is:
$$\\exists x \\; (King(x) \\land Greedy(x))$$
This requires finding at least one object in the domain for which both $King(x)$ and $Greedy(x)$ are true.

If you mistakenly write:
$$\\exists x \\; (King(x) \\Rightarrow Greedy(x))$$
remember that $P \\Rightarrow Q \\equiv \\neg P \\lor Q$. This expands to:
$$\\exists x \\; (\\neg King(x) \\lor Greedy(x))$$
Now, suppose there is an apple or a shoe in the domain. For the shoe, $King(shoe)$ is false, so $\\neg King(shoe)$ is true! That single shoe satisfies the existential implication, making the sentence true even if no king exists at all.`,
        },
        {
          question: `How does quantifier ordering affect meaning when mixing ∀ and ∃?`,
          answer: `The order of mixed quantifiers is not commutative:
1. $\\forall x \\exists y \\; Loves(x, y)$: "Everyone loves someone." For each person $x$, there exists at least one person $y$ (possibly a different $y$ for each $x$) that $x$ loves.
2. $\\exists y \\forall x \\; Loves(x, y)$: "There is someone whom everyone loves." This claims there is a single universal beloved individual $y$ that every person in the domain loves.

Note that if quantifiers are of the same type, order does not change the truth value: $\\forall x \\forall y \\equiv \\forall y \\forall x$ and $\\exists x \\exists y \\equiv \\exists y \\exists x$.`,
        },
        {
          question: `What is the syntactic difference between a Term, an Atomic Sentence, and a Predicate?`,
          answer: `- **Term**: a logical expression that refers to an **object**. Constants ($John$, $5$), variables ($x$, $y$), and function applications ($Father(John)$, $Sqrt(16)$) are terms. Terms do not have truth values.
- **Predicate**: a symbol that represents a relation or property among objects ($King$, $Adjacent$, $Loves$).
- **Atomic Sentence**: formed by applying a predicate symbol to a tuple of terms: $King(Father(John))$ or $Loves(x, Mary)$. An atomic sentence evaluates to **true** or **false** under a given interpretation.`,
        },
      ],
      workedExample: {
        title: 'Applying Quantifier De Morgan Laws and Scope Negation',
        scenario: `Negate the sentence: "Every student attended at least one lecture" and step-by-step simplify the negated expression into an intuitive natural-language claim.`,
        walkthrough: [
          `**Formulate in FOL:** Let $S(x)$ denote "$x$ is a student", $L(y)$ denote "$y$ is a lecture", and $A(x, y)$ denote "$x$ attended $y$".
$$\\alpha = \\forall x \\; (S(x) \\Rightarrow \\exists y \\; (L(y) \\land A(x, y)))$$`,
          `**Apply overall negation:**
$$\\neg \\alpha = \\neg \\forall x \\; (S(x) \\Rightarrow \\exists y \\; (L(y) \\land A(x, y)))$$`,
          `**Push negation past $\\forall$ (De Morgan for quantifiers: $\\neg \\forall x \\; P(x) \\equiv \\exists x \\; \\neg P(x)$):**
$$\\exists x \\; \\neg [S(x) \\Rightarrow \\exists y \\; (L(y) \\land A(x, y))]$$`,
          `**Negate implication (since $\\neg (P \\Rightarrow Q) \\equiv P \\land \\neg Q$):**
$$\\exists x \\; [S(x) \\land \\neg \\exists y \\; (L(y) \\land A(x, y))]$$`,
          `**Push negation past $\\exists$ (De Morgan: $\\neg \\exists y \\; Q(y) \\equiv \\forall y \\; \\neg Q(y)$):**
$$\\exists x \\; [S(x) \\land \\forall y \\; \\neg (L(y) \\land A(x, y))]$$`,
          `**Distribute negation over conjunction (De Morgan: $\\neg (P \\land Q) \\equiv P \\Rightarrow \\neg Q$ or $\\neg P \\lor \\neg Q$):**
$$\\exists x \\; [S(x) \\land \\forall y \\; (L(y) \\Rightarrow \\neg A(x, y))]$$`,
        ],
        takeaway: `Negating "Every student attended some lecture" yields "There exists a student who attended no lectures," proving that pushing negation flips $\\forall \\leftrightarrow \\exists$ and preserves logical duality.`,
      },
    },

    3: {
      qa: [
        {
          question: `What precisely constitutes a Model (Interpretation) in First-Order Logic?`,
          answer: `In propositional logic, a model is simply a truth assignment to propositional variables (e.g., $P = \\text{true}, Q = \\text{false}$).

In First-Order Logic, a **model** $M = \\langle D, I \\rangle$ consists of:
1. A non-empty set $D$ called the **domain** (universe of discourse), containing concrete or abstract objects.
2. An **interpretation function** $I$ that maps:
   - Every constant symbol $c$ to an object $I(c) \\in D$.
   - Every function symbol $f$ of arity $k$ to a total mapping $I(f): D^k \\to D$.
   - Every predicate symbol $P$ of arity $k$ to a relation $I(P) \\subseteq D^k$ (the set of $k$-tuples for which $P$ is true).

A sentence is true in a model if its evaluated relations hold under $I$ across all variable assignments satisfying the quantifiers.`,
        },
        {
          question: `Why can a First-Order Logic sentence have infinitely many models?`,
          answer: `Because the domain $D$ can be any set of any cardinality (finite or infinite), and the interpretation function $I$ can map symbols in uncountably many ways.

Even for a vocabulary with one constant $A$ and one unary predicate $P$:
- We could choose $D = \\{1\\}$, $D = \\{1, 2\\}$, or $D = \\mathbb{N}$ (natural numbers).
- In $D = \\mathbb{N}$, $I(A)$ could be 0, 1, 2, ...
- $I(P)$ could be the evens, the primes, the empty set, or all numbers.

This infinite space of possible models is why checking entailment $KB \\models \\alpha$ **by enumerating truth tables is impossible in FOL**. We must rely on symbolic inference rules (resolution, generalized modus ponens) rather than model enumeration.`,
        },
        {
          question: `What are valid, satisfiable, and unsatisfiable sentences in FOL?`,
          answer: `- **Valid (Tautology)**: true in **all possible models** under all interpretations. Example: $P(x) \\lor \\neg P(x)$, or $(\\forall x \\; P(x)) \\Rightarrow (\\exists x \\; P(x))$ (assuming non-empty domain).
- **Satisfiable**: true in **at least one model**. Example: $King(Richard)$.
- **Unsatisfiable (Contradiction)**: true in **no model**. Example: $P(x) \\land \\neg P(x)$.

Entailment connects to unsatisfiability through refutation: $KB \\models \\alpha$ if and only if $(KB \\land \\neg \\alpha)$ is unsatisfiable.`,
        },
      ],
      workedExample: {
        title: 'Evaluating an FOL Knowledge Base in a 3-Object Model',
        scenario: `Let domain $D = \\{r, j, c\\}$ (Richard, John, Crown).
Interpretation:
- Constant symbols: $John \\to j$, $Richard \\to r$.
- Predicates:
  $King = \\{r\\}$ (only Richard is a king)
  $Person = \\{r, j\\}$ (Richard and John are persons; Crown is not)
  $Greedy = \\{r, j\\}$
- Function: $Brother(j) = r, Brother(r) = j, Brother(c) = c$.
Evaluate the truth value of three sentences in this model.`,
        walkthrough: [
          `**Sentence 1:** $King(Brother(John))$
1. Evaluate term $Brother(John)$: $I(Brother)(I(John)) = I(Brother)(j) = r$.
2. Evaluate predicate $King(r)$: check if $r \\in I(King)$. Since $I(King) = \\{r\\}$, $r \\in I(King)$ is TRUE.
3. Sentence 1 evaluates to **TRUE**.`,
          `**Sentence 2:** $\\forall x \\; (Person(x) \\Rightarrow Greedy(x))$
Check every element $x \\in D$:
- If $x = r$: $r \\in Person$ (T) $\\Rightarrow r \\in Greedy$ (T). $T \\Rightarrow T$ is TRUE.
- If $x = j$: $j \\in Person$ (T) $\\Rightarrow j \\in Greedy$ (T). $T \\Rightarrow T$ is TRUE.
- If $x = c$: $c \\in Person$ (F) $\\Rightarrow c \\in Greedy$ (F). $F \\Rightarrow F$ is TRUE.
Since the implication holds for all three domain objects, Sentence 2 evaluates to **TRUE**.`,
          `**Sentence 3:** $\\forall x \\; Person(x)$
Test $x = c$: $c \\notin Person$, so $Person(c)$ is FALSE.
Since it fails for at least one object in the domain, Sentence 3 evaluates to **FALSE**.`,
        ],
        takeaway: `FOL semantics is completely grounded once a concrete domain and interpretation are defined, validating formulas by mapping terms to objects and testing relational membership.`,
      },
    },

    4: {
      qa: [
        {
          question: `What is Unification, and why do we seek the Most General Unifier (MGU)?`,
          answer: `**Unification** is the algorithmic process of finding a variable substitution $\\theta$ that makes two different logical expressions syntactically identical:
$$\\text{SUBST}(\\theta, p) = \\text{SUBST}(\\theta, q)$$

For example, to unify $Knows(John, x)$ and $Knows(y, Mary)$, we can use $\\theta = \\{y \\to John, x \\to Mary\\}$, making both expressions $Knows(John, Mary)$.

We seek the **Most General Unifier (MGU)** because it imposes the minimum necessary constraints on variables. If we unify $Knows(John, x)$ with $Knows(John, y)$, we could substitute $\\theta_1 = \\{x \\to Mary, y \\to Mary\\}$, but that overcommits. The MGU is $\\theta = \\{x \\to y\\}$, keeping the variable free for subsequent inferences.`,
        },
        {
          question: `What is the "Occurs Check" in unification, and what happens if a solver skips it?`,
          answer: `When unifying a variable $v$ with a term $t$, the **occurs check** verifies whether $v$ appears anywhere inside $t$.
For example:
$$\\text{UNIFY}(x, f(x))$$
If we blindly substitute $x \\to f(x)$, $f(x)$ becomes $f(f(x))$, which becomes $f(f(f(x)))$, creating an infinite, circular term.

Mathematically, no finite object in a standard FOL domain can equal a proper function of itself ($x \\neq f(x)$). The occurs check correctly declares unification **FAILURE**.

*Practical implementation note:* The occurs check takes $O(n)$ time relative to term size, making naive unification quadratic. Early Prolog implementations omitted the occurs check for speed, which causes unsound reasoning (proving false statements) on circular terms. Modern theorem provers include optimized occurs checks.`,
        },
        {
          question: `How does Generalized Modus Ponens (GMP) work for First-Order Definite Clauses?`,
          answer: `Standard Modus Ponens requires exact syntactic match: from $P$ and $P \\Rightarrow Q$, infer $Q$.

**Generalized Modus Ponens (GMP)** lifts this to quantified rules using unification. For atomic premises $p_1', p_2', \\dots, p_k'$ and a rule:
$$(p_1 \\land p_2 \\land \\dots \\land p_k) \\Rightarrow q$$
where a substitution $\\theta$ exists such that $\\text{SUBST}(\\theta, p_i) = \\text{SUBST}(\\theta, p_i')$ for all $i$:
$$\\text{Infer: } \\text{SUBST}(\\theta, q)$$

GMP runs in one unified step: it matches specific ground facts to universal rule premises, instantiates the variables, and derives the inferred conclusion directly.`,
        },
      ],
      workedExample: {
        title: 'Step-by-Step Unification Algorithm Trace',
        scenario: `Find the Most General Unifier (MGU) for the expressions:
$p = Knows(John, f(x, Jane))$
$q = Knows(y, f(Mother(y), z))$`,
        walkthrough: [
          `**Step 1: Check top-level predicate symbols:** Both $p$ and $q$ use the binary predicate $Knows$. Predicates match, arity is 2. Initialize substitution $\\theta = \\{\\}$.`,
          `**Step 2: Unify first argument pair $(John, y)$:**
$y$ is a variable, $John$ is a constant. $y$ does not occur in $John$.
Add $\\{y \\to John\\}$ to $\\theta$.
Apply current substitution $\\theta$ to the remaining terms:
$p' = Knows(John, f(x, Jane))$
$q' = Knows(John, f(Mother(John), z))$`,
          `**Step 3: Unify second argument pair $(f(x, Jane), f(Mother(John), z))$:**
Both have top-level function symbol $f$ with arity 2. Function names and arity match; proceed to their arguments.`,
          `**Step 4: Unify first sub-arguments $(x, Mother(John))$:**
$x$ is a variable. Occurs check: does $x$ appear in $Mother(John)$? No.
Add $\\{x \\to Mother(John)\\}$ to $\\theta$.
Current $\\theta = \\{y \\to John, x \\to Mother(John)\\}$.`,
          `**Step 5: Unify second sub-arguments $(Jane, z)$:**
$z$ is a variable, $Jane$ is a constant. Occurs check: $z$ does not occur in $Jane$.
Add $\\{z \\to Jane\\}$ to $\\theta$.`,
          `**Resulting MGU:**
$$\\theta = \\{y \\to John, \\; x \\to Mother(John), \\; z \\to Jane\\}$$
Check: $\\text{SUBST}(\\theta, p) = \\text{SUBST}(\\theta, q) = Knows(John, f(Mother(John), Jane))$.`,
        ],
        takeaway: `Unification recursively decomposes compound terms and accumulates variable bindings, finding the unique MGU that aligns both expressions.`,
      },
    },

    5: {
      qa: [
        {
          question: `Why is Skolemization needed, and what is the difference between a Skolem constant and a Skolem function?`,
          answer: `First-order resolution works on clauses where all variables are **implicitly universally quantified**. To remove existential quantifiers ($\\exists$), we use **Skolemization**.

- **Skolem Constant:** If $\\exists x$ is not governed by any outer universal quantifier:
  $$\\exists x \\; Crown(x)$$
  we replace $x$ with a brand-new constant symbol $C_1$ that does not appear anywhere else in the KB:
  $$Crown(C_1)$$
  $C_1$ names the "thing that must exist."

- **Skolem Function:** If $\\exists y$ is inside the scope of a universal quantifier $\\forall x$:
  $$\\forall x \\exists y \\; Loves(x, y)$$
  we cannot use a single constant because the beloved $y$ may depend on who $x$ is! We introduce a **Skolem function** $F(x)$:
  $$\\forall x \\; Loves(x, F(x))$$
  $F(x)$ represents the mapping that selects the corresponding $y$ for each $x$.`,
        },
        {
          question: `What are the canonical steps to convert any arbitrary FOL sentence into Conjunctive Normal Form (CNF)?`,
          answer: `AIMA outlines 6 rigorous steps:
1. **Eliminate implications & biconditionals:**
   $A \\Rightarrow B \\equiv \\neg A \\lor B$
   $A \\iff B \\equiv (\\neg A \\lor B) \\land (\\neg B \\lor A)$
2. **Move negation inward (De Morgan):**
   $\\neg (A \\land B) \\equiv \\neg A \\lor \\neg B$, $\\neg (A \\lor B) \\equiv \\neg A \\land \\neg B$
   $\\neg \\forall x \\; P \\equiv \\exists x \\; \\neg P$, $\\neg \\exists x \\; P \\equiv \\forall x \\; \\neg P$
3. **Standardize variables apart:** Ensure each quantifier binds a unique variable name (e.g., $(\\forall x \\; P(x)) \\lor (\\forall x \\; Q(x)) \\to (\\forall x \\; P(x)) \\lor (\\forall y \\; Q(y))$).
4. **Skolemize:** Replace existential variables with Skolem constants or functions depending on enclosing universal quantifiers.
5. **Drop universal quantifiers:** All remaining variables are universally quantified; drop the $\\forall$ symbols.
6. **Distribute $\\lor$ over $\\land$:** Put into a conjunction of disjunctions ($A \\lor (B \\land C) \\equiv (A \\lor B) \\land (A \\lor C)$).`,
        },
        {
          question: `What does it mean that First-Order Logic is "semi-decidable"?`,
          answer: `Alan Turing and Alonzo Church proved in 1936 that first-order logic entailment is **semi-decidable**:
- If sentence $\\alpha$ is **entailed** by $KB$ ($KB \\models \\alpha$), refutation resolution is complete and **guaranteed to find a proof** in a finite number of steps by deriving the empty clause $\\square$.
- However, if $\\alpha$ is **NOT entailed** by $KB$ ($KB \\not\\models \\alpha$), the resolution search space may be infinite (due to function symbols generating an unbounded Herbrand universe), and the algorithm may **run forever without terminating**.

In contrast, propositional logic is fully **decidable** (truth tables or DPLL always terminate, though worst-case exponential).`,
        },
      ],
      workedExample: {
        title: 'Full Resolution Refutation Proof: The West Crimes Problem',
        scenario: `Axioms:
1. "It is a crime for an American to sell weapons to hostile nations."
   $\\forall x, y, z \\; (American(x) \\land Weapon(y) \\land Sells(x, y, z) \\land Hostile(z) \\Rightarrow Criminal(x))$
2. "Cuba has missiles."
   $\\exists x \\; (Owns(Cuba, x) \\land Missile(x))$
3. "All of Cuba's missiles were sold to it by West."
   $\\forall x \\; (Missile(x) \\land Owns(Cuba, x) \\Rightarrow Sells(West, x, Cuba))$
4. "Missiles are weapons."
   $\\forall x \\; (Missile(x) \\Rightarrow Weapon(x))$
5. "Enemy of America is hostile."
   $\\forall x \\; (Enemy(x, America) \\Rightarrow Hostile(x))$
6. Ground facts: $American(West)$, $Enemy(Cuba, America)$.
Prove: $Criminal(West)$ by resolution refutation.`,
        walkthrough: [
          `**Step 1: Convert axioms to CNF:**
$C_1$: $\\neg American(x) \\lor \\neg Weapon(y) \\lor \\neg Sells(x, y, z) \\lor \\neg Hostile(z) \\lor Criminal(x)$
$C_2$: $Owns(Cuba, M_1)$ (Skolem constant $M_1$ from axiom 2)
$C_3$: $Missile(M_1)$
$C_4$: $\\neg Missile(x_1) \\lor \\neg Owns(Cuba, x_1) \\lor Sells(West, x_1, Cuba)$
$C_5$: $\\neg Missile(x_2) \\lor Weapon(x_2)$
$C_6$: $\\neg Enemy(x_3, America) \\lor Hostile(x_3)$
$C_7$: $American(West)$
$C_8$: $Enemy(Cuba, America)$`,
          `**Step 2: Negate the query and add to KB:**
$C_9$: $\\neg Criminal(West)$`,
          `**Step 3: Resolve $C_1$ with $C_9$:**
Unify $Criminal(x)$ with $Criminal(West) \\implies \\{x \\to West\\}$.
$C_{10}$: $\\neg American(West) \\lor \\neg Weapon(y) \\lor \\neg Sells(West, y, z) \\lor \\neg Hostile(z)$`,
          `**Step 4: Resolve $C_{10}$ with $C_7$ ($American(West)$):**
$C_{11}$: $\\neg Weapon(y) \\lor \\neg Sells(West, y, z) \\lor \\neg Hostile(z)$`,
          `**Step 5: Resolve $C_6$ and $C_8$ on $Enemy$:**
Unify $x_3 \\to Cuba$.
$C_{12}$: $Hostile(Cuba)$`,
          `**Step 6: Resolve $C_{11}$ with $C_{12}$ on $Hostile$:**
Unify $z \\to Cuba$.
$C_{13}$: $\\neg Weapon(y) \\lor \\neg Sells(West, y, Cuba)$`,
          `**Step 7: Resolve $C_{13}$ with $C_5$ ($Weapon$):**
Unify $y \\to x_2$.
$C_{14}$: $\\neg Missile(x_2) \\lor \\neg Sells(West, x_2, Cuba)$`,
          `**Step 8: Resolve $C_{14}$ with $C_4$ ($Sells$):**
Unify $x_2 \\to x_1$.
$C_{15}$: $\\neg Missile(x_1) \\lor \\neg Owns(Cuba, x_1)$`,
          `**Step 9: Resolve $C_{15}$ with $C_3$ ($Missile(M_1)$):**
Unify $x_1 \\to M_1$.
$C_{16}$: $\\neg Owns(Cuba, M_1)$`,
          `**Step 10: Resolve $C_{16}$ with $C_2$ ($Owns(Cuba, M_1)$):**
Literals cancel out completely $\\implies \\square$ (the empty clause). Contradiction found!`,
        ],
        takeaway: `FOL resolution systematically establishes entailment by deriving the empty clause through chained unification of complementary literals.`,
      },
    },
  },

  9: {
    1: {
      qa: [
        {
          question: `What is an Upper Ontology, and why are domain-specific ontologies ineffective without one?`,
          answer: `An **Upper Ontology** (also known as a top-level or foundation ontology) defines the most general, cross-domain categories: *Thing, Physical Object, Abstract Object, Event, Time, Space, Action, Agent*. Examples include Cyc, SUMO (Suggested Upper Merged Ontology), and BFO (Basic Formal Ontology).

Without an upper ontology, different domain models cannot communicate. For example:
- A medical database describes a patient's *Surgery* as an "Encounter".
- A hospital billing system describes *Surgery* as a "Billable Procedure".
- A scheduling database describes *Surgery* as a "Calendar Event".

An upper ontology anchors all three to a shared ancestor concept: $Event$ (which has a start time, duration, and participating agents). This provides formal semantic interoperability across independent databases and software agents.`,
        },
        {
          question: `What is the fundamental metaphysical distinction between "Objects" (Count Nouns) and "Stuff" (Mass Nouns)?`,
          answer: `In Knowledge Representation, this distinction governs how physical reality is divided (mereology):
- **Discrete Objects (Count Nouns):** Entities that have distinct shapes, spatial boundaries, and non-arbitrary parts. Examples: *Apple, Car, Person*.
  - Discrete objects have **identity criteria**: if you cut an apple in two, you do not have two apples; you have apple halves.
  - They are measured by counting: $|Apples| = 5$.
- **Stuff / Substance (Mass Nouns):** Continuous materials that lack natural units or inherent boundaries. Examples: *Water, Gold, Butter*.
  - Stuff exhibits **mereological divisibility**: any subpart of a pool of water is still water.
  - Stuff cannot be counted directly; it must be quantified with measure functions: $Mass(g) = 50\\text{kg}$ or $Volume(w) = 2.5\\text{L}$.`,
        },
        {
          question: `What are the main stages of the Knowledge Engineering process in AI?`,
          answer: `Knowledge engineering builds a formal representation of a real-world domain. AIMA Section 8.4 identifies a 7-step process:
1. **Identify the task:** What queries must the system answer?
2. **Assemble relevant knowledge:** Extract concepts and rules from domain experts and literature.
3. **Decide on a vocabulary:** Pick predicate, function, and constant symbols.
4. **Encode general domain knowledge:** Write universal axioms and taxonomy.
5. **Encode a specific problem instance:** Add specific initial ground facts.
6. **Pose queries to the inference procedure:** Run deduction to derive answers.
7. **Debug the knowledge base:** Fix missing axioms, unintended implications, and incorrect assumptions.`,
        },
      ],
      workedExample: {
        title: 'Formalizing Discrete Objects vs Mass Substances (Stuff) in FOL',
        scenario: `Express the following statements in First-Order Logic using ontology principles:
1. "A gold ring weighing 10 grams."
2. "Melting the ring produces gold, but not a ring."`,
        walkthrough: [
          `**Define vocabulary:**
- Categories: $Ring$ (discrete object category), $Gold$ (mass stuff category).
- Predicates: $PartOf(p, x)$ (subpart relation).
- Measure functions: $Mass(x)$ returning grams.`,
          `**Sentence 1: A gold ring weighing 10 grams:**
There exists an object $r$ such that $r$ is a member of the $Ring$ category, the material of $r$ is an instance of $Gold$, and its mass is 10:
$$\\exists r, g \\; (Ring(r) \\land Gold(g) \\land MadeOf(r, g) \\land Mass(r) = Grams(10))$$`,
          `**Sentence 2: Axiomatizing the nature of Stuff:**
If something is made of Gold, any physical part $p$ of that material is also Gold (substance persistence):
$$\\forall g, p \\; (Gold(g) \\land PartOf(p, g) \\Rightarrow Gold(p))$$
In contrast, for a discrete category like $Ring$, a part of a ring is NOT a ring:
$$\\forall r, p \\; (Ring(r) \\land ProperPartOf(p, r) \\Rightarrow \\neg Ring(p))$$`,
          `**Action consequence (Melting):**
Let $Result(Melt, r) = g'$. The resulting entity $g'$ satisfies $Gold(g')$ because its constituent matter is preserved, but $Ring(g')$ evaluates to false because its structural shape invariant is destroyed.`,
        ],
        takeaway: `Distinguishing between count categories (defined by shape and function) and mass categories (defined by constituent matter) prevents category errors when reasoning about physical transformation.`,
      },
    },

    2: {
      qa: [
        {
          question: `How are categories represented in FOL: unary predicates vs reified first-class objects?`,
          answer: `There are two common representation paradigms in FOL:

1. **Unary Predicate approach:**
   $Dog(Fido)$, $Mammal(x)$
   Subclass relation is an implication:
   $$\\forall x \\; (Dog(x) \\Rightarrow Mammal(x))$$
   *Limitation:* You cannot easily quantify over categories or state properties of the category itself, such as "Dogs are an endangered species" (because $Endangered(Dog)$ would treat the predicate $Dog$ as an object, violating FOL syntax).

2. **Reified Category approach (First-Class Objects):**
   Categories are treated as individual domain objects ($Dogs$, $Mammals$). We use explicit membership and subset relations:
   $$MemberOf(Fido, Dogs)$$
   $$Subset(Dogs, Mammals)$$
   Now you can cleanly predicate over the category itself:
   $$PopulationCount(Dogs, 500000000)$$
   $$Endangered(BengalTigers)$$
   AIMA standardly uses the reified category approach for large-scale ontologies.`,
        },
        {
          question: `What is the significance of Disjointness and Exhaustive Decomposition in classification ontologies?`,
          answer: `- **Disjoint Categories:** two categories share no instances. For example, $Disjoint(Mammal, Reptile)$ means:
  $$\\forall x \\; \\neg (MemberOf(x, Mammal) \\land MemberOf(x, Reptile))$$
  Without explicit disjointness axioms, a classifier cannot conclude that proving an animal is a mammal rules out it being a reptile!

- **Exhaustive Decomposition:** the union of subcategories covers the entire parent category:
  $$\\forall x \\; (Animal(x) \\Rightarrow (Mammal(x) \\lor Reptile(x) \\lor Bird(x) \\lor Fish(x) \\lor Amphibian(x) \\lor Invertebrate(x)))$$

- **Partition:** A set of subcategories that is **both disjoint and exhaustive** (e.g., $Male$ and $Female$ in biology). Partitions allow an inference engine to eliminate candidates systematically.`,
        },
        {
          question: `How do Description Logics (like OWL-DL) balance expressiveness and computational tractability compared to full FOL?`,
          answer: `Full First-Order Logic is semi-decidable: reasoning can enter infinite loops. **Description Logics (DL)** were engineered specifically as a decidable fragment of FOL to power the Semantic Web (OWL) and taxonomic knowledge bases.

DL restricts FOL by:
1. Forbidding arbitrary $n$-ary relations (only unary concepts $C(x)$ and binary roles $R(x, y)$ are permitted).
2. Forbidding general quantification over arbitrary variable structures. Instead, concepts are composed using structured operators: conjunction ($C \\sqcap D$), disjunction ($C \\sqcup D$), value restriction ($\\forall R.C$), and existential quantification ($\\exists R.C$).

These restrictions ensure that key inference tasks—such as **subsumption** (is $C \\sqsubseteq D$?) and **instance checking**—are guaranteed to terminate in finite time.`,
        },
      ],
      workedExample: {
        title: 'Taxonomic Inheritance and Disjointness Violation Detection',
        scenario: `Given the ontology axioms:
1. $Disjoint(\\{Carnivore, Herbivore\\})$
2. $Subset(Lion, Carnivore)$
3. $Subset(Cow, Herbivore)$
4. $MemberOf(Leo, Lion)$
5. An automated sensor mistakenly asserts: $MemberOf(Leo, Herbivore)$.
Show how formal inference detects the semantic inconsistency.`,
        walkthrough: [
          `**Step 1: Expand subclass semantics:**
By definition of $Subset$: $\\forall c_1, c_2 \\; (Subset(c_1, c_2) \\iff (\\forall x \\; (MemberOf(x, c_1) \\Rightarrow MemberOf(x, c_2))))$.
From axiom 2 ($Subset(Lion, Carnivore)$):
$\\forall x \\; (MemberOf(x, Lion) \\Rightarrow MemberOf(x, Carnivore))$.`,
          `**Step 2: Infer Leo's diet:**
From axiom 4 ($MemberOf(Leo, Lion)$) and Step 1:
$$\\text{By Modus Ponens: } MemberOf(Leo, Carnivore)$$`,
          `**Step 3: Expand Disjointness axiom:**
$Disjoint(\\{Carnivore, Herbivore\\})$ expands in FOL to:
$$\\forall x \\; \\neg (MemberOf(x, Carnivore) \\land MemberOf(x, Herbivore))$$
which is logically equivalent to:
$$\\forall x \\; (MemberOf(x, Carnivore) \\Rightarrow \\neg MemberOf(x, Herbivore))$$`,
          `**Step 4: Derive the contradiction:**
Substitute $x \\to Leo$:
$MemberOf(Leo, Carnivore) \\Rightarrow \\neg MemberOf(Leo, Herbivore)$.
Since $MemberOf(Leo, Carnivore)$ is proved in Step 2:
$$\\text{Infer: } \\neg MemberOf(Leo, Herbivore)$$
Combine with sensor assertion $MemberOf(Leo, Herbivore)$:
$$MemberOf(Leo, Herbivore) \\land \\neg MemberOf(Leo, Herbivore) \\implies \\text{CONTRADICTION } (\\bot)$$`,
        ],
        takeaway: `Explicit disjointness axioms turn taxonomic trees from mere passive storage into active semantic checkers capable of falsifying contradictory percepts.`,
      },
    },

    3: {
      qa: [
        {
          question: `What is the Situation Calculus, and what are its three fundamental primitives?`,
          answer: `**Situation Calculus** (developed by John McCarthy) is a formal method for representing changing worlds in First-Order Logic. It represents dynamic change using three primitives:
1. **Situations:** First-order terms denoting complete historical snapshots of the state of the world. $S_0$ is the initial situation.
2. **Actions:** Objects in the domain that cause change (e.g., $Move(BlockA, Table)$). The function $Result(a, s)$ returns the new situation that results from executing action $a$ in situation $s$.
3. **Fluents:** Predicates or functions whose truth value or output varies from one situation to another. By convention, the situation term is passed as the **last argument**: $At(Robot, RoomA, s)$ or $Holding(Robot, Cup, s)$. Non-changing properties (like $IsHeavy(Gold)$) are called **atemporal** or eternal predicates and do not take a situation argument.`,
        },
        {
          question: `What are the Frame Problem, the Ramification Problem, and the Qualification Problem?`,
          answer: `These three classic challenges arise when formalizing action and change:
1. **The Frame Problem:** In reality, almost everything stays the same when an action is executed. When a robot picks up a cup, the color of the wall, the temperature in Cairo, and the location of the chairs do not change. How can we formally state what does *not* change without writing millions of "non-change" axioms ($O(A \\times F)$ axioms for $A$ actions and $F$ fluents)?
2. **The Ramification Problem:** Actions have indirect secondary consequences (ramifications). If a robot moves a table, every object resting on that table also moves, along with dust particles on those objects. Writing explicit rules for every indirect side effect is intractable.
3. **The Qualification Problem:** An action can be prevented by an infinite number of bizarre conditions. For a car to start, the battery must be charged, there must be fuel, but also no potato plugged in the exhaust pipe, no chewed wires, no alien interference. How can an agent decide an action will succeed without checking infinitely many preconditions?`,
        },
        {
          question: `How do Successor-State Axioms solve the Representational Frame Problem?`,
          answer: `Ray Reiter solved the representational frame problem by writing axioms focused on **each fluent** rather than on each action.

For each fluent $F$, a single **Successor-State Axiom** defines the truth of $F$ in the next situation $Result(a, s)$:
$$F(Result(a, s)) \\iff [\\text{Action } a \\text{ caused } F \\text{ to become true}] \\lor [F(s) \\land \\neg (\\text{Action } a \\text{ caused } F \\text{ to become false})]$$

This states: $F$ holds in the new situation IF AND ONLY IF the action explicitly created it, OR it was already true and the action did not destroy it. This eliminates the need for separate frame axioms, reducing total axioms to exactly one per fluent ($O(F)$ instead of $O(A \\times F)$).`,
        },
      ],
      workedExample: {
        title: 'Constructing and Evaluating a Successor-State Axiom for Holding(r, x, s)',
        scenario: `A warehouse robot $r$ manipulates objects $x$. Actions available: $Grab(r, x)$ and $Release(r, x)$.
Construct the exact Successor-State Axiom for the fluent $Holding(r, x, s)$ and trace a 2-step execution.`,
        walkthrough: [
          `**Step 1: Identify positive effect causes (causes Holding to become true):**
Action $a = Grab(r, x)$, assuming robot and object are at the same location and the robot's gripper is empty:
$$Poss(Grab(r, x), s) \\land a = Grab(r, x)$$`,
          `**Step 2: Identify negative effect causes (causes Holding to become false):**
Action $a = Release(r, x)$:
$$a = Release(r, x)$$`,
          `**Step 3: Assemble the Successor-State Axiom:**
$$\\forall r, x, a, s \\; Holding(r, x, Result(a, s)) \\iff$$
$$\\big( a = Grab(r, x) \\land Poss(Grab(r, x), s) \\big) \\; \\lor \\; \\big( Holding(r, x, s) \\land a \\neq Release(r, x) \\big)$$`,
          `**Step 4: Trace Execution:**
- *Initial state $S_0$:* $\\neg Holding(Robot, Crate, S_0)$.
- *Action 1:* $a_1 = Grab(Robot, Crate)$.
  $S_1 = Result(a_1, S_0)$.
  Evaluate axiom: the first disjunct is true ($a_1 = Grab(Robot, Crate)$).
  Therefore, $Holding(Robot, Crate, S_1)$ is **TRUE**.
- *Action 2:* $a_2 = Move(Robot, Bay3)$.
  $S_2 = Result(a_2, S_1)$.
  Evaluate axiom:
  - First disjunct is false ($Move \\neq Grab$).
  - Second disjunct: $Holding(Robot, Crate, S_1)$ is true, and $Move \\neq Release$ is true!
  Therefore, $Holding(Robot, Crate, S_2)$ remains **TRUE** automatically without any custom "Move doesn't drop crate" axiom.`,
        ],
        takeaway: `Successor-state axioms bundle action causality and inertial persistence into a single biconditional formula per fluent, cleanly solving the frame problem.`,
      },
    },

    4: {
      qa: [
        {
          question: `What is the difference between the Closed-World Assumption (CWA) and Open-World Assumption (OWA)?`,
          answer: `- **Closed-World Assumption (CWA):** Assumes that any atomic sentence not explicitly present or derivable from the knowledge base is **false**.
  - Standard in relational databases (SQL) and Prolog. If flight $PK301$ is not in the database table, SQL concludes: "Flight $PK301$ does not exist."
  - Advantage: Highly efficient, avoids expressing negative facts explicitly.
  - Risk: Unsafe when information is incomplete (e.g., medical diagnosis: if a patient is not listed as allergic to penicillin, CWA assumes they are not allergic).

- **Open-World Assumption (OWA):** Assumes that any statement not derivable from the KB is simply **unknown** (could be true or false).
  - Standard in First-Order Logic and Semantic Web (OWL).
  - Advantage: Monotonically safe under incomplete knowledge.
  - Consequence: To prove something is false, you must explicitly derive $\\neg P$. Absence of proof is not proof of absence.`,
        },
        {
          question: `Why is standard classical logic "monotonic", and why does everyday intelligence require "non-monotonic" reasoning?`,
          answer: `Classical logic is **monotonic**: if $KB \\models \\alpha$, then for any additional sentence $\\beta$:
$$(KB \\land \\beta) \\models \\alpha$$
Adding new information can never invalidate or retract previously proved theorems. Knowledge only grows.

Everyday human intelligence is fundamentally **non-monotonic**: we routinely make **defeasible (revisable) assumptions** based on typicality:
1. KB: "Tweety is a bird." $\\implies$ Conclusion: "Tweety flies."
2. Add fact: "Tweety is a penguin." $\\implies$ Previous conclusion is **retracted**: "Tweety does NOT fly."

Non-monotonic logics (such as Reiter's Default Logic, McCarthy's Circumscription, and autoepistemic logic) allow default rules that hold *unless contradicted by specific evidence*.`,
        },
        {
          question: `What is the "Nixon Diamond" problem in default logic?`,
          answer: `The **Nixon Diamond** is the classic dilemma of conflicting default inheritance rules.
Consider:
- Fact 1: $Quaker(Nixon)$
- Fact 2: $Republican(Nixon)$
- Default Rule 1: "Quakers are typically pacifists."
- Default Rule 2: "Republicans are typically not pacifists."

When we query whether Nixon is a pacifist:
- Firing Rule 1 derives $Pacifist(Nixon)$, which then blocks Rule 2.
- Firing Rule 2 derives $\\neg Pacifist(Nixon)$, which then blocks Rule 1.

There are two equally valid, mutually contradictory extensions. Without an explicit preference, priority rule, or probabilistic weighting, default logic cannot arbitrate between them.`,
        },
      ],
      workedExample: {
        title: 'Formalizing Default Rules with Exception Overrides',
        scenario: `Using First-Order Logic with an abnormality predicate $Ab(x)$, formalize:
1. "Birds typically fly."
2. "Penguins are birds that do not fly."
3. Given $Bird(Tweety)$ and $Penguin(Opus)$, show how circumscription or exception handling correctly derives that Tweety flies while Opus does not.`,
        walkthrough: [
          `**Step 1: Write the default rule using the Abnormality predicate:**
Instead of the brittle universal $\\forall x \\; (Bird(x) \\Rightarrow Flies(x))$, write:
$$\\forall x \\; (Bird(x) \\land \\neg Ab_1(x) \\Rightarrow Flies(x))$$
("If $x$ is a bird and $x$ is not abnormal in sense 1, then $x$ flies.")`,
          `**Step 2: Axiomatize the specific category exception:**
Penguins are birds:
$$\\forall x \\; (Penguin(x) \\Rightarrow Bird(x))$$
Penguins are explicitly abnormal in their ability to fly, and do not fly:
$$\\forall x \\; (Penguin(x) \\Rightarrow Ab_1(x))$$
$$\\forall x \\; (Penguin(x) \\Rightarrow \\neg Flies(x))$$`,
          `**Step 3: Reasoning about Tweety ($Bird(Tweety)$):**
Under default minimization (circumscribing $Ab_1$, or assuming the Closed World on abnormalities), since nothing asserts or implies $Ab_1(Tweety)$, we assume $\\neg Ab_1(Tweety)$.
By Modus Ponens on the default rule:
$$Bird(Tweety) \\land \\neg Ab_1(Tweety) \\implies Flies(Tweety) \\text{ [Derived]}$$`,
          `**Step 4: Reasoning about Opus ($Penguin(Opus)$):**
By the penguin exception rule: $Penguin(Opus) \\implies Ab_1(Opus)$.
Because $Ab_1(Opus)$ is true, $\\neg Ab_1(Opus)$ is false. The default rule's premise fails, blocking the derivation of $Flies(Opus)$.
Directly from the penguin rule, we conclude:
$$\\neg Flies(Opus) \\text{ [Derived]}$$`,
        ],
        takeaway: `Abnormality predicates reconcile default reasoning with classical logic by making exceptions explicit conditions that override general inheritance.`,
      },
    },
  },
};
