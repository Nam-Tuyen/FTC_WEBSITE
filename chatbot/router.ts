// chatbot/router.ts

import { ChatMode } from './types';
import { SYSTEM_PROMPT_CLUB, SYSTEM_PROMPT_INDUSTRY } from '@/prompts/system';

export function normalize(s: string) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function detectMode(question: string): ChatMode {
  const q = normalize(question);
  const clubHints = [
    'cau lac bo','ftc','ban hoc thuat','ban su kien','ban truyen thong',
    'ban tai chinh ca nhan','ban nhan su','tuyen thanh vien','lich sinh hoat',
    'thanh tich','fanpage','mentor','on boarding','cuoc thi attacker'
  ];
  return clubHints.some(k => q.includes(k)) ? 'club' : 'industry';
}

export function buildSystemPrompt(mode: ChatMode) {
  return mode === 'club' ? SYSTEM_PROMPT_CLUB : SYSTEM_PROMPT_INDUSTRY;
}
