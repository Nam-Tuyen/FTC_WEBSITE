// Test API endpoint
const testAPI = async () => {
  try {
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

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (data.text && data.text.includes('FTC xây dựng')) {
      console.log('✅ SUCCESS: FAQ matching works correctly');
    } else {
      console.log('❌ FAILED: FAQ matching not working');
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
};

testAPI();
