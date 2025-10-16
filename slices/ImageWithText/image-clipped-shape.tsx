import React from "react";

interface ImageClippedShapeProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ImageClippedShape({ children, className = "", style = {} }: ImageClippedShapeProps) {
  // Using the same mask technique as steps-cards for consistency
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{
        ...style,
        mask: `url("data:image/svg+xml,${encodeURIComponent(`
          <svg width="582" height="579" viewBox="0 0 582 579" xmlns="http://www.w3.org/2000/svg">
            <path d="M581.5 155.574L376.424 7.5285C370.041 3.04306 362.54 0.439749 354.775 0L260.374 1.52588e-05V0.0351952L0 1.52588e-05V423.426L205.076 571.471C211.459 575.957 218.96 578.56 226.725 579H271.626V578.965L581.5 579V155.574Z" fill="white"/>
          </svg>
        `)}")`,
        maskSize: 'cover',
        maskPosition: 'center',
        maskRepeat: 'no-repeat',
        WebkitMask: `url("data:image/svg+xml,${encodeURIComponent(`
          <svg width="582" height="579" viewBox="0 0 582 579" xmlns="http://www.w3.org/2000/svg">
            <path d="M581.5 155.574L376.424 7.5285C370.041 3.04306 362.54 0.439749 354.775 0L260.374 1.52588e-05V0.0351952L0 1.52588e-05V423.426L205.076 571.471C211.459 575.957 218.96 578.56 226.725 579H271.626V578.965L581.5 579V155.574Z" fill="white"/>
          </svg>
        `)}")`,
        WebkitMaskSize: 'cover',
        WebkitMaskPosition: 'center',
        WebkitMaskRepeat: 'no-repeat'
      }}
    >
      {children}
    </div>
  );
}

