"use client"

import * as React from "react"
import { ButtonProps } from "./button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HeroButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  children: React.ReactNode;
  size?: 'default' | 'small';
}

const HeroButton = React.forwardRef<HTMLButtonElement, HeroButtonProps>(
  ({ className, children, asChild, size = 'default', ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false)
    
    const isSmall = size === 'small';
    const textSize = isSmall ? 'text-[11.75px]' : 'text-[13.75px]';
    const buttonHeight = isSmall ? 'h-[41px]' : 'h-[49px]';
    const arrowContainerSize = isSmall ? 'w-[31px] h-[31px]' : 'w-[37px] h-[37px]';
    const arrowSize = isSmall ? 9 : 11;
    
    // When using asChild, we need to clone the child and add our content
    if (asChild && React.isValidElement(children)) {
      const childProps = children.props as { className?: string; style?: React.CSSProperties; children?: React.ReactNode }; // Type assertion for props access
      
      return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        ...childProps,
        className: cn(
          "flex items-center justify-between bg-dark-blue text-white rounded-2xl pl-5 font-medium uppercase transition-all duration-200 group",
          buttonHeight,
          textSize,
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
            <div className="flex-1 flex items-center justify-center" style={{ lineHeight: 0 }}>
              <div className="relative overflow-hidden h-[1em] flex items-center justify-center whitespace-nowrap leading-none" style={{ transform: 'translateY(0.5px)', display: 'flex', alignItems: 'center' }}>
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
            </div>
            <div className="py-1 pr-1 ml-3 self-stretch flex items-center">
              <div className={cn("bg-white rounded-[0.7rem] flex items-center justify-center flex-shrink-0 relative overflow-hidden", arrowContainerSize)}>
                <motion.svg 
                  width={arrowSize} 
                  height={arrowSize} 
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
                  width={arrowSize} 
                  height={arrowSize} 
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
    
    // Suppress unused variable warnings for destructured props
    void onDrag; void onDragStart; void onDragEnd; void onAnimationStart; void onAnimationEnd; void onAnimationIteration;
    
    return (
      <motion.button
        className={cn(
          "flex items-center justify-between bg-dark-blue text-white rounded-2xl pl-5 font-medium uppercase transition-all duration-200 group",
          buttonHeight,
          textSize,
          className
        )}
        style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontWeight: 400, fontStyle: 'normal' }}
        ref={ref}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        {...buttonProps}
      >
        <div className="flex-1 flex items-center justify-center" style={{ lineHeight: 0 }}>
          <div className="relative overflow-hidden h-[1em] flex items-center justify-center whitespace-nowrap leading-none" style={{ transform: 'translateY(0.5px)', display: 'flex', alignItems: 'center' }}>
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
              {children}
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
              {children}
            </motion.span>
          </div>
        </div>
        <div className="py-1 pr-1 ml-3 self-stretch flex items-center">
          <div className={cn("bg-white rounded-[0.7rem] flex items-center justify-center flex-shrink-0 relative overflow-hidden", arrowContainerSize)}>
            <motion.svg 
              width={arrowSize} 
              height={arrowSize} 
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
              width={arrowSize} 
              height={arrowSize} 
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
        </div>
      </motion.button>
    )
  }
)
HeroButton.displayName = "HeroButton"

export { HeroButton }
