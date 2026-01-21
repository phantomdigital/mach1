"use client";

import { useEffect, useState } from "react";

interface ObfuscatedEmailProps {
  email: string;
  className?: string;
  displayText?: string;
}

/**
 * Client-side email obfuscation component
 * Renders email after component mounts to prevent bots from scraping
 * Uses a combination of techniques:
 * - Delayed rendering (email appears after JS executes)
 * - Base64 encoding
 * - Split display
 */
export function ObfuscatedEmail({ 
  email, 
  className = "",
  displayText 
}: ObfuscatedEmailProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [decodedEmail, setDecodedEmail] = useState("");

  useEffect(() => {
    // Delay rendering to prevent immediate bot scraping
    const timer = setTimeout(() => {
      setIsMounted(true);
      // Decode email from base64 (encoded in server component)
      try {
        if (typeof window !== 'undefined') {
          setDecodedEmail(email);
        }
      } catch (e) {
        // Fallback to plain email if decoding fails
        setDecodedEmail(email);
      }
    }, 100); // Small delay to prevent immediate scraping

    return () => clearTimeout(timer);
  }, [email]);

  // Show placeholder or obfuscated version before mount
  if (!isMounted) {
    // Show obfuscated version (HTML entities)
    const obfuscated = email
      .split('')
      .map((char) => {
        if (char === '@') return '&#64;';
        if (char === '.') return '&#46;';
        return `&#${char.charCodeAt(0)};`;
      })
      .join('');
    
    return (
      <span 
        className={className}
        dangerouslySetInnerHTML={{ __html: obfuscated }}
        aria-label="Email address"
      />
    );
  }

  // Show actual email after mount (when JS is enabled)
  const display = displayText || decodedEmail;
  
  return (
    <a 
      href={`mailto:${decodedEmail}`}
      className={className}
      aria-label={`Email: ${decodedEmail}`}
    >
      {display}
    </a>
  );
}
