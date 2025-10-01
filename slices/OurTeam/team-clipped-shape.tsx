interface TeamClippedShapeProps {
  children: React.ReactNode;
  className?: string;
}

export function TeamClippedShape({ children, className = "" }: TeamClippedShapeProps) {
  // Convert the SVG path to a CSS clip-path polygon
  // Original SVG viewBox: 0 0 394 393
  // Converting coordinates to percentages for responsive scaling
  const clipPath = `polygon(
    0% 26.84%, 
    35.28% 1.3%, 
    39.01% 0%, 
    55.2% 0%, 
    55.2% 0.01%, 
    100% 0%, 
    100% 73.03%, 
    64.72% 98.55%, 
    60.99% 100%, 
    53.28% 100%, 
    53.28% 99.99%, 
    0% 100%
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

