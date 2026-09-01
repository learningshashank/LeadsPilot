-- Supabase Postgres Schema for LeadsPilot Campaigns & Leads
-- Run this SQL in your Supabase SQL Editor (https://app.supabase.com/project/_/sql)

-- 1. Enable pgcrypto / uuid-ossp if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Campaigns Table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  platforms TEXT[] NOT NULL DEFAULT '{}',
  total_profiles INT NOT NULL DEFAULT 0,
  completed_count INT NOT NULL DEFAULT 0,
  failed_count INT NOT NULL DEFAULT 0,
  scrape_config JSONB DEFAULT '{}'::jsonb
);

-- 3. Create Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  source_identifier TEXT NOT NULL,
  raw_profile JSONB DEFAULT '{}'::jsonb,
  scrape_status TEXT NOT NULL DEFAULT 'pending' CHECK (scrape_status IN ('pending', 'success', 'failed')),
  scrape_error TEXT,
  detected_company TEXT,
  detected_domain TEXT,
  candidate_emails TEXT[],
  verified_email TEXT,
  verification_status TEXT NOT NULL DEFAULT 'none' CHECK (verification_status IN ('verified', 'risky', 'unverified', 'none')),
  phone TEXT,
  lead_score INT,
  score_breakdown JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Enable Row Level Security (RLS) on both tables
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 5. Campaigns RLS Policies
DROP POLICY IF EXISTS "Users can view their own campaigns" ON public.campaigns;
CREATE POLICY "Users can view their own campaigns"
  ON public.campaigns
  FOR SELECT
  USING (owner_user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own campaigns" ON public.campaigns;
CREATE POLICY "Users can insert their own campaigns"
  ON public.campaigns
  FOR INSERT
  WITH CHECK (owner_user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own campaigns" ON public.campaigns;
CREATE POLICY "Users can update their own campaigns"
  ON public.campaigns
  FOR UPDATE
  USING (owner_user_id = auth.uid())
  WITH CHECK (owner_user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own campaigns" ON public.campaigns;
CREATE POLICY "Users can delete their own campaigns"
  ON public.campaigns
  FOR DELETE
  USING (owner_user_id = auth.uid());

-- 6. Leads RLS Policies (scoped by campaign ownership)
DROP POLICY IF EXISTS "Users can view leads belonging to their campaigns" ON public.leads;
CREATE POLICY "Users can view leads belonging to their campaigns"
  ON public.leads
  FOR SELECT
  USING (
    campaign_id IN (
      SELECT id FROM public.campaigns WHERE owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert leads into their campaigns" ON public.leads;
CREATE POLICY "Users can insert leads into their campaigns"
  ON public.leads
  FOR INSERT
  WITH CHECK (
    campaign_id IN (
      SELECT id FROM public.campaigns WHERE owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update leads in their campaigns" ON public.leads;
CREATE POLICY "Users can update leads in their campaigns"
  ON public.leads
  FOR UPDATE
  USING (
    campaign_id IN (
      SELECT id FROM public.campaigns WHERE owner_user_id = auth.uid()
    )
  )
  WITH CHECK (
    campaign_id IN (
      SELECT id FROM public.campaigns WHERE owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete leads from their campaigns" ON public.leads;
CREATE POLICY "Users can delete leads from their campaigns"
  ON public.leads
  FOR DELETE
  USING (
    campaign_id IN (
      SELECT id FROM public.campaigns WHERE owner_user_id = auth.uid()
    )
  );

-- 7. Add Tables to Supabase Realtime Publication for live updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'campaigns'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.campaigns;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'leads'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- In case publication doesn't exist yet or has restrictive permissions
    RAISE NOTICE 'Realtime publication setup completed or skipped.';
END $$;

-- 8. Indexes for lightning fast queries & realtime filter performance
CREATE INDEX IF NOT EXISTS idx_campaigns_owner ON public.campaigns(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_created ON public.campaigns(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_campaign ON public.leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_leads_scrape_status ON public.leads(scrape_status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON public.leads(created_at DESC);
