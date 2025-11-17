import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ship, Calendar, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface FerrySchedule {
  departure_time: string;
  arrival_time: string;
  duration: string;
  company: string;
  price: number;
  available_seats: number;
}

export default function FerryScheduleWidget() {
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState<FerrySchedule[]>([]);
  const [from, setFrom] = useState('piraeus');
  const [to, setTo] = useState('sifnos');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { toast } = useToast();

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-ferry-schedule', {
        body: { from, to, date }
      });

      if (error) throw error;

      if (data.success) {
        setSchedules(data.schedules);
        if (data.schedules.length === 0) {
          toast({
            title: "No schedules found",
            description: "Try a different date or route",
          });
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching ferry schedules:', error);
      toast({
        title: "Error",
        description: "Failed to load ferry schedules. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ship className="h-5 w-5 text-primary" />
          Real-Time Ferry Schedules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">From</label>
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="piraeus">Piraeus</SelectItem>
                <SelectItem value="lavrio">Lavrio</SelectItem>
                <SelectItem value="milos">Milos</SelectItem>
                <SelectItem value="serifos">Serifos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">To</label>
            <Select value={to} onValueChange={setTo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sifnos">Sifnos</SelectItem>
                <SelectItem value="piraeus">Piraeus</SelectItem>
                <SelectItem value="milos">Milos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={fetchSchedules}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Results */}
        {schedules.length > 0 && (
          <div className="space-y-3 mt-6">
            <h3 className="font-semibold text-sm text-muted-foreground">
              {schedules.length} ferries found for {format(new Date(date), 'MMM dd, yyyy')}
            </h3>
            {schedules.map((schedule, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-semibold text-lg">{schedule.departure_time}</p>
                    <p className="text-xs text-muted-foreground">Depart</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-px w-12 bg-border"></div>
                      <Ship className="h-4 w-4" />
                      <div className="h-px w-12 bg-border"></div>
                    </div>
                    <p className="text-xs mt-1">{schedule.duration}</p>
                  </div>

                  <div className="text-center">
                    <p className="font-semibold text-lg">{schedule.arrival_time}</p>
                    <p className="text-xs text-muted-foreground">Arrive</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-primary">€{schedule.price}</p>
                  <p className="text-xs text-muted-foreground">{schedule.company}</p>
                  <Button size="sm" className="mt-2">
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {schedules.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            <Ship className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Search for ferry schedules to see real-time availability</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
