// Utility function to test API connectivity
export const testApiConnection = async (token: string) => {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://89.35.125.136:8090/api/v1';
  
  console.log('Testing API connection to:', API_BASE);
  
  const tests = [
    {
      name: 'Owner Profile',
      url: `${API_BASE}/profile/owner`,
      method: 'GET'
    },
    {
      name: 'Company Profile', 
      url: `${API_BASE}/company/profile`,
      method: 'GET'
    },
    {
      name: 'My Studios',
      url: `${API_BASE}/studios/my`,
      method: 'GET'
    },
    {
      name: 'Owner Analytics',
      url: `${API_BASE}/owner/analytics`,
      method: 'GET'
    },
    {
      name: 'Room Types',
      url: `${API_BASE}/room-types`,
      method: 'GET'
    }
  ];

  const results = await Promise.allSettled(
    tests.map(async (test) => {
      try {
        const response = await fetch(test.url, {
          method: test.method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        return {
          name: test.name,
          url: test.url,
          status: response.status,
          ok: response.ok,
          success: response.ok
        };
      } catch (error) {
        return {
          name: test.name,
          url: test.url,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false
        };
      }
    })
  );

  console.log('API Test Results:');
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const test = result.value;
      console.log(`${test.name}: ${test.success ? '✅' : '❌'} (${test.status || 'Error'}) ${test.url}`);
      if (test.error) console.log(`  Error: ${test.error}`);
    } else {
      console.log(`Test ${index}: ❌ Failed - ${result.reason}`);
    }
  });

  return results;
};
