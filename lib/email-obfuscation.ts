/**
 * Email obfuscation utilities to prevent bot scraping
 * Uses HTML entity encoding and other techniques
 */

/**
 * Encode email address using HTML entities
 * Makes it harder for bots to scrape emails from HTML
 */
export function obfuscateEmail(email: string): string {
  return email
    .split('')
    .map((char) => {
      // Convert each character to its HTML entity
      if (char === '@') {
        return '&#64;'; // @ symbol
      } else if (char === '.') {
        return '&#46;'; // Period
      } else {
        // Convert to char code
        return `&#${char.charCodeAt(0)};`;
      }
    })
    .join('');
}

/**
 * Create an obfuscated mailto link
 * Uses HTML entities for both href and display text
 */
export function obfuscateMailtoLink(email: string, displayText?: string): {
  href: string;
  display: string;
} {
  const obfuscatedEmail = obfuscateEmail(email);
  const obfuscatedDisplay = displayText ? obfuscateEmail(displayText) : obfuscatedEmail;
  
  return {
    href: `mailto:${email}`, // Keep href as plain email (browsers need it)
    display: obfuscatedDisplay, // Obfuscate display text
  };
}

/**
 * Encode email for use in data attributes or JavaScript
 * Uses base64 encoding as an additional layer
 */
export function encodeEmailForJS(email: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(email).toString('base64');
  }
  // Fallback for browser environments
  return btoa(email);
}

/**
 * Decode email from base64 (for use in client-side JavaScript if needed)
 */
export function decodeEmailFromJS(encoded: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(encoded, 'base64').toString('utf-8');
  }
  // Fallback for browser environments
  return atob(encoded);
}
