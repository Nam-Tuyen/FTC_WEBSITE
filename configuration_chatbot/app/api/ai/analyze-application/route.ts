import { NextRequest, NextResponse } from 'next/server';
import { analyzeApplication, AnalyzeApplicationInput } from '@/ai/flows/analyze-application';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { reason, expectation, situation } = body;
    
    // Validate required fields
    if (!reason || !expectation || !situation) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          message: 'reason, expectation, and situation are required'
        },
        { status: 400 }
      );
    }

    if (typeof reason !== 'string' || typeof expectation !== 'string' || typeof situation !== 'string') {
      return NextResponse.json(
        { 
          error: 'Invalid field types',
          message: 'All fields must be strings'
        },
        { status: 400 }
      );
    }

    const input: AnalyzeApplicationInput = {
      reason: reason.trim(),
      expectation: expectation.trim(),
      situation: situation.trim()
    };

    const result = await analyzeApplication(input);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[api/ai/analyze-application] Error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to analyze application',
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}