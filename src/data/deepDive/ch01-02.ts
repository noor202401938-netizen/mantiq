import type { ChapterDeepDive } from './types';

export const DEEP_DIVE_CH01_02: Record<number, ChapterDeepDive> = {
  1: {
    1: {
      qa: [
        {
          question: `Is there one accepted definition of AI?`,
          answer: `No. Russell & Norvig organize the definitions along two independent axes (AIMA Table 1.1). The first asks what is measured: **thought processes and reasoning** or **behavior and action**. The second asks the benchmark: **human performance** or **ideal rationality**. Crossing the two gives four definitions: thinking humanly, acting humanly, thinking rationally, and acting rationally.

This is why "AI" can refer to a cognitive model of memory, a chatbot, a theorem prover, or a utility-maximizing controller. Each researcher picks a different cell of the grid, and each cell implies different tests of success.`,
        },
        {
          question: `Does "rational" mean the agent always gets the right answer?`,
          answer: `No. Rationality is judged by the decision process given what the agent knows, not by hindsight. A rational agent picks the action with the highest expected utility:

$$a^* = \\arg\\max_{a} \\sum_{s'} P(s' \\mid a, \\mathbf{e})\\, U(s')$$

Here $\\mathbf{e}$ is the evidence in the percepts. Suppose an autonomous car drives forward, and a sinkhole opens one millisecond earlier with no sensor evidence of it. Driving forward was still rational, because the car acted on the best available expected outcome. The bad result does not make the decision irrational.`,
        },
        {
          question: `If rationality is the goal, why still study human cognition?`,
          answer: `Rationality is the design benchmark, but human cognition remains valuable evidence. Studying humans is an empirical science: it measures reaction times, errors, and brain activity (fMRI, EEG). Those measurements can guide models of perception and memory.

Humans are not rational in the formal sense, though. Cognitive biases and emotional fatigue produce systematic errors, as Kahneman and Tversky showed. A medical or trading AI that reasoned exactly like a human would inherit those errors. AIMA therefore uses rationality as the target, because it can be stated mathematically, proved, and transferred across domains.`,
        },
      ],
      workedExample: {
        title: 'Classifying four systems on the Thought-Action grid',
        scenario: `Four systems are described below. (A) A theorem prover derives conclusions only from axioms by deductive steps. (B) A chatbot is judged successful when interrogators cannot tell it apart from a person. (C) A model of human memory is fitted to reaction-time data from psychology experiments. (D) A recommender chooses items that maximize the expected value of clicks and purchases.`,
        walkthrough: [
          `**Axis 1 (what is measured):** A and C are about internal mental mechanisms, so they are **thought** systems. B and D are judged by what they do, so they are **action** systems.`,
          `**Axis 2 (benchmark):** B and C are measured against human behavior or data from humans, so they are **human** benchmarks. A and D are measured against a formal standard, namely valid deduction or expected utility, so they are **rational** benchmarks.`,
          `**Cell assignment:** A = thinking rationally (logic), B = acting humanly (Turing test), C = thinking humanly (cognitive model), D = acting rationally (expected utility).`,
        ],
        takeaway: `Every AI system sits in one of four cells, and the cell determines what counts as success, so identifying it is the first step in evaluating any claim about "intelligence."`,
      },
    },

    2: {
      qa: [
        {
          question: `Is acting humanly the same as passing the Turing test?`,
          answer: `Acting humanly is the behavioral goal, and the Turing test is its operational form. An interrogator chats by text with a human and a machine. If, after about 5 minutes, the interrogator cannot reliably tell which is which, the machine passes.

The standard test already requires natural language, knowledge representation, automated reasoning, and learning. The **Total Turing Test** adds computer vision and robotics for physical interaction. Passing is defined by indistinguishable behavior, not by internal mechanism. A system can act humanly without thinking humanly, which is exactly the distinction between the first two cells of the grid.`,
        },
        {
          question: `Why did logic-based AI struggle if logic is so rigorous?`,
          answer: `Two obstacles stood out. The first is **informal knowledge**: most real-world facts are uncertain, have exceptions, and depend on context, so they cannot be stated as certain premises. The second is **computational intractability**. Propositional inference is NP-complete, and first-order logic is only semidecidable. A complete prover can run forever on a non-theorem.

Logic did not disappear. Chapters 7 to 9 use it inside agents, and modern systems combine logical structure with probabilistic reasoning. The school's failure was the belief that logic alone was enough.`,
        },
        {
          question: `Why does cognitive modeling need more than the Turing test?`,
          answer: `Acting humanly judges only outputs. Two very different mechanisms can produce identical human-like answers, and the Turing test cannot tell them apart. The cognitive modeling school needs process-level evidence, such as introspection, psychological experiments, and brain imaging.

Newell and Simon's General Problem Solver is the classic case. Its design was checked against the step-by-step reasoning recorded from human subjects solving the same problems, so the program was supposed to reproduce the sequence of human steps, not just the final answer.`,
        },
      ],
      workedExample: {
        title: 'The hot pan: thinking rationally versus acting rationally',
        scenario: `A robot holds a pan on a hot burner. If it keeps holding the pan, there is a 0.9 probability of a burn, with utility -100. If it drops the pan, soup spills for certain, with utility -1. Dropping has no burn risk.`,
        walkthrough: [
          `**Logic school check:** Writing "hold leads to burn, burn is bad, so drop" as a deduction fails, because the burn happens only with probability 0.9. No certain premise yields a proof that dropping is correct.`,
          `**Expected utility of holding:** $EU(\\text{hold}) = 0.9 \\times (-100) + 0.1 \\times 0 = -90$.`,
          `**Expected utility of dropping:** $EU(\\text{drop}) = 1 \\times (-1) = -1$.`,
          `**Decision:** $-1 > -90$, so the robot drops the pan, even though no logical proof was available.`,
        ],
        takeaway: `Rational action can be justified by expected utility when no deductive proof exists, which is why the acting-rationally school is more general than the laws-of-thought school.`,
      },
    },

    3: {
      qa: [
        {
          question: `Why is 1956 called the birth of AI?`,
          answer: `In 1955, John McCarthy, Marvin Minsky, Nathaniel Rochester, and Claude Shannon proposed a summer research project at Dartmouth. Its founding premise was that every aspect of learning or intelligence could in principle be described precisely enough for a machine to simulate. McCarthy coined the name "artificial intelligence" for that proposal. The workshop was held in 1956.

The same year, Newell, Shaw, and Simon demonstrated the Logic Theorist, which proved theorems from Whitehead and Russell's *Principia Mathematica*. The field existed as a named research program from then on.`,
        },
        {
          question: `What caused the AI winters?`,
          answer: `The winters followed overpromising. Early claims outran results, and funders withdrew when promised progress did not arrive.

- **Machine translation (1966):** the ALPAC report judged the field's translation efforts unsuccessful, and funding was cut.
- **Perceptrons (1969):** Minsky and Papert showed that single-layer perceptrons cannot compute XOR, which discouraged neural network research for years.
- **Expert systems (late 1980s):** they were brittle outside their narrow rule sets, and the market for specialized AI hardware collapsed.
- **Fifth Generation Project (ended 1992):** Japan's ambitious plan did not reach its goals.

Each winter reduced funding and trust, and each was followed by a return driven by new methods and better compute.`,
        },
      ],
      workedExample: {
        title: 'Measuring the gaps between milestones',
        scenario: `Using dates from the timeline: the Dartmouth Conference (1956), backpropagation (1986), Deep Blue beats Kasparov (1997), AlexNet wins ImageNet (2012), and ChatGPT launches (2022).`,
        walkthrough: [
          `**Dartmouth to Deep Blue:** $1997 - 1956 = 41$ years between the field's founding and a famous chess victory.`,
          `**Backpropagation to AlexNet:** $2012 - 1986 = 26$ years between a key training algorithm and the deep learning breakthrough that made it dominant.`,
          `**AlexNet to ChatGPT:** $2022 - 2012 = 10$ years between the vision breakthrough and a widely used language system.`,
          `**Interpretation:** The 26-year gap shows that a key idea can wait decades for the data and compute that make it work. The shorter later gaps reflect that the field had matured by then.`,
        ],
        takeaway: `Milestone dates are most informative when read as gaps, because the delay between an idea and its payoff shows what the idea was waiting for.`,
      },
    },

    4: {
      qa: [
        {
          question: `What was the DARPA Urban Challenge, and who won it?`,
          answer: `Stanford's robot car **Stanley** won the **2005 DARPA Grand Challenge**, a desert course of about 132 miles. The **2007 DARPA Urban Challenge** was a different event. Vehicles had to navigate a course of about 60 miles in an urban-style setting, obey traffic rules, and handle other moving vehicles. Carnegie Mellon's **Boss** won that race.

The distinction matters: desert driving is mostly about terrain and sensing, while urban driving adds interaction with other agents, which is the multi-agent problem from Chapter 2.`,
        },
        {
          question: `How large is the Go search space compared with chess?`,
          answer: `Both are far larger than anything exhaustive search can cover. Chess has roughly $10^{44}$ legal positions, and Go on a 19 by 19 board has roughly $10^{170}$. The number of atoms in the observable universe is about $10^{80}$, so Go's position count exceeds it by an enormous margin.

This is why AlphaGo (2016) did not try to search exhaustively. It combined deep neural networks, which judge positions and suggest moves, with Monte Carlo tree search, which explores only promising lines. Learned evaluation replaced brute-force enumeration.`,
        },
        {
          question: `How big was AlexNet's improvement in 2012?`,
          answer: `On the ImageNet classification benchmark (ILSVRC 2012), AlexNet's **top-5 error** was **15.3%**. The second-best entry had **26.2%**. The reduction is about 11 percentage points, or $\\frac{26.2 - 15.3}{26.2} \\approx 42\\%$ relative to the runner-up.

Human top-5 error on this benchmark is roughly 5%, so the gap to human performance was still large. The jump was dramatic, though, and it was achieved by a deep convolutional network trained on GPUs. That result is widely cited as the start of the deep learning era.`,
        },
      ],
      workedExample: {
        title: 'Quantifying the AlexNet breakthrough',
        scenario: `Two entries in the 2012 ImageNet competition are compared on top-5 error: AlexNet at 15.3% and the second-best entry at 26.2%. The question is how much better AlexNet was, in absolute and relative terms.`,
        walkthrough: [
          `**Absolute gap:** $26.2 - 15.3 = 10.9$ percentage points.`,
          `**Relative reduction:** $\\frac{10.9}{26.2} \\approx 0.416$, so AlexNet made about 42% fewer top-5 errors than the runner-up.`,
          `**Context:** Human top-5 error is roughly 5%, so AlexNet closed a substantial part of the gap in one step.`,
        ],
        takeaway: `Benchmark results are easiest to judge as relative error reductions against the strongest competitor, not as raw numbers alone.`,
      },
    },
  },
  2: {
    1: {
      qa: [
        {
          question: `Is a thermostat an agent?`,
          answer: `Yes. Under AIMA's definition, anything that perceives its environment through sensors and acts on it through actuators is an agent. A thermostat senses temperature, its program decides whether to switch the heater on or off, and the heater is the actuator. It is a very simple agent with a very simple agent function.

The broad definition is intentional. It lets one framework describe humans, robots, and web search systems, so their designs can be compared on equal terms.`,
        },
        {
          question: `Why does the agent function depend on percept sequences instead of the current percept?`,
          answer: `The best action can depend on history. In the two-square vacuum world, suppose the vacuum perceives [A, Clean]. That single percept cannot tell it whether square B is dirty. If the earlier percepts showed that it had already cleaned B, the best next move is different from the case where B's status is unknown, even though the current percept is identical.

This is why the domain of the agent function is $\\mathcal{P}^*$, the set of all percept sequences, rather than the set of single percepts. A simple reflex agent deliberately ignores that history.`,
        },
        {
          question: `What is the difference between an agent function and an agent program?`,
          answer: `The **agent function** is the abstract mapping $f: \\mathcal{P}^* \\rightarrow \\mathcal{A}$ from every possible percept sequence to an action. The **agent program** is the code that runs on a specific architecture (sensors plus actuators) and implements that mapping.

The function can be enormous. A lookup table would need one entry for every percept sequence, and the number of sequences grows without bound as time passes. A practical program computes the right action from a compact internal state instead of storing the whole table.`,
        },
      ],
      workedExample: {
        title: 'How fast the agent function table grows',
        scenario: `A two-square vacuum world produces four possible percepts: [A, Clean], [A, Dirty], [B, Clean], and [B, Dirty]. A lookup-table agent function must assign an action to every sequence of percepts of each length.`,
        walkthrough: [
          `**Length 1:** There are $4^1 = 4$ percept sequences, so the table needs 4 entries.`,
          `**Length 2:** There are $4^2 = 16$ sequences, one for each pair of percepts.`,
          `**Length 10:** There are $4^{10} = 1{,}048{,}576$ sequences, so a table for only ten time steps already has over a million rows.`,
          `**Program alternative:** A rule such as "if dirty then suck, otherwise move to the other square" computes an action from the current percept alone. It is compact, but it covers only the history-independent part of the function.`,
        ],
        takeaway: `The agent function is defined over all histories, which grow exponentially, so practical agents must compress the function into a program with internal state.`,
      },
    },

    2: {
      qa: [
        {
          question: `Does rationality require omniscience?`,
          answer: `No. An omniscient agent would know the actual outcome of every action in advance, which is impossible in general. Rationality is defined with respect to **expected** performance, given the percept sequence and the agent's built-in knowledge.

Consider crossing a street. An agent that looks both ways and crosses when the road appears clear is rational, even though a car might unexpectedly speed up. An agent that crosses with its eyes closed is not, because it ignored information it could have obtained cheaply.`,
        },
        {
          question: `Why shouldn't the performance measure reward the vacuum for running its motor?`,
          answer: `Because a performance measure that rewards behavior is optimized by behavior, not by results. If the vacuum earns a point for each motor action, the best strategy is to keep moving, whether or not anything gets cleaned.

If the measure instead rewards each clean square at each time step, the agent is pushed toward the outcome the designer wants: a clean floor. The measure should describe the state of the environment that you care about, and the agent's internal activity should not enter into it.`,
        },
        {
          question: `When is exploration rational?`,
          answer: `Information gathering is rational when the information is expected to improve later decisions enough to justify the short-term cost. An agent that does not know whether a room is dirty may check it first, even though checking yields no cleaning. That choice has value because it changes what the agent does next.

AIMA's point is that rationality is not the same as immediate productivity. An agent that always acts greedily on current information can be irrational when a cheap look would have changed its best choice.`,
        },
      ],
      workedExample: {
        title: 'Two performance measures, two very different winners',
        scenario: `A vacuum runs for 1,000 time steps on a two-square floor that starts dirty. Agent X cleans both squares by step 3 and then stays idle. Agent Y moves back and forth every step but never sucks.`,
        walkthrough: [
          `**Motor-count measure (1 point per motor action):** Agent X scores about 3 (only the actions needed to clean). Agent Y scores 1,000, so Y looks far better.`,
          `**Clean-square measure (1 point per clean square per time step):** Agent X has both squares clean for roughly 997 steps, scoring about $2 \\times 997 \\approx 1{,}990$. Agent Y never cleans, so it scores 0.`,
          `**Verdict:** The motor-count measure ranks the useless agent first, while the clean-square measure ranks the useful one first.`,
        ],
        takeaway: `A performance measure must score the environment outcome, because any reward on the agent's activity will be gamed by the activity itself.`,
      },
    },

    3: {
      qa: [
        {
          question: `Does "fully observable" mean the agent actually sees everything?`,
          answer: `It means the agent's sensors give access to the complete state of the environment at each point in time. Chess is fully observable because the whole board is visible. Poker is partially observable because opponents' cards are hidden.

Observability depends on the sensors as well as the world. A robot whose camera covers only one room is partially observable in a house, even though the house itself contains no hidden state. The question to ask is whether the agent's percepts determine the full state.`,
        },
        {
          question: `Why does it matter whether an environment is sequential?`,
          answer: `In a **sequential** environment, the current decision affects all future decisions. In an **episodic** environment, each perceive-act episode is independent. Chess and taxi navigation are sequential, while inspecting parts on an assembly line is episodic.

Sequential environments need planning and search (Chapters 3, 10, and 11), because a choice that looks locally good can damage later states. Episodic environments can often be handled by a simple rule applied to each episode, which is why they are easier.`,
        },
        {
          question: `Does a chess clock make the environment dynamic?`,
          answer: `AIMA calls this **semidynamic**. The board does not change while the agent deliberates, so the state is static. But the performance score depends on elapsed time, so thinking longer has a cost. A taxi meter works the same way: the road does not change while the taxi waits, but the fare keeps increasing.

The distinction matters because a semidynamic agent must trade deliberation time against decision quality, even though the world is not moving underneath it.`,
        },
      ],
      workedExample: {
        title: 'Classifying an automated taxi on the six dimensions',
        scenario: `An automated taxi drives city streets with passengers, traffic, pedestrians, and changing weather. Each of the six dimensions must be assigned a value.`,
        walkthrough: [
          `**Observable:** Partially. Cars behind buildings and pedestrians stepping out of sight are not visible to the sensors.`,
          `**Agents:** Multi-agent. Other drivers and pedestrians respond to what the taxi does.`,
          `**Deterministic or stochastic:** Stochastic. Sudden braking, mechanical faults, and weather make the next state uncertain.`,
          `**Episodic or sequential:** Sequential. Each route choice affects where the taxi is and what it can do next.`,
          `**Static or dynamic:** Dynamic. Other cars keep moving while the taxi deliberates.`,
          `**Discrete or continuous:** Continuous. Steering angles, speeds, and positions are real-valued.`,
        ],
        takeaway: `The taxi is partially observable, multi-agent, stochastic, sequential, dynamic, and continuous, which is why it requires belief-state tracking, game-aware reasoning, and probabilistic planning together.`,
      },
    },

    4: {
      qa: [
        {
          question: `Why does a simple reflex agent fail in a partially observable environment?`,
          answer: `A simple reflex agent maps the current percept directly to an action. Imagine the vacuum's sensor reports only whether its own square is clean or dirty, with no location. Its rule is "if dirty, suck; otherwise move." When both squares are already clean, every percept is "clean," so it keeps moving between squares forever.

It cannot tell whether the other square is clean, because nothing in its current percept records that. A reflex agent works only when the current percept determines the right action.`,
        },
        {
          question: `What extra knowledge does a model-based agent need?`,
          answer: `A model-based agent keeps an internal state that estimates the parts of the world it cannot currently see. To update that state, it needs two models:

1. **Transition model:** how its own actions change the world (for example, moving right from A leaves the vacuum on B).
2. **Sensor model:** how world states generate percepts (for example, a dirty square produces a "Dirty" percept).

A taxi that loses GPS in a tunnel can use its transition model, which includes its speed and heading, to estimate its position. The state then supports decisions that the current percept alone cannot.`,
        },
        {
          question: `Why does a learning agent need a separate critic?`,
          answer: `The **critic** judges behavior against a fixed performance standard supplied from outside the learner. Without it, the learning element would be judging itself and could drift toward whatever it already does.

The four components divide the work. The **performance element** acts. The **critic** grades the outcome. The **learning element** changes the performance element based on that grade. The **problem generator** proposes exploratory actions that might reveal better strategies. In a chess program, the game result is the critic's standard, and the problem generator might try an unusual opening to learn something new.`,
        },
      ],
      workedExample: {
        title: 'Choosing a taxi route by expected utility',
        scenario: `Three routes are compared with the utility $U = -\\text{minutes} - 200 \\cdot P(\\text{accident})$, where the weight 200 is an assumed cost of an accident measured in minutes. Highway: 12 minutes, accident probability 0.01. Side street: 18 minutes, accident probability 0.001. Shortcut: 14 minutes, accident probability 0.05.`,
        walkthrough: [
          `**Highway:** $U = -12 - 200 \\times 0.01 = -14$.`,
          `**Side street:** $U = -18 - 200 \\times 0.001 = -18.2$.`,
          `**Shortcut:** $U = -14 - 200 \\times 0.05 = -24$.`,
          `**Decision:** The highway has the highest utility, $-14$, so the taxi takes it, accepting a small accident risk for a faster trip.`,
        ],
        takeaway: `A utility-based agent resolves trade-offs between goals such as time and safety by putting them on one scale and maximizing the expected total.`,
      },
    },
  },
};
