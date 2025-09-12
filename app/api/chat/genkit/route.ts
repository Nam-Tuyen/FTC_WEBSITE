import { NextRequest, NextResponse } from 'next/server';
import { ftcChatbot, FtcChatbotInput } from '@/ai/flows/ftc-chatbot';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes timeout
export const runtime = 'nodejs';

// Validate and parse request body
async function parseRequest(req: NextRequest) {
  try {
    const body = await req.json();

    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const history = Array.isArray(body.history) ? body.history : [];
    const mode = ['auto', 'club', 'domain'].includes(body.mode) ? body.mode : 'auto';

    if (!message) {
      throw new Error('Invalid message');
    }

    return { message, history, mode };
  } catch (error) {
    throw new Error('Invalid request body');
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('[api/chat/genkit] Incoming request');

    // Parse request
    const { message, history, mode } = await parseRequest(req);
    
    console.log('[api/chat/genkit] Processing message:', {
      messageLength: message.length,
      historyLength: history.length,
      mode
    });

    // Prepare input for Genkit flow
    const input: FtcChatbotInput = {
      message,
      history,
      mode: mode as 'auto' | 'club' | 'domain'
    };

    // Call Genkit flow
    const result = await ftcChatbot(input);

    console.log('[api/chat/genkit] Response generated successfully');

    return NextResponse.json({
      response: result.response,
      source: result.source,
      suggestions: result.suggestions || []
    });

  } catch (error: any) {
    console.error('[api/chat/genkit] Error:', error);

    // Handle different types of errors
    if (error.message === 'Invalid request body' || error.message === 'Invalid message') {
      return NextResponse.json(
        { 
          error: 'Invalid request', 
          message: error.message 
        },
        { status: 400 }
      );
    }

    // Handle Genkit/AI specific errors
    if (error.message?.includes('API key') || error.message?.includes('GEMINI')) {
      return NextResponse.json(
        { 
          error: 'AI service unavailable', 
          code: 'NO_API_KEY',
          message: 'AI service is temporarily unavailable'
        },
        { status: 503 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Something went wrong. Please try again.',
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'FTC Chatbot (Genkit)',
    timestamp: new Date().toISOString()
  });
}