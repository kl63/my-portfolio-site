// Load environment variables
import dotenv from 'dotenv';
import { sign } from 'jsonwebtoken';

dotenv.config({ path: '.env.local' });

// Environment variables 
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const PROPERTY_ID = process.env.GA_PROPERTY_ID;

console.log('Testing Google Analytics Auth with:');
console.log('- Email:', CLIENT_EMAIL);
console.log('- Property ID:', PROPERTY_ID);
console.log('- Private Key Available:', !!PRIVATE_KEY);

// Create a JWT token for Google API authentication
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

// Make a simple request to the Google Analytics Data API
const testAnalyticsAccess = async () => {
  if (!PROPERTY_ID) {
    throw new Error('Missing GA_PROPERTY_ID environment variable');
  }

  try {
    console.log('Getting access token...');
    const accessToken = await getAccessToken();
    console.log('Access token obtained. Now testing API access...');
    
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [
            {
              startDate: '7daysAgo',
              endDate: 'today',
            },
          ],
          metrics: [
            { name: 'activeUsers' },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Google Analytics API Error:', {
        status: response.status,
        statusText: response.statusText,
        data: data,
        property: PROPERTY_ID
      });
      throw new Error(`Analytics API error: ${JSON.stringify(data)}`);
    }

    console.log('Google Analytics API access successful!');
    console.log('Response data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('API test failed:', error);
  }
};

// Run the test
testAnalyticsAccess().catch(console.error);
