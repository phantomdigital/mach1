import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { safeEqual } from "@/lib/security";

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

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

function validateSecret(bodySecret: string | null | undefined): boolean {
  const expectedSecret = process.env.PRISMIC_WEBHOOK_SECRET;
  
  if (!expectedSecret) {
    console.error('PRISMIC_WEBHOOK_SECRET is not configured in environment variables');
    return false;
  }
  
  if (!bodySecret) {
    console.warn('No secret provided in webhook request');
    return false;
  }
  
  return safeEqual(bodySecret, expectedSecret);
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
    const ip = getClientIdentifier(request.headers);
    const rate = await checkRateLimit(`prismic-webhook:${ip}`, 30, 60_000);
    if (!rate.allowed) {
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
    
    const bodySecret = body.secret;
    
    if (!validateSecret(bodySecret)) {
      console.warn('Invalid webhook secret received', {
        ip,
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
    revalidateTag("prismic", "max");
    
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
