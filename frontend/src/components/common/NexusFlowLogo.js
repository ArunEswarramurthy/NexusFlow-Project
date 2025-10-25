import React from 'react';

const NexusFlowLogo = ({ size = 32, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer hexagon */}
      <path
        d="M24 4L36.6 11V25L24 32L11.4 25V11L24 4Z"
        fill="url(#gradient1)"
        stroke="url(#gradient2)"
        strokeWidth="1.5"
      />
      
      {/* Inner flow lines */}
      <path
        d="M18 16L24 20L30 16M18 24L24 28L30 24"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Center nexus point */}
      <circle
        cx="24"
        cy="20"
        r="2"
        fill="white"
      />
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0052D4" />
          <stop offset="100%" stopColor="#F2994A" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#003280" />
          <stop offset="100%" stopColor="#E07A1F" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default NexusFlowLogo;