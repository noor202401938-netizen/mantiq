import React from 'react';

export type LogoVariant = 'knot';

interface MantiqLogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  showBorder?: boolean;
  variant?: string;
  onClick?: () => void;
}

export const MantiqLogo: React.FC<MantiqLogoProps> = ({
  size = 38,
  className = '',
  style = {},
  showBorder = true,
  onClick
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      style={{
        display: 'inline-block',
        flexShrink: 0,
        borderRadius: `${(size * 26) / 100}px`,
        ...style
      }}
      aria-label="Mantiq Logo (The Continuous Logic Knot)"
    >
      {/* Pitch Onyx Squircle Base */}
      <rect width="120" height="120" rx="30" fill="#13211C" />
      {showBorder && (
        <rect
          x="1"
          y="1"
          width="118"
          height="118"
          rx="29"
          stroke="#C9F26B"
          strokeOpacity="0.22"
          strokeWidth="1.5"
        />
      )}

      {/* The Continuous Logic Knot: Dual Intersecting Rational Streams */}
      {/* Stream 1 (Perception): Ivory curve sweeping left-to-right */}
      <path
        d="M 28 82 C 28 42, 38 30, 52 30 C 64 30, 68 48, 76 64 C 82 76, 88 82, 92 82"
        stroke="#F3F5EF"
        strokeWidth="8.5"
        strokeLinecap="round"
      />

      {/* Stream 2 (Action): Citron Lime curve sweeping right-to-left */}
      <path
        d="M 92 82 C 92 42, 82 30, 68 30 C 56 30, 52 48, 44 64 C 38 76, 32 82, 28 82"
        stroke="#C9F26B"
        strokeWidth="8.5"
        strokeLinecap="round"
      />

      {/* Rational Nexus Convergence Core: Citron Lime Diamond */}
      <polygon points="60,39 69,48 60,57 51,48" fill="#C9F26B" />
      <circle cx="60" cy="48" r="2.5" fill="#13211C" />

      {/* Terminus Anchor Nodes */}
      <circle cx="28" cy="82" r="4.25" fill="#F3F5EF" />
      <circle cx="92" cy="82" r="4.25" fill="#C9F26B" />
    </svg>
  );
};

export default MantiqLogo;
