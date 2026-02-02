"use client";

import { useEffect, useState } from "react";

interface ObfuscatedEmailProps {
  email: string;
  className?: string;
  displayText?: string;
  isBase64Encoded?: boolean;
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
  displayText,
  isBase64Encoded = false
}: ObfuscatedEmailProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [decodedEmail, setDecodedEmail] = useState("");

  useEffect(() => {
    // Delay rendering to prevent immediate bot scraping
    const timer = setTimeout(() => {
      setIsMounted(true);
      // Decode email from base64 if encoded
      try {
        if (typeof window !== 'undefined') {
          if (isBase64Encoded) {
            // Decode base64 email
            const decoded = atob(email);
            setDecodedEmail(decoded);
          } else {
            setDecodedEmail(email);
          }
        }
      } catch (e) {
        // Fallback to plain email if decoding fails
        console.warn('Failed to decode email:', e);
        setDecodedEmail(email);
      }
    }, 100); // Small delay to prevent immediate scraping

    return () => clearTimeout(timer);
  }, [email, isBase64Encoded]);

  // Show placeholder or obfuscated version before mount
  if (!isMounted) {
    // Decode email first if it's base64 encoded, then obfuscate with HTML entities
    let emailToObfuscate = email;
    if (isBase64Encoded) {
      try {
        emailToObfuscate = typeof window !== 'undefined' ? atob(email) : email;
      } catch (e) {
        emailToObfuscate = email;
      }
    }
    
    // Show obfuscated version (HTML entities)
    const obfuscated = emailToObfuscate
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
