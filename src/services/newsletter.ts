
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Note: This service doesn't have direct access to i18n context
// Toast messages will be in English for now, or we can pass translations as parameters
// For now, keeping English messages as they're less critical UI elements

const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api';
const MAILERLITE_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNDJmZWJjMjIwMzMwN2Y3NTJjNDlkMTQ5MzljZWY1ZmRjMGM4NWY5ODhkMTE0YTI3Y2IyMGQxNWRiNzJhYTQ3NDdkYWRjOWUzMzgzMDM5MGMiLCJpYXQiOjE3NDcxNDQyNTQuNDMwMTc0LCJuYmYiOjE3NDcxNDQyNTQuNDMwMTc4LCJleHAiOjQ5MDI4MTc4NTQuNDI1MDMsInN1YiI6IjE1MzE4MzYiLCJzY29wZXMiOltdfQ.W0hjPzoz0b2MQ7VLC6jZgcUloJLEXdtJwynW2KcbBQ0eDnOkxFuw-3xSPABpjS9vhN3xLByl2SrGrfxYWupcUB9W9pRyX_dZG0VmIYRA9d69X8g91KqxG-2Vsd9AoCQ79c3HMSJw3f78VzG_BYzZexIB3CyR7G2GG0ZDdN8brOcDVO3_TbsBdnNlGaCHiiehNSehq1Vd8m6y30o6hmaw0l3iJydzZgqFt0bgxnfoneXDMfMqYU5i-Fo6mPuLgUVpMaKSkvTczMOUEcqUbKxpijmq5kiYy9Y0Wgwwp0xVsneyU-qsT62KAi9rZdTSuo8FZ0aY3jeditj0eFKQTblBqiRwR461lr3ArKqKylxEa0Du-YxcNLBU4-yiz3s6GF6ys5BkcQ3PIrlZ6AYp8GBeiDQs2uKOOOEJ9b8N7M0jMC6XhtillnX196fCaLiqlLKtHfX3rwQVAu2zy8B_JMFjIhdq-ntiJwhtVrE2HSFfX8IlYeS2IYXQwTxE0GUKFQsv1EWrcWQQbUOXxwH4-BWiIJLnStwyWzfQZs2L71wL44kaYqKilHPjdnODUe6OiFdXTv0lEr96yfwO60E0768vtg3bKnaigeS2jTAQUpL_BHvxltQT96R3dHJlOH9U7S3fecu3B25RLQ1-0Dn7B2V3gGMO23nWy4LCr16QRD-ZTcw';

// Interface for subscriber data
export interface SubscriberData {
  email: string;
  name?: string;
  fields?: Record<string, any>;
  groups?: string[];
}

/**
 * Try to subscribe using the server-side edge function
 * This is a fallback for when direct API calls fail
 */
const subscribeViaEdgeFunction = async (data: SubscriberData) => {
  try {
    const { error } = await supabase.functions.invoke('newsletter-subscribe', {
      body: data,
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Server-side subscription failed:', error);
    return false;
  }
};

/**
 * Subscribe a user to the newsletter
 * @param data - The subscriber's data
 * @returns A promise with the API response
 */
export const subscribeToNewsletter = async (data: SubscriberData): Promise<any> => {
  try {
    // Set up default group for Sifnos Hotels website subscribers if not specified
    if (!data.groups || data.groups.length === 0) {
      data.groups = ['sifnos-hotels-website'];
    }

    // First attempt: Direct API call to MailerLite
    try {
      const response = await fetch(`${MAILERLITE_API_URL}/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          // 409 means subscriber already exists, which is fine in our case
          toast.info('You are already subscribed to our newsletter!');
          return result;
        }
        // If there was an error other than 409, throw to try the fallback
        throw new Error(result.message || 'Error subscribing to newsletter');
      }

      toast.success('Thank you for subscribing to our newsletter!');
      return result;
    } catch (directApiError) {
      // If the direct API call fails, try using the edge function
      console.error('Direct API call failed, trying edge function:', directApiError);
      const fallbackSuccess = await subscribeViaEdgeFunction(data);
      
      if (!fallbackSuccess) {
        throw new Error('Failed to subscribe via all methods');
      }
      
      toast.success('Thank you for subscribing to our newsletter!');
      return { success: true };
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    toast.error('Failed to subscribe. Please try again later.');
    throw error;
  }
};
