'use client';

import { useState, useEffect } from 'react';

const ServiceCarousel = (): JSX.Element => {
  const [rotation, setRotation] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const interval = setInterval(() => {
      setRotation((prev) => prev + 90); // Rotate 90 degrees every cycle
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [mounted]);

  if (!mounted) {
    return <></>;
  }

  // Combine all services into one circular text with separators
  const fullText = "AIR • LAND • SEA • WAREHOUSING • ";
  const letters = fullText.split('');

  return (
    <div className="absolute bottom-24 right-8 lg:bottom-22 lg:right-22 z-30">
      <div className="w-24 h-24 lg:w-32 lg:h-32">
        <div
          className="relative w-full h-full flex items-center justify-center rounded-full shadow-lg"
          style={{ 
            backgroundColor: 'var(--color-mach1-red)',
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 1s ease-in-out'
          }}
        >
          {/* Circular text following the circumference */}
          <div className="absolute inset-0">
            {letters.map((letter, index) => {
              const angle = (index * 360) / letters.length;
              const radius = 42; // Closer to edge - reduced padding
              const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
              const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;

              return (
                <span
                  key={`${letter}-${index}`}
                  className={`absolute text-xs lg:text-sm font-bold uppercase ${
                    letter === '•' ? 'text-white/40' : 'text-white'
                  }`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                    transformOrigin: "center",
                    fontFamily: '"space-mono", monospace',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    letterSpacing: '0.5px'
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </div>

          {/* Center logo/icon area - counter-rotating to stay stationary */}
          <div
            className="z-10 flex items-center justify-center w-8 h-8 lg:w-12 lg:h-12 bg-white/10 rounded-full"
            style={{
              transform: `rotate(${-rotation}deg)`,
              transition: 'transform 1s ease-in-out'
            }}
          >
            <div 
              className="text-white text-xs lg:text-sm font-bold"
              style={{ fontFamily: '"space-mono", monospace', fontWeight: 400, fontStyle: 'normal' }}
            >
              M1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCarousel;