import * as React from "react"
import { ButtonProps } from "./button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HeroButtonProps extends Omit<ButtonProps, 'variant'> {
  children: React.ReactNode;
}

const HeroButton = React.forwardRef<HTMLButtonElement, HeroButtonProps>(
  ({ className, children, asChild, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false)
    
    // When using asChild, we need to clone the child and add our content
    if (asChild && React.isValidElement(children)) {
      const childProps = children.props as { className?: string; style?: React.CSSProperties; children?: React.ReactNode }; // Type assertion for props access
      
      return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        ...childProps,
        className: cn(
          "inline-flex items-center bg-dark-blue text-white rounded-2xl pl-6 pr-1 h-[45px] w-auto font-medium text-[13px] uppercase transition-all duration-200 gap-3 group",
          childProps.className,
          className
        ),
        style: { 
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontWeight: 400,
          fontStyle: 'normal',
          ...(childProps.style || {})
        },
        ref,
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        children: (
          <>
            <div className="relative overflow-hidden h-[1em] flex items-center justify-center whitespace-nowrap" style={{ lineHeight: '1' }}>
              <motion.span
                className="flex items-center justify-center h-full"
                animate={{
                  y: isHovered ? "-150%" : "0%"
                }}
                transition={{
                  duration: 0.35,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                {childProps.children}
              </motion.span>
              <motion.span
                className="absolute inset-0 flex items-center justify-center"
                initial={{ y: "150%" }}
                animate={{
                  y: isHovered ? "0%" : "150%"
                }}
                transition={{
                  duration: 0.35,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                {childProps.children}
              </motion.span>
            </div>
            <div className="w-[37px] h-[37px] bg-white rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
              <motion.svg 
                width="11" 
                height="11" 
                viewBox="0 0 9 9" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="absolute"
                animate={{
                  x: isHovered ? "150%" : "0%",
                  y: isHovered ? "-150%" : "0%"
                }}
                transition={{
                  duration: 0.35,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <path d="M1 8L8 1M8 1H1M8 1V8" stroke="#2b2b2b" strokeLinejoin="round"/>
              </motion.svg>
              <motion.svg 
                width="11" 
                height="11" 
                viewBox="0 0 9 9" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="absolute"
                initial={{ x: "-200%", y: "200%" }}
                animate={{
                  x: isHovered ? "0%" : "-200%",
                  y: isHovered ? "0%" : "200%"
                }}
                transition={{
                  duration: 0.35,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <path d="M1 8L8 1M8 1H1M8 1V8" stroke="#2b2b2b" strokeLinejoin="round"/>
              </motion.svg>
            </div>
          </>
        )
      });
    }

    // Regular button usage (not asChild)
    const { 
      onDrag, 
      onDragStart, 
      onDragEnd, 
      onAnimationStart,
      onAnimationEnd,
      onAnimationIteration,
      ...buttonProps 
    } = props
    
    return (
      <motion.button
        className={cn(
          "inline-flex items-center bg-mach1-blue text-white rounded-[80%] pl-6 pr-1 h-[45px] w-auto font-medium text-[13px] uppercase hover:bg-[#1e2366] transition-all duration-200 gap-3",
          className
        )}
        style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontWeight: 400, fontStyle: 'normal', lineHeight: '1' }}
        ref={ref}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        {...buttonProps}
      >
        <div className="relative overflow-hidden h-[1em] flex items-center justify-center whitespace-nowrap" style={{ lineHeight: '1' }}>
          <motion.span
            className="flex items-center justify-center h-full"
            animate={{
              y: isHovered ? "-150%" : "0%"
            }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {children}
          </motion.span>
          <motion.span
            className="absolute inset-0 flex items-center justify-center"
            initial={{ y: "150%" }}
            animate={{
              y: isHovered ? "0%" : "150%"
            }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {children}
          </motion.span>
        </div>
        <div className="w-[37px] h-[37px] bg-slate-100 rounded-[80%] flex items-center justify-center flex-shrink-0 relative overflow-hidden">
          <motion.svg 
            width="11" 
            height="11" 
            viewBox="0 0 9 9" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="absolute"
            animate={{
              x: isHovered ? "150%" : "0%",
              y: isHovered ? "-150%" : "0%"
            }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <path d="M1 8L8 1M8 1H1M8 1V8" stroke="#2b2e7f" strokeLinejoin="round"/>
          </motion.svg>
          <motion.svg 
            width="11" 
            height="11" 
            viewBox="0 0 9 9" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="absolute"
            initial={{ x: "-200%", y: "200%" }}
            animate={{
              x: isHovered ? "0%" : "-200%",
              y: isHovered ? "0%" : "200%"
            }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <path d="M1 8L8 1M8 1H1M8 1V8" stroke="#2b2e7f" strokeLinejoin="round"/>
          </motion.svg>
        </div>
      </motion.button>
    )
  }
)
HeroButton.displayName = "HeroButton"

export { HeroButton }
