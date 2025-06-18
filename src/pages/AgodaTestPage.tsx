import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

export default function AgodaTestPage() {
  const [checkInDate, setCheckInDate] = useState('2024-07-15');
  const [checkOutDate, setCheckOutDate] = useState('2024-07-20');
  const [numberOfAdults, setNumberOfAdults] = useState(2);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testAgodaAPI = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log('Testing Agoda API with:', {
        checkInDate,
        checkOutDate,
        numberOfAdults,
        numberOfChildren: 0
      });

      const { data, error: functionError } = await supabase.functions.invoke('agoda-search', {
        body: {
          checkInDate,
          checkOutDate,
          numberOfAdults,
          numberOfChildren: 0
        }
      });

      if (functionError) {
        console.error('Function error:', functionError);
        setError(`Function Error: ${JSON.stringify(functionError)}`);
      } else {
        console.log('Agoda API response:', data);
        setResults(data);
      }
    } catch (err) {
      console.error('Test error:', err);
      setError(`Test Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Agoda API Test</CardTitle>
          <CardDescription>
            Test the Agoda API integration to debug any issues
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

          <Button 
            onClick={testAgodaAPI} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Testing...' : 'Test Agoda API'}
          </Button>

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700">Error</CardTitle>
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
                <CardTitle className="text-green-700">Results</CardTitle>
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