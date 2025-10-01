/**
 * Test script for Google Sheets API
 * Run with: npx tsx googleSheetApi/test-api.ts
 * 
 * Note: Update WEB_APP_URL in sheet.ts before testing
 */

import {
  login,
  registerUser,
  fetchQuestions,
  createQuestion,
  createResponse,
  toggleLike,
  deleteResponse,
  deleteQuestion,
  forgotPasswordGetQuestions,
  forgotPasswordReset,
} from './sheet'

// Test data
const testMSSV = 'K225123456'
const testPassword = 'testpassword123'
const testFullName = 'Nguyễn Văn Test'
const testEmail = 'test@student.hcmus.edu.vn'

async function testAuth() {
  console.log('\n=== Testing Authentication ===\n')

  // Test 1: Register
  console.log('1. Testing registerUser...')
  const registerResp = await registerUser({
    mssv: testMSSV,
    password: testPassword,
    full_name: testFullName,
    email: testEmail,
    sec_q1: 'Tên thú cưng?',
    sec_a1: 'mèo',
    sec_q2: 'Màu yêu thích?',
    sec_a2: 'xanh',
    sec_q3: 'Sở thích?',
    sec_a3: 'đọc sách',
  })
  console.log('Register result:', registerResp)
  console.log('Status:', registerResp.ok ? '✅ Success' : '❌ Failed')

  // Test 2: Login
  console.log('\n2. Testing login...')
  const loginResp = await login({
    mssv: testMSSV,
    password: testPassword,
  })
  console.log('Login result:', loginResp)
  console.log('Status:', loginResp.ok ? '✅ Success' : '❌ Failed')

  // Test 3: Get security questions
  console.log('\n3. Testing forgotPasswordGetQuestions...')
  const questionsResp = await forgotPasswordGetQuestions({ mssv: testMSSV })
  console.log('Questions result:', questionsResp)
  console.log('Status:', questionsResp.ok ? '✅ Success' : '❌ Failed')

  // Test 4: Reset password (commented out to avoid changing password)
  // console.log('\n4. Testing forgotPasswordReset...')
  // const resetResp = await forgotPasswordReset({
  //   mssv: testMSSV,
  //   answers: { a1: 'mèo', a2: 'xanh', a3: 'đọc sách' },
  //   new_password: 'newpassword123',
  // })
  // console.log('Reset result:', resetResp)
  // console.log('Status:', resetResp.ok ? '✅ Success' : '❌ Failed')
}

async function testForum() {
  console.log('\n=== Testing Forum ===\n')

  let questionId = ''
  let responseId = ''

  // Test 1: Create question
  console.log('1. Testing createQuestion...')
  const createQResp = await createQuestion({
    title: 'Test Question - Hỏi về AI',
    category: 'Hỏi về ngành học',
    user: testMSSV,
    content: 'Đây là câu hỏi test về AI và Machine Learning',
    anonymous: false,
  })
  console.log('Create question result:', createQResp)
  console.log('Status:', createQResp.ok ? '✅ Success' : '❌ Failed')
  if (createQResp.ok && createQResp.data) {
    questionId = createQResp.data.id
    console.log('Question ID:', questionId)
  }

  // Test 2: Fetch questions
  console.log('\n2. Testing fetchQuestions...')
  const fetchResp = await fetchQuestions({
    take: 5,
    category: 'Hỏi về ngành học',
  })
  console.log('Fetch questions result:')
  console.log('- Total items:', fetchResp.data?.items.length || 0)
  console.log('- Status:', fetchResp.ok ? '✅ Success' : '❌ Failed')
  if (fetchResp.ok && fetchResp.data) {
    console.log('- First 2 questions:')
    fetchResp.data.items.slice(0, 2).forEach((q, i) => {
      console.log(`  ${i + 1}. ${q.title} (likes: ${q.like_count}, responses: ${q.responses.length})`)
    })
  }

  // Test 3: Create response
  if (questionId) {
    console.log('\n3. Testing createResponse...')
    const createRResp = await createResponse({
      user: testMSSV,
      anonymous: false,
      content: 'Đây là phản hồi test cho câu hỏi',
      questionId: questionId,
    })
    console.log('Create response result:', createRResp)
    console.log('Status:', createRResp.ok ? '✅ Success' : '❌ Failed')
    if (createRResp.ok && createRResp.data) {
      responseId = createRResp.data.id
      console.log('Response ID:', responseId)
    }
  }

  // Test 4: Toggle like
  if (questionId) {
    console.log('\n4. Testing toggleLike (like)...')
    const likeResp = await toggleLike({
      questionId: questionId,
      mssv: testMSSV,
      like: 1,
    })
    console.log('Like result:', likeResp)
    console.log('Status:', likeResp.ok ? '✅ Success' : '❌ Failed')
    if (likeResp.ok && likeResp.data) {
      console.log('New like count:', likeResp.data.like_count)
    }

    console.log('\n5. Testing toggleLike (unlike)...')
    const unlikeResp = await toggleLike({
      questionId: questionId,
      mssv: testMSSV,
      like: 0,
    })
    console.log('Unlike result:', unlikeResp)
    console.log('Status:', unlikeResp.ok ? '✅ Success' : '❌ Failed')
    if (unlikeResp.ok && unlikeResp.data) {
      console.log('New like count:', unlikeResp.data.like_count)
    }
  }

  // Test 5: Search
  console.log('\n6. Testing fetchQuestions with search...')
  const searchResp = await fetchQuestions({
    search: 'test',
  })
  console.log('Search result:')
  console.log('- Found items:', searchResp.data?.items.length || 0)
  console.log('- Status:', searchResp.ok ? '✅ Success' : '❌ Failed')

  // Test 6: Delete response (cleanup)
  if (responseId) {
    console.log('\n7. Testing deleteResponse...')
    const delRResp = await deleteResponse({
      responseId: responseId,
      mssv: testMSSV,
    })
    console.log('Delete response result:', delRResp)
    console.log('Status:', delRResp.ok ? '✅ Success' : '❌ Failed')
  }

  // Test 7: Delete question (cleanup)
  if (questionId) {
    console.log('\n8. Testing deleteQuestion...')
    const delQResp = await deleteQuestion({
      questionId: questionId,
      mssv: testMSSV,
    })
    console.log('Delete question result:', delQResp)
    console.log('Status:', delQResp.ok ? '✅ Success' : '❌ Failed')
  }
}

async function runTests() {
  console.log('╔════════════════════════════════════════╗')
  console.log('║   Google Sheets API Test Suite        ║')
  console.log('╚════════════════════════════════════════╝')

  try {
    // Run auth tests
    await testAuth()

    // Run forum tests
    await testForum()

    console.log('\n╔════════════════════════════════════════╗')
    console.log('║   All Tests Completed                  ║')
    console.log('╚════════════════════════════════════════╝\n')
  } catch (error) {
    console.error('\n❌ Test suite failed with error:', error)
  }
}

// Run tests
runTests()

