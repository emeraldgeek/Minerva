import React from 'react';

export const GrainyBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Dynamic Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-md-sys-color-primaryContainer opacity-20 blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-md-sys-color-tertiaryContainer opacity-20 blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-md-sys-color-secondaryContainer opacity-10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      {/* SVG Noise Filter */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.07] mix-blend-overlay">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
};
