/**
 * Test script for Genkit AI flows
 * Run with: npx tsx scripts/test-genkit.ts
 */

import { config } from 'dotenv';
config();

import { ftcChatbot } from '../ai/flows/ftc-chatbot';
import { moderateBlogComments } from '../ai/flows/moderate-blog-comments';
import { analyzeApplication } from '../ai/flows/analyze-application';
import { personalAdvisorChat } from '../ai/flows/personal-advisor-chat';

async function testFtcChatbot() {
  console.log('\n🤖 Testing FTC Chatbot...');
  try {
    const result = await ftcChatbot({
      message: "FTC là gì? Câu lạc bộ này có những hoạt động gì?",
      history: [],
      mode: 'club'
    });
    
    console.log('✅ FTC Chatbot Response:');
    console.log('Response:', result.response.substring(0, 200) + '...');
    console.log('Source:', result.source);
    console.log('Suggestions:', result.suggestions?.slice(0, 3));
  } catch (error) {
    console.error('❌ FTC Chatbot Error:', error);
  }
}

async function testModerateComments() {
  console.log('\n🛡️ Testing Comment Moderation...');
  try {
    const result = await moderateBlogComments({
      comment: "Bài viết hay quá! Cảm ơn bạn đã chia sẻ."
    });
    
    console.log('✅ Comment Moderation Result:');
    console.log('Is Safe:', result.isSafe);
    console.log('Reason:', result.reason || 'No reason provided');
  } catch (error) {
    console.error('❌ Comment Moderation Error:', error);
  }
}

async function testAnalyzeApplication() {
  console.log('\n📝 Testing Application Analysis...');
  try {
    const result = await analyzeApplication({
      reason: "Tôi muốn tham gia FTC để học hỏi thêm về FinTech và phát triển kỹ năng chuyên môn.",
      expectation: "Tôi hy vọng sẽ được tham gia các dự án thực tế và kết nối với những người cùng chí hướng.",
      situation: "Nếu có xung đột trong nhóm, tôi sẽ lắng nghe ý kiến của mọi người và tìm cách giải quyết một cách hòa bình."
    });
    
    console.log('✅ Application Analysis Result:');
    console.log('Analysis:', result.analysis);
  } catch (error) {
    console.error('❌ Application Analysis Error:', error);
  }
}

async function testPersonalAdvisor() {
  console.log('\n💬 Testing Personal Advisor...');
  try {
    const result = await personalAdvisorChat({
      message: "Mình có thể tham gia những hoạt động gì trong ban này?",
      context: {
        departmentInfo: {
          name: "Ban Truyền thông & Kỹ thuật",
          description: "Quản lý hạ tầng công nghệ, thiết kế đồ họa, phát triển website",
          strengths: ["Sáng tạo", "Kỹ thuật"],
          weaknesses: ["Giao tiếp"]
        },
        quizScores: {
          A: 7,
          B: 3,
          C: 5,
          D: 4
        },
        department: "A",
        isReturningUser: false,
        chatCount: 1
      }
    });
    
    console.log('✅ Personal Advisor Response:');
    console.log('Response:', result.response.substring(0, 200) + '...');
  } catch (error) {
    console.error('❌ Personal Advisor Error:', error);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Genkit Flow Tests...');
  
  // Check if API key is configured
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    console.error('❌ No API key found. Please set GEMINI_API_KEY or GOOGLE_API_KEY in your .env file');
    process.exit(1);
  }
  
  await testFtcChatbot();
  await testModerateComments();
  await testAnalyzeApplication();
  await testPersonalAdvisor();
  
  console.log('\n✨ All tests completed!');
}

// Run tests
runAllTests().catch(console.error);