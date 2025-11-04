"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TrackingSearchProps {
  className?: string;
  placeholder?: string;
  urlPrefix: string;
  variant?: "light" | "dark";
  warningText?: string;
}

export function TrackingSearch({ 
  className,
  placeholder = "Enter tracking number...",
  urlPrefix,
  variant = "dark",
  warningText = "This will open a new window to Logixboard tracking"
}: TrackingSearchProps) {
  const [trackingNumber, setTrackingNumber] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingNumber.trim() && urlPrefix) {
      // Open Logixboard search in a new tab (same behavior as TrackingWidget)
      window.open(
        `https://${urlPrefix}.logixboard.com/search?term=${encodeURIComponent(trackingNumber.trim())}`,
        '_blank',
        'noopener,noreferrer'
      )
    }
  }

  const isLight = variant === "light"
  
  return (
    <div className={cn("w-full", className)}>
      <form 
        onSubmit={handleSubmit}
        className="w-full"
      >
        <div className={cn(
          "relative flex items-center gap-1.5 p-1 rounded-md backdrop-blur-sm border border-neutral-400/50 bg-white"
        )}>
          <Input
            ref={inputRef}
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "border-0 border-b-0 pb-0 px-2.5 py-1 text-xs flex-1 placeholder:text-xs",
              isLight
                ? "text-neutral-800 placeholder:text-neutral-500"
                : "text-neutral-800 placeholder:text-neutral-500"
            )}
            style={{ 
              fontFamily: 'var(--font-jetbrains-mono), monospace',
            }}
          />
          <Button 
            type="submit"
            variant="hero"
            className="flex-shrink-0 !py-1.5 !px-4 !h-auto"
          >
            Track
          </Button>
        </div>
      </form>
      {warningText && (
        <p className="text-[10px] text-neutral-400 text-left mt-2">
          {warningText}
        </p>
      )}
    </div>
  )
}
