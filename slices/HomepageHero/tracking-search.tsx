"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TrackingSearchProps {
  className?: string;
  heading?: string;
  placeholder?: string;
  urlPrefix: string;
  variant?: "light" | "dark";
  warningText?: string;
}

export function TrackingSearch({ 
  className,
  heading,
  placeholder = "Enter tracking number...",
  urlPrefix,
  variant = "dark",
  warningText = "This will open a new window to Logixboard tracking"
}: TrackingSearchProps) {
  const [trackingNumber, setTrackingNumber] = React.useState("")
  const [error, setError] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous error
    setError("")
    
    const trimmed = trackingNumber.trim()
    
    if (!trimmed) {
      setError("Please enter a tracking number")
      inputRef.current?.focus()
      return
    }
    
    if (trimmed.length < 5) {
      setError("Please enter at least 5 characters")
      inputRef.current?.focus()
      return
    }
    
    if (trimmed.length > 50) {
      setError("Tracking number is too long")
      inputRef.current?.focus()
      return
    }
    
    // Must contain at least one letter or digit (handles paste errors, symbols-only input)
    if (!/[a-zA-Z0-9]/.test(trimmed)) {
      setError("Please enter a valid tracking number")
      inputRef.current?.focus()
      return
    }
    
    if (urlPrefix) {
      // Open Logixboard search in a new tab (same behavior as TrackingWidget)
      window.open(
        `https://${urlPrefix}.logixboard.com/search?term=${encodeURIComponent(trimmed)}`,
        '_blank',
        'noopener,noreferrer'
      )
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackingNumber(e.target.value)
    // Clear error when user starts typing
    if (error) {
      setError("")
    }
  }

  React.useEffect(() => {
    if (!error) return
    const timer = setTimeout(() => setError(""), 5000)
    return () => clearTimeout(timer)
  }, [error])

  const isLight = variant === "light"
  
  return (
    <div className={cn("w-full", className)}>
      {(heading || warningText || error) && (
        <div className="flex items-center gap-1.5 mb-3">
          {heading && (
            <h3 className="text-neutral-800 text-left text-sm lg:text-base font-medium m-0">
              {heading}
            </h3>
          )}
          {warningText && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="text-neutral-400 hover:text-neutral-600 transition-colors p-0.5 rounded -ml-0.5"
                  aria-label="More information"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" className="max-w-[260px] p-3 text-[11px] text-neutral-600">
                {warningText}
              </PopoverContent>
            </Popover>
          )}
        </div>
      )}
      {error ? (
        <Popover open>
          <PopoverAnchor asChild>
            <form
              onSubmit={handleSubmit}
              className="w-full"
            >
              <div className={cn(
                "relative flex items-center gap-1.5 p-1 rounded-md backdrop-blur-sm border bg-white transition-colors",
                "border-red-400/70"
              )}>
                <Input
                  ref={inputRef}
                  type="text"
                  value={trackingNumber}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={cn(
                    "border-0 border-b-0 pb-0 px-2 py-1 text-[11px] lg:text-xs flex-1 placeholder:text-[11px] lg:placeholder:text-xs transition-colors",
                    isLight
                      ? "text-neutral-800 placeholder:text-neutral-500"
                      : "text-neutral-800 placeholder:text-neutral-500",
                    "placeholder:text-red-400/70"
                  )}
                  style={{ 
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                  }}
                />
                <Button 
                  type="submit"
                  variant="hero"
                  className="flex-shrink-0 !py-1.5 !px-3 lg:!px-4 !h-auto !text-[11px] lg:!text-sm !bg-dark-blue hover:!bg-dark-blue/90"
                >
                  Track
                </Button>
              </div>
            </form>
          </PopoverAnchor>
          <PopoverContent
            side="top"
            align="start"
            sideOffset={6}
            className="w-fit max-w-[260px] p-3 pr-8 border border-red-200 bg-red-50 text-neutral-800 shadow-lg relative rounded-none"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <p className="text-[11px] text-red-500 animate-in fade-in duration-200">
              {error}
            </p>
            <button
              type="button"
              onClick={() => setError("")}
              className="absolute top-3 right-2 p-0.5 rounded text-red-500 hover:text-red-600 transition-colors"
              aria-label="Dismiss error"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </PopoverContent>
        </Popover>
      ) : (
        <form 
          onSubmit={handleSubmit}
          className="w-full"
        >
          <div className={cn(
            "relative flex items-center gap-1.5 p-1 rounded-md backdrop-blur-sm border bg-white transition-colors",
            "border-neutral-400/50"
          )}>
            <Input
              ref={inputRef}
              type="text"
              value={trackingNumber}
              onChange={handleChange}
              placeholder={placeholder}
              className={cn(
                "border-0 border-b-0 pb-0 px-2 py-1 text-[11px] lg:text-xs flex-1 placeholder:text-[11px] lg:placeholder:text-xs transition-colors",
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
              className="flex-shrink-0 !py-1.5 !px-3 lg:!px-4 !h-auto !text-[11px] lg:!text-sm !bg-dark-blue hover:!bg-dark-blue/90"
            >
              Track
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
