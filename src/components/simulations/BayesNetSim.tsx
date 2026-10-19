import React, { useState } from 'react';
import { Network, HelpCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

type EvidenceState = 'unknown' | 'true' | 'false';

export const BayesNetSim: React.FC = () => {
  const [evidence, setEvidence] = useState<{
    B: EvidenceState;
    E: EvidenceState;
    A: EvidenceState;
    J: EvidenceState;
    M: EvidenceState;
  }>({
    B: 'unknown',
    E: 'unknown',
    A: 'unknown',
    J: 'true',
    M: 'true'
  });

  // Calculate full joint distribution over 32 worlds (2^5)
  // P(B, E, A, J, M) = P(B) * P(E) * P(A|B,E) * P(J|A) * P(M|A)
  const computeExactMarginals = () => {
    const P_B_true = 0.001;
    const P_E_true = 0.002;

    const CPT_A: Record<string, number> = {
      'true,true': 0.95,
      'true,false': 0.94,
      'false,true': 0.29,
      'false,false': 0.001
    };

    const P_J_given_A = (a: boolean) => (a ? 0.90 : 0.05);
    const P_M_given_A = (a: boolean) => (a ? 0.70 : 0.01);

    const matchesEvidence = (val: boolean, ev: EvidenceState): boolean => {
      if (ev === 'unknown') return true;
      if (ev === 'true' && val) return true;
      if (ev === 'false' && !val) return true;
      return false;
    };

    let totalWeight = 0;
    const trueWeights = { B: 0, E: 0, A: 0, J: 0, M: 0 };

    for (const b of [true, false]) {
      for (const e of [true, false]) {
        for (const a of [true, false]) {
          for (const j of [true, false]) {
            for (const m of [true, false]) {
              if (
                matchesEvidence(b, evidence.B) &&
                matchesEvidence(e, evidence.E) &&
                matchesEvidence(a, evidence.A) &&
                matchesEvidence(j, evidence.J) &&
                matchesEvidence(m, evidence.M)
              ) {
                const probB = b ? P_B_true : 1 - P_B_true;
                const probE = e ? P_E_true : 1 - P_E_true;
                const probA = a ? CPT_A[`${b},${e}`] : 1 - CPT_A[`${b},${e}`];
                const probJ = j ? P_J_given_A(a) : 1 - P_J_given_A(a);
                const probM = m ? P_M_given_A(a) : 1 - P_M_given_A(a);

                const jointProb = probB * probE * probA * probJ * probM;
                totalWeight += jointProb;

                if (b) trueWeights.B += jointProb;
                if (e) trueWeights.E += jointProb;
                if (a) trueWeights.A += jointProb;
                if (j) trueWeights.J += jointProb;
                if (m) trueWeights.M += jointProb;
              }
            }
          }
        }
      }
    }

    if (totalWeight === 0) {
      return { B: 0, E: 0, A: 0, J: 0, M: 0 };
    }

    return {
      B: trueWeights.B / totalWeight,
      E: trueWeights.E / totalWeight,
      A: trueWeights.A / totalWeight,
      J: trueWeights.J / totalWeight,
      M: trueWeights.M / totalWeight
    };
  };

  const marginals = computeExactMarginals();

  const cycleEvidence = (key: 'B' | 'E' | 'A' | 'J' | 'M') => {
    soundFX.playClick();
    const cycle: Record<EvidenceState, EvidenceState> = {
      unknown: 'true',
      true: 'false',
      false: 'unknown'
    };
    setEvidence((prev) => ({ ...prev, [key]: cycle[prev[key]] }));
  };

  const resetEvidence = () => {
    soundFX.playClick();
    setEvidence({ B: 'unknown', E: 'unknown', A: 'unknown', J: 'unknown', M: 'unknown' });
  };

  return (
    <div className="sim-card">
      <div className="sim-header">
        <div className="sim-title-group">
          <span className="sim-badge">AIMA Chapter 14 Lab</span>
          <h3>Bayesian Network & Exact Inference (Alarm Network)</h3>
        </div>
        <button className="btn-action secondary" onClick={resetEvidence}>
          <RotateCcw size={14} /> Clear Evidence
        </button>
      </div>

      <p className="sim-instruction-text">
        Click on any node to clamp evidence: <strong>Unknown → Observed True → Observed False</strong>. Watch exact posterior probabilities update!
      </p>

      <div className="bayes-net-diagram">
        {/* Layer 1: Causes */}
        <div className="bayes-row causes-row">
          <div
            className={`bayes-node ${evidence.B !== 'unknown' ? 'clamped' : ''}`}
            onClick={() => cycleEvidence('B')}
          >
            <div className="node-title">Burglary (B)</div>
            <div className="node-prob">{(marginals.B * 100).toFixed(2)}%</div>
            <div className="node-status-tag">State: {evidence.B.toUpperCase()}</div>
          </div>

          <div
            className={`bayes-node ${evidence.E !== 'unknown' ? 'clamped' : ''}`}
            onClick={() => cycleEvidence('E')}
          >
            <div className="node-title">Earthquake (E)</div>
            <div className="node-prob">{(marginals.E * 100).toFixed(2)}%</div>
            <div className="node-status-tag">State: {evidence.E.toUpperCase()}</div>
          </div>
        </div>

        {/* Layer 2: Intermediate Alarm */}
        <div className="bayes-row">
          <div
            className={`bayes-node alarm-node ${evidence.A !== 'unknown' ? 'clamped' : ''}`}
            onClick={() => cycleEvidence('A')}
          >
            <div className="node-title">Alarm (A)</div>
            <div className="node-prob">{(marginals.A * 100).toFixed(2)}%</div>
            <div className="node-status-tag">State: {evidence.A.toUpperCase()}</div>
          </div>
        </div>

        {/* Layer 3: Effects */}
        <div className="bayes-row effects-row">
          <div
            className={`bayes-node ${evidence.J !== 'unknown' ? 'clamped' : ''}`}
            onClick={() => cycleEvidence('J')}
          >
            <div className="node-title">JohnCalls (J)</div>
            <div className="node-prob">{(marginals.J * 100).toFixed(2)}%</div>
            <div className="node-status-tag">State: {evidence.J.toUpperCase()}</div>
          </div>

          <div
            className={`bayes-node ${evidence.M !== 'unknown' ? 'clamped' : ''}`}
            onClick={() => cycleEvidence('M')}
          >
            <div className="node-title">MaryCalls (M)</div>
            <div className="node-prob">{(marginals.M * 100).toFixed(2)}%</div>
            <div className="node-status-tag">State: {evidence.M.toUpperCase()}</div>
          </div>
        </div>
      </div>

      <div className="sim-footer">
        <div className="sim-status-message">
          <Network size={16} className="text-accent" />
          <span>
            {evidence.J === 'true' && evidence.M === 'true' && evidence.E === 'unknown'
              ? 'Both John and Mary called! P(Burglary) has risen to ~28.4%. Now set Earthquake = TRUE to see "Explaining Away" drop Burglary to ~10%!'
              : 'Exact inference computed across all 32 joint worlds via factorization: P(B,E,A,J,M) = P(B)P(E)P(A|B,E)P(J|A)P(M|A).'}
          </span>
        </div>
      </div>
    </div>
  );
};
