
-- Add the pg_cron and pg_net extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule a daily job to fetch Booking.com reviews
SELECT cron.schedule(
  'fetch-booking-reviews-daily',
  '0 3 * * *',  -- Run at 3am every day
  $$
  SELECT
    net.http_post(
        url:='https://wdzlruiekcznbcicjgrz.supabase.co/functions/v1/fetch-booking-reviews',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkemxydWlla2N6bmJjaWNqZ3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyODAyNzYsImV4cCI6MjA1OTg1NjI3Nn0.NaoVf3tU3Xz08CWCHpQtq7_9H6G6ES9EjtCvPHa0aRk"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);
