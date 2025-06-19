# 🚀 Production Deployment Checklist

## **Before Deploying:**

### **1. Environment Variables Configuration**
✅ Created `env.production` file with:
```bash
VITE_SUPABASE_URL=https://wdzlruiekcznbcicjgrz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkemxydWlla2N6bmJjaWNqZ3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyODAyNzYsImV4cCI6MjA1OTg1NjI3Nn0.NaoVf3tU3Xz08CWCHpQtq7_9H6G6ES9EjtCvPHa0aRk
VITE_PRODUCTION_URL=https://hotelssifnos.com
```

### **2. Supabase Production Setup**
- [ ] Update your Supabase project settings:
  - Go to Settings > Auth
  - Set Site URL to: `https://hotelssifnos.com`
  - Add `https://hotelssifnos.com` to redirect URLs
- [ ] Deploy your Edge Functions to production:
  ```bash
  supabase functions deploy agoda-search
  supabase functions deploy ai-travel-assistant
  supabase functions deploy newsletter-subscribe
  supabase functions deploy send-contact-email
  ```

### **3. Domain Configuration**
- [ ] Update `supabase/config.toml`:
  - Replace `https://your-production-domain.com` with your actual domain
- [ ] Ensure CORS is properly configured in your hosting platform

### **4. Build and Test**
- [ ] Run: `npm run deploy:check`
- [ ] Test all authentication flows
- [ ] Test Agoda API integration
- [ ] Verify all environment variables are set

## **Agoda API Checklist:**
- [ ] ✅ Removed localhost dependencies (completed)
- [ ] ✅ Using Supabase Edge Functions only (completed)
- [ ] Verify Agoda credentials are working in production
- [ ] Test hotel search functionality
- [ ] Check error handling and logging

## **Authentication Checklist:**
- [ ] Test user registration
- [ ] Test user login/logout
- [ ] Test password reset
- [ ] Verify email confirmations work
- [ ] Test favorite hotels functionality

## **Post-Deployment Testing:**
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Verify all API endpoints respond correctly
- [ ] Check console for any errors
- [ ] Test all user flows end-to-end

## **Troubleshooting:**
If authentication doesn't work:
1. Check browser console for CORS errors
2. Verify environment variables are set correctly
3. Ensure Supabase project URL and keys match

If Agoda API doesn't work:
1. Check Supabase Edge Function logs
2. Verify Agoda credentials
3. Test with a known working city ID (Bangkok: 9395) 