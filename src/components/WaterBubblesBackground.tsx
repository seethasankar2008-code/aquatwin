import React, { useMemo } from 'react';

interface Bubble {
  id: number;
  left: number; // percentage across screen
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  type: 'rise' | 'split';
}

interface RainDrop {
  id: number;
  left: number; // percentage across screen
  length: number; // px
  duration: number; // seconds
  delay: number; // seconds
  opacity: number;
}

interface Ripple {
  id: number;
  left: number; // percentage
  bottom: number; // percentage
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
}

export const WaterBubblesBackground: React.FC = () => {
  // Delicate, atmospheric falling rain drops across viewport
  const raindrops: RainDrop[] = useMemo(() => [
    { id: 1, left: 3, length: 32, duration: 1.1, delay: 0.1, opacity: 0.55 },
    { id: 2, left: 7, length: 26, duration: 1.3, delay: 0.8, opacity: 0.45 },
    { id: 3, left: 12, length: 38, duration: 1.0, delay: 0.3, opacity: 0.65 },
    { id: 4, left: 16, length: 24, duration: 1.4, delay: 1.2, opacity: 0.4 },
    { id: 5, left: 21, length: 34, duration: 1.15, delay: 0.6, opacity: 0.5 },
    { id: 6, left: 26, length: 42, duration: 0.95, delay: 0.2, opacity: 0.7 },
    { id: 7, left: 31, length: 28, duration: 1.25, delay: 0.9, opacity: 0.45 },
    { id: 8, left: 36, length: 36, duration: 1.05, delay: 0.4, opacity: 0.6 },
    { id: 9, left: 41, length: 22, duration: 1.5, delay: 1.5, opacity: 0.4 },
    { id: 10, left: 46, length: 40, duration: 1.0, delay: 0.7, opacity: 0.65 },
    { id: 11, left: 51, length: 30, duration: 1.2, delay: 0.1, opacity: 0.5 },
    { id: 12, left: 56, length: 44, duration: 0.9, delay: 0.5, opacity: 0.7 },
    { id: 13, left: 61, length: 26, duration: 1.35, delay: 1.1, opacity: 0.45 },
    { id: 14, left: 66, length: 38, duration: 1.05, delay: 0.3, opacity: 0.6 },
    { id: 15, left: 71, length: 24, duration: 1.4, delay: 0.8, opacity: 0.4 },
    { id: 16, left: 76, length: 36, duration: 1.1, delay: 0.2, opacity: 0.65 },
    { id: 17, left: 81, length: 28, duration: 1.3, delay: 1.4, opacity: 0.45 },
    { id: 18, left: 86, length: 42, duration: 0.98, delay: 0.6, opacity: 0.7 },
    { id: 19, left: 91, length: 32, duration: 1.15, delay: 0.0, opacity: 0.55 },
    { id: 20, left: 96, length: 26, duration: 1.45, delay: 1.0, opacity: 0.45 },
  ], []);

  // Soft concentric water ripples on the surface
  const ripples: Ripple[] = useMemo(() => [
    { id: 1, left: 14, bottom: 8, size: 45, duration: 4.2, delay: 0 },
    { id: 2, left: 38, bottom: 15, size: 55, duration: 4.8, delay: 1.8 },
    { id: 3, left: 62, bottom: 6, size: 40, duration: 3.9, delay: 0.9 },
    { id: 4, left: 84, bottom: 12, size: 50, duration: 4.5, delay: 2.5 },
  ], []);

  // Serene rising and splitting water bubbles
  const bubbles: Bubble[] = useMemo(() => [
    { id: 1, left: 10, size: 18, duration: 22, delay: 0, type: 'rise' },
    { id: 2, left: 24, size: 24, duration: 25, delay: 3, type: 'split' },
    { id: 3, left: 48, size: 16, duration: 21, delay: 7, type: 'rise' },
    { id: 4, left: 72, size: 22, duration: 23, delay: 2, type: 'split' },
    { id: 5, left: 89, size: 15, duration: 19, delay: 9, type: 'rise' },
  ], []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Falling Rain Drops */}
      {raindrops.map((r) => (
        <div
          key={`rain-${r.id}`}
          className="absolute animate-rain-fall"
          style={{
            left: `${r.left}%`,
            top: '-50px',
            width: '2px',
            height: `${r.length}px`,
            opacity: r.opacity,
            animationDuration: `${r.duration}s`,
            animationDelay: `${r.delay}s`,
            background: 'linear-gradient(to bottom, rgba(56, 189, 248, 0) 0%, rgba(14, 165, 233, 0.45) 60%, rgba(2, 132, 199, 0.9) 100%)',
            borderRadius: '9999px',
            boxShadow: '0 0 3px rgba(56, 189, 248, 0.5)',
          }}
        />
      ))}

      {/* Surface Water Ripples */}
      {ripples.map((rip) => (
        <div
          key={`ripple-${rip.id}`}
          className="absolute rounded-full animate-water-ripple"
          style={{
            left: `${rip.left}%`,
            bottom: `${rip.bottom}%`,
            width: `${rip.size}px`,
            height: `${rip.size * 0.45}px`,
            animationDuration: `${rip.duration}s`,
            animationDelay: `${rip.delay}s`,
            border: '1.5px solid rgba(14, 165, 233, 0.45)',
            boxShadow: '0 0 8px rgba(56, 189, 248, 0.25)',
          }}
        />
      ))}

      {/* Floating & Splitting Water Bubbles */}
      {bubbles.map((b) => {
        if (b.type === 'split') {
          return (
            <React.Fragment key={`bubble-${b.id}`}>
              {/* Left twin droplet */}
              <div
                className="absolute rounded-full animate-bubble-split-left opacity-60"
                style={{
                  left: `${b.left}%`,
                  bottom: '-40px',
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                  animationDuration: `${b.duration}s`,
                  animationDelay: `${b.delay}s`,
                  background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.95), rgba(186, 230, 253, 0.45) 55%, rgba(14, 165, 233, 0.22) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.7)',
                  boxShadow: '0 2px 8px rgba(14, 165, 233, 0.2)',
                }}
              />
              {/* Right twin droplet */}
              <div
                className="absolute rounded-full animate-bubble-split-right opacity-60"
                style={{
                  left: `${b.left}%`,
                  bottom: '-40px',
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                  animationDuration: `${b.duration}s`,
                  animationDelay: `${b.delay}s`,
                  background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.95), rgba(186, 230, 253, 0.45) 55%, rgba(14, 165, 233, 0.22) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.7)',
                  boxShadow: '0 2px 8px rgba(14, 165, 233, 0.2)',
                }}
              />
            </React.Fragment>
          );
        }

        // Standard rising bubble
        return (
          <div
            key={`bubble-${b.id}`}
            className="absolute rounded-full animate-bubble-rise opacity-60"
            style={{
              left: `${b.left}%`,
              bottom: '-40px',
              width: `${b.size}px`,
              height: `${b.size}px`,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.95), rgba(186, 230, 253, 0.4) 55%, rgba(14, 165, 233, 0.18) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              boxShadow: '0 2px 8px rgba(14, 165, 233, 0.2)',
            }}
          />
        );
      })}
    </div>
  );
};
