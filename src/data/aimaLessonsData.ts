// ==========================================================================
// AIMA (3rd Edition) — Russell & Norvig — Comprehensive Lesson System
// Phase 1: Chapters 1–7 | Extremely rich, interactive, textbook-accurate
// Supplemented by: Deep Learning (Goodfellow), Hands-On ML (Géron),
//                  Speech & Language Processing (Jurafsky & Martin)
// ==========================================================================

export type VisualType =
  | 'agent_loop'
  | 'peas_diagram'
  | 'env_taxonomy'
  | 'agent_architectures'
  | 'romania_map'
  | 'search_tree'
  | 'search_comparison'
  | 'astar_trace'
  | 'hill_climbing'
  | 'simulated_annealing'
  | 'genetic_algo'
  | 'belief_state'
  | 'minimax_tree'
  | 'alpha_beta'
  | 'wumpus_world'
  | 'propositional_logic'
  | 'resolution_proof'
  | 'ai_timeline'
  | 'four_approaches'
  | 'neural_net_overview'
  | 'decision_boundary'
  | 'gradient_descent';

export type ConceptType = 'intuition' | 'algorithm' | 'math' | 'connection' | 'visual' | 'summary';

export interface Connection {
  chapterId: number;
  chapterTitle: string;
  relationship: string;
  bookRef?: string; // e.g. "Deep Learning p. 165"
}

export interface LessonStep {
  id?: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  conceptType: ConceptType;
  visualType: VisualType;
  contentMarkdown: string;
  keyPoints?: string[];
  mathBlock?: {
    formula: string;
    explanation: string;
  };
  codeBlock?: {
    language: string;
    code: string;
    caption: string;
  };
  interactiveData?: Record<string, unknown>;
  examTip?: string;
  connectedTo?: Connection[];
  bookCitation?: string; // AIMA page reference
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface DetailedLesson {
  chapterId: number;
  partId: number;
  topicId: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  bookPages: string;
  xpReward?: number;
  steps: LessonStep[];
  quizQuestions?: QuizQuestion[];
  quiz?: QuizQuestion[];
  flashCards?: { front: string; back: string }[];
}

export const AIMA_DETAILED_LESSONS: Record<number, DetailedLesson> = {

  // =========================================================================
  // CHAPTER 1 — Introduction to AI
  // Source: AIMA Ch 1 (pp. 1–33)
  // =========================================================================
  1: {
    chapterId: 1,
    partId: 1,
    topicId: '1.1–1.4',
    title: 'What is Artificial Intelligence?',
    subtitle: 'Four approaches, historical roots, and the rational agent paradigm',
    estimatedMinutes: 12,
    bookPages: 'pp. 1–33',
    xpReward: 50,
    steps: [
      {
        stepNumber: 1,
        title: 'The Fundamental Question: What is AI?',
        subtitle: 'Why there is no single answer — and why that matters',
        conceptType: 'intuition',
        visualType: 'four_approaches',
        bookCitation: 'AIMA 3rd Ed., pp. 1–5',
        contentMarkdown: `## The Definitional Dilemma of Artificial Intelligence

For thousands of years, philosophers, mathematicians, and biologists have attempted to comprehend a single question: **How is it possible for a brain to perceive, understand, predict, and manipulate a world far larger and more complicated than itself?**

Artificial Intelligence does not merely seek to understand this mystery — it endeavors to **build intelligent entities**.

Russell & Norvig open their masterwork with a crucial observation: **Artificial Intelligence has no single, universally agreed-upon definition.** Instead, the field has historically fractured along two fundamental, independent axes:

### The Two Underlying Dimensions (AIMA Table 1.1)

1. **Dimension 1: The Target of Inquiry (Thought vs. Action)**
   - **Thought Processes & Reasoning**: Focuses on internal mental mechanisms, logic, deductive reasoning, and how concepts are formed.
   - **Behavior & Action**: Focuses on external performance, decisions made, actions executed in an environment, and tangible consequences.

2. **Dimension 2: The Evaluation Benchmark (Human vs. Rational)**
   - **Human Performance**: Measures intelligence by fidelity to human behavior. A system is intelligent if it acts or thinks the way a person would (empirical science involving psychology and neuroscience).
   - **Ideal Rationality**: Measures intelligence against an idealized, mathematically rigorous concept of intelligence. A system is rational if it does the "right thing" to maximize its expected success given what it knows.

### Why the Benchmark Matters
Humans are remarkable, but **human thought is not synonymous with rational thought**:
- Humans are subject to systematic cognitive biases (Kahneman & Tversky's prospect theory).
- Humans suffer from emotional distress, fatigue, memory decay, and perceptual illusions.
- If an automated financial trading system or medical diagnostic AI reasoned "like a human," it would inherit human panic and computational limitations!

> *"A rational agent is one that acts so as to achieve the best outcome or, when there is uncertainty, the best expected outcome."* — Russell & Norvig

### The Unifying Thesis of Modern AI
Throughout all 27 chapters, Russell & Norvig adopt the **"Acting Rationally"** paradigm. This is not because human cognition is uninteresting, but because rationality provides an objective, mathematically verifiable framework that can be tested, proved, and generalized across robots, web search engines, autonomous vehicles, and diagnostic software.`,
        keyPoints: [
          'AI has 4 distinct historical definitions formed by crossing Thought vs Action with Human vs Rational',
          'Human behavior is an empirical science (messy, biased); Rationality is a mathematical standard (provable, optimal)',
          'Russell & Norvig choose "Acting Rationally" because it provides a unified, mathematically rigorous foundation',
          'A rational agent maximizes EXPECTED utility — it is not omniscient (it cannot know the future, only act optimally given its percepts)',
        ],
        examTip: 'Exam trap: "A rational agent always makes the right choice and achieves its goal." False! Rationality maximizes expected performance given current information. If an autonomous car hits an invisible sinkhole that opened 1 millisecond earlier, its choice to drive forward was still rational given its sensors.',
        connectedTo: [
          {
            chapterId: 2,
            chapterTitle: 'Intelligent Agents',
            relationship: 'Formalizes the Acting Rationally paradigm into the mathematical Agent Function f: P* → A and PEAS specifications.',
          },
          {
            chapterId: 13,
            chapterTitle: 'Quantifying Uncertainty',
            relationship: 'Because the real world cannot be fully observed, rational decisions require probability theory and expected utility.',
            bookRef: 'Deep Learning (Goodfellow) Ch. 3',
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'The Four Schools of AI',
        subtitle: 'Thinking vs Acting · Human vs Rational — Deep Comparison',
        conceptType: 'visual',
        visualType: 'four_approaches',
        bookCitation: 'AIMA 3rd Ed., pp. 2–5',
        contentMarkdown: `## Deep Dive into the Four Historical Schools

Understanding the four schools is essential because every modern breakthrough — from ChatGPT to AlphaGo — blends elements of these traditions.

---

### 1. Thinking Humanly: The Cognitive Modeling Approach
- **Core Idea**: If we want to construct an AI that thinks like a human, we must first discover how humans actually think.
- **Methodology**: 
  1. *Introspection*: Catching our own thoughts as they go by.
  2. *Psychological Experiments*: Observing a person in action (recording reaction times, errors).
  3. *Brain Imaging*: Tracking neurological firing patterns via fMRI and EEG.
- **Pioneer**: Newell & Simon's **General Problem Solver (GPS)** (1956) was explicitly designed not just to solve puzzles, but to mirror the exact sequence of reasoning steps taken by human test subjects.
- **Modern Connection**: Cognitive science and computational neuroscience collaborate closely with AI, inspiring architectures like convolutional networks modeled on the primate visual cortex (Hubel & Wiesel, 1959).

---

### 2. Acting Humanly: The Turing Test Approach
- **Core Idea**: Proposed by Alan Turing in his landmark 1950 paper *"Computing Machinery and Intelligence"*. Turing bypassed the vague, insoluble philosophical question "Can machines think?" and replaced it with an operational behavioral test: **The Imitation Game**.
- **The Protocol**: A human interrogator communicates via text terminal with two entities: one human, one computer. If the interrogator cannot tell which is which after 5 minutes, the machine passes.
- **The Six Core Disciplines**: To pass the **Total Turing Test** (which includes physical interaction), a machine must possess:
  1. **Natural Language Processing (NLP)**: To communicate fluently in English (Jurafsky & Martin, Ch. 1).
  2. **Knowledge Representation**: To store what it knows or hears.
  3. **Automated Reasoning**: To use stored information to answer questions and draw conclusions.
  4. **Machine Learning**: To adapt to new circumstances and detect patterns (Goodfellow et al., Ch. 1).
  5. **Computer Vision**: To perceive real-world objects.
  6. **Robotics**: To manipulate and physically move objects in space.

---

### 3. Thinking Rationally: The "Laws of Thought" Approach
- **Core Idea**: Greek philosopher Aristotle was among the first to codify "right thinking" through **syllogisms** (formal argument structures that always yield correct conclusions given correct premises):
  $$\\text{All humans are mortal.} \\quad \\text{Socrates is human.} \\implies \\text{Socrates is mortal.}$$
- **The Logicist Tradition**: In the 1960s–80s, the "logicist" school believed that translating all domain knowledge into formal First-Order Logic and running an inference engine would create Artificial General Intelligence.
- **Why It Struggled in Practice**:
  - *Informal Knowledge*: Real-world knowledge is rarely 100% certain (it involves likelihood, exceptions, and context).
  - *Computational Intractability*: Solving logic problems in general is NP-complete or undecidable. A logic solver with just a few hundred facts can loop forever.

---

### 4. Acting Rationally: The Rational Agent Approach ⭐
- **Core Idea**: An **agent** is just something that acts. A **rational agent** is one that acts so as to achieve the best expected outcome:
  $$a^* = \\arg\\max_{a \\in \\mathcal{A}} \\mathbb{E}[U(s') \\mid s, a]$$
- **Why AIMA Adopts This Paradigm**:
  1. *Generality*: It is far more general than the "Laws of Thought" approach. Deductive logic is just one tool among many (reflexes, learning, optimization) used by a rational agent.
  2. *Scientific Precision*: Unlike human behavior (which is messy, biased, and culturally variable), rationality is mathematically grounded in probability and utility theory.
  3. *Engineered Applications*: An autonomous spaceship or medical scanner must act *rationally* (protecting life and equipment), not "humanly" (panicking or getting tired).`,
        keyPoints: [
          'Thinking Humanly requires cognitive models (psychology, fMRI); Acting Humanly requires behavioral indistinguishability (Turing Test)',
          'Thinking Rationally relies on formal deductive logic; Acting Rationally relies on expected utility maximization',
          'Passing the Total Turing Test requires all 6 major subfields of modern AI: NLP, Knowledge Rep, Reasoning, ML, Vision, and Robotics',
          'Modern LLMs (ChatGPT) combine Acting Humanly (conversational fluency) with Rational Utility Optimization (RLHF alignment)',
        ],
        examTip: 'Exam question: "Why is the rational agent approach considered more general than the laws of thought approach?" Answer: Because achieving correct logical inference is only ONE way to achieve rational action; in situations where there is no provably correct action (e.g. pulling one\'s hand from a hot stove), reflex and heuristic utility maximization are rational even without full logical deduction.',
        connectedTo: [
          {
            chapterId: 2,
            chapterTitle: 'Intelligent Agents',
            relationship: 'Chapter 2 formalizes how an agent function f: P* → A is constructed from architecture and program.',
          },
          {
            chapterId: 7,
            chapterTitle: 'Logical Agents',
            relationship: 'The Thinking Rationally school is formalized through Propositional and First-Order Logic in Part III.',
          },
          {
            chapterId: 16,
            chapterTitle: 'Making Simple Decisions',
            relationship: 'Utility theory formally quantifies "best outcome" under risk using von Neumann-Morgenstern axioms.',
          },
        ],
      },
      {
        stepNumber: 3,
        title: 'Historical Timeline of AI',
        subtitle: 'From Aristotle to GPT — 2500 years of progress',
        conceptType: 'visual',
        visualType: 'ai_timeline',
        bookCitation: 'AIMA 3rd Ed., pp. 16–28',
        contentMarkdown: `### The Genesis (1943–1956)
- **1943** McCulloch & Pitts: Mathematical model of neurons
- **1950** Alan Turing: "Computing Machinery and Intelligence"
- **1951** Minsky & Edmonds: First neural network computer (SNARC — 40 neurons)
- **1956** **Dartmouth Conference** — John McCarthy coins "Artificial Intelligence"
- **1956** Newell, Shaw, Simon create Logic Theorist (proves math theorems!)

### The Great Expectations Era (1952–1969)
- **1957** GPS (General Problem Solver) — Newell & Simon
- **1958** McCarthy: Lisp, advice taker (programs in logic!)
- **1965** Robinson: Resolution algorithm — complete proof procedure

### AI Winters (1966 + 1974–1980 + 1987–1993)
- Machine Translation fails (ALPAC report 1966)
- Perceptrons shown limited by Minsky & Papert (1969)
- Expert systems' brittleness exposed
- 5th Generation Project collapses (Japan, 1992)

### The Return of Neural Networks (1986–)
- **1986** Rumelhart, Hinton, Williams: **Backpropagation** — trains multi-layer networks
- **1997** Deep Blue defeats Kasparov at Chess
- **2004** DARPA Grand Challenge: Autonomous cars on desert course
- **2011** IBM Watson beats Jeopardy champions
- **2012** AlexNet + ImageNet → **Deep Learning revolution**
- **2016** AlphaGo defeats Lee Sedol at Go (Go has more positions than atoms in universe!)
- **2020** GPT-3: 175B parameters, few-shot learning
- **2022** ChatGPT, diffusion models — AI in every device`,
        keyPoints: [
          '1956 Dartmouth Conference is the birth of AI as a field — McCarthy coins the term',
          'AI had multiple "winters" — overpromising led to funding cuts',
          'Backpropagation (1986) and GPUs (2012) are the two most important technical breakthroughs',
          'Deep Learning book (Goodfellow et al.) covers the theoretical foundations of the modern neural wave',
        ],
        connectedTo: [
          {
            chapterId: 18,
            chapterTitle: 'Learning from Examples',
            relationship: 'Machine learning — which powered the 2012 revolution — is covered in Chapter 18.',
            bookRef: 'Deep Learning p. 1',
          },
        ],
      },
      {
        stepNumber: 4,
        title: 'The State of the Art — What AI Can Do Now',
        subtitle: 'Robotic cars · Speech · Translation · Game playing',
        conceptType: 'summary',
        visualType: 'four_approaches',
        bookCitation: 'AIMA 3rd Ed., pp. 28–32',
        contentMarkdown: `Russell & Norvig document remarkable 2010-era achievements that have since been far surpassed:

| Domain | Achievement |
|--------|-------------|
| **Autonomous Driving** | DARPA Urban Challenge 2007: Stanley (Stanford) navigates 60 miles |
| **Game Playing** | Backgammon (1990s), Chess/1997, Go/2016, Poker/2017, Starcraft II/2019 |
| **Speech Recognition** | Near-human error rates on clean speech (Google, Apple, Amazon) |
| **Machine Translation** | Google Translate handles 100+ languages (AIMA: "adequate for most purposes") |
| **Image Classification** | AlexNet (2012) drops ImageNet error to 16% — humans at ~5% |
| **Medical Diagnosis** | Exceeds dermatologists at skin cancer detection |

### The Core Message
> *"AI is now in routine commercial use: speech recognition, machine translation, autonomous cars, recommender systems, spam filters."* — Russell & Norvig

Modern AI systems — LLMs, diffusion models, robotics — build on every concept in this book. The foundations matter!`,
        keyPoints: [
          'AI moved from academic curiosity to commercial infrastructure (2000s–2020s)',
          'Each AI success story maps to a specific AIMA chapter: Search Ch.3, ML Ch.18, Planning Ch.10...',
          'The 2012 deep learning breakthrough used AIMA Ch.18 neural network concepts + massive scale',
        ],
        connectedTo: [
          {
            chapterId: 18,
            chapterTitle: 'Learning from Examples',
            relationship: 'The modern AI revolution (neural networks, deep learning) lives in Part V of AIMA.',
            bookRef: 'Hands-On ML with Scikit-Learn (Géron) — practical implementations of these systems',
          },
        ],
      },
    ],
    quizQuestions: [
      {
        question: 'Which of the four approaches to AI does Russell & Norvig\'s textbook primarily advocate?',
        options: [
          'Thinking Humanly (cognitive modeling approach)',
          'Acting Humanly (Turing Test approach)',
          'Thinking Rationally (laws of thought approach)',
          'Acting Rationally (rational agent approach)',
        ],
        correctIndex: 3,
        explanation: 'AIMA advocates "Acting Rationally" because it is the most mathematically precise approach. A rational agent is one that acts to achieve the best expected outcome — this doesn\'t require mimicking human cognition or passing verbal tests.',
        difficulty: 'easy',
      },
      {
        question: 'The 1956 Dartmouth Conference is historically significant because:',
        options: [
          'It was where backpropagation was invented',
          'John McCarthy coined the term "Artificial Intelligence" and it launched AI as a formal academic field',
          'It was the first demonstration of a robot defeating a human chess player',
          'It was where Turing proposed his famous test for machine intelligence',
        ],
        correctIndex: 1,
        explanation: 'The 1956 Dartmouth Summer Research Project on Artificial Intelligence is where the field was formally founded. McCarthy coined the term "AI." Turing\'s paper came in 1950. Backpropagation was 1986.',
        difficulty: 'medium',
      },
      {
        question: 'A rational agent that makes the "best" decision given its available information but still fails at the task is:',
        options: [
          'Irrational, because rational agents always succeed',
          'Still rational — rationality is about maximizing EXPECTED performance, not actual outcomes',
          'Irrational — omniscience is required for rationality',
          'A cognitive agent, not a rational agent',
        ],
        correctIndex: 1,
        explanation: 'Rationality ≠ omniscience. A rational agent maximizes EXPECTED utility given its current percept sequence and built-in knowledge. If the environment provides bad luck, even a perfectly rational agent can fail. AIMA p. 36.',
        difficulty: 'hard',
      },
    ],
    flashCards: [
      { front: 'What is the Turing Test?', back: 'A test where a human interrogator cannot distinguish (in 5 minutes of text chat) between a human and a machine. Proposed by Alan Turing in 1950 as an operational definition of machine intelligence.' },
      { front: 'What are the four approaches to AI?', back: '1. Thinking Humanly (cognitive science)\n2. Acting Humanly (Turing Test)\n3. Thinking Rationally (formal logic)\n4. Acting Rationally (rational agents) ← AIMA\'s approach' },
      { front: 'What makes an agent "rational"?', back: 'A rational agent selects the action that maximizes its EXPECTED performance measure, given the evidence provided by the percept sequence and whatever built-in knowledge the agent has.' },
      { front: 'When was the term "Artificial Intelligence" coined?', back: '1956 at the Dartmouth Summer Research Project. Coined by John McCarthy.' },
    ],
  },

  // =========================================================================
  // CHAPTER 2 — Intelligent Agents
  // Source: AIMA Ch 2 (pp. 34–63)
  // =========================================================================
  2: {
    chapterId: 2,
    partId: 1,
    topicId: '2.1–2.4',
    title: 'Intelligent Agents',
    subtitle: 'PEAS specification, environment taxonomy, and the five agent architectures',
    estimatedMinutes: 14,
    bookPages: 'pp. 34–63',
    xpReward: 60,
    steps: [
      {
        stepNumber: 1,
        title: 'Agents and Their Environments',
        subtitle: 'The fundamental agent-environment interaction loop',
        conceptType: 'intuition',
        visualType: 'agent_loop',
        bookCitation: 'AIMA 3rd Ed., p. 34',
        contentMarkdown: `### The Core Definition
An **agent** is *anything* that can be viewed as **perceiving** its environment through **sensors** and **acting** upon that environment through **actuators**.

This single definition spans:
- A **human agent**: eyes/ears/skin (sensors) → brain (processing) → hands/voice (actuators)
- A **robotic vacuum**: cameras/bump sensors (sensors) → microcontroller (processing) → wheels/motor (actuators)  
- A **web search agent**: HTML content (sensors) → ranking algorithm (processing) → search results (actuators)

### The Agent Function
The mathematical heart of the agent concept:

$$f: \\mathcal{P}^* \\rightarrow \\mathcal{A}$$

- $\\mathcal{P}^*$: the set of all possible **percept sequences** (not just the current percept!)
- $\\mathcal{A}$: the set of all possible **actions**

The asterisk in $\\mathcal{P}^*$ is crucial — an agent's current action can depend on **everything it has observed** since the beginning. A simple reflex agent ignores history; a more sophisticated agent remembers it all.`,
        mathBlock: {
          formula: 'f: P* → A',
          explanation: 'The agent function maps any sequence of percepts to an action. The agent program implements this function on physical hardware (agent = architecture + program).',
        },
        keyPoints: [
          'An agent perceives its environment through sensors and acts through actuators',
          'The agent function maps percept SEQUENCES (not just current percept) to actions',
          'Agent Program ≠ Agent Function: the function is the abstract math; the program is the concrete implementation',
          '"Anything that can be viewed as an agent" — this is intentionally broad!',
        ],
        connectedTo: [
          {
            chapterId: 3,
            chapterTitle: 'Solving Problems by Searching',
            relationship: 'The "problem-solving agent" in Chapter 3 is a specific implementation of the agent function that uses search.',
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Rationality & PEAS Specification',
        subtitle: 'Defining "good behavior" and specifying an agent completely',
        conceptType: 'algorithm',
        visualType: 'peas_diagram',
        bookCitation: 'AIMA 3rd Ed., pp. 36–40',
        contentMarkdown: `### What is Rationality?
A **rational agent** is one that does the right thing. But what is "right"?

> *"For each possible percept sequence, a rational agent should select an action that is expected to maximize its performance measure, given the evidence provided by the percept sequence and whatever built-in knowledge the agent has."* — Russell & Norvig, p. 37

Four things determine rationality:
1. The **performance measure** defining the criterion of success
2. The agent's **prior knowledge** of the environment
3. The **actions** the agent can perform
4. The **percept sequence** to date

### Critical Warning
**Do not design performance measures that reward behavior rather than outcome!**

- **Suboptimal**: Reward a vacuum cleaner for every time it runs its motor
- **Sound**: Reward a vacuum cleaner for each square of clean floor

### PEAS Specification — The Mandatory First Step
Before designing any AI system, you must specify:

| Letter | Stands for | Automated Taxi Example | Medical Diagnosis Example |
|--------|-----------|----------------------|--------------------------|
| **P** | Performance Measure | Safety, speed, legality, comfort, profit | Healthy patient, minimize costs, no malpractice |
| **E** | Environment | Roads, traffic, pedestrians, weather | Patient, hospital, staff |
| **A** | Actuators | Steering, accelerator, brake, signals | Questions, tests, prescriptions |
| **S** | Sensors | Cameras, radar, GPS, speedometer | Symptoms, patient history, test results |`,
        keyPoints: [
          'Rationality = maximizing EXPECTED performance measure (not actual; not omniscient)',
          'PEAS specification is the first mandatory step in designing any agent',
          'Performance measure must measure environment state, not agent\'s internal behavior',
          'An agent gathering useful information (exploration) is rational even if not immediately productive',
        ],
        examTip: 'Exam trap: "A rational agent is omniscient." FALSE! An omniscient agent would know actual outcomes — impossible. Rationality operates under uncertainty with expected values.',
      },
      {
        stepNumber: 3,
        title: 'Task Environment Properties (PEAS Dimensions)',
        subtitle: 'The 6 axes that completely characterize any environment',
        conceptType: 'visual',
        visualType: 'env_taxonomy',
        bookCitation: 'AIMA 3rd Ed., pp. 40–45',
        contentMarkdown: `The **task environment** completely determines what algorithms are feasible for an agent. AIMA identifies **6 fundamental dimensions**:

### Dimension 1: Fully vs. Partially Observable
- **Fully Observable**: sensors give complete access to the complete state of the environment at each point in time
  - Example: Chess (you see the whole board)
- **Partially Observable**: sensors are noisy, inaccurate, or miss parts of state
  - Example: Poker (hidden opponent cards), Driving (car around corner)
  - → Agent must maintain an **internal belief state** (see Chapter 4)

### Dimension 2: Single vs. Multi-Agent
- **Single Agent**: agent solving a crossword puzzle alone
- **Multi-Agent**: 
  - **Competitive**: Chess (zero-sum, Ch. 5)
  - **Cooperative**: Autonomous cars (avoid collisions)
  - Key: Multi-agent = another agent's behavior depends on your actions

### Dimension 3: Deterministic vs. Stochastic
- **Deterministic**: next state completely determined by current state + action
  - Example: 8-Queens puzzle (one correct move sequence)
- **Stochastic**: uncertainty remains even after knowing state + action
  - Example: Driving (pedestrians, mechanical failures)
  - Mathematically: next state is a probability distribution P(s'|s, a)

### Dimension 4: Episodic vs. Sequential
- **Episodic**: each episode (perceive → act) is independent. Quality of action depends only on that episode.
  - Example: defect detection on assembly line (each item is independent)
- **Sequential**: current decision affects all future decisions
  - Example: Chess, taxi navigation (require planning)
  - → Requires Search & Planning (Chapters 3, 10, 11)

### Dimension 5: Static vs. Dynamic
- **Static**: environment does not change while agent is deliberating
  - Example: crossword puzzle
- **Dynamic**: environment keeps changing as agent thinks
  - Example: driving (cars keep moving!), stock trading
- **Semidynamic**: environment static but performance score changes with time (taxi meter)

### Dimension 6: Discrete vs. Continuous
- **Discrete**: finite number of distinct states, percepts, actions
  - Example: Chess (discrete moves)
- **Continuous**: states and/or actions are real-valued
  - Example: Robotic arm (continuous joint angles)

### The Hardest Environment
> Partially Observable + Stochastic + Sequential + Dynamic + Continuous + Multi-Agent
> = Real-World Driving. This is why autonomous driving is an open research problem!`,
        keyPoints: [
          'These 6 dimensions determine which algorithms are needed — know them cold',
          'Real-world environments are almost always: Partially Observable, Stochastic, Sequential, Dynamic, Continuous',
          'Fully Observable + Deterministic + Episodic = simplest → memoryless if-then rules work',
          'Multi-agent environments require reasoning about other agents\' strategies (Game Theory, Ch. 5)',
        ],
        examTip: 'Classic exam question: "Classify chess along the 6 environment dimensions." Answer: Fully Observable (see whole board), Deterministic (moves are deterministic), Sequential (every move matters), Static (board doesn\'t change between turns), Discrete (finite moves), Multi-Agent/Competitive.',
      },
      {
        stepNumber: 4,
        title: 'The Five Agent Architectures',
        subtitle: 'From simple reflexes to full learning agents',
        conceptType: 'algorithm',
        visualType: 'agent_architectures',
        bookCitation: 'AIMA 3rd Ed., pp. 47–60',
        contentMarkdown: `AIMA presents agent programs from simplest to most capable. Each adds a new layer:

### Architecture 1: Simple Reflex Agent
Maps the **current percept** directly to an action using condition-action rules:
\`\`\`
if car-in-front-is-braking then apply-brakes
if bump-sensor-fires then turn-randomly
\`\`\`
- **Works only in**: Fully Observable environments
- **Fatal flaw**: Infinite loops in partially observable environments (vacuum doesn't know if it already cleaned)

### Architecture 2: Model-Based Reflex Agent
Maintains **internal state** that captures the part of the world that cannot be currently perceived.

Requires two pieces of knowledge:
1. **Transition model**: How does my action change the world? (physics model)
2. **Sensor model**: How does the current world state generate percepts?

Example: Taxi maintains state of current speed, prior position (from GPS history), blindspot estimates.

### Architecture 3: Goal-Based Agent
Adds **explicit goals** — descriptions of desirable world states.

The agent uses **search and planning** (Chapters 3–11) to find action sequences that achieve goals.
- More flexible than reflex: can be reprogrammed just by specifying new goals
- Less efficient: search can be slow for complex state spaces

### Architecture 4: Utility-Based Agent
Goals are binary (achieved/not achieved). But what if multiple goals conflict?

A **utility function** maps states to real numbers — expressing how "good" each state is.

**Expected Utility Maximization**:
$$EU(a|\\mathbf{e}) = \\sum_{s'} P(\\text{Result}(a) = s' | a, \\mathbf{e}) \\cdot U(s')$$

This handles trade-offs: a taxi might trade slightly higher risk for shorter time (passengers prefer this).

### Architecture 5: Learning Agent ⭐
The most general and powerful architecture. Four components:
1. **Performance Element**: selects external actions (the agent program so far)
2. **Critic**: evaluates the agent's behavior against the performance standard
3. **Learning Element**: makes improvements based on critic's feedback
4. **Problem Generator**: suggests exploratory actions for potentially better future performance

> *"A learning agent can become more rational over time by observing the world."* — R&N

Deep Learning, Reinforcement Learning (Chapter 21) implement the Learning Agent architecture!`,
        keyPoints: [
          'Each architecture from 1→5 adds capabilities but also complexity and computation',
          'Simple Reflex: if-then rules only (memoryless)',
          'Model-Based: adds internal state tracking (memory)',
          'Goal-Based: adds planning (deliberation)',
          'Utility-Based: adds preferences & probability (handles trade-offs)',
          'Learning Agent: can improve itself over time (the most powerful)',
        ],
        examTip: 'Exam question: "Which architecture is needed for the automated taxi?" Answer: Utility-Based + Learning. It needs to handle trade-offs (safety vs speed) and improve from experience.',
        connectedTo: [
          {
            chapterId: 3,
            chapterTitle: 'Solving Problems by Searching',
            relationship: 'Goal-Based Agents use search algorithms (BFS, A*) to find action sequences.',
          },
          {
            chapterId: 16,
            chapterTitle: 'Making Simple Decisions',
            relationship: 'Utility functions and Expected Utility Maximization formalize Utility-Based Agents.',
          },
          {
            chapterId: 21,
            chapterTitle: 'Reinforcement Learning',
            relationship: 'Reinforcement Learning implements the Learning Agent architecture where the critic is a reward signal.',
            bookRef: 'Hands-On ML (Géron) Ch. 18: Reinforcement Learning',
          },
        ],
      },
    ],
    quizQuestions: [
      {
        question: 'Which of the following correctly expresses what makes a rational agent rational?',
        options: [
          'It always finds the globally optimal solution',
          'It maximizes its expected performance measure given percept sequence and built-in knowledge',
          'It has perfect sensors that observe the complete environment state',
          'It never makes mistakes or takes incorrect actions',
        ],
        correctIndex: 1,
        explanation: 'AIMA Definition (p. 37): A rational agent selects the action expected to maximize its performance measure, given evidence from percept sequence and built-in knowledge. It does NOT require omniscience or guarantee optimal outcomes.',
        difficulty: 'easy',
      },
      {
        question: 'A chess-playing agent, a crossword-puzzle-solving agent, and a robotic vacuum cleaner operating in an empty room — which of the three has a FULLY OBSERVABLE environment?',
        options: [
          'Only the chess player',
          'Only the vacuum cleaner (empty room)',
          'Both chess and crossword puzzle',
          'All three — any well-designed agent has full observability',
        ],
        correctIndex: 2,
        explanation: 'Chess is fully observable (complete board state is visible). Crossword puzzle is fully observable (all squares and clues known). The vacuum cleaner — even in empty room — may not know if floor is truly clean from just one bump-sensor reading, making it partially observable.',
        difficulty: 'medium',
      },
      {
        question: 'In the Learning Agent architecture, what is the role of the "Problem Generator"?',
        options: [
          'It generates new problems for other agents to solve as training exercises',
          'It suggests exploratory actions that may be suboptimal now but lead to better future performance through discovery',
          'It reports failures and errors to the Critic component',
          'It selects which external actions to take in the environment',
        ],
        correctIndex: 1,
        explanation: 'The Problem Generator suggests novel exploratory actions — even if suboptimal in the short term — to help the agent discover better strategies over time. This is exploration vs. exploitation, formalized in Chapter 21 (Reinforcement Learning). AIMA p. 55.',
        difficulty: 'hard',
      },
      {
        question: 'An environment where the score changes as time passes (e.g. a taxi meter ticking) but the state of roads and traffic does not change while the agent deliberates is called:',
        options: [
          'Stochastic',
          'Dynamic',
          'Semidynamic',
          'Episodic',
        ],
        correctIndex: 2,
        explanation: 'AIMA p. 43: "Semidynamic" — the environment itself is static, but the performance score changes with elapsed time. Example: Chess with a clock (board doesn\'t change, but score decreases as time passes).',
        difficulty: 'medium',
      },
    ],
    flashCards: [
      { front: 'What is PEAS?', back: 'Performance measure, Environment, Actuators, Sensors — the mandatory first step when designing any AI agent. Defines what success means, where the agent operates, how it acts, and how it perceives.' },
      { front: 'What does the agent function f: P* → A mean?', back: 'The agent function maps any percept SEQUENCE (P*) to an action (A). The asterisk means the entire history of observations, not just the current one. The agent program implements this abstract function on physical hardware.' },
      { front: 'What is the difference between a goal-based and utility-based agent?', back: 'Goal-based: binary — state is either a goal or not. Utility-based: states have numerical "goodness" scores (utility), enabling trade-offs between competing goals under uncertainty.' },
      { front: 'Name all 6 environment dimensions from AIMA Chapter 2', back: '1. Fully vs Partially Observable\n2. Single vs Multi-Agent\n3. Deterministic vs Stochastic\n4. Episodic vs Sequential\n5. Static vs Dynamic\n6. Discrete vs Continuous' },
    ],
  },

  // =========================================================================
  // CHAPTER 3 — Solving Problems by Searching
  // Source: AIMA Ch 3 (pp. 64–119)
  // =========================================================================
  3: {
    chapterId: 3,
    partId: 2,
    topicId: '3.1–3.6',
    title: 'Solving Problems by Searching',
    subtitle: 'State spaces, BFS, DFS, UCS, and A* with heuristic functions',
    estimatedMinutes: 16,
    bookPages: 'pp. 64–119',
    xpReward: 70,
    steps: [
      {
        stepNumber: 1,
        title: 'Formulating Search Problems',
        subtitle: 'The 5 components of a well-defined search problem',
        conceptType: 'intuition',
        visualType: 'romania_map',
        bookCitation: 'AIMA 3rd Ed., pp. 64–68',
        contentMarkdown: `### The Problem-Solving Agent
A **problem-solving agent** is a type of goal-based agent that uses **search** through a space of possible states to find a sequence of actions achieving the goal.

The key assumption: the world is **fully observable, deterministic, static, and discrete** — the simplest possible setting. (Chapter 4 relaxes these assumptions.)

### The 5 Components of a Search Problem
Every search problem is defined by exactly these 5 things:

1. **Initial State** $s_0$: Where does the agent start?
   - Example: \`In(Arad)\` — the agent is in the Romanian city of Arad

2. **Actions**: $\\text{ACTIONS}(s)$ — what can the agent do in state $s$?
   - Example: \`{Go(Sibiu), Go(Timisoara), Go(Zerind)}\`

3. **Transition Model**: $\\text{RESULT}(s, a) = s'$ — what state results from action $a$ in state $s$?
   - Example: \`RESULT(In(Arad), Go(Sibiu)) = In(Sibiu)\`

4. **Goal Test**: Is state $s$ a goal state?
   - Example: $s = \\text{In(Bucharest)}$? Yes/No

5. **Path Cost**: $c(s, a, s')$ — the cost of taking action $a$ from $s$ to reach $s'$
   - Example: road distance in kilometers

### State Space
The **state space** is the set of all states reachable from the initial state by any sequence of actions. Together with the transition model it forms a **directed graph**.

> **Romania Map Problem**: Start at Arad. Reach Bucharest. Minimize total distance.`,
        keyPoints: [
          '5 components of a search problem: Initial State, Actions, Transition Model, Goal Test, Path Cost',
          'State space = directed graph; solution = path from initial state to goal state',
          'Optimal solution = path with the lowest total path cost',
          'State ≠ Node: a state is a world configuration; a node is a data structure in the search tree',
        ],
        connectedTo: [
          {
            chapterId: 4,
            chapterTitle: 'Beyond Classical Search',
            relationship: 'Chapter 4 extends search to Partially Observable and Stochastic environments.',
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Tree Search vs Graph Search',
        subtitle: 'The Frontier, Explored Set, and avoiding infinite loops',
        conceptType: 'algorithm',
        visualType: 'search_tree',
        bookCitation: 'AIMA 3rd Ed., pp. 72–77',
        contentMarkdown: `### The Generic Search Algorithm
All search strategies share the same skeleton. They differ ONLY in how they select the next node from the **frontier**:

\`\`\`
function TREE-SEARCH(problem) → solution or failure
  frontier ← {initial node}
  loop:
    if frontier is empty → return FAILURE
    node ← SELECT-FROM(frontier)         ← THIS LINE DETERMINES THE ALGORITHM
    if GOAL-TEST(node.STATE) → return SOLUTION(node)
    frontier ← frontier ∪ EXPAND(node)
\`\`\`

### Tree Search vs Graph Search
**Tree Search** may revisit states (following cycles leads to infinite loops!):

**Graph Search** adds an **Explored Set** (closed list):
\`\`\`
function GRAPH-SEARCH(problem) → solution or failure
  frontier ← {initial node}
  explored ← {}                          ← NEW: tracks visited states
  loop:
    if frontier is empty → return FAILURE
    node ← SELECT-FROM(frontier)
    if GOAL-TEST(node.STATE) → return SOLUTION(node)
    explored ← explored ∪ {node.STATE}   ← Mark as visited
    for child in EXPAND(node):
      if child.STATE not in explored and child not in frontier:
        frontier ← frontier ∪ {child}
\`\`\`

### The Node Data Structure
Every node in the search tree stores:
- \`state\`: the world configuration
- \`parent\`: the node that generated this node
- \`action\`: the action that was applied to parent to reach this node
- \`path-cost\` g(n): total cost from root to this node`,
        keyPoints: [
          'All search algorithms share the same skeleton — they differ only in frontier selection',
          'Tree Search: explores paths; can revisit same states (cycles → infinite loops)',
          'Graph Search: tracks explored set to avoid repeating states',
          'A node ≠ a state: multiple nodes can represent the same state (different paths)',
        ],
      },
      {
        stepNumber: 3,
        title: 'Uninformed Search Strategies',
        subtitle: 'BFS, DFS, UCS, IDS — the big comparison',
        conceptType: 'algorithm',
        visualType: 'search_comparison',
        bookCitation: 'AIMA 3rd Ed., pp. 81–92',
        contentMarkdown: `Uninformed (blind) search uses NO domain knowledge beyond the problem definition.

### Breadth-First Search (BFS)
- **Frontier**: FIFO Queue (shallowest node first)
- **Complete?** Yes (if branching factor b is finite)
- **Optimal?** Yes, if all step costs are EQUAL (finds shallowest goal)
- **Time**: $O(b^d)$ — catastrophic! At b=10, d=6: 1,000,006 nodes
- **Space**: $O(b^d)$ — keeps entire frontier in memory! ← **killer problem**

### Depth-First Search (DFS)
- **Frontier**: LIFO Stack (deepest node first)
- **Complete?** No in infinite spaces (may chase infinite path). Yes with graph search in finite spaces
- **Optimal?** No (may find a deeper, more expensive solution first)
- **Time**: $O(b^m)$ where m = max depth (m >> d usually)
- **Space**: $O(bm)$ — LINEAR! ← DFS's great advantage

### Uniform-Cost Search (UCS) = Dijkstra's Algorithm
- **Frontier**: Priority Queue ordered by path cost g(n)
- **Expands the node with the LOWEST g(n)** (cheapest path so far)
- **Complete?** Yes, if every step cost ≥ ε > 0
- **Optimal?** Yes — always finds the minimum cost solution
- **Time/Space**: $O(b^{1+\\lfloor C^*/\\varepsilon \\rfloor})$ where $C^*$ = optimal solution cost

### Iterative Deepening Search (IDS) ⭐ Best Uninformed Method
Combines DFS's space efficiency with BFS's optimality:
- Run DFS with depth limit 0, then 1, then 2, ...
- **Complete?** Yes
- **Optimal?** Yes if all step costs equal (like BFS)
- **Time**: $O(b^d)$ — repeated work negligible! Top nodes visited many times but $b^d$ dominates
- **Space**: $O(bd)$ — LINEAR! (like DFS)

| Algorithm | Complete? | Optimal? | Time | Space |
|-----------|-----------|----------|------|-------|
| BFS | Yes | Only if equal costs | $O(b^d)$ | $O(b^d)$ |
| DFS | No/Graph-Yes | No | $O(b^m)$ | $O(bm)$ |
| UCS | Yes | Yes | $O(b^{C^*/\\varepsilon})$ | $O(b^{C^*/\\varepsilon})$ |
| **IDS** | **Yes** | **If equal costs** | **$O(b^d)$** | **$O(bd)$** |`,
        mathBlock: {
          formula: 'IDS overhead: (d)b + (d-1)b² + ... + (1)bᵈ = O(bᵈ)',
          explanation: 'Even though IDS re-expands nodes at each depth limit, the work at the bottom level dominates. The overhead factor is only b/(b-1) — about 1.11 for b=10.',
        },
        keyPoints: [
          'BFS: optimal for equal costs, but exponential space is a killer',
          'DFS: linear space but not complete (can loop forever) and not optimal',
          'UCS: optimal for any costs — but can be slow if many cheap paths',
          'IDS: the BEST uninformed method — combines BFS completeness/optimality with DFS\'s linear space',
        ],
        examTip: 'IDS exam trick: "IDS wastes time re-expanding nodes." FALSE! The extra work is a constant factor. The bottom level has bᵈ nodes and is visited once; level above is bᵈ⁻¹ visited twice. Total waste is only ~11% for b=10.',
      },
      {
        stepNumber: 4,
        title: 'Informed (Heuristic) Search & A*',
        subtitle: 'f(n) = g(n) + h(n) — combining past cost with future estimate',
        conceptType: 'math',
        visualType: 'astar_trace',
        bookCitation: 'AIMA 3rd Ed., pp. 92–102',
        contentMarkdown: `Informed search uses **problem-specific knowledge** in the form of a **heuristic function** $h(n)$ to guide search.

$$h(n) = \\text{estimated cost of cheapest path from state } n \\text{ to a goal}$$

### Greedy Best-First Search
- Expands node with smallest $h(n)$ (seems closest to goal)
- **Not optimal!** Ignores the cost already paid to reach $n$
- Example: Greedy goes Arad → Sibiu → Fagaras → Bucharest = 450km (not optimal!)

### A* Search ⭐ The Most Important Algorithm in AIMA
Combines past cost $g(n)$ and estimated future cost $h(n)$:

$$\\boxed{f(n) = g(n) + h(n)}$$

- $g(n)$: exact cost from start to node $n$ (known precisely)
- $h(n)$: heuristic estimate of cheapest cost from $n$ to goal
- $f(n)$: estimated total cost of best solution through $n$

### Romania Example: A* from Arad to Bucharest
- **SLD heuristic** $h(n)$ = straight-line distance to Bucharest (always ≤ road distance!)
- Arad → Sibiu: g=140, h(Sibiu)=253, f=393
- Sibiu → Fagaras: g=239, h(Fagaras)=176, f=415
- Fagaras → Bucharest: g=450, h=0, **f=450** ← Optimal path!

### Why A* is Optimal: Admissibility
**Definition**: $h(n)$ is **admissible** if $h(n) \\le h^*(n)$ for all $n$, where $h^*(n)$ is the TRUE optimal cost.

An admissible heuristic is **OPTIMISTIC** — it never overestimates the remaining cost.

**Theorem** (AIMA Theorem 3.5): If $h(n)$ is admissible, Tree-Search A* is optimal.

### Graph Search: Consistency (Monotonicity)
For Graph Search A* (with explored set), admissibility alone isn't enough!

**Consistency** (triangle inequality):
$$h(n) \\le c(n, a, n') + h(n')$$

Meaning: the heuristic estimate at $n$ can't exceed the step cost to $n'$ plus the heuristic at $n'$.

**Key fact**: Every consistent heuristic is admissible (but not vice versa).
**Key consequence**: With consistent heuristic, $f(n)$ never decreases along any path → when A* expands a node, it has found the optimal path to that state.`,
        mathBlock: {
          formula: 'f(n) = g(n) + h(n),  where  h(n) ≤ c(n,a,n\') + h(n\')',
          explanation: 'A* evaluation function + consistency condition. If h is consistent, the first time A* expands a node is guaranteed to be via the optimal path.',
        },
        keyPoints: [
          'A* = UCS (g(n)) + Greedy (h(n)): the best of both worlds',
          'Admissibility: h(n) ≤ h*(n) — never overestimate. Guarantees optimal solution in tree search',
          'Consistency: needed for graph search A* to be optimal without re-opening nodes',
          'Every consistent heuristic is admissible, but not vice versa',
          'A* is optimally efficient: no other optimal algorithm expands fewer nodes for the same h',
        ],
        examTip: 'Graph-Search A* with ADMISSIBLE but INCONSISTENT heuristic: NOT guaranteed optimal unless you re-open closed nodes. This is a classic exam trap!',
        connectedTo: [
          {
            chapterId: 4,
            chapterTitle: 'Beyond Classical Search',
            relationship: 'When only the goal state matters (not path), local search (hill climbing, SA) uses h(n) with O(1) memory instead of A*.',
          },
        ],
      },
      {
        stepNumber: 5,
        title: 'Heuristic Functions — Design & Quality',
        subtitle: 'Admissibility, dominance, and deriving heuristics from relaxed problems',
        conceptType: 'math',
        visualType: 'astar_trace',
        bookCitation: 'AIMA 3rd Ed., pp. 102–110',
        contentMarkdown: `### Quality of Heuristics: Effective Branching Factor b*
Given a solution of depth d found by expanding N nodes:
$$N + 1 = 1 + b^* + (b^*)^2 + \\cdots + (b^*)^d$$

Solve for $b^*$ — a well-designed heuristic gives $b^*$ close to 1.

### Dominance — Comparing Heuristics
If $h_2(n) \\ge h_1(n)$ for all $n$ (and both admissible), then $h_2$ **dominates** $h_1$.
- $h_2$ expands **fewer or equal nodes** than $h_1$ on every problem
- More accurate estimates → less wasted exploration

### The 8-Puzzle Example
From initial state, find moves to reach goal configuration.

Two classic admissible heuristics:
- $h_1$: **Misplaced tiles** — number of tiles not in goal position (ignores distance)
- $h_2$: **Manhattan distance** — $\\sum |\\Delta x_i| + |\\Delta y_i|$ for each tile

$h_2 \\ge h_1$ always → $h_2$ dominates $h_1$! Use $h_2$.

With $h_2$: A* solves random 8-puzzle in ~13 nodes. Without heuristic: ~130,000 nodes!

### Deriving Heuristics: The Relaxed Problem Method ⭐
> *"The key insight is that the cost of an optimal solution to a relaxed problem is an admissible heuristic for the original problem."* — Russell & Norvig

A **relaxed problem** removes constraints from the original problem.
The optimal solution of the relaxed problem ≤ optimal solution of original → always admissible!

Examples for 8-puzzle:
1. Relax "tile can only slide to adjacent empty square" → "tile can move anywhere" → heuristic = misplaced tiles
2. Relax "tile can only slide to adjacent" → "tile can move to any adjacent square" → heuristic = Manhattan distance
3. Relax nothing → h = h* (perfect heuristic, too expensive to compute)

### Combining Heuristics
If you have multiple admissible heuristics:
$$h(n) = \\max(h_1(n), h_2(n), \\ldots, h_k(n))$$
This is always admissible and dominates all component heuristics!`,
        keyPoints: [
          'Effective Branching Factor b* measures heuristic quality (closer to 1 = better)',
          'Dominance: h₂ ≥ h₁ everywhere → h₂ is strictly better (never expands more nodes)',
          'Relaxed problems: remove constraints to get admissible heuristics automatically',
          'max(h₁, h₂, ..., hₖ) of admissible heuristics is admissible and dominates all',
          'Pattern databases: precompute exact costs for subproblems as admissible heuristics',
        ],
      },
    ],
    quizQuestions: [
      {
        question: 'Which search algorithm combines BFS\'s completeness and optimality with DFS\'s linear space complexity?',
        options: [
          'Uniform-Cost Search (UCS)',
          'Bidirectional Search',
          'Iterative Deepening Search (IDS)',
          'Greedy Best-First Search',
        ],
        correctIndex: 2,
        explanation: 'IDS runs DFS with increasing depth limits (0, 1, 2, ...). It achieves: Complete (like BFS), Optimal for equal costs (like BFS), Space O(bd) linear (like DFS). The extra work from re-expanding nodes is a constant factor — dominated by the deepest level.',
        difficulty: 'easy',
      },
      {
        question: 'A* Graph Search with a heuristic h that is admissible but NOT consistent — what happens?',
        options: [
          'A* is still guaranteed to find the optimal solution',
          'A* may fail to find the optimal solution unless closed nodes are allowed to be re-opened',
          'A* will fail to terminate',
          'A* behaves identically to Greedy Best-First Search',
        ],
        correctIndex: 1,
        explanation: 'Consistency (monotonicity) guarantees that when A* first expands a node, it has found the optimal path to it. Without consistency, a shorter path might be found later to an already-closed node, potentially missing the optimal solution unless you re-open closed nodes. AIMA Theorem 3.7.',
        difficulty: 'hard',
      },
      {
        question: 'If h₁(n) = number of misplaced tiles and h₂(n) = Manhattan distance for the 8-puzzle, which statement is TRUE?',
        options: [
          'h₁ dominates h₂ because misplaced tiles is a simpler computation',
          'h₂ dominates h₁ because Manhattan distance ≥ misplaced tiles for all states',
          'Neither dominates the other — they are incomparable',
          'Both heuristics are equally effective',
        ],
        correctIndex: 1,
        explanation: 'For every tile not in its goal position, the Manhattan distance is ≥ 1 (the count) because Manhattan distance measures how far each tile needs to move. Therefore h₂(n) ≥ h₁(n) for all n, and since both are admissible, h₂ dominates h₁ — A* with h₂ never expands more nodes than A* with h₁.',
        difficulty: 'medium',
      },
    ],
    flashCards: [
      { front: 'What are the 5 components of a search problem?', back: '1. Initial State\n2. Actions(s)\n3. Transition Model: Result(s, a)\n4. Goal Test\n5. Path Cost c(s, a, s\')' },
      { front: 'A* evaluation function?', back: 'f(n) = g(n) + h(n)\ng(n) = exact cost from start to n\nh(n) = estimated cost from n to goal\nf(n) = estimated total solution cost through n' },
      { front: 'What is an admissible heuristic?', back: 'h(n) ≤ h*(n) for all n\nNever overestimates the true cost to the goal.\nA heuristic that is OPTIMISTIC about remaining cost.\nGuarantees A* tree-search optimality.' },
      { front: 'What is the Relaxed Problem method for heuristics?', back: 'Remove constraints from the original problem. The optimal cost in the relaxed problem ≤ optimal cost in original problem → automatically admissible heuristic.' },
    ],
  },

  // =========================================================================
  // CHAPTER 4 — Beyond Classical Search
  // Source: AIMA Ch 4 (pp. 120–160)
  // =========================================================================
  4: {
    chapterId: 4,
    partId: 2,
    topicId: '4.1–4.4',
    title: 'Beyond Classical Search',
    subtitle: 'Local search, simulated annealing, genetic algorithms, and partial observability',
    estimatedMinutes: 14,
    bookPages: 'pp. 120–160',
    xpReward: 65,
    steps: [
      {
        stepNumber: 1,
        title: 'When You Don\'t Need the Path — Local Search',
        subtitle: 'Hill climbing and landscape metaphors',
        conceptType: 'intuition',
        visualType: 'hill_climbing',
        bookCitation: 'AIMA 3rd Ed., pp. 120–124',
        contentMarkdown: `### The Key Insight
In many problems, the **path to the goal doesn't matter** — only the **goal state itself** matters.

Examples:
- **8-Queens**: Find a configuration with no queens attacking each other (you don't care which order you placed queens)
- **VLSI Layout**: Place chips to minimize wire length
- **Protein Folding**: Find minimum-energy 3D structure
- **Traveling Salesman Problem (TSP)**: Find minimum-cost tour (ordering matters, intermediate steps don't)

For these problems, classical search wastes memory tracking paths. **Local Search** operates using a **single current state** and moves to neighboring states — using only **O(1) memory**!

### The Landscape Metaphor
Imagine the **state space** as a geographic landscape where:
- **Elevation** = objective function value (quality of state)
- **Position** = current state

The goal: find the **highest peak** (maximization) or **lowest valley** (minimization).

### Hill-Climbing Search (Steepest Ascent)
\`\`\`
function HILL-CLIMBING(problem) → state
  current ← problem.INITIAL-STATE
  loop:
    neighbor ← highest-valued successor of current
    if neighbor.VALUE ≤ current.VALUE → return current  ← local maximum!
    current ← neighbor
\`\`\`

### The Three Fatal Problems of Hill Climbing

**1. Local Maxima**: A peak that is higher than all neighbors but NOT the global maximum.
The algorithm stops here — it can't "see" that a better peak exists elsewhere.

**2. Ridges**: A series of local maxima connected together. Each is a peak in some directions, valley in others. Algorithm bounces around.

**3. Plateaux / Flat Shoulders**: The evaluation function is constant — no gradient to follow. Algorithm does random walk (or stalls).`,
        keyPoints: [
          'Local search trades path memory for solving optimization problems efficiently',
          'Uses O(1) memory — only stores current state (+ possibly a few neighbors)',
          'Hill climbing is greedy — always moves to best neighbor',
          '3 failure modes: local maxima, ridges, plateaux',
        ],
      },
      {
        stepNumber: 2,
        title: 'Escaping Local Optima — Simulated Annealing',
        subtitle: 'Random restarts and physics-inspired probabilistic moves',
        conceptType: 'algorithm',
        visualType: 'simulated_annealing',
        bookCitation: 'AIMA 3rd Ed., pp. 126–129',
        contentMarkdown: `### Why Pure Hill Climbing Fails
Hill climbing gets stuck at **local maxima** because it never accepts moves that decrease value.

Two simple fixes:
1. **Random Restart Hill Climbing**: restart from a random state when stuck. Complete (probability 1 as restarts → ∞). Works well when local maxima aren't too common.

2. **Simulated Annealing**: accept "bad" moves occasionally, with probability that decreases over time.

### Simulated Annealing — Inspired by Metallurgy
When metalworkers heat then slowly cool metal (annealing), atoms settle into a highly ordered, low-energy crystalline structure — the global minimum!

\`\`\`
function SIMULATED-ANNEALING(problem, schedule) → solution state
  current ← problem.INITIAL-STATE
  for t = 1 to ∞:
    T ← schedule(t)    ← temperature, decreasing over time
    if T = 0 → return current
    next ← randomly selected successor of current
    ΔE ← VALUE(next) - VALUE(current)
    if ΔE > 0 → current ← next    ← ALWAYS accept improvements
    else → current ← next with probability exp(ΔE / T)  ← SOMETIMES accept worsening
\`\`\`

### The Magic Formula
$$P(\\text{accept bad move}) = e^{\\Delta E / T}$$

- $\\Delta E < 0$: bad move (value decreased)
- High temperature $T$: $e^{\\Delta E / T} ≈ 1$ → almost always accept bad moves (explore freely)
- Low temperature $T → 0$: $e^{\\Delta E / T} → 0$ → rarely accept bad moves (converge to best found)

### The Convergence Guarantee
If the **annealing schedule** (how fast T decreases) is slow enough:
> *"Simulated annealing is guaranteed to find the global optimum with probability approaching 1."* — R&N

**In practice**: The schedule must be "slow enough" — but this can require exponential time. Engineers use heuristic schedules (geometric cooling: $T_{t+1} = \\alpha \\cdot T_t$, $\\alpha \\approx 0.99$).`,
        mathBlock: {
          formula: 'P(accept) = e^{ΔE/T}',
          explanation: 'Boltzmann acceptance probability. ΔE = new value − current value (negative for bad moves). T = temperature. As T→0, only improvements are accepted.',
        },
        keyPoints: [
          'SA randomly selects neighbors (not the best) — this allows exploring bad directions',
          'High T: almost random walk; Low T: almost hill climbing',
          'The key: T decreases over time → starts exploring, ends exploiting',
          'Convergence theorem requires T to decrease logarithmically (very slowly in theory)',
          'Used in VLSI chip design, scheduling, protein folding in practice',
        ],
        examTip: 'Simulated Annealing convergence: guaranteed in theory but requires exponential time. In practice, use geometric cooling schedule with many restarts.',
      },
      {
        stepNumber: 3,
        title: 'Genetic Algorithms — Evolution as Search',
        subtitle: 'Selection, crossover, mutation — mimicking natural evolution',
        conceptType: 'algorithm',
        visualType: 'genetic_algo',
        bookCitation: 'AIMA 3rd Ed., pp. 129–133',
        contentMarkdown: `### Inspiration: Darwinian Evolution
Genetic Algorithms (GAs) simulate the mechanism of natural evolution:
- **Population** of candidates → selection of the fittest → reproduction with variation → next generation

### The GA Algorithm
\`\`\`
function GENETIC-ALGORITHM(population, FITNESS-FN) → individual
  repeat:
    new_population ← {}
    for i = 1 to SIZE(population):
      x ← RANDOM-SELECTION(population, FITNESS-FN)    ← Fitter → more likely selected
      y ← RANDOM-SELECTION(population, FITNESS-FN)
      child ← REPRODUCE(x, y)                          ← Crossover
      if (small random probability):
        child ← MUTATE(child)                          ← Mutation
      new_population ← new_population + child
    population ← new_population
  until some individual is fit enough or time limit reached
  return BEST-INDIVIDUAL(population)
\`\`\`

### Example: 8-Queens Encoding
Encode 8-queens board as an 8-digit string: "24748552"
- Digit $i$ = row of queen in column $i$
- Fitness function = number of NON-attacking queen pairs (max 28)

**Selection**: "24748552" (fitness=24) is 3× more likely chosen than "32752411" (fitness=8)

**Crossover** at position 5:
- Parent 1: "24748|552"
- Parent 2: "32752|411"  
- Child: "24748411"

**Mutation** (flip one digit): "24748411" → "24748**3**11" (random change to 3)

### What Makes GAs Powerful?
1. **Schema Theorem**: Short, high-fitness substrings ("building blocks") survive and combine → complex structures emerge
2. **Implicit Parallelism**: A population of k individuals evaluates exponentially many schemas simultaneously
3. **Global Search**: Multiple simultaneous local searches with recombination avoids getting stuck

### GAs vs. Simulated Annealing
- SA explores one trajectory; GA explores multiple simultaneously
- SA: escape local optima with random bad moves; GA: escape with crossover (combining good pieces from different regions)
- GA needs encoding, fitness function; SA needs neighbors, ΔE`,
        keyPoints: [
          'Representation: states encoded as strings (bit strings, real numbers)',
          'Selection: probability of reproduction ∝ fitness',
          'Crossover: child inherits "genes" from both parents at random split point',
          'Mutation: small random changes prevent premature convergence',
          'Population size: typically 100–1000; too small = premature convergence; too large = slow',
        ],
        connectedTo: [
          {
            chapterId: 18,
            chapterTitle: 'Learning from Examples',
            relationship: 'GAs can be used to evolve neural network architectures (Neural Architecture Search — NAS). Deep Learning book covers this connection.',
            bookRef: 'Deep Learning (Goodfellow) pp. 226–229',
          },
        ],
      },
      {
        stepNumber: 4,
        title: 'Searching with Partial Observations — Belief States',
        subtitle: 'From physical states to sets of possible states',
        conceptType: 'math',
        visualType: 'belief_state',
        bookCitation: 'AIMA 3rd Ed., pp. 136–149',
        contentMarkdown: `### The Partial Observability Problem
In Chapters 3, the agent always knew its exact state. Now: **sensors don't tell you everything**.

### The Vacuum World with No Sensors
Physical states: 8 possible configurations (2 rooms × 2 cleanliness each × 2 positions):
- Sensorless agent doesn't know if it's in Room A or B, or which rooms are dirty

**Belief State** $b$: a **set** of physical states the agent might currently be in.

Initial belief state (no sensors): $b_0 = \\{1, 2, 3, 4, 5, 6, 7, 8\\}$ — could be anywhere!

### Belief State Updates
When agent takes action $a$ and observes $o$:

**Step 1 — Predict** (action effect on belief state):
$$b' = \\text{PREDICT}(b, a) = \\{s' : s' = \\text{Result}(s, a), s \\in b\\}$$

**Step 2 — Update** (filter by observation):
$$b'' = \\text{UPDATE}(b', o) = \\{s' \\in b' : o = \\text{PERCEPT}(s')\\}$$

### Sensorless (Conformant) Planning Example
Can we reach the goal (all clean) with NO sensors at all?

Starting from $b_0 = \\{1,2,3,4,5,6,7,8\\}$:

| Action | Belief State Before | Belief State After |
|--------|---------------------|---------------------|
| Go Right | {1..8} | {2,4,6,8} — now in Room B |
| Suck | {2,4,6,8} | {4,8} — Room B is clean |
| Go Left | {4,8} | {3,7} — now in Room A |
| Suck | {3,7} | {7} — Room A is clean! |

$b = \\{7\\}$ is our goal! State 7 = "both clean, agent in A".

**Conformant Plan**: \`[Right, Suck, Left, Suck]\` works regardless of initial state — zero sensors needed!

### The Power of Belief State Search
Key insight: **We can treat the belief state as a single "super-state"** and apply standard search algorithms to the belief space!
- The belief space has $2^N$ states (N = number of physical states)
- Requires search algorithms (BFS, A*) over this exponentially large space
- Chapter 15 upgrades this: instead of SET of possible states, use PROBABILITY DISTRIBUTION (Bayesian filtering)`,
        mathBlock: {
          formula: "b'' = UPDATE(PREDICT(b, a), o)",
          explanation: "Two-step belief update: Predict expands belief state by action effects; Update shrinks it by filtering states inconsistent with observation o.",
        },
        keyPoints: [
          'Belief state = set of physical states agent believes it could be in',
          'Size: physical state space N → belief space 2^N (exponential!)',
          'Conformant planning: find action sequence that works in ALL belief states (no sensors)',
          'Contingency planning: actions depend on observations during execution',
          'Online search: agent discovers environment as it acts (exploration)',
        ],
        connectedTo: [
          {
            chapterId: 15,
            chapterTitle: 'Probabilistic Reasoning over Time',
            relationship: 'HMMs upgrade belief states from "set of possible states" (Boolean) to probability distributions P(State) — Bayesian filtering is the probabilistic version of belief state update.',
          },
        ],
      },
    ],
    quizQuestions: [
      {
        question: 'Which of the following describes Hill Climbing\'s "plateau" problem?',
        options: [
          'The algorithm encounters a state from which it cannot backtrack',
          'The evaluation function is flat — no gradient indicates which neighbor is best',
          'The algorithm finds a state better than all global neighbors but not the global optimum',
          'The evaluation function has too many local maxima to efficiently navigate',
        ],
        correctIndex: 1,
        explanation: 'A plateau is a region where the evaluation function is constant — all neighbors have the same value. Hill climbing has no gradient signal to follow, so it either stalls or does random walk. AIMA p. 122.',
        difficulty: 'medium',
      },
      {
        question: 'In Simulated Annealing, why does the algorithm sometimes accept worse moves?',
        options: [
          'To ensure equal probability of choosing any neighbor',
          'To escape local optima by occasionally moving to lower-quality states, with decreasing probability over time',
          'To reduce computation time by skipping expensive neighbor evaluations',
          'Because the algorithm cannot distinguish better from worse moves at high temperature',
        ],
        correctIndex: 1,
        explanation: 'SA accepts bad moves with probability exp(ΔE/T). At high T, bad moves are often accepted (exploration phase). As T cools, this probability → 0 (exploitation phase). This allows escape from local optima while eventually converging.',
        difficulty: 'easy',
      },
      {
        question: 'If an environment has 8 physical states, how many possible belief states does the belief state space contain?',
        options: [
          '8', '16', '64', '256',
        ],
        correctIndex: 3,
        explanation: 'A belief state is any subset of the physical state space. With N=8 physical states, there are 2^8 = 256 possible subsets (including the empty set). This is why belief state search is computationally challenging even for small physical state spaces.',
        difficulty: 'easy',
      },
    ],
    flashCards: [
      { front: 'What is local search?', back: 'Search that operates on a single current state, moving to neighboring states. Uses O(1) memory. Useful when the PATH to the goal doesn\'t matter, only the goal state. Examples: Hill Climbing, Simulated Annealing, Genetic Algorithms.' },
      { front: 'Three failure modes of Hill Climbing?', back: '1. Local Maxima: better than all neighbors but not global optimum\n2. Ridges: series of local maxima\n3. Plateaux/Shoulders: flat region with no gradient' },
      { front: 'Simulated Annealing acceptance formula?', back: 'P(accept bad move) = exp(ΔE / T)\nΔE = new_value − current_value (negative for bad move)\nT = temperature (decreases over time)\nHigh T ≈ random walk; Low T ≈ hill climbing' },
      { front: 'What is a belief state?', back: 'A SET of physical states the agent believes it might currently be in, given its observation history. Used when the environment is partially observable. If N physical states, 2^N possible belief states.' },
    ],
  },

  // =========================================================================
  // CHAPTER 5 — Adversarial Search
  // Source: AIMA Ch 5 (pp. 161–201)
  // =========================================================================
  5: {
    chapterId: 5,
    partId: 2,
    topicId: '5.1–5.4',
    title: 'Adversarial Search & Games',
    subtitle: 'Minimax, alpha-beta pruning, and imperfect real-time decisions',
    estimatedMinutes: 14,
    bookPages: 'pp. 161–201',
    xpReward: 70,
    steps: [
      {
        stepNumber: 1,
        title: 'Games as Search Problems',
        subtitle: 'Adversaries, zero-sum games, and the impossibility of brute force',
        conceptType: 'intuition',
        visualType: 'minimax_tree',
        bookCitation: 'AIMA 3rd Ed., pp. 161–164',
        contentMarkdown: `### Why Games Require New Techniques
In Chapters 3–4, the agent was the **only decision-maker** — the environment was indifferent. In adversarial search, there is an **opponent** who is also trying to make optimal decisions!

### The Game Framework (AIMA Definition)
A deterministic, two-player, zero-sum game of perfect information is defined by:
- **Initial State**: board position and whose turn it is
- **PLAYER(s)**: which player moves in state s (MAX or MIN)
- **ACTIONS(s)**: set of legal moves
- **RESULT(s, a)**: the next state after action a in state s
- **TERMINAL-TEST(s)**: is s a terminal (game-over) state?
- **UTILITY(s, p)**: numerical payoff for player p in terminal state s (Chess: +1, 0, -1)

### Zero-Sum Property
$$U_{\\text{MAX}} + U_{\\text{MIN}} = \\text{constant}$$
What MAX wins, MIN loses exactly. No cooperation possible.

### The Complexity Problem
- **Chess**: branching factor $b \\approx 35$, average depth $m \\approx 80$ → $35^{80} \\approx 10^{123}$ nodes
- Number of atoms in observable universe: $\\approx 10^{80}$
- **Conclusion**: Brute-force minimax is impossible for chess! Need pruning + heuristics.`,
        keyPoints: [
          'Games have an adversary making rational decisions against you — not a neutral environment',
          'Zero-sum: maximizing your utility = minimizing opponent\'s utility',
          'Perfect information: both players see the complete board state (Chess, Checkers, Go)',
          'Complexity: Chess has more game tree nodes than atoms in the universe → need alpha-beta pruning',
        ],
      },
      {
        stepNumber: 2,
        title: 'The Minimax Algorithm',
        subtitle: 'Backward induction from terminal states to root',
        conceptType: 'math',
        visualType: 'minimax_tree',
        bookCitation: 'AIMA 3rd Ed., pp. 164–167',
        contentMarkdown: `### The Core Idea
MAX wants to **maximize** utility. MIN wants to **minimize** MAX's utility. Both play **optimally**.

### The Minimax Value (Recursive Definition)
$$\\text{MINIMAX}(s) = \\begin{cases}
\\text{UTILITY}(s) & \\text{if TERMINAL-TEST}(s) \\\\
\\max_{a \\in \\text{ACTIONS}(s)} \\text{MINIMAX}(\\text{RESULT}(s, a)) & \\text{if PLAYER}(s) = \\text{MAX} \\\\
\\min_{a \\in \\text{ACTIONS}(s)} \\text{MINIMAX}(\\text{RESULT}(s, a)) & \\text{if PLAYER}(s) = \\text{MIN}
\\end{cases}$$

### Reading the Game Tree
At terminal states: assign utility (+1 MAX wins, -1 MIN wins, 0 draw)
Working BACKWARDS from leaves:
- At **MAX nodes**: parent takes the MAX of children's values
- At **MIN nodes**: parent takes the MIN of children's values

### Example Trace
\`\`\`
           MAX node: picks max(3, 2, 2) = 3
          /            \\            \\
    MIN(3,2)        MIN(5,2)      MIN(1,∞)
     /    \\           /    \\          |
    3      2         5      2         1
\`\`\`
MAX picks the 3 subtree → plays the move leading to the left MIN node.
MIN in the left subtree then picks min(3,2) = 2.

### Formal Analysis
- **Complete**: Yes (in finite game trees)
- **Optimal**: Yes against any opponent (even suboptimal opponents — won't do worse!)
- **Time**: $O(b^m)$ — depth-first search through game tree
- **Space**: $O(bm)$ — only stores current path`,
        mathBlock: {
          formula: 'MINIMAX(s) = max_a MINIMAX(RESULT(s,a)) [for MAX], min_a MINIMAX(RESULT(s,a)) [for MIN]',
          explanation: 'Backward induction: work from terminal states backward. MAX nodes take max of children, MIN nodes take min of children.',
        },
        keyPoints: [
          'Minimax assumes BOTH players play optimally — provides worst-case guarantee',
          'Against suboptimal opponent: minimax is still valid (you won\'t do worse; may do better)',
          'Time O(b^m): complete DFS through entire game tree',
          'Minimax is provably optimal: no other strategy guarantees better results against optimal play',
        ],
      },
      {
        stepNumber: 3,
        title: 'Alpha-Beta Pruning',
        subtitle: 'Doubling search depth without changing the answer',
        conceptType: 'algorithm',
        visualType: 'alpha_beta',
        bookCitation: 'AIMA 3rd Ed., pp. 167–173',
        contentMarkdown: `### The Key Observation
When computing MINIMAX, many branches are **irrelevant** — they cannot change the final decision at the root. Alpha-Beta Pruning finds and skips these branches.

### Two Variables Track the "Already Known" Bounds
- **α (alpha)**: The best (highest) value that MAX can guarantee along the path from root to current node
- **β (beta)**: The best (lowest) value that MIN can guarantee along the path from root to current node

### The Pruning Rules
**At a MIN node**: if we find a value $v \\le \\alpha$ → **PRUNE** (stop evaluating siblings)
- Why? MAX already has a path guaranteeing ≥ α. MIN would never choose this MIN node!

**At a MAX node**: if we find a value $v \\ge \\beta$ → **PRUNE** (stop evaluating siblings)
- Why? MIN already has a path guaranteeing ≤ β. MAX would never choose this MAX node!

In both cases: the parent will never choose this subtree. **Skip it!**

### The ALPHA-BETA-SEARCH Algorithm
\`\`\`
function ALPHA-BETA-SEARCH(state)
  return action in ACTIONS(state) with value MAX-VALUE(state, -∞, +∞)

function MAX-VALUE(state, α, β)
  if TERMINAL-TEST(state): return UTILITY(state)
  v ← -∞
  for each a in ACTIONS(state):
    v ← max(v, MIN-VALUE(RESULT(state, a), α, β))
    if v ≥ β: return v      ← β-cutoff (prune remaining)
    α ← max(α, v)
  return v

function MIN-VALUE(state, α, β)
  if TERMINAL-TEST(state): return UTILITY(state)
  v ← +∞
  for each a in ACTIONS(state):
    v ← min(v, MAX-VALUE(RESULT(state, a), α, β))
    if v ≤ α: return v      ← α-cutoff (prune remaining)
    β ← min(β, v)
  return v
\`\`\`

### The Spectacular Complexity Improvement

| Move Ordering | Nodes Evaluated | Effective Branching |
|---------------|-----------------|---------------------|
| Worst case | $O(b^m)$ | b |
| Average (random) | $O(b^{3m/4})$ | $b^{3/4}$ |
| **Best case (perfect ordering)** | **$O(b^{m/2})$** | **$\\sqrt{b}$** |

For chess: $35^{80}$ → $35^{40}$ → instead of $10^{123}$ nodes, about $10^{61}$ nodes!

**Alpha-Beta with good move ordering effectively doubles the search depth!**`,
        keyPoints: [
          'Alpha-Beta returns IDENTICAL minimax value as full search — just faster',
          'α = highest guaranteed value for MAX; β = lowest guaranteed value for MIN',
          'Prune at MIN if v ≤ α; Prune at MAX if v ≥ β',
          'Perfect move ordering: O(b^(m/2)) — doubles effective search depth',
          'Move ordering heuristics: try captures first, killer moves, history heuristic',
        ],
        examTip: 'CRITICAL: Alpha-Beta NEVER changes the minimax value at the root. It returns the EXACT SAME MOVE as full minimax, just with dramatically less computation. Pruning is purely an optimization.',
      },
      {
        stepNumber: 4,
        title: 'Imperfect Real-Time Decisions',
        subtitle: 'Evaluation functions, depth cutoffs, and the horizon effect',
        conceptType: 'algorithm',
        visualType: 'minimax_tree',
        bookCitation: 'AIMA 3rd Ed., pp. 173–181',
        contentMarkdown: `### The Computational Reality
Even with Alpha-Beta, games like Chess are too deep to search to terminal states. Real programs use:

### 1. Evaluation Functions (Heuristic Cutoffs)
Instead of reaching terminal states, evaluate at a **cutoff depth** with an **evaluation function** EVAL(s).

Requirements for EVAL:
- Must order terminal states the same as UTILITY function
- Must be computable quickly
- Must correlate with actual chances of winning

**Classic Chess Evaluation** (Shannon, 1950):
$$\\text{EVAL}(s) = \\sum_i w_i f_i(s)$$
- $f_i$: features (material count, king safety, pawn structure, mobility, control of center)
- $w_i$: weights (pawn=1, knight/bishop=3, rook=5, queen=9, ...)

**Deep Blue** (defeated Kasparov 1997): 8000 features, 243 MHz VLSI, α-β to depth 14+

**AlphaZero** (2017): replaced hand-crafted EVAL with a neural network! See Chapter 21.

### 2. The Horizon Effect — A Critical Failure Mode
A **horizon effect** occurs when a serious problem "disappears" by being pushed past the search horizon.

Example: A pawn about to be queened can be prevented... by wasting moves pushing it past the horizon where the computer can no longer "see" the queening.

### 3. Quiescence Search — Fixing the Horizon Effect
- Continue searching past depth limit in **non-quiescent** (tactically volatile) positions
- Non-quiescent: pieces under attack, captures available, checks pending
- Only apply depth cutoff in **quiet** positions (no tactics in progress)

### 4. Singular Extensions
- If one move is clearly better than all others (e.g., forced check), extend search depth for that move
- Prevents missing "obvious" tactical sequences just beyond the cutoff`,
        keyPoints: [
          'Real games need depth cutoff + evaluation function instead of utility at terminal states',
          'EVAL function must be fast, accurate, and agree with UTILITY on terminal states',
          'Horizon Effect: severe tactical threat "disappears" past search depth — major bug in early chess programs',
          'Quiescence search: extend beyond depth limit in volatile positions to fix horizon effect',
          'AlphaZero replaced hand-crafted EVAL with neural network learned from self-play',
        ],
        connectedTo: [
          {
            chapterId: 21,
            chapterTitle: 'Reinforcement Learning',
            relationship: 'AlphaGo/AlphaZero uses Monte Carlo Tree Search + neural network EVAL trained by RL — replacing hand-crafted evaluation functions entirely.',
          },
        ],
      },
    ],
    quizQuestions: [
      {
        question: 'Alpha-Beta pruning prunes a branch under a MIN node when:',
        options: [
          'The value found v ≥ β (MIN has found too good a value)',
          'The value found v ≤ α (MIN\'s subtree is worse than MAX\'s guaranteed alternative)',
          'The value found v = 0 (draw detected)',
          'The search depth exceeds the cutoff limit',
        ],
        correctIndex: 1,
        explanation: 'Prune at MIN node when v ≤ α: α is the best MAX can guarantee. If MIN finds a value ≤ α, MAX would never choose this branch (MAX already has something better elsewhere). So we stop evaluating remaining children of this MIN node.',
        difficulty: 'medium',
      },
      {
        question: 'With perfect move ordering, Alpha-Beta pruning evaluates approximately how many nodes compared to plain Minimax?',
        options: [
          'The same number — pruning doesn\'t affect correctness OR efficiency',
          'Half as many nodes — b^(m-1) instead of b^m',
          'Square root as many — b^(m/2) instead of b^m (effectively doubles search depth!)',
          'Logarithmically fewer — log(b^m) nodes',
        ],
        correctIndex: 2,
        explanation: 'With perfect move ordering (best moves first), Alpha-Beta evaluates O(b^(m/2)) nodes vs O(b^m) for minimax — square root of the nodes! This means for the same time budget, you can search TWICE as deep. For chess: from 10^123 → 10^61 nodes.',
        difficulty: 'medium',
      },
      {
        question: 'The "horizon effect" in game tree search refers to:',
        options: [
          'The maximum depth at which neural networks can evaluate board positions',
          'The problem where an agent mistakes its starting position for a later one',
          'A serious threat being delayed beyond the depth cutoff so the program does not "see" it',
          'The exponential growth of game tree nodes as branching factor increases',
        ],
        correctIndex: 2,
        explanation: 'Horizon effect: the search has a fixed depth cutoff. An opponent can force a serious bad event (e.g., losing a piece) to occur just PAST the horizon, making it "invisible" to the program. The program plays suboptimally, thinking it has escaped the problem. Quiescence search partially addresses this.',
        difficulty: 'hard',
      },
    ],
    flashCards: [
      { front: 'Minimax MINIMAX(s) for MAX node?', back: 'MINIMAX(s) = max_{a∈ACTIONS(s)} MINIMAX(RESULT(s,a))\nMAX picks the action leading to the child with the HIGHEST minimax value.' },
      { front: 'What do α and β represent in Alpha-Beta?', back: 'α = best (highest) value MAX can guarantee along current path from root\nβ = best (lowest) value MIN can guarantee along current path from root\nPrune at MIN if v ≤ α; Prune at MAX if v ≥ β' },
      { front: 'What is the horizon effect?', back: 'A serious threat is delayed past the search depth cutoff, making the program "blind" to it. Fixed by quiescence search: continue searching in tactically volatile positions (captures, checks).' },
      { front: 'Alpha-Beta best case complexity?', back: 'O(b^(m/2)) with perfect move ordering — the same as searching with branching factor √b instead of b. Effectively DOUBLES the search depth achievable in the same time.' },
    ],
  },

  // =========================================================================
  // CHAPTER 6 — Constraint Satisfaction Problems
  // Source: AIMA Ch 6 (pp. 202–233)
  // =========================================================================
  6: {
    chapterId: 6,
    partId: 2,
    topicId: '6.1–6.5',
    title: 'Constraint Satisfaction Problems',
    subtitle: 'AC-3 arc consistency, backtracking with MRV/LCV, and local search CSP',
    estimatedMinutes: 14,
    bookPages: 'pp. 202–233',
    xpReward: 65,
    steps: [
      {
        stepNumber: 1,
        title: 'What is a CSP?',
        subtitle: 'Variables, domains, constraints, and problem formulation',
        conceptType: 'intuition',
        visualType: 'propositional_logic',
        bookCitation: 'AIMA 3rd Ed., pp. 202–206',
        contentMarkdown: `### Factored State Representation
Standard search treats states as atomic "black boxes." CSPs reveal the **internal structure of states** as a set of variables with values.

A **Constraint Satisfaction Problem** is defined by:
1. **Variables** $X = \\{X_1, X_2, \\ldots, X_n\\}$
2. **Domains** $D = \\{D_1, D_2, \\ldots, D_n\\}$ where each $D_i$ = set of allowed values for $X_i$
3. **Constraints** $C$ = set of constraints, each restricting allowed value combinations

**Goal**: Find an **assignment** (value for each variable) satisfying ALL constraints.

### Classic Example: Map Coloring — Australia
Variables: {WA, NT, Q, NSW, V, SA, T} (7 Australian states/territories)
Domain: {Red, Green, Blue} for each
Constraints: Adjacent regions must have different colors
- WA ≠ NT, WA ≠ SA, NT ≠ SA, NT ≠ Q, SA ≠ Q, SA ≠ NSW, SA ≠ V, Q ≠ NSW, NSW ≠ V

### Classic Example: 8-Queens CSP
Variables: $Q_1, Q_2, \\ldots, Q_8$ (which row queen i is in, for column i)
Domain: $\\{1, 2, 3, 4, 5, 6, 7, 8\\}$ for each
Constraints: No two queens attack each other:
- $Q_i \\neq Q_j$ (different rows)
- $|Q_i - Q_j| \\neq |i - j|$ (different diagonals)

### Classic Example: Cryptarithmetic
$$\\text{SEND} + \\text{MORE} = \\text{MONEY}$$
Variables: {S, E, N, D, M, O, R, Y} + carry variables
Domain: {0, 1, 2, ..., 9} per letter (S, M ≠ 0)
Constraints: Column-by-column arithmetic + all different letters

### Constraint Types
- **Unary**: restricts one variable: $V \\neq \\text{Green}$
- **Binary**: restricts two variables: $WA \\neq NT$ — most common!
- **Higher-order**: restricts 3+ variables: ALLDIFF constraint in cryptarithmetic

All CSPs can be transformed to use only binary constraints (via auxiliary variables).`,
        keyPoints: [
          'CSP = Variables + Domains + Constraints — enables general-purpose algorithms',
          'CSP algorithms exploit variable-constraint structure (unlike generic search)',
          'Complete assignment: value assigned to every variable',
          'Consistent assignment: satisfies all constraints',
          'Solution: complete + consistent assignment',
        ],
      },
      {
        stepNumber: 2,
        title: 'Constraint Propagation — AC-3 Algorithm',
        subtitle: 'Inference reduces domains before and during search',
        conceptType: 'algorithm',
        visualType: 'propositional_logic',
        bookCitation: 'AIMA 3rd Ed., pp. 209–216',
        contentMarkdown: `### The Power of Inference
Rather than just searching blindly, CSP solvers use **constraint propagation** to **reduce domains** before and during search.

### Arc Consistency
Directed arc $(X_i, X_j)$ is **arc-consistent** if:
$$\\forall x \\in D_i, \\exists y \\in D_j \\text{ such that } (x, y) \\text{ satisfies constraint } C_{ij}$$

For every value in $X_i$'s domain, there exists at least one compatible value in $X_j$'s domain.

If not: remove the inconsistent values from $D_i$.

### The AC-3 Algorithm
\`\`\`
function AC-3(csp) → false if inconsistency; true otherwise
  queue ← all arcs in csp
  while queue is not empty:
    (Xi, Xj) ← REMOVE-FIRST(queue)
    if REVISE(csp, Xi, Xj):
      if SIZE(Di) = 0: return false   ← Domain empty = unsolvable!
      for each Xk in NEIGHBORS(Xi) - {Xj}:
        add (Xk, Xi) to queue         ← Removal may affect other arcs

function REVISE(csp, Xi, Xj) → true if Di revised
  revised ← false
  for each x in Di:
    if no y in Dj satisfies (Xi=x, Xj=y):
      remove x from Di
      revised ← true
  return revised
\`\`\`

### Example: Map Coloring — Before and After AC-3
Suppose WA = Red (assigned). AC-3 propagates:
- Arc (NT, WA): NT domain {R,G,B} → remove R → NT domain = {G, B}
- Arc (SA, WA): SA domain → remove R → SA domain = {G, B}
- Arc (SA, NT): if NT = G, SA ≠ G → and if NT = B, SA ≠ B → SA domain = ?
- This cascades through the entire graph!

### Complexity
$$O(c \\cdot d^3)$$
where $c$ = number of binary constraints, $d$ = maximum domain size.

Each arc can be re-added to queue at most $d$ times per variable (domain can only shrink).`,
        mathBlock: {
          formula: '∀x ∈ Dᵢ, ∃y ∈ Dⱼ such that (x,y) satisfies Cᵢⱼ',
          explanation: 'Arc consistency condition: for every value in Xᵢ\'s domain, there must exist some compatible value in Xⱼ\'s domain. If not, remove that value from Dᵢ.',
        },
        keyPoints: [
          'Arc consistency removes values from domains that cannot participate in any solution',
          'AC-3 is the standard algorithm — runs in O(cd³) time',
          'Domain becomes empty → current assignment is inconsistent → backtrack',
          'Constraint propagation dramatically reduces search space before backtracking',
          'k-consistency generalizes arc consistency: looking at k-variable subsets simultaneously',
        ],
        examTip: 'After applying AC-3, if every domain has exactly one value remaining, the CSP is solved without any search! This is the power of inference.',
      },
      {
        stepNumber: 3,
        title: 'Backtracking Search with Smart Heuristics',
        subtitle: 'MRV, Degree Heuristic, LCV — 1000x speedup',
        conceptType: 'algorithm',
        visualType: 'propositional_logic',
        bookCitation: 'AIMA 3rd Ed., pp. 214–222',
        contentMarkdown: `### Basic Backtracking for CSPs
Standard DFS adapted for CSPs — assign one variable at a time, backtrack when stuck:
\`\`\`
function BACKTRACKING-SEARCH(csp) → assignment or failure
  return BACKTRACK({}, csp)

function BACKTRACK(assignment, csp) → assignment or failure
  if assignment is complete: return assignment
  var ← SELECT-UNASSIGNED-VARIABLE(csp, assignment)    ← KEY: which var?
  for each value in ORDER-DOMAIN-VALUES(var, assignment, csp):  ← KEY: which order?
    if value is consistent with assignment:
      assignment ← assignment + {var = value}
      inferences ← INFERENCE(csp, var, assignment)     ← propagate!
      if inferences ≠ failure:
        assignment ← assignment + inferences
        result ← BACKTRACK(assignment, csp)
        if result ≠ failure: return result
      assignment ← remove {var = value} and inferences
  return failure
\`\`\`

### Heuristic 1: Minimum Remaining Values (MRV) — "Fail-First"
**Choose the variable with the fewest legal values remaining in its domain.**

Rationale: If a variable has only 1 value left, we MUST assign it now (or fail fast!). Variables with few options are the "most constrained" — detect failures early.

*Also called: Most Constrained Variable, Fail-First Heuristic*

### Heuristic 2: Degree Heuristic (Tie-Breaker for MRV)
**Choose the variable involved in the most constraints with remaining unassigned variables.**

Rationale: High-degree variables constrain the most others → reducing their domains has the most global impact.

### Heuristic 3: Least Constraining Value (LCV) — "Fail-Last"
**Given a selected variable, choose the value that rules out the fewest values in neighboring domains.**

Rationale: We want to preserve the maximum flexibility for remaining variables. Try the "most compatible" value first.

### The Elegant Dichotomy ⭐
> **Variable selection (Fail-First MRV)**: Choose the MOST constrained variable
> **Value ordering (Fail-Last LCV)**: Choose the LEAST constraining value

This works because:
- Variable selection: we must try all variables anyway → fail fast to prune dead ends
- Value ordering: we want just ONE solution → pick values most likely to succeed

### Forward Checking (Inference)
After each assignment, propagate to neighbors: remove values from their domains that violate constraints. If any domain becomes empty → immediately fail and backtrack!`,
        keyPoints: [
          'MRV "Fail-First": variable with fewest remaining legal values — detect failures early',
          'Degree heuristic: variable with most constraints on unassigned variables (MRV tie-breaker)',
          'LCV "Fail-Last": value that eliminates fewest neighbors\' values — maximum future flexibility',
          'Forward checking: propagate after each assignment; empty domain → immediate backtrack',
          'Combined, these heuristics can reduce search by factors of 1000x or more!',
        ],
        examTip: 'The dichotomy: MRV selects the MOST constrained variable (Fail-First). LCV selects the LEAST constraining value (Fail-Last). These work in opposite directions but both reduce search!',
      },
    ],
    quizQuestions: [
      {
        question: 'In CSP backtracking, what does the Minimum Remaining Values (MRV) heuristic select?',
        options: [
          'The variable that has been assigned the minimum number of constraints',
          'The variable with the fewest legal values remaining in its domain',
          'The value for the current variable that rules out the fewest choices for neighbors',
          'The constraint with the minimum number of variables',
        ],
        correctIndex: 1,
        explanation: 'MRV (also called "Fail-First" or "Most Constrained Variable") selects the variable with the fewest remaining legal values in its domain. This detects dead ends early — if a variable has 0 legal values, we backtrack immediately rather than exploring further.',
        difficulty: 'easy',
      },
      {
        question: 'After running AC-3, if a variable\'s domain becomes empty, what does this mean?',
        options: [
          'The variable needs to be removed from the CSP',
          'The CSP has no solution — it is unsatisfiable',
          'The current partial assignment is inconsistent and we need to backtrack',
          'The domain needs to be reset to its original values',
        ],
        correctIndex: 2,
        explanation: 'An empty domain means the current partial assignment has made it impossible for that variable to take any legal value consistent with the constraints. AC-3 returns false, causing backtracking in the search. Note: this doesn\'t mean the ENTIRE CSP is unsolvable — just that the current path is dead.',
        difficulty: 'medium',
      },
    ],
    flashCards: [
      { front: 'What defines a CSP?', back: 'Variables X = {X₁,...,Xₙ}\nDomains D = {D₁,...,Dₙ}\nConstraints C\nGoal: Complete + Consistent assignment' },
      { front: 'AC-3 arc consistency condition?', back: '∀x ∈ Dᵢ, ∃y ∈ Dⱼ such that (x,y) satisfies Cᵢⱼ\nIf x has no compatible y → remove x from Dᵢ\nComplexity: O(cd³)' },
      { front: 'MRV vs LCV in CSP?', back: 'MRV (variable selection): choose variable with FEWEST remaining legal values — Fail-First\nLCV (value ordering): choose value that eliminates FEWEST neighbors\' choices — Fail-Last' },
    ],
  },

  // =========================================================================
  // CHAPTER 7 — Logical Agents
  // Source: AIMA Ch 7 (pp. 234–284)
  // =========================================================================
  7: {
    chapterId: 7,
    partId: 3,
    topicId: '7.1–7.7',
    title: 'Logical Agents & Propositional Logic',
    subtitle: 'Knowledge bases, entailment, Wumpus World, and DPLL',
    estimatedMinutes: 16,
    bookPages: 'pp. 234–284',
    xpReward: 75,
    steps: [
      {
        stepNumber: 1,
        title: 'Knowledge-Based Agents',
        subtitle: 'The Knowledge Base, TELL, ASK, and inference engines',
        conceptType: 'intuition',
        visualType: 'wumpus_world',
        bookCitation: 'AIMA 3rd Ed., pp. 234–237',
        contentMarkdown: `### From Reflex to Reasoning
Previous chapters: agents that react to percepts using search. Now: agents that **reason** about the world using explicit **logical knowledge**.

### The Knowledge Base (KB)
A **knowledge base** is a set of **sentences** (facts and rules) in a formal language.

Two operations:
- **TELL**: Add a new sentence to the KB (assertion)
- **ASK**: Query the KB — *"Does this follow from what I know?"*

\`\`\`
function KB-AGENT(percept) → action
  TELL(KB, MAKE-PERCEPT-SENTENCE(percept, t))
  action ← ASK(KB, MAKE-ACTION-QUERY(t))
  TELL(KB, MAKE-ACTION-SENTENCE(action, t))
  t ← t + 1
  return action
\`\`\`

### Two Levels of Knowledge
- **Knowledge Level**: What the agent knows (sentences in the KB)
- **Implementation Level**: How the knowledge is stored and queried

### Why Logic?
Previous approaches had limitations:
- **Search agents** (Ch. 3–4): don't know *why* actions work
- **Reflex agents** (Ch. 2): can't generalize from observed cases
- **Logical agents**: can **infer** new facts from existing ones, **explain** decisions, **update** knowledge as they learn

Example: Agent in Wumpus World smells a stench in [1,1]:
- KB: "If there's a stench, the Wumpus is in an adjacent cell"
- Query: "Is the Wumpus in [1,2] or [2,1]?"
- Answer derived by logical inference — no search needed!`,
        keyPoints: [
          'KB = set of sentences in formal language; TELL adds facts; ASK queries for entailment',
          'Knowledge-based agents can reason about the world, explain decisions, update knowledge',
          'The "inference engine" is separate from the "knowledge base" — general-purpose reasoning',
          'Logic provides a declarative representation: say WHAT is true, not HOW to compute it',
        ],
      },
      {
        stepNumber: 2,
        title: 'The Wumpus World — A Test Environment',
        subtitle: 'PEAS specification and knowledge discovery by inference',
        conceptType: 'visual',
        visualType: 'wumpus_world',
        bookCitation: 'AIMA 3rd Ed., pp. 237–244',
        contentMarkdown: `### The Wumpus World (AIMA Figure 7.2)
A classic environment for testing logical reasoning:

**Grid**: 4×4 squares (rooms), bounded by walls.

**PEAS Specification**:
- **Performance**: +1000 gold; -1000 death (Wumpus/pit); -1 each action; -10 shoot arrow
- **Environment**: Squares, pits, Wumpus, gold, breezes, stenches, glitter
- **Actuators**: Forward, TurnLeft, TurnRight, Grab, Shoot, Climb
- **Sensors**: Stench, Breeze, Glitter, Bump, Scream

**World Rules** (what the agent learns to encode in KB):
- A **Pit** in [x,y] → **Breeze** in all adjacent squares
- The **Wumpus** in [x,y] → **Stench** in all adjacent squares
- **Gold** in same square → **Glitter** sensed
- There is exactly ONE Wumpus and ONE pile of Gold

### The Agent's Challenge
The agent starts at [1,1] facing right (East). No sensors fire at [1,1].

Turn 1: Agent perceives Nothing at [1,1]:
- **TELL(KB)**: Percept([Nothing, Nothing, Nothing, Nothing, Nothing], 0)
- **Infer**: [1,1] has no pit (would feel breeze), [2,1] and [1,2] have no Wumpus (no stench)

After [2,1], perceives Breeze:
- **Infer**: Either [1,1], [2,2], or [3,1] has a pit. Not [1,1] (safe, came from there). So [2,2] or [3,1].

After [1,2], perceives Stench:
- **Infer**: Wumpus in [2,2] or [1,3]. Since [1,1] is safe, Wumpus could be [1,3] or [2,2].

This **case analysis by logic** guides the agent to the gold without risking pits!`,
        keyPoints: [
          'Wumpus World: safe test bed for logical reasoning under uncertainty',
          'Breezes → adjacent pits; Stenches → adjacent Wumpus',
          'Agent uses logical inference to determine safe squares without exploring dangerously',
          'This is knowledge-based reasoning — not search through action sequences',
        ],
      },
      {
        stepNumber: 3,
        title: 'Logic: Syntax, Semantics, and Entailment',
        subtitle: 'The mathematical foundation of logical reasoning',
        conceptType: 'math',
        visualType: 'propositional_logic',
        bookCitation: 'AIMA 3rd Ed., pp. 244–249',
        contentMarkdown: `### Logic: Three Levels
1. **Syntax**: the formal language — what sentences are legal expressions
2. **Semantics**: what sentences MEAN — how to evaluate truth in a possible world (a model)
3. **Inference**: how to derive new sentences from existing ones

### Models
A **model** is a mathematical object that fixes the truth value of every relevant proposition.

For propositional logic with 3 symbols (P, Q, R): 2³ = 8 possible models.

### Entailment ⭐ The Core Concept
$$KB \\models \\alpha$$
*"KB entails α"* — meaning: **α is true in every model in which KB is true**.

Equivalently: The set of models satisfying KB is a **subset** of the models satisfying α.

$M(KB) \\subseteq M(\\alpha)$

### Soundness vs Completeness
**Soundness**: The inference procedure only derives sentences that are actually entailed by KB.
$$\\text{If } KB \\vdash_i \\alpha \\text{ then } KB \\models \\alpha$$
*An algorithm that is not sound is USELESS — it produces false conclusions!*

**Completeness**: The inference procedure can derive ANY sentence entailed by KB.
$$\\text{If } KB \\models \\alpha \\text{ then } KB \\vdash_i \\alpha$$
*An algorithm that is not complete is INCOMPLETE — it may miss valid conclusions.*

We want: **sound + complete** inference.

### Validity and Satisfiability
- **Valid (Tautology)**: True in ALL models. Example: $P \\lor \\neg P$
- **Satisfiable**: True in SOME model. Example: $P \\land Q$
- **Unsatisfiable (Contradiction)**: False in ALL models. Example: $P \\land \\neg P$

### The Connection to Entailment
$$KB \\models \\alpha \\iff (KB \\land \\neg \\alpha) \\text{ is unsatisfiable}$$
This is **proof by contradiction** — the foundation of resolution theorem proving!`,
        mathBlock: {
          formula: 'KB ⊨ α ⟺ (KB ∧ ¬α) is UNSATISFIABLE',
          explanation: 'Entailment via contradiction: α follows from KB iff assuming ¬α while believing KB leads to a logical contradiction. This is the foundation of resolution proof.',
        },
        keyPoints: [
          'Entailment: KB ⊨ α means α is TRUE in ALL worlds where KB is TRUE',
          'Soundness: only derive what is actually entailed (no false conclusions)',
          'Completeness: derive EVERYTHING that is entailed (no missed conclusions)',
          'KB ⊨ α ⟺ (KB ∧ ¬α) is unsatisfiable — proof by refutation!',
        ],
        examTip: 'The difference between ⊨ (entails, semantic) and ⊢ (derives, syntactic/algorithmic). A sound system ensures ⊢ only proves ⊨. A complete system ensures ⊨ implies ⊢.',
      },
      {
        stepNumber: 4,
        title: 'Propositional Logic & Inference',
        subtitle: 'Modus Ponens, resolution, and CNF conversion',
        conceptType: 'algorithm',
        visualType: 'resolution_proof',
        bookCitation: 'AIMA 3rd Ed., pp. 249–262',
        contentMarkdown: `### Propositional Logic Connectives
| Connective | Symbol | Meaning |
|------------|--------|---------|
| NOT | ¬ | negation |
| AND | ∧ | conjunction |
| OR | ∨ | disjunction |
| IMPLIES | ⇒ | implication: P ⇒ Q ≡ ¬P ∨ Q |
| IFF | ⟺ | biconditional: P ⟺ Q ≡ (P⇒Q)∧(Q⇒P) |

### Key Inference Rules
**Modus Ponens**: $\\dfrac{\\alpha \\Rightarrow \\beta, \\quad \\alpha}{\\beta}$

**And-Elimination**: $\\dfrac{\\alpha_1 \\land \\alpha_2 \\land \\ldots \\land \\alpha_k}{\\alpha_i}$

**Resolution** (the most powerful single inference rule):
$$\\dfrac{(l_1 \\lor \\cdots \\lor l_k \\lor P) \\quad (m_1 \\lor \\cdots \\lor m_n \\lor \\neg P)}{l_1 \\lor \\cdots \\lor l_k \\lor m_1 \\lor \\cdots \\lor m_n}$$

Resolution **cancels** complementary literals P and ¬P, merging the remaining disjunctions.

### Resolution Theorem Proving — Proof by Refutation
To prove KB ⊨ α:
1. Assume α is FALSE (add ¬α to KB)
2. Convert everything to **Conjunctive Normal Form (CNF)**: conjunction of clauses, each clause = disjunction of literals
3. Apply resolution repeatedly until either:
   - Empty clause derived → **contradiction** → ¬α was false → α is true (Q.E.D.)
   - No new clauses can be derived → α does NOT follow from KB

### CNF Conversion Steps
1. Eliminate ⟺: $(P \\Leftrightarrow Q) \\to (P \\Rightarrow Q) \\land (Q \\Rightarrow P)$
2. Eliminate ⇒: $(P \\Rightarrow Q) \\to (\\neg P \\lor Q)$
3. Move ¬ inward (De Morgan's laws): $\\neg(P \\land Q) \\to \\neg P \\lor \\neg Q$
4. Distribute ∨ over ∧: $(P \\lor (Q \\land R)) \\to (P \\lor Q) \\land (P \\lor R)$`,
        keyPoints: [
          'Modus Ponens: from (P⇒Q) and P, conclude Q',
          'Resolution: cancel complementary literals P and ¬P from two clauses',
          'CNF: every sentence reducible to conjunction of clauses (required for resolution)',
          'Proof by refutation: add ¬α to KB, derive empty clause to prove KB ⊨ α',
          'Resolution is REFUTATION-COMPLETE: can always find a proof if KB ⊨ α',
        ],
        connectedTo: [
          {
            chapterId: 9,
            chapterTitle: 'Inference in First-Order Logic',
            relationship: 'Chapter 9 lifts resolution to First-Order Logic with variables (Generalized Modus Ponens, Unification).',
          },
        ],
      },
      {
        stepNumber: 5,
        title: 'DPLL — Efficient SAT Solving',
        subtitle: 'Davis-Putnam-Logemann-Loveland with unit propagation and pure symbols',
        conceptType: 'algorithm',
        visualType: 'propositional_logic',
        bookCitation: 'AIMA 3rd Ed., pp. 263–268',
        contentMarkdown: `### The SAT Problem
**Satisfiability (SAT)**: Given a CNF sentence, is there an assignment of TRUE/FALSE to variables that makes it true?

SAT is **NP-complete** (Cook-Levin theorem, 1971) — no known polynomial-time algorithm. But in practice, smart algorithms handle millions of variables!

### The DPLL Algorithm
DPLL is model checking with three crucial optimizations:

\`\`\`
function DPLL(clauses, symbols, model)
  if every clause is true in model → return true
  if some clause is false in model → return false  ← Early termination!
  
  P, value ← FIND-PURE-SYMBOL(symbols, clauses, model)
  if P exists: return DPLL(clauses, symbols - P, model ∪ {P=value})
  
  P, value ← FIND-UNIT-CLAUSE(clauses, model)
  if P exists: return DPLL(clauses, symbols - P, model ∪ {P=value})
  
  P ← FIRST(symbols); rest ← REST(symbols)
  return DPLL(clauses, rest, model ∪ {P=true}) or
         DPLL(clauses, rest, model ∪ {P=false})
\`\`\`

### The Three Optimizations

**1. Early Termination** (without this it's just truth-table enumeration):
- If a **clause is already satisfied** by current partial assignment → skip it
- If a **clause is already falsified** (all literals false) → backtrack immediately

**2. Pure Symbol Heuristic**:
- A symbol is **pure** if it always appears with the SAME sign in all remaining clauses
- If P always appears positive, set P = true (satisfies all clauses containing P)
- Pure symbols can always be set to their "satisfying" sign without loss

**3. Unit Clause Heuristic** (most powerful!):
- A **unit clause** has only ONE unassigned literal
- That literal MUST be true (otherwise the clause is falsified)
- Forces the assignment → cascades further propagation

### WalkSAT — Local Search for SAT
Instead of complete search, do local search:
- Start with random assignment
- Repeat: pick unsatisfied clause; flip a symbol (either random or the one maximizing satisfied clauses)
- Very fast in practice; incomplete (may not find solution if one exists)`,
        keyPoints: [
          'DPLL is the foundation of all modern SAT solvers (used in AI, EDA, verification)',
          'Early termination: fail immediately when any clause is falsified',
          'Pure symbol: always safe to set to its "good" value without losing solutions',
          'Unit clause: forced assignment (unit propagation) — incredibly powerful pruning',
          'Modern CDCL SAT solvers handle millions of variables (built on DPLL + learning)',
        ],
        examTip: 'DPLL exam: "What is the pure symbol heuristic?" A symbol appearing only in POSITIVE form → always set to TRUE. Only NEGATIVE form → always set to FALSE. This never loses solutions (if pure symbol appears only positive, any solution must have it TRUE).',
      },
    ],
    quizQuestions: [
      {
        question: 'KB ⊨ α (KB entails α) means:',
        options: [
          'α is a member of the Knowledge Base',
          'α is true in EVERY model that satisfies KB',
          'α can be derived in polynomial time from KB',
          'α is a tautology (true in all models regardless of KB)',
        ],
        correctIndex: 1,
        explanation: 'Entailment (⊨) is a semantic relationship: KB ⊨ α means that in every possible world (model) where all KB sentences are true, α is also true. M(KB) ⊆ M(α). This is different from membership in KB or syntactic derivability.',
        difficulty: 'easy',
      },
      {
        question: 'In DPLL, the "unit clause heuristic" forces:',
        options: [
          'Setting the most frequently appearing variable to TRUE',
          'Choosing the variable that appears in the most clauses',
          'Setting the single unassigned literal in a clause to make that clause true',
          'Removing all clauses of length 1 from the problem',
        ],
        correctIndex: 2,
        explanation: 'A unit clause is a clause with exactly ONE unassigned literal. That literal MUST be set to TRUE (otherwise this clause is falsified and the problem is unsolvable with current partial assignment). This is called "unit propagation" and is extremely powerful.',
        difficulty: 'medium',
      },
      {
        question: 'Resolution theorem proving proves KB ⊨ α by:',
        options: [
          'Checking α against every model of KB by truth table enumeration',
          'Adding ¬α to KB, converting to CNF, and deriving the empty clause by resolution',
          'Applying Modus Ponens repeatedly until α appears in the KB',
          'Building a decision tree over all propositional variables',
        ],
        correctIndex: 1,
        explanation: 'Proof by refutation: assume α is FALSE (add ¬α). Convert KB ∧ ¬α to CNF. Apply resolution to derive new clauses. If the empty clause (contradiction) is derived, then ¬α leads to contradiction, so α must be true. Resolution is refutation-complete: if KB ⊨ α, resolution will always find a proof.',
        difficulty: 'hard',
      },
    ],
    flashCards: [
      { front: 'What does KB ⊨ α mean?', back: 'KB entails α: α is TRUE in EVERY model where KB is TRUE.\nM(KB) ⊆ M(α).\nEquivalent: (KB ∧ ¬α) is UNSATISFIABLE.' },
      { front: 'Resolution inference rule?', back: 'From (l₁ ∨ ... ∨ lₖ ∨ P) and (m₁ ∨ ... ∨ mₙ ∨ ¬P)\nResolve: (l₁ ∨ ... ∨ lₖ ∨ m₁ ∨ ... ∨ mₙ)\nComplementary P and ¬P cancel out.' },
      { front: 'DPLL 3 key optimizations?', back: '1. Early Termination: fail if any clause falsified\n2. Pure Symbol: set to its always-consistent value\n3. Unit Clause: single unassigned literal MUST be true\nAll three together give huge speedups over naive enumeration.' },
      { front: 'What is CNF (Conjunctive Normal Form)?', back: 'A sentence is in CNF if it is a conjunction (AND) of clauses, where each clause is a disjunction (OR) of literals.\nExample: (A ∨ ¬B) ∧ (¬A ∨ C ∨ D) ∧ (B)\nAll propositional logic sentences can be converted to CNF.' },
    ],
  },

  // ==========================================================================
  // PHASE 2 — CHAPTERS 8–14
  // Knowledge, Reasoning, Planning, Uncertainty & Learning
  // ==========================================================================

  // ── Chapter 8: First-Order Logic ──────────────────────────────────────────
  8: {
    chapterId: 8,
    partId: 3,
    topicId: 'first-order-logic',
    title: 'First-Order Logic',
    subtitle: 'From propositions to objects, relations, and quantifiers',
    estimatedMinutes: 55,
    bookPages: 'AIMA Ch. 8, pp. 235–280',
    steps: [
      {
        stepNumber: 1,
        title: 'Why Propositional Logic Falls Short',
        subtitle: 'The gap between facts about the world and propositions',
        conceptType: 'intuition',
        visualType: 'propositional_logic',
        contentMarkdown: `## The Expressibility Problem

Propositional logic is powerful but **severely limited**:

| What we want to say | Propositional problem |
|---|---|
| "All kings are mortal" | Need one proposition per king |
| "John loves Mary" | Can't express relationships |
| "Every student passed" | Can't quantify over sets |

**First-Order Logic (FOL)** — also called **predicate calculus** or **first-order predicate logic** — adds:
- **Objects**: constants, variables, functions
- **Relations**: predicates that are true/false of objects  
- **Quantifiers**: ∀ (for all) and ∃ (there exists)

> *"FOL is expressive enough to represent most human knowledge, yet has sound, complete inference procedures."* — AIMA p. 235`,
        keyPoints: [
          'Propositional logic cannot express general facts about object classes',
          'FOL introduces objects (constants/variables), relations (predicates), and functions',
          'FOL has ∀ (universal) and ∃ (existential) quantifiers',
          'FOL is the foundation of databases, mathematics, and expert systems',
        ],
        examTip: 'Propositional logic: P, Q, R (no structure). FOL: King(x), Mortal(x), Loves(John, Mary) — objects and relations.',
        bookCitation: 'AIMA 3rd Ed., Section 8.1, pp. 235–238',
      },
      {
        stepNumber: 2,
        title: 'Syntax of First-Order Logic',
        subtitle: 'Constants, variables, functions, predicates, quantifiers',
        conceptType: 'algorithm',
        visualType: 'propositional_logic',
        contentMarkdown: `## FOL Building Blocks

### Terms (denote objects)
| Type | Example | Meaning |
|---|---|---|
| **Constant** | John, 3, Pakistan | Specific object |
| **Variable** | x, y, king | Placeholder for any object |
| **Function** | Father(John), +(2,3) | Maps objects → objects |

### Atomic Sentences (basic facts)
\`\`\`
King(Richard)          → Richard is a king
Loves(John, Mary)      → John loves Mary
>(Age(John), 18)       → John's age > 18
\`\`\`

### Complex Sentences
All propositional connectives apply: ∧, ∨, ¬, ⇒, ⟺

Plus **quantifiers**:
- **∀x**: "For all x in the domain..."
- **∃x**: "There exists some x such that..."`,
        mathBlock: {
          formula: '∀x King(x) ⇒ Person(x)\\n∃x Crown(x) ∧ OnHead(x, John)',
          explanation: '∀x: Every king is a person. ∃x: There is some crown that is on John\'s head. Note: ∀ pairs naturally with ⇒; ∃ pairs naturally with ∧.',
        },
        examTip: 'Common mistake: ∀x King(x) ∧ Mortal(x) means "everything is both a king AND mortal" — use ⇒ with ∀. ∃x King(x) ∧ Mortal(x) means "something is a mortal king" — correct with ∃.',
        bookCitation: 'AIMA 3rd Ed., Section 8.2, pp. 238–248',
      },
      {
        stepNumber: 3,
        title: 'Semantics: Models and Interpretation',
        subtitle: 'How FOL sentences connect to the world',
        conceptType: 'math',
        visualType: 'propositional_logic',
        contentMarkdown: `## What Makes a FOL Sentence True?

A **model** for FOL specifies:
1. A non-empty **domain** D (set of objects)
2. An **interpretation** mapping:
   - Each constant → specific object in D
   - Each function → specific function on D
   - Each predicate → set of object tuples in D

### Example
Domain = {Richard, John, Crown}  
King = {Richard}  
OnHead = {(Crown, John)}  

Then:
- \`King(Richard)\` → TRUE (Richard ∈ King)
- \`King(John)\` → FALSE (John ∉ King)
- \`∀x King(x) ⇒ Person(x)\` → TRUE if Person = {Richard, John, ...}

**Entailment** KB ⊨ α means α is true in **every model** of KB.`,
        keyPoints: [
          'A model specifies domain + interpretation of constants, functions, predicates',
          'Sentences are true/false relative to a model + variable assignment',
          'KB ⊨ α: α holds in every possible world consistent with KB',
        ],
        bookCitation: 'AIMA 3rd Ed., Section 8.2.2, pp. 245–248',
      },
      {
        stepNumber: 4,
        title: 'Inference in First-Order Logic',
        subtitle: 'Unification, substitution, and Modus Ponens for FOL',
        conceptType: 'algorithm',
        visualType: 'resolution_proof',
        contentMarkdown: `## From Propositional to FOL Inference

### Key Challenge: Variables
In propositional logic, rules directly apply. In FOL, we must **instantiate** variables.

### Unification
To apply \`King(x) ⇒ Mortal(x)\` to \`King(John)\`:
- Unify: x/John (substitute John for x)
- Apply rule → conclude \`Mortal(John)\`

\`\`\`
UNIFY(King(x), King(John)) = {x → John}
\`\`\`

### Generalized Modus Ponens (GMP)
If KB contains:
1. \`King(John)\`
2. \`∀x King(x) ⇒ Mortal(x)\`

Then UNIFY gives θ = {x/John}  
Apply θ to rule → \`King(John) ⇒ Mortal(John)\`  
By MP → conclude \`Mortal(John)\`  

### Forward & Backward Chaining
- **Forward chaining**: Start from facts, apply rules, derive new facts until query proved
- **Backward chaining**: Start from query, work backward to find supporting facts
- Both are **sound and complete** for Horn clauses`,
        mathBlock: {
          formula: 'UNIFY(p, q) = θ such that SUBST(θ, p) = SUBST(θ, q)',
          explanation: 'θ is a substitution (mapping variables to terms). Unification finds the most general substitution (MGU) that makes two expressions identical.',
        },
        codeBlock: {
          language: 'text',
          code: `KB = {
  King(John), King(Richard),
  ∀x King(x) ⇒ Person(x),
  ∀x,y Person(x) ∧ Greedy(y) ⇒ Evil(y),
  Greedy(John)
}
Query: Evil(John)?

Forward chaining:
Step 1: King(John) + ∀x King(x)⇒Person(x) → Person(John)  [θ={x/John}]
Step 2: Person(John) + Greedy(John) + rule → Evil(John) [Derived]`,
          caption: 'Forward chaining derives Evil(John) in 2 steps via unification',
        },
        examTip: 'FOL inference can be undecidable in general, but is sound and complete. For Horn clauses (one positive literal per clause), it is decidable and efficient.',
        bookCitation: 'AIMA 3rd Ed., Sections 9.2–9.3, pp. 323–336',
      },
      {
        stepNumber: 5,
        title: 'Resolution in First-Order Logic',
        subtitle: 'Refutation-complete proof by contradiction',
        conceptType: 'algorithm',
        visualType: 'resolution_proof',
        contentMarkdown: `## FOL Resolution: The Complete Proof Method

### Key Steps
1. **Negate the goal**: Add ¬α to KB
2. **Skolemize**: Replace ∃ with Skolem constants/functions
3. **Convert to CNF**: Distribute, eliminate biconditionals/implications
4. **Drop universal quantifiers**: Variables are implicitly universalized
5. **Apply resolution**: Resolve complementary literals using unification
6. **Goal**: Derive the empty clause (contradiction)

### Skolemization
\`∃x Crown(x)\` → \`Crown(C₁)\` (C₁ is a Skolem constant)  
\`∀x ∃y Loves(x,y)\` → \`∀x Loves(x, F(x))\` (F is a Skolem function)

### Resolution Rule (FOL)
\`\`\`
(l₁ ∨ ... ∨ lₖ ∨ P(x))
(m₁ ∨ ... ∨ mₙ ∨ ¬P(f(y)))

θ = UNIFY(P(x), P(f(y))) = {x → f(y)}
Resolvent: SUBST(θ, l₁∨...∨lₖ∨m₁∨...∨mₙ)
\`\`\`

FOL resolution is **refutation-complete**: if KB ⊨ α, resolution will always find the proof.`,
        keyPoints: [
          'Negate goal, Skolemize, convert to CNF, drop ∀, resolve',
          'Skolem constants replace ∃ with no outer ∀; Skolem functions replace ∃ with outer ∀',
          'FOL resolution is sound and refutation-complete',
          'Undecidable in general — may loop forever if KB ⊭ α',
        ],
        bookCitation: 'AIMA 3rd Ed., Section 9.5, pp. 345–357',
      },
    ],
    quiz: [
      {
        question: 'Which formula correctly expresses "All kings are mortal"?',
        options: [
          '∀x King(x) ∧ Mortal(x)',
          '∀x King(x) ⇒ Mortal(x)',
          '∃x King(x) ⇒ Mortal(x)',
          '∃x King(x) ∧ Mortal(x)',
        ],
        correctIndex: 1,
        explanation: '∀ with ⇒ is the standard pattern: "For every x, IF x is a king THEN x is mortal." Using ∧ would claim everything in the domain is both a king and mortal, which is wrong.',
        difficulty: 'easy',
      },
      {
        question: 'UNIFY(Knows(John, x), Knows(y, Jane)) returns:',
        options: [
          '{y → John, x → Jane}',
          '{x → Jane}',
          'FAILURE (cannot unify)',
          '{y → John}',
        ],
        correctIndex: 0,
        explanation: 'Set y → John (to unify Knows(John,x) with Knows(y,Jane)) and x → Jane (to unify the second arguments). Result: {y/John, x/Jane}. Both Knows expressions become Knows(John, Jane).',
        difficulty: 'medium',
      },
      {
        question: 'What is a Skolem function used for in FOL resolution?',
        options: [
          'To convert universal quantifiers to existential ones',
          'To replace existential variables bound by an outer universal',
          'To simplify conjunctions into disjunctions',
          'To create the negation of a sentence',
        ],
        correctIndex: 1,
        explanation: 'When ∃y appears inside ∀x (e.g., ∀x ∃y Loves(x,y)), we can\'t use a simple constant because y depends on x. Instead, introduce a Skolem function F: replace ∃y with F(x), giving ∀x Loves(x, F(x)).',
        difficulty: 'hard',
      },
    ],
    flashCards: [
      { front: 'FOL term types?', back: 'Constants (John, 3), Variables (x, y), Functions (Father(x), +(2,3)). Terms denote objects in the domain.' },
      { front: '∀ vs ∃ quantifier pairing?', back: '∀x P(x) ⇒ Q(x) — "All P\'s are Q\'s"\n∃x P(x) ∧ Q(x) — "Some P is also a Q"\nMixing them up is the #1 FOL mistake.' },
      { front: 'What is unification?', back: 'Finding a substitution θ such that SUBST(θ,p) = SUBST(θ,q). The most general unifier (MGU) is the least-specific substitution that works.' },
      { front: 'FOL resolution completeness?', back: 'Refutation-complete: if KB ⊨ α, resolution WILL find a proof by deriving the empty clause from KB ∪ {¬α}. But if KB ⊭ α, it may loop forever (undecidable).' },
    ],
  },

  // ── Chapter 9 / 10: Knowledge Representation ─────────────────────────────
  9: {
    chapterId: 9,
    partId: 3,
    topicId: 'knowledge-representation',
    title: 'Knowledge Representation',
    subtitle: 'Ontologies, categories, events, and the real world',
    estimatedMinutes: 50,
    bookPages: 'AIMA Ch. 10, pp. 385–420',
    steps: [
      {
        stepNumber: 1,
        title: 'The Knowledge Engineering Ontology',
        subtitle: 'Building a general ontology of the world',
        conceptType: 'intuition',
        visualType: 'wumpus_world',
        contentMarkdown: `## What Does an AI Need to Know?

For an agent to reason about the real world, it needs a **general-purpose ontology** — a structured vocabulary of the world's categories.

### The Upper Ontology Hierarchy
\`\`\`
Thing
├── Abstract Objects (numbers, sets, properties)
└── Physical Objects
    ├── Stuff (matter without clear boundaries: water, gold)
    └── Objects with clear boundaries
        ├── Agents (humans, robots)
        └── Inanimate Objects
\`\`\`

### Key Distinctions

| Concept | Example | Property |
|---|---|---|
| **Categories** | Dogs, Cars | Membership (x ∈ Dog) |
| **Individuals** | Fido, my car | Specific instances |
| **Stuff** | Water, Gold | Portions, not counting |
| **Events** | WW2, a kiss | Fluents over time |

> *"The fundamental ontological distinction is between categories and their instances."* — AIMA p. 386`,
        keyPoints: [
          'Upper ontology: shared vocabulary to link domain knowledge',
          'Categories (sets) vs. individuals (members)',
          'Stuff: substances with no natural unit (water ≠ one water)',
          'Events: things that happen over intervals of time',
        ],
        bookCitation: 'AIMA 3rd Ed., Section 10.1, pp. 385–390',
      },
      {
        stepNumber: 2,
        title: 'Categories, Inheritance, and Subclass Relations',
        subtitle: 'FOL representation of hierarchical knowledge',
        conceptType: 'algorithm',
        visualType: 'wumpus_world',
        contentMarkdown: `## Representing Categories in FOL

### Subclass and Membership
\`\`\`
∀x Dog(x) ⇒ Animal(x)           -- Dogs are animals
∀x Animal(x) ⇒ LivingThing(x)   -- Animals are living things
Dog(Fido)                        -- Fido is a dog
\`\`\`
By chaining: \`LivingThing(Fido)\` [Proven]

### Disjoint Categories
\`\`\`
∀x Male(x) ⇒ ¬Female(x)
\`\`\`

### Exhaustive Decomposition
\`\`\`
∀x Animal(x) ⇒ (Mammal(x) ∨ Bird(x) ∨ Fish(x) ∨ ...)
\`\`\`

### Properties and Inheritance
Objects inherit properties from their categories:
\`\`\`
∀x Dog(x) ⇒ HasLegs(x, 4)    -- default rule
∀x Dog(x) ⇒ Barks(x)
\`\`\`

**Exception handling** requires **defeasible reasoning** — overriding defaults when specific info contradicts them (e.g., a 3-legged dog).`,
        mathBlock: {
          formula: 'MemberOf(x, C) ∧ ∀y MemberOf(y,C) ⇒ HasProperty(y, P)\\n⊢ HasProperty(x, P)',
          explanation: 'Inheritance: if x is a member of category C, and all members of C have property P, then x has property P.',
        },
        examTip: 'In AIMA\'s FOL treatment, Category(x) is a predicate (not a type). This allows categories themselves to be first-class objects in the ontology.',
        bookCitation: 'AIMA 3rd Ed., Section 10.2, pp. 390–399',
      },
      {
        stepNumber: 3,
        title: 'Events, Fluents, and the Situation Calculus',
        subtitle: 'Reasoning about change over time',
        conceptType: 'math',
        visualType: 'belief_state',
        contentMarkdown: `## How the World Changes: Situation Calculus

### Core Vocabulary
| Term | Meaning |
|---|---|
| **Situation** | A snapshot of the world (S₀, S₁, ...) |
| **Fluent** | A property that changes: On(A,B,s) |
| **Action** | What causes change: Move(A,B) |
| **Result(a,s)** | The situation after doing action a in s |

### Successor-State Axioms
For each fluent F:
\`\`\`
F(Result(a, s)) ⟺
  [a caused F to become true]
  ∨ [F was already true ∧ a didn't make it false]
\`\`\`

### Frame Problem
**Challenge**: In a world with many facts, how do we know what DIDN'T change?  
- Naively: must specify for every action what didn't change
- Solution: **successor-state axioms** handle this cleanly

### Event Calculus (alternative)
Uses \`Holds(f, t)\` for fluents at time t and \`Happens(e, t)\` for events.
More expressive for overlapping and concurrent events.`,
        keyPoints: [
          'Situation calculus: situations are world-snapshots, fluents change between them',
          'Result(a, s): the state that follows from doing action a in state s',
          'Frame problem: most things don\'t change when you do an action',
          'Successor-state axioms elegantly solve the frame problem',
        ],
        bookCitation: 'AIMA 3rd Ed., Section 10.3, pp. 399–406',
      },
      {
        stepNumber: 4,
        title: 'Default Reasoning and Open-World Assumption',
        subtitle: 'Handling incomplete and uncertain knowledge',
        conceptType: 'connection',
        visualType: 'belief_state',
        contentMarkdown: `## When We Don't Know Everything

### Closed-World vs Open-World Assumption

| | Closed World (CWA) | Open World (OWA) |
|---|---|---|
| Unknown fact | Assumed FALSE | Unknown (maybe true) |
| Used in | Databases, Prolog | FOL, OWL ontologies |
| Example | "John's not in DB → John doesn't exist" | "John not in DB → unknown" |

### Non-Monotonic Reasoning
Standard logic is **monotonic**: adding facts can only derive MORE conclusions.  
Real-world reasoning is **non-monotonic**: new facts can **retract** previous conclusions.

Example:
- "Birds fly" → Tweety is a bird → Tweety flies
- "Tweety is a penguin" → Tweety does NOT fly (default overridden)

### Default Logic
\`\`\`
Bird(x) : Flies(x)     -- "If x is a bird, and it's consistent
──────────────────       --  to assume x flies, then assume x flies"
     Flies(x)
\`\`\`

This is beyond standard FOL — requires specialized non-monotonic logics or probabilistic approaches (Ch. 13–14).`,
        connectedTo: [
          { chapterId: 13, chapterTitle: 'Uncertainty', relationship: 'Probability handles uncertain defaults more rigorously' },
          { chapterId: 7, chapterTitle: 'Logical Agents', relationship: 'Wumpus World used CWA-like reasoning' },
        ],
        bookCitation: 'AIMA 3rd Ed., Section 10.6, pp. 412–418',
      },
    ],
    quiz: [
      {
        question: 'The "frame problem" in AI refers to:',
        options: [
          'How to display AI outputs in a visual frame',
          'The difficulty of specifying what does NOT change when an action occurs',
          'How to handle circular reasoning in logic programs',
          'The computational cost of unification in FOL',
        ],
        correctIndex: 1,
        explanation: 'In situation calculus, when a robot moves a block, we need to know the block moved AND that everything else stayed the same. With many facts, specifying all non-changes is intractable. Successor-state axioms solve this cleanly.',
        difficulty: 'medium',
      },
      {
        question: 'Under the Open-World Assumption (OWA), if "KnightStatus(John)" is not in the KB:',
        options: [
          'John is definitely not a knight',
          'John is definitely a knight',
          "John's knight status is unknown",
          'The query causes an error',
        ],
        correctIndex: 2,
        explanation: "OWA (used in OWL/FOL) treats missing facts as unknown, not false. CWA (used in databases/Prolog) treats missing facts as false. OWA is more realistic but harder to compute with.",
        difficulty: 'easy',
      },
    ],
    flashCards: [
      { front: 'Situation calculus: Result(a, s)?', back: 'The situation (world-state) that results from performing action a in situation s. Chaining: Result(b, Result(a, S₀)) = state after a then b.' },
      { front: 'CWA vs OWA?', back: 'CWA (Closed World): unknown = false. Used in databases, Prolog.\nOWA (Open World): unknown = possibly true. Used in FOL, OWL.\nCWA is efficient; OWA is more realistic.' },
      { front: 'Non-monotonic reasoning?', back: 'Logic where adding new facts can REMOVE previous conclusions. Example: "Birds fly" + "Tweety is a bird" → Tweety flies. Then "Tweety is a penguin" → Tweety does NOT fly (retraction).' },
    ],
  },

  // ── Chapter 11: Classical Planning ────────────────────────────────────────
  10: {
    chapterId: 10,
    partId: 3,
    topicId: 'classical-planning',
    title: 'Classical Planning',
    subtitle: 'STRIPS, PDDL, state-space search, and plan graphs',
    estimatedMinutes: 60,
    bookPages: 'AIMA Ch. 10–11, pp. 366–420',
    steps: [
      {
        stepNumber: 1,
        title: 'The Planning Problem',
        subtitle: 'From state-space search to declarative planning',
        conceptType: 'intuition',
        visualType: 'search_tree',
        contentMarkdown: `## What Is Classical Planning?

**Classical planning** assumes:
- Fully observable, deterministic world
- Finite state space
- Static environment (doesn't change without action)
- Sequential action execution

### Why Not Just Use Search?
Search algorithms (Ch. 3–4) work but require:
- Domain-specific state representations
- Hand-coded successor functions
- Domain-specific heuristics

**Planning** uses a **declarative representation** of actions, letting us:
- Automatically extract heuristics from the problem structure
- Plan at a higher level of abstraction
- Reuse generic planners across different domains

### The Planning Domain Definition Language (PDDL)
PDDL represents:
1. **Objects**: things in the world
2. **Predicates**: boolean properties/relations
3. **Initial state**: what's true at start
4. **Goal**: what must be true at end
5. **Actions**: with preconditions and effects`,
        keyPoints: [
          'Classical planning: fully observable, deterministic, static, sequential',
          'PDDL separates domain knowledge from specific problem instances',
          'Planners automatically derive heuristics from declarative descriptions',
          'Enables reuse: same planner works for logistics, robotics, scheduling',
        ],
        bookCitation: 'AIMA 3rd Ed., Section 10.1–10.2, pp. 366–377',
      },
      {
        stepNumber: 2,
        title: 'STRIPS Representation',
        subtitle: 'Preconditions, add lists, and delete lists',
        conceptType: 'algorithm',
        visualType: 'search_tree',
        contentMarkdown: `## STRIPS: The Standard Planning Language

**STRIPS** (Stanford Research Institute Problem Solver) represents each action as:
- **Precondition**: must be true to execute the action
- **Add list** (EFFECT+): what becomes true after
- **Delete list** (EFFECT−): what becomes false after

### Example: The Blocks World
Objects: Block A, B, C, Table  
Predicates: On(x,y), Clear(x), OnTable(x), Holding(x)

\`\`\`
Action: MoveToTable(x)
  PRECOND: Holding(x)
  EFFECT+: OnTable(x), Clear(x)
  EFFECT−: Holding(x)

Action: Stack(x, y)
  PRECOND: Holding(x) ∧ Clear(y)
  EFFECT+: On(x,y), Clear(HandEmpty)
  EFFECT−: Holding(x), Clear(y)
\`\`\`

### State Representation
A state = set of ground atoms currently true  
All other atoms assumed FALSE (closed-world assumption)  
Goal = subset of atoms that must be true (partial state)`,
        codeBlock: {
          language: 'pddl',
          code: `(:action Stack
  :parameters (?x ?y - block)
  :precondition (and (holding ?x) (clear ?y))
  :effect (and (on ?x ?y)
               (arm-empty)
               (not (holding ?x))
               (not (clear ?y))))`,
          caption: 'PDDL action for stacking one block on another',
        },
        examTip: 'STRIPS uses CWA: unlisted facts are FALSE. PDDL is the modern standardization of STRIPS. Effects simultaneously add and delete facts.',
        bookCitation: 'AIMA 3rd Ed., Section 10.2, pp. 370–375',
      },
      {
        stepNumber: 3,
        title: 'Planning as State-Space Search',
        subtitle: 'Forward planning, backward planning, and heuristics',
        conceptType: 'algorithm',
        visualType: 'search_tree',
        contentMarkdown: `## Two Directions of Search

### Forward Planning (Progression)
- Start from initial state
- Apply applicable actions
- Search forward until goal reached
- Like BFS/A* in state space

**Problem**: branching factor can be enormous

### Backward Planning (Regression)
- Start from goal state
- Work backwards: what actions could have produced this?
- Search until initial state is reached
- Explores fewer irrelevant actions

### Heuristics for Planning
**Ignore-preconditions heuristic**: 
- Allow any action to apply (relax preconditions)
- Count minimum actions to achieve each goal literal
- Admissible lower bound

**Ignore-delete-list heuristic (h+)**:
- Remove all delete effects from actions
- Goals can only be achieved, never un-achieved
- Solve this relaxed problem to get heuristic value
- Very effective in practice (used by FF planner)

### Planning Graph (Graphplan)
Alternative to search — builds a polynomial-size planning graph and extracts a plan from it.`,
        mathBlock: {
          formula: 'h_max(s) = max_{g∈goal} h(s, g)\\nh_add(s) = Σ_{g∈goal} h(s, g)',
          explanation: 'Two common additive heuristics. h_max is admissible (never overestimates). h_add can overestimate (not admissible) but often more accurate. AIMA discusses both.',
        },
        bookCitation: 'AIMA 3rd Ed., Sections 10.2–10.4, pp. 374–390',
      },
      {
        stepNumber: 4,
        title: 'Graphplan Algorithm',
        subtitle: 'Planning graphs and mutex relations',
        conceptType: 'algorithm',
        visualType: 'search_tree',
        contentMarkdown: `## Planning Graphs: A Compact Representation

A **planning graph** is a directed acyclic graph with alternating layers:
- **Literal layers** (Lᵢ): propositions reachable in i steps
- **Action layers** (Aᵢ): applicable actions between Lᵢ and Lᵢ₊₁

### Mutex Relations
Two literals or actions are **mutex** (mutually exclusive) if they cannot both be true/applied simultaneously:

**Inconsistent effects**: a achieves p, b achieves ¬p  
**Interference**: a achieves ¬(precond of b)  
**Competing needs**: preconditions of a and b are mutex  
**Inconsistent support**: every way to achieve a literal is mutex with every way to achieve another

### Graphplan Algorithm
1. Expand the planning graph layer by layer
2. Stop when goal literals all appear non-mutex
3. Extract a plan by backward search through the graph
4. If extraction fails, add more layers and retry

### Complexity
- Graph building: polynomial time
- Plan extraction: NP-hard in worst case
- But often extremely efficient in practice`,
        keyPoints: [
          'Planning graph alternates literal and action layers',
          'Mutex: two actions/literals that cannot coexist at a level',
          'Graphplan is a complete planner — if a plan exists, it finds one',
          'The graph provides an admissible heuristic (level cost)',
        ],
        bookCitation: 'AIMA 3rd Ed., Section 10.3, pp. 379–390',
      },
    ],
    quiz: [
      {
        question: 'In STRIPS, the DELETE list of an action specifies:',
        options: [
          'Actions that must be performed before this one',
          'Literals that become FALSE after the action executes',
          'The goal conditions the action achieves',
          'Variables that are removed from the knowledge base',
        ],
        correctIndex: 1,
        explanation: 'STRIPS action = PRECOND (must hold to execute) + ADD LIST (what becomes true after) + DELETE LIST (what becomes false after). The delete list handles the "what changes" part of the frame problem.',
        difficulty: 'easy',
      },
      {
        question: 'The "ignore-delete-list" heuristic for planning is:',
        options: [
          'Admissible because removing deletes makes the problem easier',
          'Inadmissible but often useful because it can overestimate cost',
          'Admissible because goal literals can never be un-achieved',
          'Not useful because it ignores too much problem structure',
        ],
        correctIndex: 0,
        explanation: 'Removing delete effects relaxes the problem (makes it easier). Any solution to the original is also a solution to the relaxed problem. Therefore the optimal relaxed solution ≤ optimal original solution, making h+ admissible.',
        difficulty: 'hard',
      },
    ],
    flashCards: [
      { front: 'STRIPS action representation?', back: 'PRECONDITION: must be true to apply\nADD LIST (EFFECT+): becomes true after\nDELETE LIST (EFFECT−): becomes false after\nClosed World: unspecified = false.' },
      { front: 'Graphplan mutex types?', back: '1. Inconsistent effects (a adds p, b adds ¬p)\n2. Interference (a deletes precond of b)\n3. Competing needs (preconditions mutex)\n4. Inconsistent support (all supports mutex)' },
      { front: 'Forward vs backward planning?', back: 'Forward (progression): initial state → goal. Can have huge branching factor.\nBackward (regression): goal → initial state. Focuses on relevant actions.\nBoth are sound and complete.' },
    ],
  },

  // ── Chapter 13: Uncertainty ───────────────────────────────────────────────
  11: {
    chapterId: 11,
    partId: 4,
    topicId: 'uncertainty',
    title: 'Uncertainty & Probability',
    subtitle: 'From logic to probabilistic reasoning',
    estimatedMinutes: 65,
    bookPages: 'AIMA Ch. 13, pp. 480–526',
    steps: [
      {
        stepNumber: 1,
        title: 'Why Logic Fails in the Real World',
        subtitle: 'Sources of uncertainty and the need for probability',
        conceptType: 'intuition',
        visualType: 'belief_state',
        contentMarkdown: `## The Limits of Logical Agents

A logical agent either **knows** something or **doesn't**. The real world offers:

| Source of Uncertainty | Example |
|---|---|
| **Partial observability** | Can't see what's behind the door |
| **Noisy sensors** | Medical test gives false positives |
| **Stochastic outcomes** | Throwing a die |
| **Vast model complexity** | Weather, human behavior |

### Probability Theory as Rationality
Probability gives us a **principled, consistent** framework for reasoning under uncertainty.

**Kolmogorov Axioms**:
1. 0 ≤ P(A) ≤ 1
2. P(True) = 1
3. P(A ∨ B) = P(A) + P(B) - P(A ∧ B)

**Key Insight** (de Finetti, Cox): Any other numerical belief system either violates rationality or reduces to probability.  
→ Probability is the **only coherent** way to represent uncertain beliefs.`,
        keyPoints: [
          'Real agents face partial observability, noisy sensors, and stochastic environments',
          'Probability is the unique coherent framework for uncertainty',
          'Kolmogorov axioms: non-negativity, normalization, additivity',
          'Conditional probability P(A|B) = P(A∧B)/P(B) is the update rule',
        ],
        bookCitation: 'AIMA 3rd Ed., Section 13.1, pp. 480–486',
      },
      {
        stepNumber: 2,
        title: 'Probability Fundamentals',
        subtitle: 'Prior, conditional, joint distributions, and Bayes\' theorem',
        conceptType: 'math',
        visualType: 'belief_state',
        contentMarkdown: `## Core Probability Concepts

### Key Definitions
| Term | Formula | Meaning |
|---|---|---|
| **Prior** | P(A) | Probability before evidence |
| **Conditional** | P(A\|B) | P after knowing B |
| **Joint** | P(A,B) | Probability of both |
| **Marginal** | ΣᵦP(A,B) | Summing out B |

### Bayes' Theorem (the central formula)
$$P(H|E) = \\frac{P(E|H) \\cdot P(H)}{P(E)}$$
- P(H): **Prior** (belief before evidence)
- P(E|H): **Likelihood** (how likely is E given H)
- P(E): **Marginal likelihood** / normalizing constant
- P(H|E): **Posterior** (updated belief)

### Chain Rule (full joint)
$$P(X_1, X_2, ..., X_n) = \\prod_{i=1}^{n} P(X_i | X_1, ..., X_{i-1})$$

### Product Rule
$$P(A \\wedge B) = P(A|B) \\cdot P(B)$$`,
        mathBlock: {
          formula: 'P(Cavity | Toothache) = P(Toothache | Cavity) × P(Cavity) / P(Toothache)',
          explanation: 'Medical diagnosis: given a toothache, what\'s the probability of a cavity? Multiply likelihood of toothache given cavity by prior probability of cavity, normalize.',
        },
        examTip: 'Bayes\' theorem is the engine of probabilistic AI. The denominator P(E) = ΣₕP(E|h)P(h) is often computed by normalization rather than directly.',
        bookCitation: 'AIMA 3rd Ed., Sections 13.2–13.3, pp. 486–500',
      },
      {
        stepNumber: 3,
        title: 'Independence and Conditional Independence',
        subtitle: 'The key to tractable probabilistic reasoning',
        conceptType: 'math',
        visualType: 'belief_state',
        contentMarkdown: `## Conquering the Joint Distribution

### The Full Joint Problem
For n binary variables, the full joint has 2ⁿ entries.  
With n=30, that's 10⁹ numbers — intractable!

### Absolute Independence
P(A, B) = P(A) × P(B)  ↔  P(A|B) = P(A)

If A and B are independent, knowing B tells us **nothing new** about A.

**Example**: Weather in Tokyo and the result of a coin flip.

### Conditional Independence (the power tool)
A ⊥ B | C: A and B are independent **given C**

$$P(A, B | C) = P(A|C) \\cdot P(B|C)$$

**Medical Example**:
- Toothache and Catch are NOT independent
- Both are caused by Cavity
- But: **Toothache ⊥ Catch | Cavity**  
  (Given we know about the cavity, the toothache tells us nothing extra about the probe catch)

### Naive Bayes Assumption
Assume all features are conditionally independent given the class:
$$P(C|x_1,...,x_n) \\propto P(C) \\prod_{i=1}^{n} P(x_i|C)$$

Reduces n-dimensional joint to n 1-dimensional conditionals!`,
        keyPoints: [
          'Full joint: 2ⁿ entries — exponential blowup',
          'Absolute independence: P(A,B) = P(A)P(B)',
          'Conditional independence: A⊥B|C — more common and powerful',
          'Naive Bayes exploits conditional independence for classification',
        ],
        connectedTo: [
          { chapterId: 14, chapterTitle: 'Probabilistic Reasoning', relationship: 'Bayesian networks encode conditional independence compactly', bookRef: 'Deep Learning Ch. 3' },
        ],
        bookCitation: 'AIMA 3rd Ed., Section 13.4–13.5, pp. 500–515',
      },
      {
        stepNumber: 4,
        title: 'Making Decisions Under Uncertainty',
        subtitle: 'Expected utility and the MEU principle',
        conceptType: 'connection',
        visualType: 'decision_boundary',
        contentMarkdown: `## Rational Decisions Under Uncertainty

### Expected Utility
Given uncertainty about outcomes, a rational agent should choose the action that **maximizes expected utility**:

$$EU(a | e) = \\sum_{s'} P(Result(a) = s' | a, e) \\cdot U(s')$$

- P(Result(a)=s'): probability action a leads to state s'
- U(s'): utility of state s' (agent's preferences)

### The MEU Principle
**Maximum Expected Utility**: Choose action a* with highest EU(a|e)

$$a^* = \\arg\\max_a EU(a | e)$$

### Utility Theory
For preferences to be rational (von Neumann-Morgenstern), they must satisfy:
1. **Orderability**: A≻B or B≻A or A∼B
2. **Transitivity**: A≻B, B≻C → A≻C
3. **Continuity**: Preferences over probability mixtures are continuous
4. **Substitutability**: Indifferent things can be swapped

**Theorem**: Any preferences satisfying these axioms can be represented by a utility function.`,
        mathBlock: {
          formula: 'a* = argmax_a Σ_{s\'} P(RESULT(a)=s\' | a, e) × U(s\')',
          explanation: 'The MEU principle: the best action is the one maximizing expected utility. This is the foundation of decision theory and Bayesian decision making.',
        },
        bookCitation: 'AIMA 3rd Ed., Sections 16.1–16.3, pp. 610–628',
      },
    ],
    quiz: [
      {
        question: 'Bayes\' Theorem states P(H|E) = ?',
        options: [
          'P(H) × P(E)',
          'P(E|H) × P(H) / P(E)',
          'P(H) / P(E|H)',
          'P(E) / P(H)',
        ],
        correctIndex: 1,
        explanation: 'P(H|E) = P(E|H)·P(H)/P(E). Posterior = Likelihood × Prior / Evidence. P(E) is the normalizing constant (marginal likelihood), ensuring posteriors sum to 1.',
        difficulty: 'easy',
      },
      {
        question: 'X and Y are conditionally independent given Z means:',
        options: [
          'P(X,Y) = P(X)·P(Y)',
          'P(X|Y,Z) = P(X|Z)',
          'P(Z|X,Y) = P(Z)',
          'P(X,Y,Z) = P(X)·P(Y)·P(Z)',
        ],
        correctIndex: 1,
        explanation: 'X ⊥ Y | Z means P(X|Y,Z) = P(X|Z). Knowing Y gives no additional info about X once we know Z. This is more common than absolute independence and is the key insight behind Bayesian networks.',
        difficulty: 'medium',
      },
      {
        question: 'The MEU (Maximum Expected Utility) principle says an agent should:',
        options: [
          'Choose the action with the highest maximum possible outcome',
          'Choose the action that minimizes the worst possible outcome',
          'Choose the action with the highest weighted average utility across possible outcomes',
          'Choose the action that most often leads to the best outcome',
        ],
        correctIndex: 2,
        explanation: 'MEU: a* = argmax EU(a|e) where EU = Σ P(outcome | action) × U(outcome). The weighting is by probability, giving expected (probability-weighted average) utility.',
        difficulty: 'medium',
      },
    ],
    flashCards: [
      { front: 'Bayes\' Theorem?', back: 'P(H|E) = P(E|H)·P(H)/P(E)\nPosterior = Likelihood × Prior / Evidence\nDenominator P(E) is the normalizing constant.' },
      { front: 'Conditional independence: A⊥B|C?', back: 'P(A,B|C) = P(A|C)·P(B|C)\nEquivalently: P(A|B,C) = P(A|C)\nMeaning: given C, knowing B gives no extra info about A.' },
      { front: 'Naive Bayes formula?', back: 'P(C|x₁,...,xₙ) ∝ P(C)·Π P(xᵢ|C)\nAssumes features independent given class.\nSimple but surprisingly effective for text classification, spam filtering.' },
      { front: 'MEU principle?', back: 'Maximum Expected Utility:\na* = argmaxₐ Σₛ P(Result(a)=s|e)·U(s)\nRational agents maximize probability-weighted utility, not just best-case or worst-case outcome.' },
    ],
  },

  // ── Chapter 14: Bayesian Networks ─────────────────────────────────────────
  12: {
    chapterId: 12,
    partId: 4,
    topicId: 'bayesian-networks',
    title: 'Probabilistic Reasoning',
    subtitle: 'Bayesian networks, exact and approximate inference',
    estimatedMinutes: 70,
    bookPages: 'AIMA Ch. 14, pp. 510–558',
    steps: [
      {
        stepNumber: 1,
        title: 'Bayesian Networks: Structure and Semantics',
        subtitle: 'Directed acyclic graphs encoding conditional independence',
        conceptType: 'intuition',
        visualType: 'belief_state',
        contentMarkdown: `## The Bayesian Network

A **Bayesian network** (BN) is a **directed acyclic graph** (DAG) where:
- Each **node** = a random variable
- Each **directed edge** = direct causal/probabilistic influence
- Each node has a **Conditional Probability Table** (CPT): P(Xᵢ | Parents(Xᵢ))

### Classic Example: Burglar Alarm
\`\`\`
Burglary → Alarm ← Earthquake
              ↓        ↓
           JohnCalls  MaryCalls
\`\`\`

| B | E | P(Alarm=T) |
|---|---|---|
| T | T | 0.95 |
| T | F | 0.94 |
| F | T | 0.29 |
| F | F | 0.001 |

P(JohnCalls=T | Alarm=T) = 0.90  
P(JohnCalls=T | Alarm=F) = 0.05

### The Joint Distribution (Chain Rule for BNs)
$$P(X_1,...,X_n) = \\prod_{i=1}^{n} P(X_i | Parents(X_i))$$

This compactly represents the full joint! (5 nodes: 5 CPTs vs 2⁵=32 entries)`,
        keyPoints: [
          'BN = DAG + CPTs — encodes conditional independence compactly',
          'Joint = product of CPTs: P(X₁,...,Xₙ) = Π P(Xᵢ | Parents(Xᵢ))',
          'Each edge means "parent directly influences child"',
          'Missing edge means conditional independence',
        ],
        examTip: 'A Bayesian network is NOT just a causal diagram. It\'s a specific encoding of the joint distribution via conditional independence assumptions.',
        bookCitation: 'AIMA 3rd Ed., Section 14.1–14.2, pp. 510–520',
      },
      {
        stepNumber: 2,
        title: 'Conditional Independence in BNs',
        subtitle: 'd-separation and the Markov condition',
        conceptType: 'math',
        visualType: 'belief_state',
        contentMarkdown: `## Reading Independence from the Graph

### Markov Condition
Each variable is **conditionally independent** of its non-descendants given its parents:
$$X_i \\perp NonDescendants(X_i) | Parents(X_i)$$

### Three Canonical Patterns

**Chain**: A → B → C  
- A and C are independent given B: A ⊥ C | B  
- "Information passes through B"

**Fork (common cause)**: A ← B → C  
- A and C are independent given B: A ⊥ C | B  
- "B explains the correlation between A and C"

**Collider (common effect)**: A → B ← C  
- A and C are independent WITHOUT knowing B
- But: A and C become DEPENDENT given B!  
  (Explaining away: if B happened and A didn't cause it, C probably did)

### d-Separation
X and Z are d-separated by Y if every path from X to Z is blocked.  
A path is blocked by Y if:
- It passes through a chain/fork where the middle node is in Y, OR
- It passes through a collider NOT in Y (and no descendant in Y)`,
        mathBlock: {
          formula: 'P(X₁,...,Xₙ) = Π_{i=1}^{n} P(Xᵢ | Parents(Xᵢ))',
          explanation: 'The fundamental Bayesian network factorization. Only O(n × 2^k) parameters needed (k = max parents per node) instead of 2^n for the full joint.',
        },
        examTip: 'Colliders are counter-intuitive: two independent causes become dependent when you observe the effect (explaining away). This is crucial for causal reasoning.',
        bookCitation: 'AIMA 3rd Ed., Section 14.2, pp. 517–525',
      },
      {
        stepNumber: 3,
        title: 'Exact Inference: Variable Elimination',
        subtitle: 'Computing posterior probabilities from BNs',
        conceptType: 'algorithm',
        visualType: 'belief_state',
        contentMarkdown: `## Computing Answers from Bayesian Networks

### The Inference Task
Given evidence E = e (observed variables), query Q (unobserved variable):
Compute P(Q | E = e)

### Enumeration (Brute Force)
Sum over all hidden variables H:
$$P(Q | e) \\propto \\sum_{h \\in H} P(Q, h, e)$$

**Problem**: Exponential in the number of hidden variables!

### Variable Elimination (Better)
Eliminate hidden variables one at a time by summing out:

1. Start with CPTs relevant to query
2. Multiply factors that share variables
3. Sum out (marginalize) each hidden variable
4. Normalize the result

\`\`\`
Query: P(Burglary | JohnCalls=T, MaryCalls=T)

1. Start: φ(B,E,A,J,M)
2. Sum out E: φ(B,A,J,M) 
3. Sum out A: φ(B,J,M)
4. Normalize over B
\`\`\`

**Complexity**: O(n × 2^w) where w = treewidth of the graph.  
For tree-structured BNs, inference is linear!`,
        codeBlock: {
          language: 'python',
          code: `# Variable Elimination (simplified pseudocode)
def variable_elimination(bn, query, evidence):
    factors = make_factor_list(bn, evidence)
    
    for var in elimination_order(bn, query, evidence):
        # Find all factors containing var
        relevant = [f for f in factors if var in f.variables]
        # Multiply them together
        product = multiply_factors(relevant)
        # Sum out the variable
        marginal = sum_out(product, var)
        # Replace relevant factors with marginal
        factors = [f for f in factors if f not in relevant]
        factors.append(marginal)
    
    # Multiply remaining factors and normalize
    result = multiply_factors(factors)
    return normalize(result)`,
          caption: 'Variable elimination computes exact posteriors efficiently by summing out hidden variables in order',
        },
        bookCitation: 'AIMA 3rd Ed., Section 14.4, pp. 527–537',
      },
      {
        stepNumber: 4,
        title: 'Approximate Inference: Monte Carlo Sampling',
        subtitle: 'MCMC and likelihood weighting for large networks',
        conceptType: 'algorithm',
        visualType: 'belief_state',
        contentMarkdown: `## When Exact Inference Is Too Slow

For large, complex networks (NP-hard in general), we use **approximate inference**.

### Direct Sampling
1. Topological order through the BN
2. Sample each variable from its CPT given parent values
3. Repeat N times → estimate probabilities from counts

**Problem**: If evidence is rare, most samples are discarded!

### Likelihood Weighting
Fix evidence variables to observed values, weight samples by probability:
\`\`\`
For each sample:
  1. Set evidence variables to observed values
  2. Sample non-evidence variables from CPTs
  3. Weight sample by P(evidence | parent assignments)
Sum weighted samples to estimate query probability
\`\`\`

### MCMC: Gibbs Sampling
Markov Chain Monte Carlo:
1. Initialize all variables randomly
2. Repeatedly: pick non-evidence variable, resample from P(Xᵢ | Markov Blanket(Xᵢ))
3. This creates a Markov chain that converges to P(X | evidence)

**Markov Blanket** of X: parents + children + parents of children.  
X is conditionally independent of ALL other variables given its Markov blanket!`,
        keyPoints: [
          'Direct sampling: accurate but ignores rare evidence',
          'Likelihood weighting: weights by probability of evidence — much more efficient',
          'Gibbs sampling (MCMC): Markov chain convergence to exact posterior',
          'Markov Blanket: X\'s parents, children, and children\'s parents',
        ],
        connectedTo: [
          { chapterId: 13, chapterTitle: 'Uncertainty', relationship: 'MCMC uses conditional independence structure from BNs', bookRef: 'Deep Learning Ch. 17' },
        ],
        bookCitation: 'AIMA 3rd Ed., Section 14.5, pp. 537–548',
      },
    ],
    quiz: [
      {
        question: 'In a Bayesian network, what does a missing edge between nodes X and Y signify?',
        options: [
          'X and Y are absolutely independent',
          'X and Y are conditionally independent given some set of other nodes',
          'X causes Y indirectly through other nodes',
          'The relationship was deemed unimportant',
        ],
        correctIndex: 1,
        explanation: 'A missing direct edge means X and Y are conditionally independent given their parents (Markov condition). It does NOT necessarily mean they are absolutely independent.',
        difficulty: 'medium',
      },
      {
        question: 'In the "collider" pattern A → C ← B, what happens when we observe C?',
        options: [
          'A and B become independent',
          'A and B become dependent (explaining away)',
          'A becomes independent of all other variables',
          'B becomes a cause of A',
        ],
        correctIndex: 1,
        explanation: '"Explaining away" (Berkson\'s paradox): A and B are initially independent causes of C. Once we observe C=true, knowing A is false increases the probability that B is true (B must explain C). They become DEPENDENT after observing the common effect.',
        difficulty: 'hard',
      },
      {
        question: 'The Markov Blanket of a node X in a Bayesian network consists of:',
        options: [
          "X's parents only",
          "X's children only",
          "X's parents, children, and the other parents of X's children",
          "All nodes within 2 edges of X",
        ],
        correctIndex: 2,
        explanation: "The Markov Blanket = X's parents + X's children + the other parents of X's children. Given its Markov blanket, X is conditionally independent of ALL remaining variables. This is crucial for Gibbs sampling.",
        difficulty: 'medium',
      },
    ],
    flashCards: [
      { front: 'Bayesian network joint formula?', back: 'P(X₁,...,Xₙ) = Π P(Xᵢ | Parents(Xᵢ))\nProduct of all CPTs. Key insight: massive compression since each CPT is small (exponential in number of parents, not all variables).' },
      { front: 'Three BN path patterns?', back: 'Chain (A→B→C): independent given B\nFork (A←B→C): independent given B\nCollider (A→B←C): independent WITHOUT B, DEPENDENT given B (explaining away)' },
      { front: 'Likelihood weighting in BNs?', back: 'Fix evidence variables; sample others from CPTs.\nWeight each sample by P(evidence vars | their parents).\nSuperior to direct sampling for rare evidence.' },
      { front: "Markov Blanket definition?", back: "MB(X) = Parents(X) ∪ Children(X) ∪ OtherParents(Children(X))\nGiven MB(X), X is conditionally independent of all other variables.\nBasis for Gibbs sampling." },
    ],
  },

  // ── Chapter 18: Learning from Examples ────────────────────────────────────
  13: {
    chapterId: 13,
    partId: 5,
    topicId: 'machine-learning-intro',
    title: 'Learning from Examples',
    subtitle: 'Decision trees, overfitting, cross-validation, and linear models',
    estimatedMinutes: 75,
    bookPages: 'AIMA Ch. 18, pp. 693–750',
    steps: [
      {
        stepNumber: 1,
        title: 'Forms of Learning',
        subtitle: 'Supervised, unsupervised, reinforcement — the taxonomy',
        conceptType: 'intuition',
        visualType: 'neural_net_overview',
        contentMarkdown: `## How Agents Learn

### The Learning Problem
Given:
- A **performance measure** P
- A **task** T
- **Experience** E

Improve performance on T, as measured by P, through experience E. (Mitchell's definition)

### Learning Taxonomy

| Type | Input | Output | Example |
|---|---|---|---|
| **Supervised** | (x, y) labeled pairs | f: x → y | Spam detection |
| **Unsupervised** | Unlabeled x | Structure/clusters | Customer segmentation |
| **Reinforcement** | State, reward signals | Policy | Game playing |
| **Semi-supervised** | Few labeled + many unlabeled | f: x → y | Medical imaging |

### Inductive Learning Framework
Learn hypothesis h from training examples {(x₁,y₁), ..., (xₙ,yₙ)}  
Goal: h ≈ target function f  
Measured by: **generalization error** on unseen examples

> *"The key challenge is not fitting training data but generalizing to new data."* — Géron, Hands-On ML`,
        keyPoints: [
          'Supervised: learn from labeled examples',
          'Unsupervised: find structure without labels',
          'Reinforcement: learn from rewards/penalties',
          'Generalization is the true goal — not memorizing training data',
        ],
        connectedTo: [
          { chapterId: 21, chapterTitle: 'Reinforcement Learning', relationship: 'RL is a third major learning paradigm', bookRef: 'Hands-On ML Ch. 18' },
        ],
        bookCitation: 'AIMA 3rd Ed., Section 18.1, pp. 693–697',
      },
      {
        stepNumber: 2,
        title: 'Decision Trees',
        subtitle: 'Building interpretable classifiers by information gain',
        conceptType: 'algorithm',
        visualType: 'decision_boundary',
        contentMarkdown: `## Decision Tree Learning

A decision tree classifies by asking a series of questions about features.

### Building the Tree: DTL-LEARN Algorithm
1. If all examples have the same class → return leaf
2. If no attributes left → return majority class (default)
3. Otherwise:
   - Choose best attribute A (highest information gain)
   - Create branch for each value of A
   - Recurse on subsets

### Information Gain
$$\\text{Gain}(S, A) = H(S) - \\sum_{v} \\frac{|S_v|}{|S|} H(S_v)$$

Where **entropy** H measures impurity:
$$H(S) = -\\sum_c p_c \\log_2(p_c)$$

### Entropy Examples
- Pure set {+++++}: H = 0 (no uncertainty)
- Equal split {+++---}: H = 1 bit (maximum uncertainty)
- Slight majority {++++−}: H ≈ 0.72 bits

### Choosing the Best Split
Pick attribute A that reduces entropy most:
- High Gain → attribute A separates classes well
- Low Gain → attribute gives little information`,
        mathBlock: {
          formula: 'H(S) = -Σ p_c log₂(p_c)\\nGain(S,A) = H(S) - Σᵥ |Sᵥ|/|S| × H(Sᵥ)',
          explanation: 'H(S): entropy (uncertainty) of set S. Gain(S,A): expected reduction in entropy after knowing attribute A. Higher gain = better split. Choose attribute with maximum gain at each node.',
        },
        codeBlock: {
          language: 'python',
          code: `import math

def entropy(examples):
    counts = {}
    for ex in examples:
        counts[ex['label']] = counts.get(ex['label'], 0) + 1
    total = len(examples)
    return -sum((c/total) * math.log2(c/total) 
                for c in counts.values() if c > 0)

def information_gain(examples, attribute):
    h_before = entropy(examples)
    values = set(ex[attribute] for ex in examples)
    h_after = sum(
        len([e for e in examples if e[attribute] == v]) / len(examples)
        * entropy([e for e in examples if e[attribute] == v])
        for v in values
    )
    return h_before - h_after`,
          caption: 'Entropy and information gain implementation for decision tree splitting',
        },
        bookCitation: 'AIMA 3rd Ed., Section 18.3, pp. 697–711',
      },
      {
        stepNumber: 3,
        title: 'Overfitting, Underfitting, and Model Selection',
        subtitle: 'The bias-variance tradeoff and cross-validation',
        conceptType: 'math',
        visualType: 'decision_boundary',
        contentMarkdown: `## The Fundamental Challenge

### Overfitting
Model learns training data **too well** — memorizes noise, fails on new data.

**Signs**: High training accuracy, low test accuracy.

### Underfitting  
Model is **too simple** — doesn't capture the true patterns.

**Signs**: Low training accuracy AND low test accuracy.

### Bias-Variance Tradeoff
$$\\text{Expected Error} = \\text{Bias}^2 + \\text{Variance} + \\text{Noise}$$

| | Bias | Variance |
|---|---|---|
| **High** | Underfitting | Overfitting |
| **Low** | Complex model | Simple model |
| **Cause** | Too simple | Too complex |

### Cross-Validation
1. Split data into K folds
2. Train on K-1 folds, test on remaining fold
3. Repeat K times, average test errors

**k-fold CV** gives a reliable estimate of generalization error.

### Regularization
Penalize complex models during training:
$$\\text{Loss} = \\text{Training Error} + \\lambda \\cdot \\text{Complexity Penalty}$$

For decision trees: **pruning** — remove branches that don't improve generalization.`,
        keyPoints: [
          'Overfitting: low train error, high test error — model too complex',
          'Underfitting: high train error and test error — model too simple',
          'Bias² + Variance + Noise = total expected error',
          'Cross-validation: reliable estimate of generalization performance',
          'Regularization: add penalty for complexity to prevent overfitting',
        ],
        examTip: 'Bias-variance tradeoff: you can\'t eliminate both simultaneously. Optimal model complexity balances them. Regularization is the engineering solution.',
        bookCitation: 'AIMA 3rd Ed., Section 18.4, pp. 711–718',
      },
      {
        stepNumber: 4,
        title: 'Linear Models and Gradient Descent',
        subtitle: 'Perceptrons, logistic regression, and optimization',
        conceptType: 'algorithm',
        visualType: 'gradient_descent',
        contentMarkdown: `## Learning with Linear Models

### Linear Regression
Predict continuous outputs:
$$h_w(x) = w_0 + w_1 x_1 + ... + w_n x_n = \\mathbf{w}^T \\mathbf{x}$$

Loss: **Mean Squared Error (MSE)**
$$L(w) = \\frac{1}{N} \\sum_{i=1}^{N} (y_i - h_w(x_i))^2$$

### Gradient Descent
Update weights to minimize loss:
$$w \\leftarrow w - \\alpha \\nabla_w L(w)$$

- **Batch GD**: Compute gradient over all training examples — stable but slow
- **Stochastic GD (SGD)**: One example at a time — fast but noisy
- **Mini-batch GD**: Small batches — best of both worlds

### Logistic Regression
For binary classification, apply sigmoid to linear output:
$$P(y=1|x) = \\sigma(w^T x) = \\frac{1}{1 + e^{-w^T x}}$$

Loss: **Cross-entropy / Log loss**
$$L = -\\sum_i [y_i \\log(h_i) + (1-y_i) \\log(1-h_i)]$$

This is convex — gradient descent always finds the global optimum!`,
        mathBlock: {
          formula: 'w ← w - α × ∂L/∂w\\n∂MSE/∂wⱼ = (2/N) Σᵢ (hᵥᵥ(xᵢ) - yᵢ) × xᵢⱼ',
          explanation: 'Gradient descent update rule. α is the learning rate. The gradient points in the direction of steepest increase, so we subtract it to descend. For MSE, the gradient is the average error times the feature value.',
        },
        connectedTo: [
          { chapterId: 19, chapterTitle: 'Neural Networks', relationship: 'Neural networks generalize linear models with non-linear activations', bookRef: 'Deep Learning Ch. 6' },
        ],
        bookCitation: 'AIMA 3rd Ed., Section 18.6, pp. 723–734',
      },
      {
        stepNumber: 5,
        title: 'Ensemble Methods and Model Averaging',
        subtitle: 'Boosting, bagging, and random forests',
        conceptType: 'algorithm',
        visualType: 'decision_boundary',
        contentMarkdown: `## Wisdom of Crowds: Ensemble Learning

### Key Insight
Combining multiple weak learners often produces a stronger learner.  
Error types: Bias (systematic) and Variance (random noise).  
Ensembles reduce variance by averaging.

### Bagging (Bootstrap Aggregating)
1. Create B bootstrap samples (sample with replacement)
2. Train one learner on each sample
3. Average predictions (regression) or majority vote (classification)

**Random Forests** = Bagging + random feature subsets at each split.  
Reduces variance dramatically. Very robust in practice.

### Boosting (AdaBoost)
1. Train a weak learner on original data
2. Increase weight of misclassified examples
3. Train next learner focusing on hard examples
4. Final = weighted vote of all learners

$$H(x) = \\text{sign}\\left(\\sum_{t} \\alpha_t h_t(x)\\right)$$

**AdaBoost** can achieve zero training error even with very weak learners.

### Gradient Boosting
Fit each new tree to the **residual errors** of the current ensemble.  
XGBoost / LightGBM are state-of-the-art gradient boosting implementations.`,
        keyPoints: [
          'Bagging: parallel training on bootstrap samples → averages out variance',
          'Random Forests: bagging + random feature selection → very robust',
          'Boosting: sequential training, focus on mistakes → reduces bias',
          'Gradient boosting fits new trees to residual errors',
        ],
        connectedTo: [
          { chapterId: 13, chapterTitle: 'Machine Learning Intro', relationship: 'Ensembles directly exploit the bias-variance tradeoff', bookRef: 'Hands-On ML Ch. 7' },
        ],
        bookCitation: 'AIMA 3rd Ed., Section 18.10, pp. 746–750',
      },
    ],
    quiz: [
      {
        question: 'In decision tree learning, which attribute should be chosen for splitting?',
        options: [
          'The attribute with the most distinct values',
          'The attribute with the highest information gain (entropy reduction)',
          'The attribute with the lowest entropy overall',
          'Any attribute — the tree will converge regardless',
        ],
        correctIndex: 1,
        explanation: 'Choose the attribute that maximizes information gain = H(S) - Σ |Sv|/|S| × H(Sv). This selects the attribute that best separates positive and negative examples, minimizing residual uncertainty.',
        difficulty: 'easy',
      },
      {
        question: 'A model with high bias and low variance is most likely:',
        options: [
          'Overfitting the training data',
          'Underfitting — too simple to capture the true pattern',
          'Perfectly balanced between bias and variance',
          'The optimal model for the given task',
        ],
        correctIndex: 1,
        explanation: 'High bias = systematic errors, model too simple or wrong assumptions. Low variance = model is consistent across different training sets. This profile is classic underfitting. Fix: increase model complexity.',
        difficulty: 'medium',
      },
      {
        question: 'In AdaBoost, after each round of training:',
        options: [
          'All misclassified examples are removed from training data',
          'A completely new dataset is created by re-sampling',
          'The weights of misclassified examples are increased',
          'The learning rate is automatically reduced',
        ],
        correctIndex: 2,
        explanation: 'AdaBoost upweights misclassified examples so the next weak learner focuses more on them. Each learner αₜ is proportional to its accuracy. The final classifier is a weighted majority vote.',
        difficulty: 'medium',
      },
    ],
    flashCards: [
      { front: 'Information Gain formula?', back: 'Gain(S,A) = H(S) - Σᵥ |Sᵥ|/|S| × H(Sᵥ)\nH(S) = -Σ pₒ log₂(pₒ) is entropy.\nGain = entropy before - weighted entropy after splitting on A.' },
      { front: 'Bias-Variance decomposition?', back: 'Expected Error = Bias² + Variance + Noise\nBias: systematic error from wrong assumptions (underfitting)\nVariance: sensitivity to training set fluctuations (overfitting)\nCannot minimize both simultaneously.' },
      { front: 'Bagging vs Boosting?', back: 'Bagging: parallel, bootstrap samples, average → reduces VARIANCE (Random Forests)\nBoosting: sequential, reweight hard examples → reduces BIAS (AdaBoost, XGBoost)\nBoth create ensembles from weak learners.' },
      { front: 'Gradient descent update?', back: 'w ← w - α × ∇L(w)\nα = learning rate (step size)\n∇L = gradient (direction of steepest ascent)\nSubtract gradient to minimize loss.' },
    ],
  },

  // ── Chapter 19: Neural Networks ────────────────────────────────────────────
  14: {
    chapterId: 14,
    partId: 5,
    topicId: 'neural-networks',
    title: 'Neural Networks & Deep Learning',
    subtitle: 'Multilayer perceptrons, backpropagation, and modern architectures',
    estimatedMinutes: 80,
    bookPages: 'AIMA Ch. 18–19, pp. 727–753 | Deep Learning (Goodfellow) Ch. 6–9',
    steps: [
      {
        stepNumber: 1,
        title: 'The Perceptron: Building Block of Neural Nets',
        subtitle: 'From biological neurons to computational units',
        conceptType: 'intuition',
        visualType: 'neural_net_overview',
        contentMarkdown: `## From Biology to Math

### Biological Neuron
- Receives signals from dendrites
- Integrates signals in cell body
- Fires if threshold exceeded
- Transmits via axon

### Mathematical Neuron (Perceptron)
$$y = \\sigma(\\mathbf{w}^T \\mathbf{x} + b)$$

| Component | Biological | Mathematical |
|---|---|---|
| Inputs | Dendrites | x = (x₁,...,xₙ) |
| Weights | Synaptic strengths | w = (w₁,...,wₙ) |
| Bias | Threshold | b |
| Activation | Fire/No-fire | σ(·) function |
| Output | Axon signal | y |

### Activation Functions

| Function | Formula | Use |
|---|---|---|
| **Sigmoid** | 1/(1+e^-z) | Binary output (0 to 1) |
| **Tanh** | (eᶻ-e^-z)/(eᶻ+e^-z) | Centered (-1 to 1) |
| **ReLU** | max(0, z) | Hidden layers (modern) |
| **Softmax** | eᶻᵢ/Σeᶻⱼ | Multiclass output |

**ReLU** is the default choice for hidden layers — simple, fast, avoids vanishing gradients.`,
        keyPoints: [
          'Perceptron: weighted sum of inputs → activation function → output',
          'Bias term shifts the activation function — like a threshold',
          'ReLU: max(0,z) — most common hidden activation in deep learning',
          'Softmax converts raw scores to probability distribution (multiclass)',
        ],
        bookCitation: 'AIMA 3rd Ed., Section 18.7, pp. 727–734 | Goodfellow et al., Ch. 6',
      },
      {
        stepNumber: 2,
        title: 'Multilayer Perceptrons (MLPs)',
        subtitle: 'Stacked layers and the universal approximation theorem',
        conceptType: 'algorithm',
        visualType: 'neural_net_overview',
        contentMarkdown: `## Deep Networks: Layer by Layer

### Architecture
\`\`\`
Input Layer → Hidden Layer(s) → Output Layer
    x₁ ──────┐
    x₂ ──────┼→ [Hidden 1] → [Hidden 2] → ... → [Output] → ŷ
    x₃ ──────┘
\`\`\`

### Forward Pass (Prediction)
For each layer l:
$$\\mathbf{a}^{[l]} = \\sigma(\\mathbf{W}^{[l]} \\mathbf{a}^{[l-1]} + \\mathbf{b}^{[l]})$$

### Why Depth Matters?
**Universal Approximation Theorem**: A single hidden layer MLP with enough neurons can approximate any continuous function.

But **deep** networks are more efficient:
- Each layer learns increasingly abstract features
- Fewer parameters needed for same expressiveness
- Compositionality: complex functions as compositions of simple ones

### Example: Image Recognition
- Layer 1: edges and gradients
- Layer 2: corners, curves
- Layer 3: object parts
- Layer 4: whole objects

> *"Deep learning's fundamental insight: abstract features are better learned hierarchically."* — Goodfellow et al., Deep Learning Ch. 1`,
        mathBlock: {
          formula: 'a^[l] = σ(W^[l] a^[l-1] + b^[l])\\nf(x) = a^[L] = σ(W^[L]...σ(W^[1]x + b^[1])...+ b^[L])',
          explanation: 'Forward pass: each layer applies a linear transformation (W, b) then a non-linear activation σ. Output is a composition of these transformations. Non-linearity is ESSENTIAL — without it, a deep network collapses to a linear model.',
        },
        bookCitation: 'AIMA 3rd Ed., Section 18.7 | Goodfellow et al., Ch. 6.4',
      },
      {
        stepNumber: 3,
        title: 'Backpropagation: How Networks Learn',
        subtitle: 'Chain rule of calculus applied to neural networks',
        conceptType: 'algorithm',
        visualType: 'gradient_descent',
        contentMarkdown: `## The Backpropagation Algorithm

Backprop efficiently computes ∂L/∂W for every weight using the **chain rule**.

### Algorithm

**Forward Pass**: Compute predictions and cache intermediate activations  
**Compute Loss**: L = Loss(ŷ, y)  
**Backward Pass**: Compute gradients layer by layer, back to front

### Chain Rule Applied
For output layer error δ^[L]:
$$\\delta^{[L]} = \\frac{\\partial L}{\\partial \\mathbf{a}^{[L]}} \\cdot \\sigma'(\\mathbf{z}^{[L]})$$

For hidden layers (propagate backward):
$$\\delta^{[l]} = (\\mathbf{W}^{[l+1]T} \\delta^{[l+1]}) \\cdot \\sigma'(\\mathbf{z}^{[l]})$$

Weight gradients:
$$\\frac{\\partial L}{\\partial \\mathbf{W}^{[l]}} = \\delta^{[l]} (\\mathbf{a}^{[l-1]})^T$$

### The Vanishing Gradient Problem
With sigmoid/tanh activations, gradients shrink by a factor < 1 at each layer.  
With 20+ layers → gradients ≈ 0 → weights stop updating → network doesn't learn.

**Solutions**: ReLU activations, batch normalization, residual connections (ResNets)`,
        codeBlock: {
          language: 'python',
          code: `import numpy as np

def sigmoid(z): return 1 / (1 + np.exp(-z))
def relu(z): return np.maximum(0, z)
def relu_grad(z): return (z > 0).astype(float)

class MLP:
    def forward(self, X):
        self.cache = {'a0': X}
        a = X
        for l, (W, b) in enumerate(zip(self.weights, self.biases)):
            z = a @ W.T + b
            a = relu(z) if l < len(self.weights)-1 else sigmoid(z)
            self.cache[f'z{l+1}'] = z
            self.cache[f'a{l+1}'] = a
        return a

    def backward(self, X, y, lr=0.01):
        L = len(self.weights)
        m = X.shape[0]
        # Output layer error
        delta = self.cache[f'a{L}'] - y
        for l in range(L-1, -1, -1):
            dW = delta.T @ self.cache[f'a{l}'] / m
            db = delta.mean(axis=0)
            if l > 0:
                delta = (delta @ self.weights[l]) * relu_grad(self.cache[f'z{l}'])
            self.weights[l] -= lr * dW
            self.biases[l] -= lr * db`,
          caption: 'Simplified backpropagation in NumPy — forward and backward pass',
        },
        bookCitation: 'AIMA 3rd Ed., Section 18.7.3 | Goodfellow Ch. 6.5',
      },
      {
        stepNumber: 4,
        title: 'Convolutional and Recurrent Neural Networks',
        subtitle: 'Specialized architectures for images and sequences',
        conceptType: 'connection',
        visualType: 'neural_net_overview',
        contentMarkdown: `## Specialized Deep Architectures

### Convolutional Neural Networks (CNNs) — For Images
Instead of connecting every neuron to every input, use **local filters**:

\`\`\`
Input Image → [Conv + ReLU] → [Pooling] → [Conv + ReLU] → [Pooling] → [FC] → Output
\`\`\`

**Key ideas**:
- **Local connectivity**: Each filter looks at a small region
- **Weight sharing**: Same filter applied across entire image
- **Translation invariance**: Detects features regardless of position
- **Pooling**: Reduces spatial dimensions, adds invariance

**Landmark architectures**: LeNet-5, AlexNet, VGG, ResNet (skip connections), EfficientNet

### Recurrent Neural Networks (RNNs) — For Sequences
Process sequences by maintaining a **hidden state** that carries information:
$$h_t = \\sigma(W_{hh} h_{t-1} + W_{xh} x_t + b)$$
$$y_t = W_{hy} h_t$$

**LSTM** (Long Short-Term Memory): Adds gates to control memory flow — solves vanishing gradient for sequences.

**Transformer**: Replaced RNNs for NLP. Uses **self-attention** — each token attends to all others simultaneously.

> *"The transformer architecture is arguably the single most important development in AI in the last decade."* — LLM Book, Ch. 1`,
        keyPoints: [
          'CNN: local filters + weight sharing + pooling → translation-invariant features',
          'RNN: hidden state carries sequence context',
          'LSTM: gates control memory → handles long-range dependencies',
          'Transformer: self-attention on all positions simultaneously → parallelizable',
        ],
        connectedTo: [
          { chapterId: 22, chapterTitle: 'NLP & Language Models', relationship: 'Transformers are the foundation of modern NLP', bookRef: 'Build LLMs from Scratch, Ch. 1 | Speech & Language Processing Ch. 9' },
        ],
        bookCitation: 'AIMA 3rd Ed., Section 18.8–18.9 | Goodfellow Ch. 9–10 | LLM Book Ch. 1',
      },
      {
        stepNumber: 5,
        title: 'Regularization and Training Modern Networks',
        subtitle: 'Dropout, batch normalization, and optimization tricks',
        conceptType: 'algorithm',
        visualType: 'gradient_descent',
        contentMarkdown: `## Making Deep Learning Work in Practice

### Dropout
During training, randomly set fraction p of neurons to 0:
- Forces network to learn redundant representations
- Acts as ensemble of many networks
- At test time: scale by (1-p) or use inverted dropout

### Batch Normalization
Normalize activations within each mini-batch:
$$\\hat{x}^{(k)} = \\frac{x^{(k)} - \\mu_B}{\\sqrt{\\sigma_B^2 + \\epsilon}}$$

Benefits:
- Reduces internal covariate shift
- Allows higher learning rates
- Acts as mild regularizer
- Dramatically speeds training

### Advanced Optimizers
| Optimizer | Key Idea | Best For |
|---|---|---|
| **SGD + Momentum** | Accumulate velocity | CNNs with careful tuning |
| **RMSProp** | Adaptive learning rates | RNNs |
| **Adam** | Momentum + RMSProp | General purpose |
| **AdamW** | Adam + weight decay | Transformers |

### Learning Rate Scheduling
- **Warmup**: Start small, increase to peak
- **Cosine annealing**: Smooth decay
- **One-cycle**: Warmup then decay

> *"In practice, Adam with a tuned learning rate and batch normalization is a reliable starting point."* — Géron, Hands-On ML`,
        keyPoints: [
          'Dropout: random neuron deactivation → prevents co-adaptation, acts as ensemble',
          'Batch norm: normalize within mini-batch → stable training, faster convergence',
          'Adam: combines momentum + RMSProp → adaptive learning rates per parameter',
          'Learning rate is the most critical hyperparameter to tune',
        ],
        examTip: 'Dropout p=0.5 is common for fully-connected layers. p=0.1–0.3 for convolutional layers. Always OFF during inference (test time).',
        bookCitation: 'Goodfellow et al., Ch. 7 | Géron, Hands-On ML Ch. 11 | Designing ML Systems Ch. 6',
      },
    ],
    quiz: [
      {
        question: 'Why is a non-linear activation function essential in neural networks?',
        options: [
          'To ensure the network converges during training',
          'Without non-linearity, stacking layers is equivalent to a single linear transformation',
          'To prevent vanishing gradients in deep networks',
          'To make the output bounded between 0 and 1',
        ],
        correctIndex: 1,
        explanation: 'A composition of linear functions is still linear: W₂(W₁x) = (W₂W₁)x. Without non-linear activation functions, a 100-layer network is no more expressive than a single linear layer. Non-linearity is what gives neural nets their power.',
        difficulty: 'medium',
      },
      {
        question: 'In backpropagation, the "vanishing gradient" problem occurs when:',
        options: [
          'Gradients become NaN due to numerical overflow',
          'Gradients shrink to near-zero as they propagate to early layers, preventing learning',
          'The learning rate is too high and gradients oscillate',
          'The network memorizes training data and gradients go to zero',
        ],
        correctIndex: 1,
        explanation: 'With sigmoid/tanh activations, gradients are multiplied by σ\'(z) ≤ 0.25 at each layer. Over 10+ layers: 0.25^10 ≈ 10^-6. Early layers receive nearly zero gradients and stop learning. ReLU (gradient=1 for z>0) solves this.',
        difficulty: 'medium',
      },
      {
        question: 'Dropout regularization works by:',
        options: [
          'Reducing the learning rate when training loss plateaus',
          'Randomly setting weights to zero during training, forcing redundant representations',
          'Adding L2 penalty to the loss function proportional to weight magnitude',
          'Removing neurons with the lowest activation magnitudes',
        ],
        correctIndex: 1,
        explanation: 'Dropout randomly zeros out neurons (not weights) during training with probability p. This prevents neurons from co-adapting (becoming too reliant on specific other neurons). At test time, all neurons are used and scaled by (1-p) or inverted dropout keeps training scales consistent.',
        difficulty: 'medium',
      },
    ],
    flashCards: [
      { front: 'Perceptron formula?', back: 'y = σ(wᵀx + b)\nw = weights, x = inputs, b = bias\nσ = activation function (ReLU, sigmoid, tanh)\nForward pass: weighted sum → activate.' },
      { front: 'Backpropagation key insight?', back: 'Chain rule of calculus applied recursively:\n∂L/∂W^[l] = δ^[l] × (a^[l-1])ᵀ\nδ^[l] = (W^[l+1]ᵀ δ^[l+1]) ⊙ σ\'(z^[l])\nPropagate error signals backward through the network.' },
      { front: 'CNN vs RNN vs Transformer?', back: 'CNN: local filters + weight sharing → image features\nRNN/LSTM: hidden state → sequential data, language\nTransformer: self-attention on ALL positions → NLP (GPT, BERT)\nTransformer has replaced RNN for most sequence tasks.' },
      { front: 'Batch Normalization purpose?', back: 'Normalizes layer activations within a mini-batch.\nBenefits: reduces internal covariate shift, allows high learning rates, mild regularization.\nApply BEFORE activation function (or after, debate ongoing).' },
    ],
  },
};
