interface HeaderSeparatorProps {
  className?: string;
}

export function HeaderSeparator({ className = "" }: HeaderSeparatorProps) {
  return (
    <div className={`w-full h-6 relative ${className}`}>
      {/* Straight line that stops before the curve */}
      <div 
        className="absolute left-0 top-[1px] h-[1px] bg-[#9D9D9D]"
        style={{ width: 'calc(100% - 37px)' }}
      />
      
      {/* Curved end - only the curve part, positioned at the right */}
      <div className="absolute right-0 top-0">
        <svg 
          width="37" 
          height="23" 
          viewBox="1264 0 38 23" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M1264.61 1.00031C1271.95 1.00031 1279.11 3.68931 1285.1 8.71026L1300.99 22.0003" 
            stroke="#9D9D9D" 
            strokeMiterlimit="10"
          />
        </svg>
      </div>
    </div>
  );
}
