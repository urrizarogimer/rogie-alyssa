# 🎉 Wedding Invitation Database & Email Setup Guide

This guide walks you through setting up a permanent database with real email functionality for the wedding invitation website.

## Overview

The system uses:
- **Database**: Supabase (PostgreSQL) for persistent RSVP storage
- **Email Service**: Supabase Email (powered by Resend) for sending elegant invitations
- **Backend**: Supabase Edge Functions for serverless email handling
- **Frontend**: React with TypeScript for the wedding site

## Prerequisites

1. A Supabase account (free tier available at https://supabase.com)
2. A Resend account for email sending (free tier available at https://resend.com)
3. Node.js and npm/pnpm installed locally
4. Supabase CLI installed: `npm install -g supabase`

## Step-by-Step Setup

### 1️⃣ Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in project details:
   - Name: `rogie-alyssa-wedding`
   - Database Password: Create a secure password
   - Region: Choose closest to you
4. Wait for project creation (5-10 minutes)
5. Once ready, go to Project Settings > API
6. Copy these credentials:
   - **Project URL** (VITE_SUPABASE_URL)
   - **Anon Key** (VITE_SUPABASE_ANON_KEY)

### 2️⃣ Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_SUPABASE_EMAIL_FROM=noreply@rogie-alyssa.wedding
   ```

3. For local development with Supabase, also add to `.env.local`:
   ```
   SUPABASE_DB_PASSWORD=your-database-password
   ```

### 3️⃣ Create Database Table

1. Go to Supabase Dashboard > SQL Editor
2. Click "New Query"
3. Copy the contents of `supabase/migrations/01_create_rsvp_table.sql`
4. Paste into the SQL editor
5. Click "Run"
6. Verify that the `rsvps` table is created in Database > Tables

### 4️⃣ Set Up Email Service (Resend)

1. Go to https://resend.com and sign up
2. Get your API Key:
   - Go to Settings > API Keys
   - Create a new API key and copy it
3. Add to your `.env.local` for the Edge Function:
   ```
   RESEND_API_KEY=your-resend-api-key
   ```

### 5️⃣ Deploy Supabase Edge Function

The Edge Function handles sending emails when guests are invited.

#### Option A: Using Supabase Dashboard (Easiest)

1. In Supabase Dashboard, go to Edge Functions
2. Click "Create a new function"
3. Name it: `send-wedding-invitation`
4. Copy the code from `supabase/functions/send-wedding-invitation/index.ts`
5. Click "Deploy"
6. In Edge Function settings, add environment variable:
   - Key: `RESEND_API_KEY`
   - Value: Your Resend API key

#### Option B: Using Supabase CLI

1. Link your local project:
   ```bash
   supabase link --project-ref your-project-id
   ```

2. Deploy the function:
   ```bash
   supabase functions deploy send-wedding-invitation --no-verify
   ```

3. Set environment variables:
   ```bash
   supabase secrets set RESEND_API_KEY=your-resend-api-key
   ```

### 6️⃣ Update Application Code

The app has already been updated to use the database and email services. Key files:

- `src/lib/supabase.ts` - Supabase client initialization
- `src/lib/database.ts` - Database functions (fetchRsvps, createRsvp, etc.)
- `src/lib/email-template.ts` - Email template generator
- `src/app/App.tsx` - Integration with React components

### 7️⃣ Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser

3. Test RSVP submission:
   - Fill out the RSVP form
   - Submit
   - Check Supabase Dashboard > Database > rsvps table for the new entry

4. Test email invitation:
   - Go to Admin Dashboard
   - Password: `GieroAC22`
   - Find a guest entry
   - Click "Invite" button
   - Check the email inbox (and spam folder)

### 8️⃣ Configure Custom Domain Email (Optional)

To send from a custom domain like `noreply@rogie-alyssa.wedding`:

1. In Resend dashboard, go to Domains
2. Add your domain
3. Follow the DNS configuration steps
4. Once verified, use the domain in email sending

## Email Template Features

The email template includes:

✨ **Design Elements**:
- Elegant dusty blue gradient header (#6B8BB8)
- Responsive design for mobile/desktop
- Professional typography with serif headlines
- Subtle animations and hover effects

📱 **Content**:
- Personalized greeting with guest name
- Clear couple names (Rogimer & Alyssa Camille)
- Wedding date and time
- Call-to-action button
- Footer with wedding details

🎨 **Color Scheme**:
- Primary: #6B8BB8 (Dusty Blue)
- Light: #A8B8D8 (Light Dusty Blue)
- Secondary: #8BA7CE (Blue-gray)
- Background: Soft white with subtle gradient

## File Structure

```
supabase/
├── migrations/
│   └── 01_create_rsvp_table.sql
└── functions/
    └── send-wedding-invitation/
        └── index.ts

src/
├── lib/
│   ├── supabase.ts
│   ├── database.ts
│   └── email-template.ts
└── app/
    └── App.tsx (integrated)
```

## API Reference

### Database Functions

All functions are available in `src/lib/database.ts`:

```typescript
// Fetch all RSVPs
await fetchRsvps(): Promise<RsvpEntry[]>

// Create new RSVP
await createRsvp(rsvp): Promise<RsvpEntry | null>

// Update RSVP status
await updateRsvpStatus(id, status): Promise<boolean>

// Delete RSVP
await deleteRsvp(id): Promise<boolean>

// Send invitation email
await sendInvitationEmail(email, name): Promise<boolean>

// Mark as invited and send email
await markAsInvited(id, email, name): Promise<boolean>
```

## Troubleshooting

### Issue: "Supabase credentials not configured"
**Solution**: Check `.env.local` file exists with correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

### Issue: Email not sending
**Solution**: 
1. Verify Resend API key is set in Edge Function environment
2. Check email address is valid
3. Verify `send-wedding-invitation` function is deployed
4. Check Resend dashboard for failed deliveries

### Issue: RSVP data not saving
**Solution**:
1. Verify database table `rsvps` exists
2. Check browser console for errors
3. Verify Supabase credentials are correct
4. Check RLS policies are enabled

### Issue: CORS errors
**Solution**:
1. Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct
2. Ensure Edge Function has CORS headers configured (already included)

## Environment Variables Checklist

- ✅ `VITE_SUPABASE_URL` - From Supabase Dashboard > Settings > API
- ✅ `VITE_SUPABASE_ANON_KEY` - From Supabase Dashboard > Settings > API
- ✅ `VITE_SUPABASE_EMAIL_FROM` - Email address for sending (e.g., noreply@domain.com)
- ✅ `RESEND_API_KEY` - From Resend Dashboard > API Keys (for Edge Function)

## Next Steps

1. **Customize Email Domain**: Update `VITE_SUPABASE_EMAIL_FROM` to your custom domain
2. **Add More Guests**: Use the admin dashboard to add guest emails
3. **Send Bulk Invitations**: Use admin dashboard to invite multiple guests
4. **Monitor RSVPs**: Track responses in the admin dashboard
5. **Export Data**: Use admin dashboard's CSV export feature

## Support

For issues with:
- **Supabase**: https://supabase.com/docs
- **Resend**: https://resend.com/docs
- **Edge Functions**: https://supabase.com/docs/guides/functions

---

**Wedding Date**: Saturday, November 28, 2026  
**Couple**: Rogimer & Alyssa Camille  
**Setup Date**: July 1, 2026
