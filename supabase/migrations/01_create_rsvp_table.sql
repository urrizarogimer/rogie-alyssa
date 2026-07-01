-- Create RSVP table for wedding invitations
CREATE TABLE IF NOT EXISTS public.rsvps (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  attending VARCHAR(100),
  guests VARCHAR(10),
  meal VARCHAR(100),
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  invited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add unique constraint on email to prevent duplicates
ALTER TABLE public.rsvps 
ADD CONSTRAINT rsvps_email_unique UNIQUE (email);

-- Create indexes for common queries
CREATE INDEX idx_rsvps_status ON public.rsvps(status);
CREATE INDEX idx_rsvps_invited ON public.rsvps(invited);
CREATE INDEX idx_rsvps_email ON public.rsvps(email);
CREATE INDEX idx_rsvps_submitted_at ON public.rsvps(submitted_at DESC);

-- Enable Row Level Security
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (read-only for submitted RSVPs)
CREATE POLICY "Allow anyone to insert RSVPs" ON public.rsvps
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anyone to view RSVPs" ON public.rsvps
  FOR SELECT
  USING (true);

-- Admin policy: Update RSVPs (you'll need to restrict this with authenticated users)
CREATE POLICY "Allow admins to update RSVPs" ON public.rsvps
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow admins to delete RSVPs" ON public.rsvps
  FOR DELETE
  USING (true);
