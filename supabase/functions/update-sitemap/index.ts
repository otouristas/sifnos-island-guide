
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = 'https://wdzlruiekcznbcicjgrz.supabase.co'
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

Deno.serve(async (req) => {
  // Add CORS headers to all requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Parse request body
    const { sitemap, timestamp, cacheBuster } = await req.json()
    
    if (!sitemap) {
      return new Response(
        JSON.stringify({ error: 'Missing sitemap content' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    console.log(`Received sitemap update request at ${new Date().toISOString()}`)
    console.log(`Cache buster: ${cacheBuster}`)
    console.log(`Timestamp: ${timestamp}`)
    
    // Create the sitemap.xml file
    const { data, error } = await supabase.storage
      .from('public')
      .upload(`sitemap-${timestamp}-${cacheBuster}.xml`, sitemap, {
        contentType: 'application/xml',
        upsert: true,
      })
    
    if (error) {
      console.error('Error uploading sitemap to storage:', error)
      throw error
    }
    
    // Now copy this to the primary sitemap.xml (public URL)
    const { data: copyData, error: copyError } = await supabase.storage
      .from('public')
      .copy(`sitemap-${timestamp}-${cacheBuster}.xml`, 'sitemap.xml')
    
    if (copyError) {
      console.error('Error copying sitemap to main location:', copyError)
      throw copyError
    }
    
    // Get the public URL
    const { data: urlData } = await supabase.storage
      .from('public')
      .getPublicUrl('sitemap.xml')
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Sitemap updated successfully',
        url: urlData.publicUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error processing sitemap update:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
