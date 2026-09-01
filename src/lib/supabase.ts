import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  SupabaseCampaign, 
  SupabaseLead, 
  SupabaseScrapeStatus, 
  SupabaseVerificationStatus 
} from '../types.js';

let clientInstance: SupabaseClient | null = null;

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isConfigured: boolean;
}

/**
 * Retrieves Supabase configuration from environment or server /api/config
 */
export async function fetchSupabaseConfig(): Promise<SupabaseConfig> {
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Could not fetch /api/config:', err);
  }

  const url = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  return {
    supabaseUrl: url,
    supabaseAnonKey: anonKey,
    isConfigured: Boolean(url && anonKey),
  };
}

/**
 * Initializes and caches the Supabase client
 */
export async function initSupabase(url?: string, anonKey?: string): Promise<SupabaseClient | null> {
  if (clientInstance && !url && !anonKey) return clientInstance;

  let supabaseUrl = url;
  let supabaseAnonKey = anonKey;

  if (!supabaseUrl || !supabaseAnonKey) {
    const config = await fetchSupabaseConfig();
    supabaseUrl = config.supabaseUrl;
    supabaseAnonKey = config.supabaseAnonKey;
  }

  if (supabaseUrl && supabaseAnonKey) {
    clientInstance = createClient(supabaseUrl.trim(), supabaseAnonKey.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return clientInstance;
  }

  return null;
}

/**
 * Gets the current Supabase client instance synchronously if available
 */
export function getSupabase(): SupabaseClient | null {
  if (clientInstance) return clientInstance;
  
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey) {
    clientInstance = createClient(envUrl.trim(), envKey.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return clientInstance;
  }
  return null;
}

/* ==========================================================================
   CAMPAIGNS TABLE CLIENT CALLS (Create, Read, Update, Delete)
   ========================================================================== */

/**
 * READ: Fetch all campaigns from public.campaigns table via Supabase client
 */
export async function fetchSupabaseCampaigns(ownerUserId?: string): Promise<{ data: SupabaseCampaign[]; error: string | null }> {
  try {
    const supabase = getSupabase() || (await initSupabase());
    if (supabase) {
      let query = supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (ownerUserId) {
        query = query.eq('owner_user_id', ownerUserId);
      }

      const { data, error } = await query;
      if (!error && data) {
        return { data: data as SupabaseCampaign[], error: null };
      }
      if (error) {
        console.warn('Supabase direct campaigns query notice, trying proxy:', error.message);
      }
    }

    // Fallback via server API
    const res = await fetch('/api/supabase/campaigns');
    const json = await res.json();
    if (json.success) {
      return { data: json.campaigns || [], error: null };
    }
    return { data: [], error: json.error || 'Failed to fetch campaigns' };
  } catch (err: any) {
    return { data: [], error: err.message || 'Error fetching campaigns' };
  }
}

/**
 * CREATE: Insert a new campaign into public.campaigns and create initial leads
 */
export async function createSupabaseCampaignClient(params: {
  name: string;
  platforms: string[];
  profiles: string[];
  scrapeConfig?: Record<string, any>;
  ownerUserId?: string;
}): Promise<{ campaign: SupabaseCampaign; leads: SupabaseLead[] }> {
  const { name, platforms, profiles, scrapeConfig = {}, ownerUserId } = params;
  const validProfiles = profiles.map(p => p.trim()).filter(Boolean);

  if (validProfiles.length === 0) {
    throw new Error('Please provide at least one profile, handle, or domain URL.');
  }

  const supabase = getSupabase() || (await initSupabase());

  // Try direct Supabase client insert if client available
  if (supabase) {
    try {
      const { data: userSession } = await supabase.auth.getSession();
      const currentUserId = userSession.session?.user?.id || ownerUserId || null;

      const campaignPayload = {
        owner_user_id: currentUserId,
        name: name || `Campaign ${new Date().toLocaleDateString()}`,
        status: 'running',
        platforms: platforms.length > 0 ? platforms : ['LinkedIn'],
        total_profiles: validProfiles.length,
        completed_count: 0,
        failed_count: 0,
        scrape_config: {
          delayMs: scrapeConfig.delayMs || 1500,
          proxyRegion: scrapeConfig.proxyRegion || 'US-East',
          depth: scrapeConfig.depth || 'deep',
          useHunter: scrapeConfig.useHunter ?? true,
          ...scrapeConfig,
        },
      };

      const { data: campaignRow, error: cErr } = await supabase
        .from('campaigns')
        .insert(campaignPayload)
        .select('*')
        .single();

      if (!cErr && campaignRow) {
        const campaign = campaignRow as SupabaseCampaign;
        const primaryPlatform = platforms[0] || 'LinkedIn';

        const leadsToInsert = validProfiles.map(sourceId => {
          let inferredPlatform = primaryPlatform;
          if (sourceId.includes('linkedin.com')) inferredPlatform = 'LinkedIn';
          else if (sourceId.includes('twitter.com') || sourceId.includes('x.com')) inferredPlatform = 'Twitter / X';
          else if (sourceId.includes('github.com')) inferredPlatform = 'GitHub';
          else if (sourceId.includes('.') && !sourceId.includes(' ')) inferredPlatform = 'Company Website';

          return {
            campaign_id: campaign.id,
            platform: inferredPlatform,
            source_identifier: sourceId,
            raw_profile: { source: sourceId, registered_at: new Date().toISOString() },
            scrape_status: 'pending' as SupabaseScrapeStatus,
            verification_status: 'none' as SupabaseVerificationStatus,
          };
        });

        const { data: insertedLeads, error: lErr } = await supabase
          .from('leads')
          .insert(leadsToInsert)
          .select('*');

        const finalLeads = (!lErr && insertedLeads ? insertedLeads : []) as SupabaseLead[];

        // Trigger asynchronous background scraping and enrichment
        fetch(`/api/supabase/campaigns/${campaign.id}/process`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config: campaignPayload.scrape_config }),
        }).catch(e => console.warn('Background worker trigger:', e));

        return { campaign, leads: finalLeads };
      }
    } catch (clientErr) {
      console.warn('Direct client insert failed, executing via API endpoint:', clientErr);
    }
  }

  // Server API fallback (handles elevated service role if RLS requires)
  const token = (await supabase?.auth.getSession())?.data.session?.access_token;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch('/api/supabase/campaigns', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name,
      platforms,
      profiles: validProfiles,
      scrapeConfig,
    }),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to create campaign');
  }

  return {
    campaign: json.campaign,
    leads: json.leads || [],
  };
}

/**
 * UPDATE: Update a campaign in public.campaigns table via Supabase client
 */
export async function updateSupabaseCampaign(
  campaignId: string,
  updates: Partial<SupabaseCampaign>
): Promise<{ data: SupabaseCampaign | null; error: string | null }> {
  try {
    const supabase = getSupabase() || (await initSupabase());
    if (supabase) {
      const { data, error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', campaignId)
        .select('*')
        .single();

      if (!error && data) {
        return { data: data as SupabaseCampaign, error: null };
      }
    }

    // Fallback to server endpoint
    const res = await fetch(`/api/supabase/campaigns/${campaignId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (json.success) {
      return { data: json.data, error: null };
    }
    return { data: null, error: json.error || 'Failed to update campaign' };
  } catch (err: any) {
    return { data: null, error: err.message || 'Error updating campaign' };
  }
}

/**
 * DELETE: Delete a campaign from public.campaigns table (cascades to leads)
 */
export async function deleteSupabaseCampaign(campaignId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabase() || (await initSupabase());
    if (supabase) {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);

      if (!error) {
        return { success: true, error: null };
      }
    }

    // Fallback to server endpoint
    const res = await fetch(`/api/supabase/campaigns/${campaignId}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    return { success: json.success, error: json.error || null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error deleting campaign' };
  }
}

/* ==========================================================================
   LEADS TABLE CLIENT CALLS (Create, Read, Update, Delete, Enrich)
   ========================================================================== */

/**
 * READ: Fetch leads for a campaign from public.leads table via Supabase client
 */
export async function fetchSupabaseCampaignLeads(campaignId: string): Promise<{ data: SupabaseLead[]; error: string | null }> {
  try {
    const supabase = getSupabase() || (await initSupabase());
    if (supabase) {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return { data: data as SupabaseLead[], error: null };
      }
    }

    // Fallback to server endpoint
    const res = await fetch(`/api/supabase/campaigns/${campaignId}/leads`);
    const json = await res.json();
    if (json.success) {
      return { data: json.leads || [], error: null };
    }
    return { data: [], error: json.error || 'Failed to fetch campaign leads' };
  } catch (err: any) {
    return { data: [], error: err.message || 'Error fetching leads' };
  }
}

/**
 * CREATE / INSERT: Insert new lead(s) into public.leads table for a campaign
 */
export async function insertSupabaseLeads(
  campaignId: string,
  leads: Partial<SupabaseLead>[]
): Promise<{ data: SupabaseLead[]; error: string | null }> {
  try {
    const supabase = getSupabase() || (await initSupabase());
    const records = leads.map(l => ({
      campaign_id: campaignId,
      platform: l.platform || 'LinkedIn',
      source_identifier: l.source_identifier || '',
      raw_profile: l.raw_profile || {},
      scrape_status: l.scrape_status || 'pending',
      verification_status: l.verification_status || 'none',
      detected_company: l.detected_company || null,
      detected_domain: l.detected_domain || null,
      candidate_emails: l.candidate_emails || [],
      verified_email: l.verified_email || null,
      phone: l.phone || null,
      lead_score: l.lead_score || null,
      score_breakdown: l.score_breakdown || null,
    }));

    if (supabase) {
      const { data, error } = await supabase
        .from('leads')
        .insert(records)
        .select('*');

      if (!error && data) {
        return { data: data as SupabaseLead[], error: null };
      }
    }

    // Fallback to server endpoint
    const res = await fetch(`/api/supabase/campaigns/${campaignId}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leads: records }),
    });
    const json = await res.json();
    if (json.success) {
      return { data: json.data || [], error: null };
    }
    return { data: [], error: json.error || 'Failed to insert leads' };
  } catch (err: any) {
    return { data: [], error: err.message || 'Error inserting leads' };
  }
}

/**
 * UPDATE: Update a single lead in public.leads table via Supabase client
 */
export async function updateSupabaseLead(
  leadId: string,
  updates: Partial<SupabaseLead>
): Promise<{ data: SupabaseLead | null; error: string | null }> {
  try {
    const supabase = getSupabase() || (await initSupabase());
    if (supabase) {
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', leadId)
        .select('*')
        .single();

      if (!error && data) {
        return { data: data as SupabaseLead, error: null };
      }
    }

    // Fallback to server endpoint
    const res = await fetch(`/api/supabase/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (json.success) {
      return { data: json.data, error: null };
    }
    return { data: null, error: json.error || 'Failed to update lead' };
  } catch (err: any) {
    return { data: null, error: err.message || 'Error updating lead' };
  }
}

/**
 * DELETE: Delete a single lead from public.leads table via Supabase client
 */
export async function deleteSupabaseLead(leadId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabase() || (await initSupabase());
    if (supabase) {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (!error) {
        return { success: true, error: null };
      }
    }

    // Fallback to server endpoint
    const res = await fetch(`/api/supabase/leads/${leadId}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    return { success: json.success, error: json.error || null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error deleting lead' };
  }
}

/**
 * ENRICH: Trigger Hunter/Gemini live extraction & enrich the Supabase lead record
 */
export async function enrichSupabaseLead(leadId: string): Promise<{ data: SupabaseLead | null; error: string | null }> {
  try {
    const res = await fetch(`/api/supabase/leads/${leadId}/enrich`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    if (json.success && json.data) {
      return { data: json.data, error: null };
    }
    return { data: null, error: json.error || 'Failed to enrich lead' };
  } catch (err: any) {
    return { data: null, error: err.message || 'Error during lead enrichment' };
  }
}

/* ==========================================================================
   REALTIME & UTILITIES
   ========================================================================== */

/**
 * Subscribe to Supabase Realtime changes for leads in a specific campaign
 */
export function subscribeToCampaignLeads(
  supabase: SupabaseClient,
  campaignId: string,
  onUpdate: (payload: { eventType: string; newLead?: SupabaseLead; oldLead?: SupabaseLead }) => void
) {
  const channel = supabase
    .channel(`campaign-leads-${campaignId}-${Date.now()}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'leads',
        filter: `campaign_id=eq.${campaignId}`,
      },
      (payload) => {
        onUpdate({
          eventType: payload.eventType,
          newLead: payload.new as SupabaseLead,
          oldLead: payload.old as SupabaseLead,
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Subscribe to Supabase Realtime changes for campaigns table
 */
export function subscribeToCampaigns(
  supabase: SupabaseClient,
  onUpdate: (payload: { eventType: string; newCampaign?: SupabaseCampaign; oldCampaign?: SupabaseCampaign }) => void
) {
  const channel = supabase
    .channel(`campaigns-all-${Date.now()}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'campaigns',
      },
      (payload) => {
        onUpdate({
          eventType: payload.eventType,
          newCampaign: payload.new as SupabaseCampaign,
          oldCampaign: payload.old as SupabaseCampaign,
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Download a list of Supabase leads as a formatted CSV file
 */
export function exportSupabaseLeadsToCsv(campaignName: string, leads: SupabaseLead[]) {
  const headers = [
    'ID',
    'Platform',
    'Source Identifier',
    'Scrape Status',
    'Company',
    'Domain',
    'Verified Email',
    'Verification Status',
    'Candidate Emails',
    'Phone',
    'Lead Score',
    'Created At',
  ];

  const rows = leads.map(l => [
    `"${l.id}"`,
    `"${l.platform}"`,
    `"${(l.source_identifier || '').replace(/"/g, '""')}"`,
    `"${l.scrape_status}"`,
    `"${(l.detected_company || '').replace(/"/g, '""')}"`,
    `"${(l.detected_domain || '').replace(/"/g, '""')}"`,
    `"${(l.verified_email || '').replace(/"/g, '""')}"`,
    `"${l.verification_status}"`,
    `"${(l.candidate_emails || []).join('; ').replace(/"/g, '""')}"`,
    `"${(l.phone || '').replace(/"/g, '""')}"`,
    l.lead_score ?? '',
    `"${l.created_at}"`,
  ].join(','));

  const csvString = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const safeName = (campaignName || 'campaign_leads').toLowerCase().replace(/[^a-z0-9]/g, '_');
  link.setAttribute('download', `${safeName}_export_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
