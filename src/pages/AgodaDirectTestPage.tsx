import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AgodaDirectTestPage() {
  const [checkInDate, setCheckInDate] = useState('2024-07-15');
  const [checkOutDate, setCheckOutDate] = useState('2024-07-20');
  const [numberOfAdults, setNumberOfAdults] = useState(2);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testAgodaAPIDirect = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log('Testing Agoda API directly with:', {
        checkInDate,
        checkOutDate,
        numberOfAdults,
        numberOfChildren: 0
      });

      // Prepare Agoda API request - Exact match to official documentation
      const agodaRequest = {
        criteria: {
          additional: {
            currency: "USD",
            language: "en-us",
            maxResult: 10,
            occupancy: {
              numberOfAdult: numberOfAdults,
              numberOfChildren: 0
            },
            sortBy: "Recommended"
          },
          checkInDate,
          checkOutDate,
          cityId: 105165 // Sifnos city ID from your partner account
        }
      };

      console.log('Agoda API request:', JSON.stringify(agodaRequest, null, 2));

      // Make direct request to Agoda API
      const response = await fetch('http://affiliateapi7643.agoda.com/affiliateservice/lt_v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Encoding': 'gzip,deflate',
          'Authorization': '1943066:97ce4b44-8c2d-4333-a8c6-9dfe389cec9a'
        },
        body: JSON.stringify(agodaRequest)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Parse error:', parseError);
        setError(`Failed to parse response: ${responseText}`);
        return;
      }

      console.log('Parsed response:', responseData);

      if (!response.ok) {
        setError(`HTTP ${response.status}: ${JSON.stringify(responseData)}`);
        return;
      }

      if (responseData.error) {
        setError(`Agoda API Error ${responseData.error.id}: ${responseData.error.message}`);
        return;
      }

      setResults({
        success: true,
        results: responseData.results || [],
        total_results: responseData.results?.length || 0,
        raw_response: responseData
      });

    } catch (err: any) {
      console.error('Test error:', err);
      
      // Handle CORS errors specifically
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError(`CORS Error: ${err.message}. This is expected when calling Agoda API directly from browser. The API needs to be called from a server (Supabase Edge Function).`);
      } else {
        setError(`Test Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Test with a known working city (Bangkok) to verify credentials
  const testWithBangkok = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const agodaRequest = {
        criteria: {
          additional: {
            currency: "USD",
            language: "en-us",
            maxResult: 10,
            occupancy: {
              numberOfAdult: 2,
              numberOfChildren: 0
            },
            sortBy: "Recommended"
          },
          checkInDate,
          checkOutDate,
          cityId: 9395 // Bangkok city ID from documentation
        }
      };

      console.log('Testing with Bangkok city ID:', JSON.stringify(agodaRequest, null, 2));

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
      let responseData = JSON.parse(responseText);

      console.log('Bangkok test response:', responseData);

      if (responseData.error) {
        setError(`Bangkok Test - Agoda API Error ${responseData.error.id}: ${responseData.error.message}`);
      } else {
        setResults({
          success: true,
          test_type: 'Bangkok Test',
          results: responseData.results || [],
          total_results: responseData.results?.length || 0,
          raw_response: responseData
        });
      }

    } catch (err: any) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError(`CORS Error: This confirms we need to use Supabase Edge Function for the API calls.`);
      } else {
        setError(`Bangkok Test Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Agoda API Direct Test</CardTitle>
          <CardDescription>
            Test the Agoda API directly (will likely hit CORS errors, but shows the request/response)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkin">Check-in Date</Label>
              <Input
                id="checkin"
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="checkout">Check-out Date</Label>
              <Input
                id="checkout"
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="adults">Number of Adults</Label>
            <Input
              id="adults"
              type="number"
              min="1"
              max="10"
              value={numberOfAdults}
              onChange={(e) => setNumberOfAdults(parseInt(e.target.value))}
            />
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={testAgodaAPIDirect} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Testing...' : 'Test Sifnos (City ID: 105165)'}
            </Button>

            <Button 
              onClick={testWithBangkok} 
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              {loading ? 'Testing...' : 'Test Bangkok (City ID: 9395)'}
            </Button>
          </div>

          <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
            <h4 className="font-semibold text-yellow-800">Expected Behavior:</h4>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1">
              <li>• <strong>CORS Error:</strong> Expected when calling from browser directly</li>
              <li>• <strong>Check Console:</strong> Look for request/response details in browser console (F12)</li>
              <li>• <strong>Success:</strong> Should show hotel results if API works</li>
              <li>• <strong>Error 911:</strong> "No search result" means API works but no hotels found</li>
              <li>• <strong>Error 401:</strong> Authorization issue with credentials</li>
            </ul>
          </div>

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700">Error Response</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-red-600 whitespace-pre-wrap overflow-auto">
                  {error}
                </pre>
              </CardContent>
            </Card>
          )}

          {results && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-700">
                  API Results {results.test_type && `(${results.test_type})`}
                </CardTitle>
                <CardDescription className="text-green-600">
                  Found {results.total_results} hotels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-green-600 whitespace-pre-wrap overflow-auto max-h-96">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 