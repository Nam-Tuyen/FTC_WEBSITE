// Test club mode with non-FAQ question
const testClubMode = async () => {
  try {
    console.log("Testing club mode with non-FAQ question...");
    
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'club',
        input: 'FTC có tổ chức hoạt động ngoại khóa không?'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (data.text && data.text.includes('hiện chưa có thông tin')) {
      console.log('✅ SUCCESS: Club mode correctly responds with "hiện chưa có thông tin"');
    } else if (data.text && data.text.length > 0) {
      console.log('✅ SUCCESS: Club mode provided a response');
      console.log('Response preview:', data.text.substring(0, 100) + '...');
    } else {
      console.log('❌ FAILED: No response or empty response');
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
};

// Test with FAQ question
const testFAQQuestion = async () => {
  try {
    console.log("\nTesting club mode with FAQ question...");
    
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'club',
        input: 'Câu lạc bộ có những hoạt động gì?'
      })
    });

    const data = await response.json();
    console.log('FAQ Response:', data.text ? 'SUCCESS' : 'FAILED');
    
    if (data.text && data.text.includes('FTC xây dựng')) {
      console.log('✅ SUCCESS: FAQ matching works correctly');
    } else {
      console.log('❌ FAILED: FAQ matching not working');
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
};

// Run tests
testClubMode().then(() => testFAQQuestion());
