import React from "react";

interface ContentClippedShapeProps {
  children: React.ReactNode;
  className?: string;
}

export function ContentClippedShape({ children, className = "" }: ContentClippedShapeProps) {
  // Using the same clipping path as the Locations slice for consistency
  const clipPath = `polygon(
    100% 26.9%, 
    83.96% 1.3%, 
    49.52% 0%, 
    0% 0%, 
    0% 73.1%, 
    16.04% 98.7%, 
    50.48% 100%, 
    100% 100%
  )`;

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{
        clipPath: clipPath
      }}
    >
      {children}
    </div>
  );
}
