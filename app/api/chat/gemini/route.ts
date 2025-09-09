import { GoogleGenerativeAI } from "@google/generative-ai";
import { matchSuggestedQuestion, buildGroundedPrompt } from '@/lib/faq-grounding'

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes timeout

// Validate environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not configured in environment variables');
}

const MODEL_NAME = "gemini-pro";

// Initialize Gemini with validated API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: MODEL_NAME,
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  }
});

// Validate and parse request body
async function parseRequest(req: Request) {
  try {
    const clonedReq = req.clone ? req.clone() : req;
    const body = await clonedReq.json();
    
    if (!body.message || typeof body.message !== 'string') {
      throw new Error('Invalid message format');
    }

    const history = body.history || [];
    if (!Array.isArray(history)) {
      throw new Error('Invalid history format');
    }

    return { message: body.message.trim(), history };
  } catch (error) {
    throw new Error('Invalid request body');
  }
}

export async function POST(req: Request) {
  try {
    // Validate request
    const { message, history } = await parseRequest(req);
    if (!message) {
      return new Response(
        JSON.stringify({ error: true, message: 'Message cannot be empty' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check for suggested questions first
    try {
      const suggestedResponse = await matchSuggestedQuestion(message);
      if (suggestedResponse) {
        return new Response(
          JSON.stringify({ 
            response: suggestedResponse,
            source: 'faq',
            model: 'static'
          }), 
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
    } catch (error) {
      console.warn('Error checking suggested questions:', error);
      // Continue with Gemini if FAQ check fails
    }

    // Build prompt with context
    const prompt = await buildGroundedPrompt(message);

    // Start chat with retry mechanism
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        const chat = model.startChat({
          history: history?.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: msg.content,
          })) || [],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        if (!text) {
          throw new Error('Empty response from Gemini');
        }

        return new Response(
          JSON.stringify({ 
            response: text,
            source: 'gemini',
            model: MODEL_NAME,
            grounded: true
          }), 
          { headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error: any) {
        attempts++;
        if (attempts === maxAttempts) {
          throw error;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
      }
    }
  } catch (error: any) {
    console.error('Error in chat route:', error);
    
    // Determine appropriate error message and status
    let status = 500;
    let message = 'An unexpected error occurred';
    
    if (error.message === 'Invalid request body' || error.message === 'Message cannot be empty') {
      status = 400;
      message = error.message;
    } else if (error.message.includes('API key')) {
      message = 'Configuration error - please contact support';
    } else if (error.message.includes('SAFETY')) {
      status = 400;
      message = 'Content was filtered for safety reasons';
    }

    return new Response(
      JSON.stringify({ 
        error: true, 
        message,
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      }), 
      { 
        status,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
