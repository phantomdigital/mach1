interface ClippedCardShapeProps {
  width: number;
  height: number;
}

export default function ClippedCardShape({ width, height }: ClippedCardShapeProps) {
  // Original SVG dimensions from Figma
  const originalWidth = 582;
  const originalHeight = 579;
  
  // Calculate scale to maintain aspect ratio
  const scale = Math.max(width / originalWidth, height / originalHeight);
  const scaledWidth = originalWidth * scale;
  const scaledHeight = originalHeight * scale;
  
  return (
    <svg
      width={scaledWidth}
      height={scaledHeight}
      viewBox="0 0 582 579"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        minWidth: '100%',
        minHeight: '100%',
      }}
    >
      <path
        d="M581.5 155.574L376.424 7.5285C370.041 3.04306 362.54 0.439749 354.775 0L260.374 1.52588e-05V0.0351952L0 1.52588e-05V423.426L205.076 571.471C211.459 575.957 218.96 578.56 226.725 579H271.626V578.965L581.5 579V155.574Z"
        fill="currentColor"
      />
    </svg>
  );
}

