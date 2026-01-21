/**
 * Simple file-based rate limiting for email actions
 * Uses a JSON file for persistence - lightweight, no external dependencies
 * Automatically cleans up expired entries
 */

import { promises as fs } from 'fs';
import path from 'path';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitStore {
  [key: string]: RateLimitEntry;
}

// File path for rate limit data
// Use .next directory (gitignored) or fallback to temp directory for serverless
const getRateLimitFilePath = (): string => {
  try {
    // Try .next directory first (works for traditional servers)
    const nextDir = path.join(process.cwd(), '.next');
    return path.join(nextDir, 'rate-limit.json');
  } catch {
    // Fallback for serverless (ephemeral, but works)
    return path.join('/tmp', 'rate-limit.json');
  }
};

const RATE_LIMIT_FILE = getRateLimitFilePath();

// In-memory cache for fast access (synced with file when possible)
let rateLimitCache: RateLimitStore = {};
let cacheInitialized = false;
let writeQueue: Promise<void> | null = null;
let fileSystemAvailable = true; // Track if file system is writable

/**
 * Load rate limit data from file
 */
async function loadRateLimitData(): Promise<RateLimitStore> {
  try {
    const data = await fs.readFile(RATE_LIMIT_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, return empty store
    return {};
  }
}

/**
 * Save rate limit data to file (debounced writes)
 * Falls back to in-memory only if file system is not writable (serverless)
 */
async function saveRateLimitData(data: RateLimitStore): Promise<void> {
  if (!fileSystemAvailable) return; // Skip if file system not available
  
  try {
    // Ensure directory exists
    await fs.mkdir(path.dirname(RATE_LIMIT_FILE), { recursive: true });
    // Write to temp file first, then rename (atomic write)
    const tempFile = `${RATE_LIMIT_FILE}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(data, null, 2));
    await fs.rename(tempFile, RATE_LIMIT_FILE);
  } catch (error) {
    // If file write fails, disable file system and continue with in-memory only
    // This is normal in serverless environments
    fileSystemAvailable = false;
  }
}

/**
 * Initialize cache from file (called once)
 * Falls back to empty cache if file system is not available
 */
async function initializeCache(): Promise<void> {
  if (cacheInitialized) return;
  
  try {
    rateLimitCache = await loadRateLimitData();
    // Clean up expired entries on load
    const now = Date.now();
    let hasChanges = false;
    for (const [key, entry] of Object.entries(rateLimitCache)) {
      if (now > entry.resetTime) {
        delete rateLimitCache[key];
        hasChanges = true;
      }
    }
    if (hasChanges && fileSystemAvailable) {
      await saveRateLimitData(rateLimitCache);
    }
    cacheInitialized = true;
  } catch (error) {
    // File system not available (serverless) - use in-memory only
    // This is expected and fine
    rateLimitCache = {};
    fileSystemAvailable = false;
    cacheInitialized = true;
  }
}

/**
 * Debounced save - batches writes to avoid excessive file I/O
 */
function debouncedSave(): void {
  if (writeQueue) return; // Already queued
  
  writeQueue = Promise.resolve().then(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    await saveRateLimitData(rateLimitCache);
    writeQueue = null;
  });
}

// Clean up old entries every 5 minutes and save
setInterval(async () => {
  const now = Date.now();
  let hasChanges = false;
  for (const [key, entry] of Object.entries(rateLimitCache)) {
    if (now > entry.resetTime) {
      delete rateLimitCache[key];
      hasChanges = true;
    }
  }
  if (hasChanges) {
    await saveRateLimitData(rateLimitCache);
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param maxRequests - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Rate limit result
 */
export async function checkRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 60 * 60 * 1000 // 1 hour default
): Promise<RateLimitResult> {
  // Initialize cache if needed
  await initializeCache();
  
  const now = Date.now();
  const entry = rateLimitCache[identifier];

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired one
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitCache[identifier] = newEntry;
    debouncedSave(); // Save asynchronously
    
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Entry exists and is still valid
  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  rateLimitCache[identifier] = entry;
  debouncedSave(); // Save asynchronously

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client identifier from request headers
 * Handles both direct connections and proxied connections (Vercel, etc.)
 */
export function getClientIdentifier(headers: Headers | Record<string, string | null>): string {
  // Helper to safely get header value
  const getHeader = (key: string): string | null => {
    if (headers instanceof Headers) {
      return headers.get(key) || headers.get(key.toLowerCase());
    }
    // Type guard for Record type
    const record = headers as Record<string, string | null>;
    return record[key] || record[key.toLowerCase()] || null;
  };

  // Try to get real IP from common proxy headers
  const forwardedFor = getHeader('x-forwarded-for') || getHeader('X-Forwarded-For');
  const realIp = getHeader('x-real-ip') || getHeader('X-Real-IP');
  
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    const ips = String(forwardedFor).split(',');
    return ips[0].trim();
  }
  
  if (realIp) {
    return String(realIp).trim();
  }
  
  // Fallback to a default identifier (shouldn't happen in production)
  return 'unknown';
}
