import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Test endpoint for Agoda API
app.post('/api/agoda-search', async (req, res) => {
  try {
    console.log('Received request:', req.body);
    
    const { checkInDate, checkOutDate, numberOfAdults, numberOfChildren = 0, maxResult = 50, currency = 'USD' } = req.body;

    // Validate required parameters
    if (!checkInDate || !checkOutDate || !numberOfAdults) {
      return res.status(400).json({
        error: 'Missing required parameters: checkInDate, checkOutDate, numberOfAdults'
      });
    }

    // Prepare Agoda API request - Exact match to official documentation
    const agodaRequest = {
      criteria: {
        additional: {
          currency,
          language: "en-us",
          maxResult,
          occupancy: {
            numberOfAdult: numberOfAdults,
            numberOfChildren: numberOfChildren
          },
          sortBy: "Recommended"
        },
        checkInDate,
        checkOutDate,
        cityId: 105165 // Sifnos city ID
      }
    };

    console.log('Agoda API request:', JSON.stringify(agodaRequest, null, 2));

    // Make request to Agoda API
    const response = await fetch('http://affiliateapi7643.agoda.com/affiliateservice/lt_v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip,deflate',
        'Authorization': '1943066:97ce4b44-8c2d-4333-a8c6-9dfe389cec9a'
      },
      body: JSON.stringify(agodaRequest)
    });

    console.log('Agoda API response status:', response.status);
    console.log('Agoda API response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Agoda API raw response:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      return res.status(500).json({
        error: 'Invalid response from Agoda API',
        raw_response: responseText,
        status: response.status
      });
    }

    console.log('Parsed Agoda response:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      console.error('Agoda API error:', responseData);
      return res.status(response.status).json({
        error: 'Agoda API error',
        agoda_error: responseData,
        status: response.status
      });
    }

    // Check for Agoda API error format
    if (responseData.error) {
      console.error('Agoda API returned error:', responseData.error);
      return res.status(400).json({
        error: 'Agoda API error',
        agoda_error: responseData.error
      });
    }

    // Success response
    res.json({
      success: true,
      results: responseData.results || [],
      total_results: responseData.results?.length || 0,
      agoda_data: responseData,
      debug_info: {
        request_sent: agodaRequest,
        response_status: response.status
      }
    });

  } catch (error) {
    console.error('Proxy server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      stack: error.stack
    });
  }
});

// Test with Bangkok city ID
app.post('/api/agoda-search-bangkok', async (req, res) => {
  try {
    const { checkInDate, checkOutDate, numberOfAdults = 2, numberOfChildren = 0 } = req.body;

    const agodaRequest = {
      criteria: {
        additional: {
          currency: "USD",
          language: "en-us",
          maxResult: 10,
          occupancy: {
            numberOfAdult: numberOfAdults,
            numberOfChildren: numberOfChildren
          },
          sortBy: "Recommended"
        },
        checkInDate,
        checkOutDate,
        cityId: 9395 // Bangkok city ID from documentation
      }
    };

    console.log('Bangkok test request:', JSON.stringify(agodaRequest, null, 2));

    const response = await fetch('http://affiliateapi7643.agoda.com/affiliateservice/lt_v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip,deflate',
        'Authorization': '1943066:97ce4b44-8c2d-4333-a8c6-9dfe389cec9a'
      },
      body: JSON.stringify(agodaRequest)
    });

    const responseText = await response.text();
    const responseData = JSON.parse(responseText);

    console.log('Bangkok test response:', responseData);

    res.json({
      success: true,
      test_type: 'Bangkok Test',
      results: responseData.results || [],
      total_results: responseData.results?.length || 0,
      agoda_data: responseData,
      debug_info: {
        request_sent: agodaRequest,
        response_status: response.status
      }
    });

  } catch (error) {
    console.error('Bangkok test error:', error);
    res.status(500).json({
      error: 'Bangkok test error',
      details: error.message
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Agoda proxy server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Agoda Proxy Server running on http://localhost:${PORT}`);
  console.log('📋 Available endpoints:');
  console.log('   POST /api/agoda-search - Test Sifnos hotels');
  console.log('   POST /api/agoda-search-bangkok - Test Bangkok hotels');
  console.log('   GET /health - Health check');
  console.log('');
  console.log('🔧 Usage:');
  console.log('   Update your frontend to call http://localhost:3001/api/agoda-search');
  console.log('   instead of the Supabase Edge Function');
}); 