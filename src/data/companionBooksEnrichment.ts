// ============================================================================
// COMPANION BOOK ENRICHMENTS & MULTI-PERSPECTIVE ACADEMIC BRIDGES
// Connects Russell & Norvig (AIMA) with:
// 1. Goodfellow, Bengio, Courville: Deep Learning (MIT Press)
// 2. Jurafsky & Martin: Speech and Language Processing (3rd Edition)
// 3. Sebastian Raschka: Machine Learning with PyTorch and Scikit-Learn
// 4. Aurélien Géron: Hands-On Machine Learning with Scikit-Learn, Keras & TF
// 5. Sebastian Raschka: Build a Large Language Model (From Scratch)
// 6. Chip Huyen: Designing Machine Learning Systems (O'Reilly)
// ============================================================================

export interface CompanionInsight {
  bookKey: 'aima' | 'goodfellow' | 'jurafsky' | 'raschka_pytorch' | 'geron' | 'raschka_llm' | 'chiphuyen';
  bookTitle: string;
  authors: string;
  pdfUrl: string;
  targetPage: number;
  badge: string;
  insightTitle: string;
  conceptualBridge: string;
  coreMathOrCode: string;
  whyItMatters: string;
}

export interface ChapterCompanionData {
  theme: string;
  primaryHighlight: {
    bookTitle: string;
    quoteOrPrinciple: string;
    page: number;
    pdfUrl: string;
    explanation: string;
  };
  companionInsights: CompanionInsight[];
}

export const COMPANION_ENRICHMENTS: Record<number, ChapterCompanionData> = {
  // CHAPTER 1: What is AI?
  1: {
    theme: "Rational Agents vs. Deep Neural Representation",
    primaryHighlight: {
      bookTitle: "Deep Learning (Goodfellow, Bengio, Courville — MIT Press)",
      quoteOrPrinciple: "The AI paradox: Tasks that are challenging for humans (like chess or formal logic) are straightforward for computers, while tasks that are effortless for humans (like recognizing a face in a photo) are difficult for formal logic.",
      page: 1,
      pdfUrl: "/library/deep-learning.pdf",
      explanation: "Goodfellow highlights why AIMA's classic rational agent paradigm required a revolution: symbolic logic struggled with raw perceptual signals. Deep learning resolved this by learning hierarchical representations directly from high-dimensional sensor data."
    },
    companionInsights: [
      {
        bookKey: 'goodfellow',
        bookTitle: "Deep Learning",
        authors: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
        pdfUrl: "/library/deep-learning.pdf",
        targetPage: 15,
        badge: "Continuous Representation",
        insightTitle: "From Symbolic Rules to Continuous Feature Hierarchies",
        conceptualBridge: "While Russell & Norvig define intelligence through rational decision boundaries and utility functions, Goodfellow explains that true AI requires solving the central challenge of representation learning: transforming messy, noisy raw pixels and audio into disentangled latent factors of variation.",
        coreMathOrCode: "y = f(x; θ) = f^(L)(f^(L-1)(...f^(1)(x)...))",
        whyItMatters: "Beginners often assume AI is either entirely hardcoded logic or entirely black-box magic. Seeing how symbolic rationality and continuous representation learning complement each other gives you the unified modern worldview."
      },
      {
        bookKey: 'chiphuyen',
        bookTitle: "Designing Machine Learning Systems",
        authors: "Chip Huyen (O'Reilly)",
        pdfUrl: "/library/designing-ml-systems.pdf",
        targetPage: 18,
        badge: "Production Reality",
        insightTitle: "When NOT to Use Machine Learning for Rational Agents",
        conceptualBridge: "Chip Huyen bridges AIMA's definition of an agent with real-world industry economics: an agent should only use statistical learning when rules cannot be cleanly hand-engineered, data changes dynamically, or the problem scale exceeds human heuristic programming.",
        coreMathOrCode: "ROI = Value(Learned Agent) - Cost(Compute, Latency, Data Drift)",
        whyItMatters: "In academic courses, students are tempted to throw massive deep networks at simple problems. Huyen reminds us that an AIMA reflex agent with 5 if-statements often beats a GPU cluster in production cost and reliability."
      }
    ]
  },

  // CHAPTER 2: Intelligent Agents (PEAS & Environments)
  2: {
    theme: "Environment Modeling & Feature Engineering Under Uncertainty",
    primaryHighlight: {
      bookTitle: "Designing Machine Learning Systems (Chip Huyen)",
      quoteOrPrinciple: "A machine learning system is never just the algorithm; it is a live feedback loop between sensors, pipelines, inferences, and environmental feedback.",
      page: 35,
      pdfUrl: "/library/designing-ml-systems.pdf",
      explanation: "AIMA formalizes environments as PEAS (Performance, Environment, Actuators, Sensors). Chip Huyen demonstrates how production ML environments violate textbook assumptions through feedback loops, data shift, and delayed rewards."
    },
    companionInsights: [
      {
        bookKey: 'chiphuyen',
        bookTitle: "Designing Machine Learning Systems",
        authors: "Chip Huyen",
        pdfUrl: "/library/designing-ml-systems.pdf",
        targetPage: 42,
        badge: "Feedback Loops",
        insightTitle: "Degenerate Feedback Loops in Actuator Outputs",
        conceptualBridge: "When an agent acts in an environment (AIMA's Actuators), its actions alter future sensor readings. For example, a recommendation agent showing only popular articles prevents the system from ever learning user interest in niche topics—a feedback loop absent in static test sets.",
        coreMathOrCode: "D_train(t+1) = f(D_train(t), Actuators(Agent(Sensors(t))))",
        whyItMatters: "Understanding that agents shape their own training data prevents naive deployment failures where models collapse into self-fulfilling biases."
      },
      {
        bookKey: 'geron',
        bookTitle: "Hands-On Machine Learning with Scikit-Learn & TensorFlow",
        authors: "Aurélien Géron",
        pdfUrl: "/library/hands-on-ml.pdf",
        targetPage: 38,
        badge: "End-to-End Workflow",
        insightTitle: "Mapping AIMA's Sensors to Scikit-Learn Transformation Pipelines",
        conceptualBridge: "Géron operationalizes AIMA's concept of 'Sensors and Percept Sequences' into code: raw percepts must pass through automated missing-value imputation, categorical one-hot encoding, and standard scaling before the agent's decision logic can evaluate them.",
        coreMathOrCode: "pipeline = Pipeline([('imputer', SimpleImputer()), ('scaler', StandardScaler())])",
        whyItMatters: "Translates abstract textbook diagrams of sensors into concrete, production-ready Python pipelines."
      }
    ]
  },

  // CHAPTER 3: Search (State Spaces & A*)
  3: {
    theme: "Combinatorial Graph Search vs. Continuous Optimization",
    primaryHighlight: {
      bookTitle: "Deep Learning (Goodfellow, Bengio, Courville)",
      quoteOrPrinciple: "In discrete search spaces, we jump between states across edges. In continuous optimization, we take infinitesimal steps along the gradient vector.",
      page: 80,
      pdfUrl: "/library/deep-learning.pdf",
      explanation: "Goodfellow connects AIMA's graph search (A*) to continuous gradient descent: both algorithms seek an optimal state that minimizes cost, but continuous spaces eliminate combinatorial explosion by leveraging local slope information."
    },
    companionInsights: [
      {
        bookKey: 'goodfellow',
        bookTitle: "Deep Learning",
        authors: "Ian Goodfellow et al.",
        pdfUrl: "/library/deep-learning.pdf",
        targetPage: 86,
        badge: "Search Dual",
        insightTitle: "Gradient Descent as Continuous A* Search",
        conceptualBridge: "In AIMA, A* expands frontier nodes using f(n) = g(n) + h(n). In deep learning, parameter search does not explore a queue of discrete configurations; instead, the negative gradient -∇_θ L(θ) points directly along the steepest descent path toward the minimum cost goal.",
        coreMathOrCode: "θ_(t+1) = θ_t - η · ∇_θ L(θ_t)  [cf. discrete: pop min f(n)]",
        whyItMatters: "Helps beginners realize that all AI is fundamentally cost minimization—either over combinatorial graphs (discrete search) or parameter surfaces (continuous optimization)."
      },
      {
        bookKey: 'raschka_pytorch',
        bookTitle: "Machine Learning with PyTorch and Scikit-Learn",
        authors: "Sebastian Raschka & Vahid Mirjalili",
        pdfUrl: "/library/pytorch-scikit-learn.pdf",
        targetPage: 45,
        badge: "Practical Algorithms",
        insightTitle: "Hyperparameter Search as A* in Model Configuration Space",
        conceptualBridge: "Raschka demonstrates that choosing neural network architectures, learning rates, and regularization strengths is itself a graph search problem: Grid Search is Breadth-First Search, while Bayesian Optimization is Informed Heuristic Search.",
        coreMathOrCode: "from sklearn.model_selection import GridSearchCV, RandomizedSearchCV",
        whyItMatters: "Shows how classic AIMA search strategies are actively used every day to train state-of-the-art machine learning models."
      }
    ]
  },

  // CHAPTER 4: Beyond Classical Search (Local Search, Genetic, Stochastic)
  4: {
    theme: "Simulated Annealing & Stochastic Optimization",
    primaryHighlight: {
      bookTitle: "Hands-On Machine Learning (Aurélien Géron)",
      quoteOrPrinciple: "Escaping local minima requires stochastic noise: temperature schedules in simulated annealing and mini-batch sampling in SGD serve the exact same mathematical purpose.",
      page: 115,
      pdfUrl: "/library/hands-on-ml.pdf",
      explanation: "Géron highlights that the random kicks in AIMA's Simulated Annealing (cooling temperature T) mirror the stochastic noise of mini-batch gradient descent, enabling algorithms to bounce out of local traps."
    },
    companionInsights: [
      {
        bookKey: 'goodfellow',
        bookTitle: "Deep Learning",
        authors: "Goodfellow, Bengio, Courville",
        pdfUrl: "/library/deep-learning.pdf",
        targetPage: 280,
        badge: "Loss Landscapes",
        insightTitle: "Saddle Points vs. Local Minima in High Dimensions",
        conceptualBridge: "AIMA teaches hill-climbing on 2D surfaces where local maxima trap greedy agents. Goodfellow proves that in 10,000,000-dimensional neural networks, local minima are rare; almost all critical points with zero gradient are saddle points (escape directions exist in high dimensions!).",
        coreMathOrCode: "det(Hessian H) < 0  ⟹  Eigenvalues have mixed signs (Saddle Point)",
        whyItMatters: "Updates 1990s intuition: high dimensionality actually helps optimization escape traps rather than making them worse!"
      }
    ]
  },

  // CHAPTER 5: Adversarial Search & Games
  5: {
    theme: "From Minimax Trees to Deep Monte Carlo Tree Search (AlphaZero)",
    primaryHighlight: {
      bookTitle: "Deep Learning (Goodfellow, Bengio, Courville)",
      quoteOrPrinciple: "When game trees are too vast for complete minimax exploration (b^d > 10^120), neural networks replace hand-crafted heuristic evaluation functions.",
      page: 450,
      pdfUrl: "/library/deep-learning.pdf",
      explanation: "AIMA introduces Minimax with alpha-beta pruning and heuristic evaluation functions h(s). Modern breakthroughs like AlphaGo and AlphaZero combine MCTS with deep policy networks (selecting promising actions) and value networks (evaluating terminal probabilities)."
    },
    companionInsights: [
      {
        bookKey: 'goodfellow',
        bookTitle: "Deep Learning",
        authors: "Goodfellow et al.",
        pdfUrl: "/library/deep-learning.pdf",
        targetPage: 455,
        badge: "Deep MCTS",
        insightTitle: "Replacing Hand-Crafted Evaluation with Value Networks",
        conceptualBridge: "AIMA's Shannon-style chess engines relied on expert rules: Count(Pieces) + PositionalWeights. Goodfellow explains how deep reinforcement learning trains a value network v_θ(s) ≈ V*(s) that predicts win probability directly from raw board configurations without human bias.",
        coreMathOrCode: "v_θ(s) = P(Win | State s, optimal play)",
        whyItMatters: "Connects classic search trees to modern superhuman game engines."
      }
    ]
  },

  // CHAPTER 7: Logical Agents & Knowledge Bases
  7: {
    theme: "Deductive Proofs vs. Probabilistic Soft Logic",
    primaryHighlight: {
      bookTitle: "Speech and Language Processing (Jurafsky & Martin)",
      quoteOrPrinciple: "Natural language is rife with ambiguity, metaphor, and context that shatter brittle propositional logic rules. Modern systems ground logic in dense vector representations.",
      page: 380,
      pdfUrl: "/library/speech-and-language-processing.pdf",
      explanation: "Jurafsky & Martin explain how formal logic and natural language connect: First-Order Logic serves as semantic representations, but modern NLP bridges the gap using contextual embeddings and knowledge graph vectors."
    },
    companionInsights: [
      {
        bookKey: 'jurafsky',
        bookTitle: "Speech and Language Processing",
        authors: "Daniel Jurafsky & James H. Martin",
        pdfUrl: "/library/speech-and-language-processing.pdf",
        targetPage: 385,
        badge: "Semantic Representation",
        insightTitle: "First-Order Logic as Meaning Representations for Text",
        conceptualBridge: "AIMA introduces Knowledge Bases (KB) and entailment (KB ⊨ α). Jurafsky shows how spoken queries like 'Find flights from Boston to Denver' are parsed into lambda-calculus formulas and executed against relational databases.",
        coreMathOrCode: "λx. Flight(x) ∧ From(x, Boston) ∧ To(x, Denver)",
        whyItMatters: "Shows the real-world engineering pipeline of how voice assistants turn spoken audio into executable logic."
      }
    ]
  },

  // CHAPTER 13: Quantifying Uncertainty (Probability & Bayes)
  13: {
    theme: "Bayesian Reasoning in Practice",
    primaryHighlight: {
      bookTitle: "Hands-On Machine Learning (Aurélien Géron)",
      quoteOrPrinciple: "Bayesian classifiers calculate the exact posterior probability P(Class | Features) using class priors and conditional feature distributions.",
      page: 180,
      pdfUrl: "/library/hands-on-ml.pdf",
      explanation: "Géron operationalizes AIMA's Chapter 13 probability foundations into Scikit-Learn's Naive Bayes and logistic sigmoid classification, illustrating the impact of base rate fallacies."
    },
    companionInsights: [
      {
        bookKey: 'geron',
        bookTitle: "Hands-On Machine Learning",
        authors: "Aurélien Géron",
        pdfUrl: "/library/hands-on-ml.pdf",
        targetPage: 184,
        badge: "Classification",
        insightTitle: "Naive Bayes: Conditional Independence in Practice",
        conceptualBridge: "AIMA derives Bayes' Rule: P(A|B) = P(B|A)P(A)/P(B). Géron shows how assuming features are mutually independent given the class label transforms an intractable joint probability table into a fast linear product.",
        coreMathOrCode: "P(C_k | x) ∝ P(C_k) ∏_(i=1)^D P(x_i | C_k)",
        whyItMatters: "Essential for spam filtering, medical diagnostics, and baseline NLP."
      }
    ]
  },

  // CHAPTER 15: Temporal Models & HMMs
  15: {
    theme: "Sequential Inference from Speech to Time-Series",
    primaryHighlight: {
      bookTitle: "Speech and Language Processing (Jurafsky & Martin)",
      quoteOrPrinciple: "The Viterbi algorithm is the foundational dynamic programming backbone that transformed speech recognition and biological sequence analysis.",
      page: 195,
      pdfUrl: "/library/speech-and-language-processing.pdf",
      explanation: "Jurafsky & Martin dedicate extensive treatment to Hidden Markov Models, showing how speech audio frames are mapped to hidden phoneme states using the Forward-Backward and Viterbi algorithms."
    },
    companionInsights: [
      {
        bookKey: 'jurafsky',
        bookTitle: "Speech and Language Processing",
        authors: "Jurafsky & Martin",
        pdfUrl: "/library/speech-and-language-processing.pdf",
        targetPage: 202,
        badge: "Dynamic Programming",
        insightTitle: "The Viterbi Trellis for Acoustic & Part-of-Speech Tagging",
        conceptualBridge: "AIMA formulates temporal filtering as recursive belief updates. Jurafsky expands this into the Viterbi trellis: storing backpointers at each time step to recover the globally optimal sequence of hidden states in O(T · |S|²) time.",
        coreMathOrCode: "v_t(j) = max_i [ v_(t-1)(i) · a_(ij) ] · b_j(o_t)",
        whyItMatters: "Proves that dynamic programming makes reasoning over long time horizons computationally tractable."
      }
    ]
  },

  // CHAPTER 18: Learning from Examples (Supervised Learning)
  18: {
    theme: "From Decision Trees to Ensembles and Gradient Boosting",
    primaryHighlight: {
      bookTitle: "Machine Learning with PyTorch and Scikit-Learn (Sebastian Raschka)",
      quoteOrPrinciple: "A single decision tree easily overfits; forest ensembles aggregate orthogonal decision boundaries to achieve remarkable generalization.",
      page: 72,
      pdfUrl: "/library/pytorch-scikit-learn.pdf",
      explanation: "Raschka expands AIMA's basic ID3/C4.5 decision trees into modern Random Forests and XGBoost, explaining variance reduction through bagging and residual fitting through boosting."
    },
    companionInsights: [
      {
        bookKey: 'raschka_pytorch',
        bookTitle: "Machine Learning with PyTorch and Scikit-Learn",
        authors: "Sebastian Raschka & Vahid Mirjalili",
        pdfUrl: "/library/pytorch-scikit-learn.pdf",
        targetPage: 78,
        badge: "Ensemble Theory",
        insightTitle: "Information Gain, Gini Impurity, and Bias-Variance Tradeoff",
        conceptualBridge: "AIMA introduces entropy and Information Gain for tree splitting. Raschka explains the practical difference between Gini impurity and Shannon entropy in Scikit-Learn, and how Random Forests reduce variance by decorrelating trees with bootstrap aggregating.",
        coreMathOrCode: "Gini(p) = 1 - ∑_(i=1)^C (p_i)²,  Entropy(p) = -∑_(i=1)^C p_i log_2(p_i)",
        whyItMatters: "Tree ensembles remain the #1 winning algorithm for tabular data in competitive data science and industry."
      }
    ]
  },

  // CHAPTER 19: Deep Learning & Neural Networks
  19: {
    theme: "Backpropagation, Computation Graphs, and Optimizers",
    primaryHighlight: {
      bookTitle: "Deep Learning (Goodfellow, Bengio, Courville)",
      quoteOrPrinciple: "The backpropagation algorithm is not a learning algorithm; it is simply an efficient method for computing the gradient of a composite function via the chain rule of calculus.",
      page: 200,
      pdfUrl: "/library/deep-learning.pdf",
      explanation: "Goodfellow provides the definitive mathematical derivation of backpropagation over arbitrary directed acyclic computation graphs, laying the foundation for modern PyTorch and JAX autograd."
    },
    companionInsights: [
      {
        bookKey: 'goodfellow',
        bookTitle: "Deep Learning",
        authors: "Goodfellow, Bengio, Courville",
        pdfUrl: "/library/deep-learning.pdf",
        targetPage: 205,
        badge: "Autograd Foundations",
        insightTitle: "Reverse-Mode Automatic Differentiation on Computation Graphs",
        conceptualBridge: "AIMA presents backpropagation as layer-by-layer weight updates. Goodfellow generalizes this to reverse-mode automatic differentiation: traversing the directed acyclic graph in reverse topological order, storing node Jacobians to compute exact gradients in O(Operations) time.",
        coreMathOrCode: "∂L/∂x_i = ∑_(j ∈ Children(i)) (∂L/∂x_j) · (∂x_j/∂x_i)",
        whyItMatters: "Demystifies PyTorch's `loss.backward()` so you understand how modern deep learning frameworks actually calculate gradients."
      },
      {
        bookKey: 'raschka_llm',
        bookTitle: "Build a Large Language Model (From Scratch)",
        authors: "Sebastian Raschka (Manning)",
        pdfUrl: "/library/build-llms-from-scratch.pdf",
        targetPage: 32,
        badge: "Hands-On PyTorch",
        insightTitle: "Building Neural Layers from Scratch with PyTorch Tensors",
        conceptualBridge: "Raschka takes the math of forward activations and backprop and writes raw Python classes: defining parameter weights, bias tensors, matrix multiplication `@`, and nonlinear GELU/ReLU activations without high-level library abstractions.",
        coreMathOrCode: "class MultiHeadAttention(nn.Module): def forward(self, x): ...",
        whyItMatters: "Takes students from abstract mathematical equations to working, executable code that actually runs on their laptop."
      }
    ]
  },

  // CHAPTER 21: Reinforcement Learning
  21: {
    theme: "Bellman Equations, Temporal Difference, and Policy Gradients",
    primaryHighlight: {
      bookTitle: "Hands-On Machine Learning (Aurélien Géron)",
      quoteOrPrinciple: "In Deep Q-Learning, the agent uses a neural network to estimate Q*(s, a), stabilizing training through an experience replay buffer and a slowly updated target network.",
      page: 610,
      pdfUrl: "/library/hands-on-ml.pdf",
      explanation: "Géron demonstrates how classic tabular Q-learning from AIMA scaled to superhuman Atari gameplay by introducing deep neural function approximations and breaking temporal correlation through replay buffers."
    },
    companionInsights: [
      {
        bookKey: 'geron',
        bookTitle: "Hands-On Machine Learning",
        authors: "Aurélien Géron",
        pdfUrl: "/library/hands-on-ml.pdf",
        targetPage: 618,
        badge: "DQN Architecture",
        insightTitle: "Overcoming Divergence: Experience Replay & Target Networks",
        conceptualBridge: "AIMA notes that naive Q-learning with function approximation can diverge. Géron explains DeepMind's two architectural remedies: (1) Replay Memory (storing (s, a, r, s') tuples to train on independent batches) and (2) Target Network Q_target with frozen weights to prevent moving target oscillations.",
        coreMathOrCode: "Loss = (r + γ · max_a' Q_target(s', a') - Q_online(s, a))²",
        whyItMatters: "Critical for understanding why standard supervised learning techniques fail in dynamic interactive environments without memory replay."
      }
    ]
  },

  // CHAPTER 22 & 23: Natural Language Processing & Transformers
  23: {
    theme: "Self-Attention, Transformer Architecture, and LLMs",
    primaryHighlight: {
      bookTitle: "Build a Large Language Model (From Scratch) — Sebastian Raschka",
      quoteOrPrinciple: "Self-attention allows every token in a sentence to dynamically weigh and attend to every other token, capturing long-range semantic context without recurrence or vanishing gradients.",
      page: 55,
      pdfUrl: "/library/build-llms-from-scratch.pdf",
      explanation: "Raschka demystifies the exact mechanics of Scaled Dot-Product Attention: Query, Key, and Value matrices, causal masking for generative autoregression, and multi-head projection."
    },
    companionInsights: [
      {
        bookKey: 'raschka_llm',
        bookTitle: "Build a Large Language Model (From Scratch)",
        authors: "Sebastian Raschka",
        pdfUrl: "/library/build-llms-from-scratch.pdf",
        targetPage: 64,
        badge: "Attention Mechanism",
        insightTitle: "Dissecting Scaled Dot-Product Attention (Q, K, V)",
        conceptualBridge: "AIMA outlines sequence models. Raschka explains the exact vector math of modern LLMs: multiplying Queries by Keys transposed, scaling by √d_k, applying causal softmax masking to prevent looking into the future, and multiplying by Values.",
        coreMathOrCode: "Attention(Q, K, V) = softmax((Q · K^T) / √d_k + Mask) · V",
        whyItMatters: "This single mathematical formula powers ChatGPT, Claude, Gemini, and all modern generative AI."
      },
      {
        bookKey: 'jurafsky',
        bookTitle: "Speech and Language Processing",
        authors: "Daniel Jurafsky & James H. Martin",
        pdfUrl: "/library/speech-and-language-processing.pdf",
        targetPage: 215,
        badge: "Tokenization",
        insightTitle: "Byte-Pair Encoding (BPE) & Contextual Embeddings",
        conceptualBridge: "Before an LLM can calculate attention, raw human text must be tokenized into subword tokens. Jurafsky explains BPE compression and shows how word embeddings evolved from static vectors (Word2Vec) to dynamic contextual representations.",
        coreMathOrCode: "Vocab_size = 50,257 (GPT-2/3 standard BPE vocabulary)",
        whyItMatters: "Eliminates Out-Of-Vocabulary (OOV) errors and explains why LLMs struggle with character-level spelling tasks."
      }
    ]
  }
};

/**
 * Returns companion textbook insights for a given chapter, falling back to canonical defaults.
 */
export function getCompanionData(chapterId: number): ChapterCompanionData {
  if (COMPANION_ENRICHMENTS[chapterId]) {
    return COMPANION_ENRICHMENTS[chapterId];
  }

  // Smart fallback matching the 7 Parts of AIMA
  if (chapterId >= 1 && chapterId <= 2) {
    return COMPANION_ENRICHMENTS[1];
  } else if (chapterId >= 3 && chapterId <= 6) {
    return COMPANION_ENRICHMENTS[3];
  } else if (chapterId >= 7 && chapterId <= 12) {
    return COMPANION_ENRICHMENTS[7];
  } else if (chapterId >= 13 && chapterId <= 17) {
    return COMPANION_ENRICHMENTS[13];
  } else if (chapterId >= 18 && chapterId <= 21) {
    return COMPANION_ENRICHMENTS[19];
  } else if (chapterId >= 22 && chapterId <= 25) {
    return COMPANION_ENRICHMENTS[23];
  } else {
    return COMPANION_ENRICHMENTS[2];
  }
}
