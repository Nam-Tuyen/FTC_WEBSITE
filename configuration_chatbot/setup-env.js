#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment for FTC Website...\n');

// Create .env.local file
const envContent = `# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_API_KEY=your_gemini_api_key_here

# Next.js Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=

# Supabase Configuration (if needed)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
`;

const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
  console.log('⚠️  Please update GEMINI_API_KEY in .env.local with your actual API key');
} else {
  console.log('ℹ️  .env.local already exists');
}

// Check if knowledge base directory exists
const kbDir = path.join(__dirname, 'backend', 'data', 'knowledge_base');
if (!fs.existsSync(kbDir)) {
  fs.mkdirSync(kbDir, { recursive: true });
  console.log('✅ Created knowledge base directory');
} else {
  console.log('ℹ️  Knowledge base directory already exists');
}

console.log('\n🚀 Setup complete! Next steps:');
console.log('1. Get your Gemini API key from: https://makersuite.google.com/app/apikey');
console.log('2. Update GEMINI_API_KEY in .env.local');
console.log('3. Run: npm run dev');
console.log('4. Test the chatbot at: http://localhost:3000/chatbot');
