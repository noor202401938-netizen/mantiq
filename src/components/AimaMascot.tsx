import React, { useState } from 'react';
import { soundFX } from '../utils/soundEffects';

interface MascotProps {
  mood?: 'idle' | 'happy' | 'thinking' | 'proud' | 'sad';
  speech?: string;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const QUOTES = [
  "A rational agent always selects the action that maximizes expected utility!",
  "A* search with an admissible heuristic is tree-optimal! You got this!",
  "Keep your streak alive! The AI revolution waits for no one!",
  "Even deep neural nets start with gradient descent one step at a time!",
  "Practice makes an optimal policy in any MDP!"
];

export const AimaMascot: React.FC<MascotProps> = ({
  mood = 'idle',
  speech,
  size = 'md',
  interactive = true
}) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);

  const handleClick = () => {
    if (!interactive) return;
    soundFX.playClick();
    setIsBouncing(true);
    setCurrentQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    setTimeout(() => setIsBouncing(false), 600);
  };

  const displayText = speech || QUOTES[currentQuoteIndex];

  const scale = size === 'sm' ? 0.75 : size === 'lg' ? 1.25 : 1;

  return (
    <div
      className={`duo-mascot-wrapper ${isBouncing ? 'mascot-bounce' : ''}`}
      onClick={handleClick}
      title={interactive ? 'Click me for an AI wisdom nugget!' : undefined}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      {displayText && (
        <div className="mascot-speech-bubble">
          <p>{displayText}</p>
          <div className="speech-arrow" />
        </div>
      )}

      <div
        className="mascot-character"
        style={{
          width: `${100 * scale}px`,
          height: `${110 * scale}px`
        }}
      >
        <svg
          viewBox="0 0 120 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mascot-svg"
        >
          {/* Shadow */}
          <ellipse cx="60" cy="122" rx="42" ry="7" fill="rgba(0,0,0,0.25)" />

          {/* Feet */}
          <path d="M42 114 C42 118, 35 120, 32 120 C28 120, 26 117, 28 114 Z" fill="#E58E00" />
          <path d="M78 114 C78 118, 85 120, 88 120 C92 120, 94 117, 92 114 Z" fill="#E58E00" />

          {/* Robot Owl Body (Duolingo Green + Cyber Cyan) */}
          <rect
            x="24"
            y="26"
            width="72"
            height="86"
            rx="36"
            fill="url(#mascotBodyGrad)"
            stroke="#46A302"
            strokeWidth="4"
          />

          {/* Belly Plaque */}
          <ellipse cx="60" cy="80" rx="26" ry="24" fill="#E8FBD5" />
          {/* Belly Core AI Sensor */}
          <circle cx="60" cy="80" r="10" fill="#1CB0F6" opacity="0.9" />
          <circle cx="60" cy="80" r="5" fill="#FFFFFF" />

          {/* Robot Ear Antennae */}
          <path d="M30 26 L22 10 L34 18 Z" fill="#46A302" stroke="#378102" strokeWidth="2" />
          <path d="M90 26 L98 10 L86 18 Z" fill="#46A302" stroke="#378102" strokeWidth="2" />
          <circle cx="22" cy="10" r="4" fill="#FFC800" />
          <circle cx="98" cy="10" r="4" fill="#FFC800" />

          {/* Owl Visor / Eye Region */}
          <rect x="32" y="38" width="56" height="30" rx="14" fill="#15242D" />

          {/* Left Eye */}
          <circle cx="46" cy="53" r="10" fill="#FFFFFF" />
          <circle
            cx={mood === 'happy' ? 46 : 47}
            cy={mood === 'happy' ? 51 : 53}
            r="6"
            fill="#15242D"
          />
          <circle cx="44" cy="50" r="2.5" fill="#FFFFFF" />

          {/* Right Eye */}
          <circle cx="74" cy="53" r="10" fill="#FFFFFF" />
          <circle
            cx={mood === 'happy' ? 74 : 75}
            cy={mood === 'happy' ? 51 : 53}
            r="6"
            fill="#15242D"
          />
          <circle cx="72" cy="50" r="2.5" fill="#FFFFFF" />

          {/* Beak */}
          <path d="M54 58 L66 58 L60 67 Z" fill="#FF9600" />

          {/* Wings */}
          <path
            d={
              mood === 'happy'
                ? "M24 60 C12 50, 10 35, 20 40 C24 45, 25 55, 24 60 Z"
                : "M24 62 C16 68, 16 86, 24 90 Z"
            }
            fill="#46A302"
          />
          <path
            d={
              mood === 'happy'
                ? "M96 60 C108 50, 110 35, 100 40 C96 45, 95 55, 96 60 Z"
                : "M96 62 C104 68, 104 86, 96 90 Z"
            }
            fill="#46A302"
          />

          <defs>
            <linearGradient id="mascotBodyGrad" x1="24" y1="26" x2="96" y2="112" gradientUnits="userSpaceOnUse">
              <stop stopColor="#58CC02" />
              <stop offset="1" stopColor="#46A302" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
