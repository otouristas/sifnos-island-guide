-- Enable real-time updates for guest_requests table
ALTER TABLE guest_requests REPLICA IDENTITY FULL;

-- The table will automatically be added to realtime since RLS is enabled