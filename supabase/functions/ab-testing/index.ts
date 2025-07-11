import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    if (req.method === 'GET') {
      const url = new URL(req.url);
      const testName = url.searchParams.get('test');
      const userId = url.searchParams.get('userId');
      const sessionId = url.searchParams.get('sessionId');

      if (!testName) {
        return new Response(JSON.stringify({ error: 'Test name required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if user already has assignment
      let existingAssignment = null;
      
      if (userId) {
        const { data } = await supabase
          .from('user_test_assignments')
          .select('*')
          .eq('user_id', userId)
          .eq('test_name', testName)
          .single();
        existingAssignment = data;
      } else if (sessionId) {
        const { data } = await supabase
          .from('user_test_assignments')
          .select('*')
          .eq('session_id', sessionId)
          .eq('test_name', testName)
          .single();
        existingAssignment = data;
      }

      if (existingAssignment) {
        // Get variant configuration
        const { data: variant } = await supabase
          .from('ab_test_variants')
          .select('*')
          .eq('test_name', testName)
          .eq('variant_name', existingAssignment.variant_name)
          .single();

        return new Response(JSON.stringify({
          variant: existingAssignment.variant_name,
          configuration: variant?.configuration || {},
          existing: true
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get all variants for this test
      const { data: variants, error } = await supabase
        .from('ab_test_variants')
        .select('*')
        .eq('test_name', testName)
        .eq('is_active', true);

      if (error || !variants || variants.length === 0) {
        return new Response(JSON.stringify({ error: 'No active variants found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Calculate cumulative weights
      let totalWeight = 0;
      const weightedVariants = variants.map(variant => {
        totalWeight += variant.traffic_percentage;
        return {
          ...variant,
          cumulativeWeight: totalWeight
        };
      });

      // Random assignment based on weights
      const random = Math.random() * 100;
      const selectedVariant = weightedVariants.find(variant => 
        random <= variant.cumulativeWeight
      ) || weightedVariants[0];

      // Save assignment
      const assignmentData: any = {
        test_name: testName,
        variant_name: selectedVariant.variant_name
      };

      if (userId) {
        assignmentData.user_id = userId;
      } else if (sessionId) {
        assignmentData.session_id = sessionId;
      }

      await supabase
        .from('user_test_assignments')
        .insert(assignmentData);

      return new Response(JSON.stringify({
        variant: selectedVariant.variant_name,
        configuration: selectedVariant.configuration,
        existing: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST - Track conversion or event
    if (req.method === 'POST') {
      const { testName, variant, event, userId, sessionId, metadata } = await req.json();

      // Here you would typically track the conversion event
      // For now, we'll just log it
      console.log('A/B Test Event:', {
        testName,
        variant,
        event,
        userId,
        sessionId,
        metadata,
        timestamp: new Date().toISOString()
      });

      // In a real implementation, you'd save this to an analytics table
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ab-testing function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);