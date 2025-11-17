import React, { useState, useEffect } from "react";
import { useGuestContext } from "@/contexts/GuestContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import {
  Sparkles,
  Wrench,
  Phone,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Request categories with icons and descriptions
const REQUEST_CATEGORIES = [
  {
    value: "housekeeping",
    label: "Housekeeping",
    icon: Sparkles,
    description: "Towels, cleaning, toiletries",
  },
  {
    value: "maintenance",
    label: "Maintenance",
    icon: Wrench,
    description: "AC, WiFi, plumbing, electrical",
  },
  {
    value: "reception",
    label: "Reception",
    icon: Phone,
    description: "General inquiries, information",
  },
  {
    value: "late_checkout",
    label: "Late Checkout",
    icon: Clock,
    description: "Request extended checkout time",
  },
  {
    value: "other",
    label: "Other",
    icon: MessageCircle,
    description: "Other requests or questions",
  },
];

// Status badges
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  },
};

// Validation schema
const requestSchema = z.object({
  category: z.enum(["housekeeping", "maintenance", "reception", "late_checkout", "other"], {
    required_error: "Please select a category",
  }),
  description: z
    .string()
    .trim()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(1000, { message: "Description must be less than 1000 characters" }),
});

interface GuestRequest {
  id: string;
  category: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const Requests: React.FC = () => {
  const { hotel, booking } = useGuestContext();
  const { toast } = useToast();
  
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);
  const [requests, setRequests] = useState<GuestRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ category?: string; description?: string }>({});

  // Load existing requests
  useEffect(() => {
    const loadRequests = async () => {
      if (!booking) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('guest_requests')
          .select('*')
          .eq('booking_id', booking.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setRequests(data || []);
      } catch (error: any) {
        console.error('Error loading requests:', error);
        toast({
          title: "Error loading requests",
          description: "Failed to load your previous requests",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [booking, toast]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!booking) return;

    const channel = supabase
      .channel('guest-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'guest_requests',
          filter: `booking_id=eq.${booking.id}`,
        },
        (payload) => {
          console.log('Request update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setRequests((prev) => [payload.new as GuestRequest, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setRequests((prev) =>
              prev.map((req) =>
                req.id === payload.new.id ? (payload.new as GuestRequest) : req
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setRequests((prev) => prev.filter((req) => req.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!booking || !hotel) return;

    // Clear previous errors
    setErrors({});

    // Validate input
    const result = requestSchema.safeParse({
      category,
      description,
    });

    if (!result.success) {
      const fieldErrors: { category?: string; description?: string } = {};
      result.error.errors.forEach((error) => {
        if (error.path[0] === 'category') {
          fieldErrors.category = error.message;
        } else if (error.path[0] === 'description') {
          fieldErrors.description = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setSending(true);

      const { error } = await supabase
        .from('guest_requests')
        .insert({
          booking_id: booking.id,
          hotel_id: hotel.id,
          category: result.data.category,
          description: result.data.description,
          status: 'pending',
          priority: result.data.category === 'maintenance' ? 'high' : 'normal',
        });

      if (error) throw error;

      // Reset form
      setCategory("");
      setDescription("");
      
      toast({
        title: "Request sent successfully",
        description: "The hotel staff will respond to your request shortly.",
      });
    } catch (error: any) {
      console.error('Error submitting request:', error);
      toast({
        title: "Failed to send request",
        description: "Please try again or contact reception directly.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const getCategoryInfo = (categoryValue: string) => {
    return REQUEST_CATEGORIES.find((cat) => cat.value === categoryValue);
  };

  if (!hotel || !booking) return null;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-card rounded-xl shadow p-4">
        <h1 className="text-xl font-semibold text-foreground mb-1">Guest Requests</h1>
        <p className="text-sm text-muted-foreground">
          Need something? Let us know and we'll take care of it right away.
        </p>
      </div>

      {/* Request Form */}
      <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow p-4 space-y-4">
        <div>
          <Label htmlFor="category" className="text-sm font-medium text-foreground mb-2 block">
            What do you need help with?
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger 
              id="category"
              className={errors.category ? "border-destructive" : ""}
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {REQUEST_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  <div className="flex items-center gap-2">
                    <cat.icon className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{cat.label}</div>
                      <div className="text-xs text-muted-foreground">{cat.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-xs text-destructive mt-1">{errors.category}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium text-foreground mb-2 block">
            Describe your request
          </Label>
          <Textarea
            id="description"
            placeholder="Please provide details about what you need..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`min-h-[120px] ${errors.description ? "border-destructive" : ""}`}
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description ? (
              <p className="text-xs text-destructive">{errors.description}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Minimum 10 characters
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {description.length}/1000
            </p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={sending}
          className="w-full"
        >
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Request
            </>
          )}
        </Button>
      </form>

      {/* Previous Requests */}
      <div className="bg-card rounded-xl shadow overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-sm text-foreground">Your Requests</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-1">No requests yet</p>
            <p className="text-xs text-muted-foreground">
              Submit your first request using the form above
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {requests.map((request) => {
              const categoryInfo = getCategoryInfo(request.category);
              const statusInfo = STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG];
              const Icon = categoryInfo?.icon || MessageCircle;

              return (
                <div key={request.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-foreground">
                          {categoryInfo?.label || request.category}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${statusInfo?.className || ''}`}
                        >
                          {statusInfo?.label || request.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 whitespace-pre-line">
                        {request.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          {new Date(request.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {request.status === 'completed' && (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-3 w-3" />
                            Resolved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contact Footer */}
      {hotel.phone && (
        <div className="bg-muted/50 rounded-xl p-4 border border-border">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Urgent Request?</p>
              <p className="text-xs text-muted-foreground mb-2">
                For urgent matters, please call reception directly.
              </p>
              <a
                href={`tel:${hotel.phone}`}
                className="text-xs font-medium text-primary hover:underline"
              >
                {hotel.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};