// Simple API test script
// Run with: node test-api.js

const API_BASE = 'http://localhost:5000/api';

const testAPI = async () => {
  try {
    // Test health endpoint
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);

    // Test user registration
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });

    if (registerResponse.ok) {
      const userData = await registerResponse.json();
      console.log('✅ Registration successful');
      
      // Test creating an expense
      const expenseData = {
        title: 'Test Expense',
        amount: 25.50,
        category: 'Food',
        description: 'Test expense description'
      };

      const expenseResponse = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`
        },
        body: JSON.stringify(expenseData)
      });

      if (expenseResponse.ok) {
        console.log('✅ Expense creation successful');
      } else {
        console.log('❌ Expense creation failed');
      }
    } else {
      console.log('❌ Registration failed - user might already exist');
    }

  } catch (error) {
    console.error('❌ API Test Error:', error.message);
  }
};

// Uncomment to run tests
// testAPI();