// Load environment variables
import dotenv from 'dotenv';
import { sign } from 'jsonwebtoken';

dotenv.config({ path: '.env.local' });

// Environment variables 
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const PROPERTY_ID = process.env.GA_PROPERTY_ID;

console.log('=== SIMPLIFIED GA4 ACCESS TEST ===');
console.log('Service Account Email:', CLIENT_EMAIL);
console.log('GA4 Property ID:', PROPERTY_ID);
console.log('Private Key Available:', !!PRIVATE_KEY);

// Create a JWT token for authentication
const createJWT = () => {
  if (!CLIENT_EMAIL || !PRIVATE_KEY) {
    throw new Error('Missing required environment variables');
  }

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + 3600; // 1 hour

  return sign(
    {
      iss: CLIENT_EMAIL,
      sub: CLIENT_EMAIL,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: expiresAt,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
    },
    PRIVATE_KEY,
    { algorithm: 'RS256' }
  );
};

// Get an access token using the JWT
const getAccessToken = async () => {
  try {
    const jwt = createJWT();
    
    console.log('\nStep 1: Requesting access token from Google...');
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }).toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ OAuth token request failed:', {
        status: response.status,
        statusText: response.statusText,
        error: data.error,
        errorDescription: data.error_description
      });
      throw new Error(`Failed to get access token`);
    }

    console.log('✅ Access token obtained successfully!');
    return data.access_token;
  } catch (error) {
    console.error('❌ Access token generation failed:', error.message);
    throw error;
  }
};

// Test the simplest possible GA4 Data API request
const testSimpleGARequest = async (accessToken) => {
  try {
    console.log('\nStep 2: Testing simplest possible GA4 Data API request...');
    
    // The simplest possible request
    const requestBody = {
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [{ name: 'sessions' }],
    };
    
    console.log('Request body:', JSON.stringify(requestBody));
    
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    // Get response as text first to handle potential non-JSON responses
    const responseText = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch {
      console.log('Raw response (not JSON):', responseText);
      data = { nonJsonResponse: responseText };
    }

    if (!response.ok) {
      console.error('❌ GA4 Data API request failed:', {
        status: response.status,
        statusText: response.statusText,
        url: `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
        errorMessage: data.error?.message || 'Unknown error'
      });
      
      console.log('\n=== PERMISSIONS TROUBLESHOOTING ===');
      console.log('1. Verify service account has Viewer access in GA4 Admin > Property Access Management');
      console.log('2. Verify both Analytics Data API and Analytics Admin API are enabled in your Google Cloud project');
      console.log('3. Double-check that the property ID is correct in .env.local');
      console.log('4. Remember that GA4 permissions can take 15-30 minutes to propagate');
      
      throw new Error(`GA4 API permission denied`);
    }

    console.log('✅ GA4 Data API request successful!');
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('❌ GA4 test failed:', error.message);
    throw error;
  }
};

// Check if service account has Admin API read access
const checkAdminAccess = async (accessToken) => {
  try {
    console.log('\nStep 3: Checking Admin API access (optional)...');
    
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
      console.log('❓ Admin API access check failed (this is okay for read-only access):', {
        status: response.status,
        message: data.error?.message || 'Unknown error'
      });
      return false;
    }

    console.log('✅ Admin API access successful!');
    return true;
  } catch (error) {
    console.log('❓ Admin API check failed (not critical):', error.message);
    return false;
  }
};

// Run the complete test
async function runTest() {
  try {
    const accessToken = await getAccessToken();
    await testSimpleGARequest(accessToken);
    await checkAdminAccess(accessToken);
    
    console.log('\n✅✅✅ ALL TESTS COMPLETE - PERMISSIONS LOOK GOOD! ✅✅✅');
  } catch {
    console.error('\n❌❌❌ TEST FAILED - SEE ERRORS ABOVE ❌❌❌');
  }
}

runTest();
