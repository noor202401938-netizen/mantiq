import React, { useState } from 'react';
import { Play, ArrowLeft, ArrowRight, RotateCcw, CheckCircle2, BookOpen, AlertTriangle, Zap, Sliders, ShieldAlert, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

interface InteractiveLabViewProps {
  onStartQuiz: () => void;
  onBackToLearn: () => void;
}

export const InteractiveLabView: React.FC<InteractiveLabViewProps> = ({
  onStartQuiz,
  onBackToLearn
}) => {
  // Main Lab Tab: Search Visualizer vs Counter-Example Workshop
  const [labSection, setLabSection] = useState<'visualizer' | 'counter_examples'>('visualizer');

  // Search Visualizer State
  const [mode, setMode] = useState<'BFS' | 'DFS'>('BFS');
  const [currentStep, setCurrentStep] = useState<number>(4);
  const totalSteps = 7;

  // Counter-Example Workshop State
  const [activeChallenge, setActiveChallenge] = useState<'greedy_trap' | 'inadmissible_trap' | 'alphabeta_ordering'>('greedy_trap');
  const [greedyStep, setGreedyStep] = useState<number>(1);
  const [inadmissibleOverestimate, setInadmissibleOverestimate] = useState<number>(18);
  const [alphaBetaOrdering, setAlphaBetaOrdering] = useState<'optimal' | 'worst'>('optimal');

  // BFS / DFS Tree Nodes
  const nodes = [
    { id: 'A', x: 250, y: 50, depth: 0, expandedStep: 1 },
    { id: 'B', x: 150, y: 130, depth: 1, expandedStep: 2 },
    { id: 'C', x: 350, y: 130, depth: 1, expandedStep: 3 },
    { id: 'D', x: 100, y: 210, depth: 2, expandedStep: 4 },
    { id: 'E', x: 200, y: 210, depth: 2, expandedStep: 5 },
    { id: 'F', x: 300, y: 210, depth: 2, expandedStep: 6 },
    { id: 'G', x: 400, y: 210, depth: 2, expandedStep: 7 }
  ];

  const edges = [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'B', to: 'E' },
    { from: 'C', to: 'F' },
    { from: 'C', to: 'G' }
  ];

  const handleNextStep = () => {
    soundFX.playClick();
    if (currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    soundFX.playClick();
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="quest-lab-flow">
      {/* View Header */}
      <div className="quest-view-header">
        <div>
          <div className="quest-greeting-sub">CHAPTER 3 & 4 · ALGORITHM LABORATORY</div>
          <h1 className="quest-view-title">
            {labSection === 'visualizer'
              ? (mode === 'BFS' ? 'Breadth-First Search (FIFO)' : 'Depth-First Search (LIFO)')
              : 'Counter-Example Lab: Break the Algorithm'}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="quest-btn-outline"
            style={{ padding: '8px 18px', fontSize: '14px' }}
            onClick={onBackToLearn}
          >
            ← Chapters
          </button>
        </div>
      </div>

      {/* Top Section Nav: Standard Visualizer vs Counter-Example Workshop */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => {
            soundFX.playClick();
            setLabSection('visualizer');
          }}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            background: labSection === 'visualizer' ? '#13211C' : '#FFFFFF',
            color: labSection === 'visualizer' ? '#C9F26B' : 'var(--quest-text-primary)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            transition: 'all 0.15s ease'
          }}
        >
          Search Tree Visualizer
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setLabSection('counter_examples');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            background: labSection === 'counter_examples' ? '#13211C' : '#FFFFFF',
            color: labSection === 'counter_examples' ? '#C9F26B' : 'var(--quest-text-primary)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            transition: 'all 0.15s ease'
          }}
        >
          <Zap size={16} />
          Counter-Example Lab (Break the Algorithm)
        </button>
      </div>

      {labSection === 'visualizer' ? (
        /* STANDARD BFS/DFS TREE VISUALIZER */
        <div className="quest-lab-layout">
          {/* Main Tree Visualizer Card */}
          <div className="quest-lab-main-card">
            {/* Mode Switcher (BFS / DFS) */}
            <div className="quest-mode-toggle">
              <button
                className={`quest-mode-btn ${mode === 'BFS' ? 'active' : ''}`}
                onClick={() => {
                  soundFX.playClick();
                  setMode('BFS');
                  setCurrentStep(4);
                }}
              >
                BFS (Level-Order)
              </button>
              <button
                className={`quest-mode-btn ${mode === 'DFS' ? 'active' : ''}`}
                onClick={() => {
                  soundFX.playClick();
                  setMode('DFS');
                  setCurrentStep(3);
                }}
              >
                DFS (Deep-Branch)
              </button>
            </div>

            {/* Interactive Tree Canvas */}
            <div className="quest-tree-canvas-box">
              <svg width="500" height="280" viewBox="0 0 500 280">
                {/* Edges */}
                {edges.map((edge, idx) => {
                  const source = nodes.find((n) => n.id === edge.from)!;
                  const target = nodes.find((n) => n.id === edge.to)!;
                  const isTargetExpanded = target.expandedStep <= currentStep;

                  return (
                    <line
                      key={idx}
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isTargetExpanded ? '#13211C' : '#CBD5CD'}
                      strokeWidth={isTargetExpanded ? 3 : 2}
                    />
                  );
                })}

                {/* Nodes */}
                {nodes.map((node) => {
                  const isExpanded = node.expandedStep <= currentStep;
                  const isCurrentActive = node.expandedStep === currentStep;

                  return (
                    <g key={node.id} style={{ cursor: 'pointer' }} onClick={() => setCurrentStep(node.expandedStep)}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isCurrentActive ? 22 : 19}
                        fill={isExpanded ? '#C9F26B' : '#FFFFFF'}
                        stroke="#13211C"
                        strokeWidth={isCurrentActive ? 3.5 : 2}
                        style={{ transition: 'all 0.25s ease' }}
                      />
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        fill="#13211C"
                        fontSize="14"
                        fontWeight="800"
                        fontFamily="Bricolage Grotesque, sans-serif"
                      >
                        {node.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Educational Caption */}
            <div style={{ fontSize: '15px', lineHeight: 1.5, color: 'var(--quest-text-primary)' }}>
              {mode === 'BFS' ? (
                <>
                  <strong>BFS expands the shallowest unexpanded node first</strong>, keeping the frontier in a FIFO queue. Every node at depth {Math.min(2, Math.floor(currentStep / 2))} is expanded before any deeper nodes.
                </>
              ) : (
                <>
                  <strong>DFS expands the deepest unexpanded node first</strong>, plunging along one branch until reaching the maximum search depth before backtracking.
                </>
              )}
            </div>

            {/* Stepping Controls */}
            <div className="quest-step-controls">
              <button
                className="quest-btn-outline"
                onClick={handlePrevStep}
                disabled={currentStep <= 1}
                style={{ opacity: currentStep <= 1 ? 0.4 : 1 }}
              >
                Back
              </button>

              <span style={{ fontFamily: 'var(--quest-font-heading)', fontSize: '16px', fontWeight: 800 }}>
                Step {currentStep} / {totalSteps}
              </span>

              <button
                className="quest-btn-lime"
                onClick={handleNextStep}
                disabled={currentStep >= totalSteps}
                style={{ opacity: currentStep >= totalSteps ? 0.4 : 1 }}
              >
                Next step
              </button>
            </div>

            {/* Trigger Chapter Quiz */}
            <button
              className="quest-btn-lime"
              style={{ width: '100%', minHeight: '52px', marginTop: '12px', fontSize: '16px' }}
              onClick={() => {
                soundFX.playClick();
                onStartQuiz();
              }}
            >
              Start the quiz
            </button>
          </div>

          {/* Right Sidebar Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="quest-stat-card">
              <div className="quest-stat-card-title">Chapter 3 Syllabus</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '10px 14px', borderRadius: '12px', fontSize: '14px', color: 'var(--quest-text-muted)' }}>
                  3.1 Problem-solving agents
                </div>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    background: 'var(--quest-card-dark)',
                    color: 'var(--quest-accent)',
                    fontWeight: 700
                  }}
                >
                  3.4 Uninformed search
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '12px', fontSize: '14px', color: 'var(--quest-text-muted)' }}>
                  3.5 Informed search
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '12px', fontSize: '14px', color: 'var(--quest-text-muted)' }}>
                  3.6 Heuristic functions
                </div>
              </div>
            </div>

            <div className="quest-stat-card" style={{ background: '#EAF6C9', borderColor: '#C9F26B' }}>
              <div className="quest-stat-card-title" style={{ color: '#13211C' }}>
                Key takeaway
              </div>
              <div style={{ fontSize: '14px', color: '#13211C', lineHeight: 1.5 }}>
                BFS is optimal when all step costs are equal. Complete on finite state spaces with branching factor <em>b</em> and shallowest goal depth <em>d</em>.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* COUNTER-EXAMPLE CHALLENGE LAB: "BREAK THE ALGORITHM" */
        <div className="quest-lab-layout">
          {/* Main Challenge Card */}
          <div className="quest-lab-main-card">
            {/* Challenge Switcher Pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
              {[
                { id: 'greedy_trap', label: '1. The Greedy Trap' },
                { id: 'inadmissible_trap', label: '2. Inadmissible Trap' },
                { id: 'alphabeta_ordering', label: '3. Alpha-Beta Ordering' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    soundFX.playClick();
                    setActiveChallenge(c.id as any);
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: activeChallenge === c.id ? '2px solid #13211C' : '1px solid var(--quest-border)',
                    background: activeChallenge === c.id ? '#13211C' : '#F8FAF6',
                    color: activeChallenge === c.id ? '#C9F26B' : 'var(--quest-text-primary)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* SCENARIO 1: THE GREEDY TRAP */}
            {activeChallenge === 'greedy_trap' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={18} color="#D97706" />
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#D97706', letterSpacing: '0.04em' }}>
                    FAILURE MODE: GREEDY BEST-FIRST BECOMES BLINDED BY HEURISTICS
                  </span>
                </div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                  Why Greedy Best-First Search is NOT Cost-Optimal
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--quest-text-secondary)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  Greedy Best-First only minimizes remaining estimated distance $h(n)$ and completely ignores accumulated path cost $g(n)$.
                  Watch what happens when the direct-looking path has an astronomical edge cost!
                </p>

                {/* SVG Graph for Greedy Trap */}
                <div className="quest-tree-canvas-box" style={{ background: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid var(--quest-border)' }}>
                  <svg width="480" height="200" viewBox="0 0 480 200">
                    {/* Edges */}
                    {/* S -> A (Tempting but expensive) */}
                    <line x1="60" y1="100" x2="240" y2="40" stroke="#EF4444" strokeWidth="3" />
                    <text x="135" y="60" fill="#DC2626" fontSize="12" fontWeight="800">cost = 90</text>

                    {/* A -> Goal */}
                    <line x1="240" y1="40" x2="420" y2="100" stroke="#EF4444" strokeWidth="3" />
                    <text x="340" y="60" fill="#DC2626" fontSize="12" fontWeight="800">cost = 15</text>

                    {/* S -> B (Optimal highway) */}
                    <line x1="60" y1="100" x2="240" y2="160" stroke="#16A34A" strokeWidth="3" />
                    <text x="135" y="145" fill="#16A34A" fontSize="12" fontWeight="800">cost = 4</text>

                    {/* B -> Goal */}
                    <line x1="240" y1="160" x2="420" y2="100" stroke="#16A34A" strokeWidth="3" />
                    <text x="340" y="145" fill="#16A34A" fontSize="12" fontWeight="800">cost = 6</text>

                    {/* Node S */}
                    <circle cx="60" cy="100" r="22" fill="#13211C" stroke="#13211C" strokeWidth="2" />
                    <text x="60" y="105" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="800">Start</text>

                    {/* Node A (Greedy Trap) */}
                    <circle cx="240" cy="40" r="22" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2.5" />
                    <text x="240" y="45" textAnchor="middle" fill="#991B1B" fontSize="13" fontWeight="800">A</text>
                    <text x="240" y="15" textAnchor="middle" fill="#DC2626" fontSize="11" fontWeight="700">h(A) = 2 (Tempting!)</text>

                    {/* Node B (Optimal) */}
                    <circle cx="240" cy="160" r="22" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2.5" />
                    <text x="240" y="165" textAnchor="middle" fill="#166534" fontSize="13" fontWeight="800">B</text>
                    <text x="240" y="195" textAnchor="middle" fill="#16A34A" fontSize="11" fontWeight="700">h(B) = 12</text>

                    {/* Goal Node */}
                    <circle cx="420" cy="100" r="22" fill="#C9F26B" stroke="#13211C" strokeWidth="2.5" />
                    <text x="420" y="105" textAnchor="middle" fill="#13211C" fontSize="13" fontWeight="800">Goal</text>
                  </svg>
                </div>

                {/* Algorithm Step-Through Comparison */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '16px' }}>
                  <div style={{ background: '#FEF2F2', padding: '14px 16px', borderRadius: '12px', border: '1.5px solid #F87171' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#991B1B', marginBottom: '4px' }}>
                      GREEDY BEST-FIRST EVALUATION:
                    </div>
                    <div style={{ fontSize: '13px', color: '#1F2937', lineHeight: 1.4 }}>
                      • Evaluates: $f(A) = h(A) = 2$ vs $f(B) = h(B) = 12$<br />
                      • Chooses: <strong>Node A</strong> (since $2 &lt; 12$)<br />
                      • <strong>Total Path Cost: 90 + 15 = 105</strong> (Catastrophic!)
                    </div>
                  </div>

                  <div style={{ background: '#F0FDF4', padding: '14px 16px', borderRadius: '12px', border: '1.5px solid #4ADE80' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#166534', marginBottom: '4px' }}>
                      A* SEARCH EVALUATION:
                    </div>
                    <div style={{ fontSize: '13px', color: '#1F2937', lineHeight: 1.4 }}>
                      • $f(A) = g(A) + h(A) = 90 + 2 = 92$<br />
                      • $f(B) = g(B) + h(B) = 4 + 12 = 16$<br />
                      • <strong>Expands Node B first</strong> $\to$ Total Cost: <strong>10</strong> (Optimal!)
                    </div>
                  </div>
                </div>

                <div style={{ background: '#EAF6C9', border: '1px solid #13211C', padding: '12px 16px', borderRadius: '10px', marginTop: '16px', fontSize: '13px', color: '#13211C' }}>
                  <strong>Theoretical Invariant:</strong> Greedy Best-First Search has worst-case time complexity $O(b^m)$ and zero cost guarantees because it discards known accumulated history $g(n)$.
                </div>
              </div>
            )}

            {/* SCENARIO 2: THE INADMISSIBLE HEURISTIC TRAP */}
            {activeChallenge === 'inadmissible_trap' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <ShieldAlert size={18} color="#DC2626" />
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#DC2626', letterSpacing: '0.04em' }}>
                    COUNTER-EXAMPLE: OVERESTIMATING HEURISTIC DESTROYS A* OPTIMALITY
                  </span>
                </div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                  When h(n) &gt; h*(n): A* Discards the True Shortest Path
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--quest-text-secondary)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  A heuristic is admissible if $h(n) \le h^*(n)$. Use the slider below to inflate $h(Node\ C)$ above its true remaining cost ($h^*=8$). Observe how $A^*$ gets tricked into choosing a worse goal state!
                </p>

                {/* Interactive Slider */}
                <div style={{ background: '#F8FAF6', padding: '16px', borderRadius: '12px', border: '1px solid var(--quest-border)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '13.5px', fontWeight: 700, color: '#13211C' }}>
                      Heuristic Estimate h(Node C) (True Cost h* = 8):
                    </label>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: inadmissibleOverestimate > 8 ? '#DC2626' : '#16A34A' }}>
                      h(C) = {inadmissibleOverestimate} {inadmissibleOverestimate > 8 ? '(Inadmissible! Overestimate)' : '(Admissible)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="25"
                    value={inadmissibleOverestimate}
                    onChange={(e) => setInadmissibleOverestimate(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: inadmissibleOverestimate > 8 ? '#DC2626' : '#13211C', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--quest-text-muted)', marginTop: '4px' }}>
                    <span>h(C) = 2 (Underestimate)</span>
                    <span>h*(C) = 8 (Exact True Cost)</span>
                    <span>h(C) = 25 (Severe Overestimate)</span>
                  </div>
                </div>

                {/* Outcome Comparison */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '12px', border: '1px solid var(--quest-border)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--quest-text-muted)' }}>
                      PATH 1: VIA NODE C (TRUE OPTIMAL)
                    </div>
                    <div style={{ fontSize: '14px', color: '#13211C', marginTop: '6px' }}>
                      • Edge cost $g(C) = 3$<br />
                      • $f(C) = g(C) + h(C) = 3 + ${inadmissibleOverestimate} = <strong>{3 + inadmissibleOverestimate}</strong><br />
                      • True remaining cost: $h^*(C) = 8$<br />
                      • True path cost: <strong>3 + 8 = 11</strong>
                    </div>
                  </div>

                  <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '12px', border: '1px solid var(--quest-border)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--quest-text-muted)' }}>
                      PATH 2: SUBOPTIMAL GOAL G_sub
                    </div>
                    <div style={{ fontSize: '14px', color: '#13211C', marginTop: '6px' }}>
                      • Suboptimal Goal directly at depth 1: $f(G_{`sub`}) = g(G_{`sub`}) + 0 = 15$<br />
                      • Since Goal has $h(G)=0$, its priority in the queue is <strong>15</strong>.
                    </div>
                  </div>
                </div>

                {/* Verdict Box */}
                <div
                  style={{
                    marginTop: '16px',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: 3 + inadmissibleOverestimate > 15 ? '#FEE2E2' : '#DCFCE7',
                    border: `2px solid ${3 + inadmissibleOverestimate > 15 ? '#EF4444' : '#22C55E'}`
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '14px', color: 3 + inadmissibleOverestimate > 15 ? '#991B1B' : '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {3 + inadmissibleOverestimate > 15 ? (
                      <><AlertTriangle size={16} /> A* FAILS OPTIMALITY: f(C) = {3 + inadmissibleOverestimate} &gt; f(G_sub) = 15</>
                    ) : (
                      <><CheckCircle2 size={16} /> A* SUCCEEDS: f(C) = {3 + inadmissibleOverestimate} ≤ f(G_sub) = 15</>
                    )}
                  </div>
                  <div style={{ fontSize: '13px', color: '#1F2937', marginTop: '4px' }}>
                    {3 + inadmissibleOverestimate > 15
                      ? 'Because Node C’s heuristic overestimated, its f-score became worse than the suboptimal goal. The priority queue popped and returned G_sub (cost 15) before ever exploring the true 11-cost path!'
                      : 'Because h(C) is admissible (never exceeds 8), f(C) stays below 15. A* will expand C first and discover the optimal cost-11 path.'}
                  </div>
                </div>
              </div>
            )}

            {/* SCENARIO 3: ALPHA-BETA ORDERING TRAP */}
            {activeChallenge === 'alphabeta_ordering' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={18} color="#2563EB" />
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563EB', letterSpacing: '0.04em' }}>
                    COMPLEXITY REGIME: BEST-CASE O(b^(d/2)) VS WORST-CASE O(b^d)
                  </span>
                </div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                  Why Move Ordering Dictates Alpha-Beta Pruning Power
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--quest-text-secondary)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  Alpha-Beta pruning computes the exact same minimax value as standard Minimax. But if children are evaluated in the worst possible order (worst first), <strong>zero nodes are pruned</strong>!
                </p>

                {/* Ordering Toggle */}
                <div style={{ display: 'flex', background: '#F0F3EC', padding: '4px', borderRadius: '12px', width: 'fit-content', marginBottom: '16px' }}>
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setAlphaBetaOrdering('optimal');
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: alphaBetaOrdering === 'optimal' ? '#13211C' : 'transparent',
                      color: alphaBetaOrdering === 'optimal' ? '#C9F26B' : 'var(--quest-text-secondary)',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Optimal Move Ordering (Best First)
                  </button>
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setAlphaBetaOrdering('worst');
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: alphaBetaOrdering === 'worst' ? '#13211C' : 'transparent',
                      color: alphaBetaOrdering === 'worst' ? '#C9F26B' : 'var(--quest-text-secondary)',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Worst Move Ordering (Worst First)
                  </button>
                </div>

                {/* Metrics Table */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '12px', border: '1px solid var(--quest-border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--quest-text-muted)' }}>EFFECTIVE BRANCHING</div>
                    <div style={{ fontFamily: 'var(--quest-font-heading)', fontSize: '24px', fontWeight: 800, color: '#13211C', marginTop: '2px' }}>
                      {alphaBetaOrdering === 'optimal' ? '√b ≈ 1.8' : 'b = 3.2'}
                    </div>
                  </div>

                  <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '12px', border: '1px solid var(--quest-border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--quest-text-muted)' }}>NODES PRUNED</div>
                    <div style={{ fontFamily: 'var(--quest-font-heading)', fontSize: '24px', fontWeight: 800, color: alphaBetaOrdering === 'optimal' ? '#16A34A' : '#DC2626', marginTop: '2px' }}>
                      {alphaBetaOrdering === 'optimal' ? '54% of Subtrees' : '0 Nodes Pruned'}
                    </div>
                  </div>

                  <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '12px', border: '1px solid var(--quest-border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--quest-text-muted)' }}>SEARCHABLE DEPTH</div>
                    <div style={{ fontFamily: 'var(--quest-font-heading)', fontSize: '24px', fontWeight: 800, color: '#13211C', marginTop: '2px' }}>
                      {alphaBetaOrdering === 'optimal' ? '2x Deeper (2d)' : 'Standard (d)'}
                    </div>
                  </div>
                </div>

                <div style={{ background: '#F8FAF6', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--quest-border)', fontSize: '13.5px', lineHeight: 1.5 }}>
                  <strong>Key Takeaway: </strong>
                  {alphaBetaOrdering === 'optimal'
                    ? 'With perfect move ordering, alpha and beta tighten immediately on the first branch explored. Subsequent unpromising branches hit beta <= alpha on their very first child, cutting the branching factor in half.'
                    : 'If worse moves are checked first, beta remains loose (+∞) and alpha remains -∞. The pruning threshold is never breached, forcing Alpha-Beta to degrade into a plain exhaustive Minimax search!'}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Challenge Directory & Quick Lab Quiz */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="quest-stat-card">
              <div className="quest-stat-card-title">Counter-Example Invariants</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '10px 14px', borderRadius: '12px', fontSize: '13px', background: activeChallenge === 'greedy_trap' ? '#13211C' : '#F8FAF6', color: activeChallenge === 'greedy_trap' ? '#C9F26B' : 'var(--quest-text-primary)', fontWeight: 700 }}>
                  AIMA §3.5: Greedy Search has no cost optimality guarantees.
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '12px', fontSize: '13px', background: activeChallenge === 'inadmissible_trap' ? '#13211C' : '#F8FAF6', color: activeChallenge === 'inadmissible_trap' ? '#C9F26B' : 'var(--quest-text-primary)', fontWeight: 700 }}>
                  AIMA §3.5.2: Admissibility h(n) ≤ h*(n) is strictly required for tree A*.
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '12px', fontSize: '13px', background: activeChallenge === 'alphabeta_ordering' ? '#13211C' : '#F8FAF6', color: activeChallenge === 'alphabeta_ordering' ? '#C9F26B' : 'var(--quest-text-primary)', fontWeight: 700 }}>
                  AIMA §5.2: Move ordering is what makes Alpha-Beta scale in real game engines.
                </div>
              </div>
            </div>

            <div className="quest-stat-card" style={{ background: '#EAF6C9', borderColor: '#C9F26B' }}>
              <div className="quest-stat-card-title" style={{ color: '#13211C' }}>
                Ready to Test Your Knowledge?
              </div>
              <div style={{ fontSize: '13.5px', color: '#13211C', lineHeight: 1.5, marginBottom: '14px' }}>
                Take the multi-tier quiz featuring foundational definitions, hand-calculation traces, and graduate proof questions.
              </div>
              <button
                className="quest-btn-lime"
                style={{ width: '100%', minHeight: '44px', fontSize: '14px' }}
                onClick={() => {
                  soundFX.playClick();
                  onStartQuiz();
                }}
              >
                Launch Chapter Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
