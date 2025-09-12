import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash-exp',
});

import { config } from 'dotenv';
config();

// Import all flows
import '@/ai/flows/ftc-chatbot.ts';
import '@/ai/flows/moderate-blog-comments.ts';
import '@/ai/flows/analyze-application.ts';
import '@/ai/flows/personal-advisor-chat.ts';