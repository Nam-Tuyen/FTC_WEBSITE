/**
 * Test script for Knowledge Management System
 * Run with: npm run test:knowledge
 */

import { config } from 'dotenv';
config();

import { knowledgeManager } from '../lib/knowledge-manager';

async function testKnowledgeManager() {
  console.log('\n📚 Testing Knowledge Manager...');
  
  try {
    // Test loading knowledge
    console.log('\n🔄 Loading knowledge base...');
    await knowledgeManager.loadAllKnowledge();
    
    // Test getting stats
    console.log('\n📊 Getting stats...');
    const stats = knowledgeManager.getStats();
    console.log('Stats:', {
      totalItems: stats.totalItems,
      categories: Object.keys(stats.categories),
      categoryCounts: stats.categories
    });
    
    // Test search functionality
    console.log('\n🔍 Testing search...');
    const searchResults = knowledgeManager.search('FTC');
    console.log(`Found ${searchResults.length} items for "FTC"`);
    
    if (searchResults.length > 0) {
      console.log('First result:', {
        title: searchResults[0].title,
        category: searchResults[0].category,
        tags: searchResults[0].tags
      });
    }
    
    // Test category filtering
    console.log('\n📂 Testing category filter...');
    const ftcItems = knowledgeManager.getByCategory('ftc');
    console.log(`Found ${ftcItems.length} items in "ftc" category`);
    
    // Test formatted content for chatbot
    console.log('\n🤖 Testing formatted content...');
    const formattedContent = knowledgeManager.getFormattedContent();
    console.log(`Formatted content length: ${formattedContent.length} characters`);
    console.log('First 200 chars:', formattedContent.substring(0, 200) + '...');
    
    // Test adding new knowledge
    console.log('\n➕ Testing add knowledge...');
    try {
      const newItem = await knowledgeManager.addKnowledge({
        title: 'Test Knowledge Item',
        content: 'This is a test knowledge item created by the test script.',
        category: 'test',
        tags: ['test', 'script', 'demo'],
        fileType: 'md'
      });
      
      console.log('✅ Successfully added new knowledge item:', {
        id: newItem.id,
        title: newItem.title,
        category: newItem.category
      });
      
    } catch (error) {
      console.log('❌ Failed to add knowledge:', error);
    }
    
    console.log('\n✅ Knowledge Manager tests completed!');
    
  } catch (error) {
    console.error('❌ Knowledge Manager test failed:', error);
  }
}

async function testAPIs() {
  console.log('\n🌐 Testing Knowledge APIs...');
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    // Test GET /api/knowledge (stats)
    console.log('\n📊 Testing GET /api/knowledge?stats=true...');
    const statsResponse = await fetch(`${baseUrl}/api/knowledge?stats=true`);
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Stats API response:', statsData.data);
    } else {
      console.log('❌ Stats API failed:', statsResponse.status);
    }
    
    // Test GET /api/knowledge (all items)
    console.log('\n📋 Testing GET /api/knowledge...');
    const allResponse = await fetch(`${baseUrl}/api/knowledge`);
    if (allResponse.ok) {
      const allData = await allResponse.json();
      console.log(`✅ Found ${allData.total} knowledge items`);
    } else {
      console.log('❌ All items API failed:', allResponse.status);
    }
    
    // Test search
    console.log('\n🔍 Testing search API...');
    const searchResponse = await fetch(`${baseUrl}/api/knowledge?q=FTC`);
    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      console.log(`✅ Search found ${searchData.total} items for "FTC"`);
    } else {
      console.log('❌ Search API failed:', searchResponse.status);
    }
    
    console.log('\n✅ API tests completed!');
    
  } catch (error) {
    console.error('❌ API tests failed:', error);
    console.log('Note: Make sure the development server is running (npm run dev)');
  }
}

async function testChatbotIntegration() {
  console.log('\n🤖 Testing Chatbot Integration...');
  
  try {
    const { ftcChatbot } = await import('../ai/flows/ftc-chatbot');
    
    const testMessage = "FTC là gì? Câu lạc bộ này có những hoạt động gì?";
    console.log(`\n💬 Testing message: "${testMessage}"`);
    
    const result = await ftcChatbot({
      message: testMessage,
      history: [],
      mode: 'club'
    });
    
    console.log('✅ Chatbot response received:');
    console.log('Response length:', result.response.length);
    console.log('Source:', result.source);
    console.log('Suggestions count:', result.suggestions?.length || 0);
    console.log('First 200 chars:', result.response.substring(0, 200) + '...');
    
    if (result.suggestions && result.suggestions.length > 0) {
      console.log('Sample suggestions:', result.suggestions.slice(0, 3));
    }
    
    console.log('\n✅ Chatbot integration test completed!');
    
  } catch (error) {
    console.error('❌ Chatbot integration test failed:', error);
    console.log('Note: Make sure GEMINI_API_KEY is set in your .env file');
  }
}

async function runAllTests() {
  console.log('🚀 Starting Knowledge System Tests...\n');
  console.log('=' .repeat(50));
  
  await testKnowledgeManager();
  console.log('\n' + '=' .repeat(50));
  
  await testAPIs();
  console.log('\n' + '=' .repeat(50));
  
  await testChatbotIntegration();
  console.log('\n' + '=' .repeat(50));
  
  console.log('\n🎉 All Knowledge System tests completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Visit http://localhost:3000/admin/knowledge to use the admin interface');
  console.log('2. Test the chatbot at http://localhost:3000/chatbot');
  console.log('3. Add more knowledge by creating files in knowledge_base/ directory');
}

// Run tests
runAllTests().catch(console.error);