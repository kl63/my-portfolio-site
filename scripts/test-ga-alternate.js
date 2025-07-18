// Load environment variables
import dotenv from 'dotenv';
import { sign } from 'jsonwebtoken';

dotenv.config({ path: '.env.local' });

// Environment variables 
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const PROPERTY_ID = process.env.GA_PROPERTY_ID;

console.log('Testing Google Analytics with alternate approach:');
console.log('- Email:', CLIENT_EMAIL);
console.log('- Property ID:', PROPERTY_ID);
console.log('- Private Key Available:', !!PRIVATE_KEY);

// Create a JWT token with slightly different scopes
const createToken = () => {
  if (!CLIENT_EMAIL || !PRIVATE_KEY) {
    throw new Error('Missing required environment variables for Google Analytics');
  }

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + 3600; // 1 hour

  const token = sign(
    {
      iss: CLIENT_EMAIL,
      sub: CLIENT_EMAIL,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: expiresAt,
      // Try with a more specific scope
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
    },
    PRIVATE_KEY,
    { algorithm: 'RS256' }
  );

  return { token, expiresAt };
};

// Get an access token for the Google Analytics API
const getAccessToken = async () => {
  try {
    console.log('Creating JWT token...');
    const jwt = createToken();
    console.log('JWT token created successfully');

    console.log('Fetching access token from OAuth endpoint...');
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt.token,
      }).toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OAuth token request failed:', {
        status: response.status,
        data
      });
      throw new Error(`Failed to get access token: ${JSON.stringify(data)}`);
    }

    console.log('Access token received successfully:', {
      tokenType: data.token_type,
      expiresIn: data.expires_in,
    });
    
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

// Test direct property access (just metadata, not analytics data)
const testPropertyAccess = async () => {
  if (!PROPERTY_ID) {
    throw new Error('Missing GA_PROPERTY_ID environment variable');
  }

  try {
    console.log('Getting access token...');
    const accessToken = await getAccessToken();
    console.log('Access token obtained. Testing property access (not analytics data)...');

    // First, try to access property metadata 
    const response = await fetch(
      `https://analyticsadmin.googleapis.com/v1alpha/properties/${PROPERTY_ID}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Google Analytics Admin API Error:', {
        status: response.status,
        statusText: response.statusText,
        data,
        property: PROPERTY_ID
      });
      throw new Error(`Analytics Admin API error: ${JSON.stringify(data)}`);
    }

    console.log('Property access successful!');
    console.log('Property metadata:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Property access test failed:', error);
  }
};

// Test very basic reporting
const testBasicReporting = async () => {
  if (!PROPERTY_ID) {
    throw new Error('Missing GA_PROPERTY_ID environment variable');
  }

  try {
    console.log('\nTesting basic reporting...');
    const accessToken = await getAccessToken();
    
    // Try with minimal request parameters
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
          metrics: [{ name: 'sessions' }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Basic reporting API Error:', {
        status: response.status,
        statusText: response.statusText,
        data,
        property: PROPERTY_ID
      });
      throw new Error(`Basic reporting API error: ${JSON.stringify(data)}`);
    }

    console.log('Basic reporting successful!');
    console.log('Response data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Basic reporting test failed:', error);
  }
};

// Check if GA APIs are enabled 
const checkApiStatus = async () => {
  try {
    console.log('\nChecking Google Analytics API status...');
    const accessToken = await getAccessToken();
    
    // Get list of enabled APIs for the project
    const response = await fetch(
      'https://serviceusage.googleapis.com/v1/projects/my-portfolio-site-465812/services?filter=state:ENABLED',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('API status check error:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      throw new Error(`API status check error: ${JSON.stringify(data)}`);
    }

    console.log('Enabled APIs:');
    const enabledApis = data.services?.map(service => service.name) || [];
    console.log(enabledApis);
    
    // Check specifically for Analytics APIs
    const hasAnalyticsData = enabledApis.some(api => api.includes('analyticsdata'));
    const hasAnalyticsAdmin = enabledApis.some(api => api.includes('analyticsadmin'));
    
    console.log('\nAnalytics Data API enabled:', hasAnalyticsData);
    console.log('Analytics Admin API enabled:', hasAnalyticsAdmin);
    
    if (!hasAnalyticsData) {
      console.log('\n⚠️ Analytics Data API may not be enabled! Please enable it in the Google Cloud Console.');
    }
    
  } catch (error) {
    console.error('API status check failed:', error);
  }
};

// Run the tests
const runTests = async () => {
  try {
    console.log('---STARTING TESTS---');
    await checkApiStatus();
    await testPropertyAccess();
    await testBasicReporting();
    console.log('---TESTS COMPLETE---');
  } catch (error) {
    console.error('Test suite failed:', error);
  }
};

runTests().catch(console.error);
