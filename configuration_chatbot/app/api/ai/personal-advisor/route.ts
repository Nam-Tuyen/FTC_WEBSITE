import { NextRequest, NextResponse } from 'next/server';
import { personalAdvisorChat, PersonalAdvisorChatInput } from '@/ai/flows/personal-advisor-chat';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { message, context } = body;
    
    // Validate required fields
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { 
          error: 'Invalid message',
          message: 'Message is required and must be a string'
        },
        { status: 400 }
      );
    }

    if (!context || typeof context !== 'object') {
      return NextResponse.json(
        { 
          error: 'Invalid context',
          message: 'Context object is required'
        },
        { status: 400 }
      );
    }

    // Validate context structure (basic validation)
    if (!context.department || typeof context.department !== 'string') {
      return NextResponse.json(
        { 
          error: 'Invalid context',
          message: 'Context must include department'
        },
        { status: 400 }
      );
    }

    const input: PersonalAdvisorChatInput = {
      message: message.trim(),
      context: {
        departmentInfo: context.departmentInfo,
        quizScores: context.quizScores,
        quizAnswers: context.quizAnswers,
        department: context.department,
        isReturningUser: context.isReturningUser || false,
        previousDepartments: context.previousDepartments || [],
        chatCount: context.chatCount || 1
      }
    };

    const result = await personalAdvisorChat(input);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[api/ai/personal-advisor] Error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to generate advisor response',
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}