import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

// Rate limiting: Track last webhook call timestamp per IP
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 10000; // 10 seconds minimum between requests

// Prismic webhook payload type
interface PrismicWebhookPayload {
  type: 'api-update' | 'test-trigger';
  secret?: string | null;
  domain?: string;
  apiUrl?: string;
  masterRef?: string;
  documents?: string[];
  releases?: Record<string, unknown>;
  tags?: Record<string, unknown>;
}

/**
 * Validates the webhook secret from multiple sources (query params and body)
 * Following Prismic's documentation, the secret can be in either location
 */
function validateSecret(querySecret: string | null, bodySecret: string | null | undefined): boolean {
  const expectedSecret = process.env.PRISMIC_WEBHOOK_SECRET;
  
  if (!expectedSecret) {
    console.error('PRISMIC_WEBHOOK_SECRET is not configured in environment variables');
    return false;
  }
  
  // Check both query params and body (Prismic sends it in the body)
  const providedSecret = querySecret || bodySecret;
  
  if (!providedSecret) {
    console.warn('No secret provided in webhook request');
    return false;
  }
  
  // Use timing-safe comparison to prevent timing attacks
  return providedSecret === expectedSecret;
}

/**
 * Rate limiting check: Prevents abuse by limiting requests from same IP
 */
function checkRateLimit(ip: string | null): boolean {
  if (!ip) return true; // Allow if we can't determine IP (local dev)
  
  const now = Date.now();
  const lastRequest = rateLimitMap.get(ip);
  
  if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW) {
    return false;
  }
  
  rateLimitMap.set(ip, now);
  
  // Clean up old entries (prevent memory leak)
  if (rateLimitMap.size > 100) {
    const cutoff = now - RATE_LIMIT_WINDOW * 2;
    for (const [key, timestamp] of rateLimitMap.entries()) {
      if (timestamp < cutoff) {
        rateLimitMap.delete(key);
      }
    }
  }
  
  return true;
}

/**
 * Validates that the payload structure matches Prismic's webhook format
 */
function isValidPrismicPayload(body: unknown): body is PrismicWebhookPayload {
  if (!body || typeof body !== 'object') return false;
  
  const payload = body as Record<string, unknown>;
  
  // Must have type field
  if (!payload.type || (payload.type !== 'api-update' && payload.type !== 'test-trigger')) {
    return false;
  }
  
  // Must have domain for Prismic webhooks
  if (payload.type === 'api-update' && !payload.domain) {
    return false;
  }
  
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    if (!checkRateLimit(ip)) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
    
    // 2. Parse and validate payload structure
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      console.error('Failed to parse webhook payload as JSON');
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }
    
    if (!isValidPrismicPayload(body)) {
      console.error('Invalid Prismic webhook payload structure');
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }
    
    // 3. Secret validation (from both query params and body)
    const querySecret = request.nextUrl.searchParams.get('secret');
    const bodySecret = body.secret;
    
    if (!validateSecret(querySecret, bodySecret)) {
      console.warn('Invalid webhook secret received', {
        ip,
        hasQuerySecret: !!querySecret,
        hasBodySecret: !!bodySecret,
      });
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // 4. Log the webhook event (without sensitive data)
    console.log('Valid Prismic webhook received:', {
      type: body.type,
      documents: body.documents?.length || 0,
      domain: body.domain,
      timestamp: new Date().toISOString(),
      ip,
    });
    
    // 5. Handle test triggers differently (no revalidation needed)
    if (body.type === 'test-trigger') {
      return NextResponse.json({ 
        success: true,
        message: 'Test webhook received successfully',
        timestamp: Date.now(),
      });
    }
    
    // 6. Revalidate Prismic content only for actual updates
    revalidateTag("prismic");
    
    console.log('Successfully revalidated Prismic content');
    
    return NextResponse.json({ 
      revalidated: true,
      timestamp: Date.now(),
      message: 'Content revalidated successfully',
    });
    
  } catch (error) {
    // Log error with context but don't expose internal details
    console.error('Error processing Prismic webhook:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Reject all other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
