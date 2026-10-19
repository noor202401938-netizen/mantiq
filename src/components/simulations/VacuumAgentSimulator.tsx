import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Activity, Bot, Trash2, CheckCircle2 } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

type Room = 'A' | 'B';
type AgentType = 'simple-reflex' | 'model-based' | 'random';

export const VacuumAgentSimulator: React.FC = () => {
  const [agentLocation, setAgentLocation] = useState<Room>('A');
  const [roomDirty, setRoomDirty] = useState<{ A: boolean; B: boolean }>({ A: true, B: true });
  const [agentType, setAgentType] = useState<AgentType>('simple-reflex');
  const [score, setScore] = useState<number>(0);
  const [steps, setSteps] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<string>('None');
  const [memoryState, setMemoryState] = useState<{ cleanedA: boolean; cleanedB: boolean }>({ cleanedA: false, cleanedB: false });
  const [log, setLog] = useState<string[]>(['Environment initialized: Both rooms dirty.']);

  const timerRef = useRef<number | null>(null);

  const resetSim = () => {
    setAgentLocation('A');
    setRoomDirty({ A: true, B: true });
    setScore(0);
    setSteps(0);
    setIsRunning(false);
    setLastAction('Reset');
    setMemoryState({ cleanedA: false, cleanedB: false });
    setLog(['Environment reset. Both rooms dirty. Agent in Room A.']);
  };

  const stepAgent = () => {
    const isCurrentDirty = roomDirty[agentLocation];
    let action = 'NoOp';

    if (agentType === 'simple-reflex') {
      // Condition-action rules
      if (isCurrentDirty) {
        action = 'Suck';
      } else if (agentLocation === 'A') {
        action = 'Right';
      } else {
        action = 'Left';
      }
    } else if (agentType === 'model-based') {
      // Maintains internal state of cleaned rooms
      if (isCurrentDirty) {
        action = 'Suck';
      } else {
        const otherRoom: Room = agentLocation === 'A' ? 'B' : 'A';
        const otherCleaned = otherRoom === 'A' ? memoryState.cleanedA : memoryState.cleanedB;
        if (!otherCleaned) {
          action = agentLocation === 'A' ? 'Right' : 'Left';
        } else {
          action = 'NoOp'; // Conserves energy when all rooms known clean
        }
      }
    } else if (agentType === 'random') {
      if (isCurrentDirty) {
        action = 'Suck';
      } else {
        action = Math.random() > 0.5 ? (agentLocation === 'A' ? 'Right' : 'Left') : 'NoOp';
      }
    }

    // Execute action
    let newScoreDelta = 0;
    const newDirty = { ...roomDirty };
    const newMemory = { ...memoryState };
    let newLoc = agentLocation;

    if (action === 'Suck') {
      newDirty[agentLocation] = false;
      if (agentLocation === 'A') newMemory.cleanedA = true;
      if (agentLocation === 'B') newMemory.cleanedB = true;
      newScoreDelta = 10 - 2; // +10 for clean, -2 energy cost for suck
      soundFX.playStep();
    } else if (action === 'Right') {
      newLoc = 'B';
      newScoreDelta = -1; // -1 energy cost
    } else if (action === 'Left') {
      newLoc = 'A';
      newScoreDelta = -1; // -1 energy cost
    } else {
      newScoreDelta = 0; // NoOp saves energy
    }

    // Bonus for maintaining clean environment
    if (!newDirty.A && !newDirty.B) {
      newScoreDelta += 5;
    }

    setRoomDirty(newDirty);
    setAgentLocation(newLoc);
    setMemoryState(newMemory);
    setScore((prev) => prev + newScoreDelta);
    setSteps((prev) => prev + 1);
    setLastAction(action);

    const logEntry = `Step ${steps + 1}: Percept=[Loc:${agentLocation}, Dirty:${isCurrentDirty}] -> Action=${action} (Score delta: ${newScoreDelta > 0 ? '+' : ''}${newScoreDelta})`;
    setLog((prev) => [logEntry, ...prev.slice(0, 4)]);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setTimeout(() => {
        stepAgent();
      }, 600);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, agentLocation, roomDirty, agentType, steps, score, memoryState]);

  const toggleDirt = (room: Room) => {
    setRoomDirty((prev) => ({ ...prev, [room]: !prev[room] }));
    soundFX.playClick();
  };

  return (
    <div className="sim-card">
      <div className="sim-header">
        <div className="sim-title-group">
          <span className="sim-badge">AIMA Chapter 2 Lab</span>
          <h3>PEAS & Rational Agent Simulator</h3>
        </div>
        <div className="sim-algo-picker">
          <button
            className={`btn-pill ${agentType === 'simple-reflex' ? 'active' : ''}`}
            onClick={() => { setAgentType('simple-reflex'); resetSim(); }}
          >
            Simple Reflex
          </button>
          <button
            className={`btn-pill ${agentType === 'model-based' ? 'active' : ''}`}
            onClick={() => { setAgentType('model-based'); resetSim(); }}
          >
            Model-Based (Internal State)
          </button>
          <button
            className={`btn-pill ${agentType === 'random' ? 'active' : ''}`}
            onClick={() => { setAgentType('random'); resetSim(); }}
          >
            Randomized Reflex
          </button>
        </div>
      </div>

      <div className="sim-controls-bar">
        <button
          className="btn-action primary"
          onClick={() => {
            soundFX.playClick();
            setIsRunning(!isRunning);
          }}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          {isRunning ? 'Pause' : 'Run Agent'}
        </button>

        <button
          className="btn-action secondary"
          onClick={() => {
            soundFX.playClick();
            stepAgent();
          }}
          disabled={isRunning}
        >
          Step Single Action
        </button>

        <button
          className="btn-action secondary"
          onClick={() => {
            soundFX.playClick();
            resetSim();
          }}
        >
          <RotateCcw size={16} />
          Reset
        </button>

        <div className="sim-stats-pill">
          <span>Performance Score: <strong>{score}</strong></span>
          <span>Steps: <strong>{steps}</strong></span>
          <span>Last Action: <strong>{lastAction}</strong></span>
        </div>
      </div>

      <div className="vacuum-world-container">
        {/* Room A */}
        <div className={`vacuum-room ${agentLocation === 'A' ? 'agent-present' : ''}`}>
          <div className="room-label">
            <span>Room A</span>
            <button className="dirt-toggle-btn" onClick={() => toggleDirt('A')} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              {roomDirty.A ? <><CheckCircle2 size={13} /> Clean</> : <><Trash2 size={13} /> Add Dirt</>}
            </button>
          </div>
          <div className="room-floor">
            {roomDirty.A ? (
              <div className="dirt-pile" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Trash2 size={14} color="#78350F" /> Dirty</div>
            ) : (
              <div className="clean-floor" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Sparkles size={14} color="#15803D" /> Pristine Clean</div>
            )}
            {agentLocation === 'A' && (
              <div className="agent-avatar pulse-glow" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <Bot size={28} color="#13211C" />
                <span className="agent-tag">AIMA Agent</span>
              </div>
            )}
          </div>
        </div>

        {/* Room B */}
        <div className={`vacuum-room ${agentLocation === 'B' ? 'agent-present' : ''}`}>
          <div className="room-label">
            <span>Room B</span>
            <button className="dirt-toggle-btn" onClick={() => toggleDirt('B')} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              {roomDirty.B ? <><CheckCircle2 size={13} /> Clean</> : <><Trash2 size={13} /> Add Dirt</>}
            </button>
          </div>
          <div className="room-floor">
            {roomDirty.B ? (
              <div className="dirt-pile" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Trash2 size={14} color="#78350F" /> Dirty</div>
            ) : (
              <div className="clean-floor" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Sparkles size={14} color="#15803D" /> Pristine Clean</div>
            )}
            {agentLocation === 'B' && (
              <div className="agent-avatar pulse-glow" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <Bot size={28} color="#13211C" />
                <span className="agent-tag">AIMA Agent</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sim-log-card">
        <div className="log-title">
          <Activity size={14} /> Agent Percept-Action Deliberation Log
        </div>
        <div className="log-entries">
          {log.map((entry, idx) => (
            <div key={idx} className="log-item">{entry}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
