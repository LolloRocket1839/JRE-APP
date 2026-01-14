'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { hashString } from '@/lib/utils';
import { z } from 'zod';
import { Locale, LeadType, InvestorType } from '@/types';

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5;

async function getRateLimitKey(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0] || 'unknown';
  return hashString(ip);
}

async function checkRateLimit(): Promise<boolean> {
  const key = await getRateLimitKey();
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(key, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

// Waitlist Schema
const waitlistSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  interest: z.enum(['investor', 'student', 'tourist']),
  language: z.enum(['it', 'en']),
});

export async function submitWaitlist(data: {
  name: string;
  email: string;
  interest: LeadType;
  language: Locale;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Rate limit check
    if (!(await checkRateLimit())) {
      return { success: false, error: 'Too many requests. Please try again later.' };
    }

    // Validate
    const validated = waitlistSchema.parse(data);

    const supabase = await createClient();

    // Check if email already exists
    const { data: existing } = await supabase
      .from('leads')
      .select('id')
      .eq('email', validated.email)
      .eq('lead_type', 'waitlist')
      .single();

    if (existing) {
      return { success: true }; // Silent success for duplicate
    }

    // Insert lead
    const { error: leadError } = await supabase.from('leads').insert({
      lead_type: 'waitlist',
      name: validated.name,
      email: validated.email,
      language: validated.language,
      status: 'new',
      source: `waitlist_${validated.interest}`,
    });

    if (leadError) {
      console.error('Lead insert error:', leadError);
      return { success: false, error: 'Failed to submit. Please try again.' };
    }

    // Log consent
    const headersList = await headers();
    const ipHash = await getRateLimitKey();
    const userAgent = headersList.get('user-agent') || '';

    await supabase.from('consent_logs').insert({
      email: validated.email,
      consent_type: 'privacy',
      version: '1.0',
      language: validated.language,
      ip_hash: ipHash,
      user_agent_hash: hashString(userAgent),
    });

    return { success: true };
  } catch (error) {
    console.error('Waitlist error:', error);
    return { success: false, error: 'An error occurred. Please try again.' };
  }
}

// Investor Interest Schema
const investorInterestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(30).optional(),
  country: z.string().min(2).max(100),
  investor_type: z.enum(['retail', 'pro']),
  budget_range: z.string(),
  risk_tolerance: z.string(),
  timeframe: z.string(),
  notes: z.string().max(1000).optional(),
  property_interest_id: z.string().uuid().optional(),
  consent_privacy: z.literal(true),
  consent_marketing: z.boolean().optional(),
  language: z.enum(['it', 'en']),
});

export async function submitInvestorInterest(data: {
  name: string;
  email: string;
  phone?: string;
  country: string;
  investor_type: InvestorType;
  budget_range: string;
  risk_tolerance: string;
  timeframe: string;
  notes?: string;
  property_interest_id?: string;
  consent_privacy: boolean;
  consent_marketing?: boolean;
  language: Locale;
}): Promise<{ success: boolean; leadId?: string; error?: string }> {
  try {
    // Rate limit check
    if (!(await checkRateLimit())) {
      return { success: false, error: 'Too many requests. Please try again later.' };
    }

    // Validate
    const validated = investorInterestSchema.parse(data);

    const supabase = await createClient();

    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser();

    // Insert lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        user_id: user?.id || null,
        lead_type: 'investor',
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        language: validated.language,
        status: 'new',
        source: 'investor_form',
      })
      .select('id')
      .single();

    if (leadError || !lead) {
      console.error('Lead insert error:', leadError);
      return { success: false, error: 'Failed to submit. Please try again.' };
    }

    // Insert investor profile
    const { error: profileError } = await supabase.from('investor_profiles').insert({
      lead_id: lead.id,
      country: validated.country,
      investor_type: validated.investor_type,
      budget_range: validated.budget_range,
      risk_tolerance: validated.risk_tolerance,
      timeframe: validated.timeframe,
      notes: validated.notes || null,
      property_interest_id: validated.property_interest_id || null,
    });

    if (profileError) {
      console.error('Profile insert error:', profileError);
    }

    // Log consent
    const headersList = await headers();
    const ipHash = await getRateLimitKey();
    const userAgent = headersList.get('user-agent') || '';

    await supabase.from('consent_logs').insert([
      {
        lead_id: lead.id,
        email: validated.email,
        consent_type: 'privacy',
        version: '1.0',
        language: validated.language,
        ip_hash: ipHash,
        user_agent_hash: hashString(userAgent),
      },
      ...(validated.consent_marketing
        ? [
            {
              lead_id: lead.id,
              email: validated.email,
              consent_type: 'marketing' as const,
              version: '1.0',
              language: validated.language,
              ip_hash: ipHash,
              user_agent_hash: hashString(userAgent),
            },
          ]
        : []),
    ]);

    return { success: true, leadId: lead.id };
  } catch (error) {
    console.error('Investor interest error:', error);
    return { success: false, error: 'An error occurred. Please try again.' };
  }
}

// Student Request Schema
const studentRequestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(30).optional(),
  listing_id: z.string().uuid(),
  request_type: z.enum(['viewing', 'apply']),
  university: z.string().min(2).max(200),
  program: z.string().min(2).max(200),
  move_in_date: z.string(),
  budget: z.number().positive(),
  guarantor: z.boolean(),
  message: z.string().max(1000).optional(),
  preferred_dates: z.array(z.string()).max(5),
  consent_privacy: z.literal(true),
  consent_marketing: z.boolean().optional(),
  language: z.enum(['it', 'en']),
});

export async function submitStudentRequest(data: {
  name: string;
  email: string;
  phone?: string;
  listing_id: string;
  request_type: 'viewing' | 'apply';
  university: string;
  program: string;
  move_in_date: string;
  budget: number;
  guarantor: boolean;
  message?: string;
  preferred_dates: string[];
  consent_privacy: boolean;
  consent_marketing?: boolean;
  language: Locale;
}): Promise<{ success: boolean; leadId?: string; requestId?: string; error?: string }> {
  try {
    // Rate limit check
    if (!(await checkRateLimit())) {
      return { success: false, error: 'Too many requests. Please try again later.' };
    }

    // Validate
    const validated = studentRequestSchema.parse(data);

    const supabase = await createClient();

    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser();

    // Insert lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        user_id: user?.id || null,
        lead_type: 'student',
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        language: validated.language,
        status: 'new',
        source: `student_${validated.request_type}`,
      })
      .select('id')
      .single();

    if (leadError || !lead) {
      console.error('Lead insert error:', leadError);
      return { success: false, error: 'Failed to submit. Please try again.' };
    }

    // Insert student request
    const { data: request, error: requestError } = await supabase
      .from('student_requests')
      .insert({
        lead_id: lead.id,
        listing_id: validated.listing_id,
        request_type: validated.request_type,
        university: validated.university,
        program: validated.program,
        move_in_date: validated.move_in_date,
        budget: validated.budget,
        guarantor: validated.guarantor,
        message: validated.message || null,
        preferred_dates: validated.preferred_dates,
        status: 'pending',
      })
      .select('id')
      .single();

    if (requestError) {
      console.error('Request insert error:', requestError);
    }

    // Log consent
    const headersList = await headers();
    const ipHash = await getRateLimitKey();
    const userAgent = headersList.get('user-agent') || '';

    await supabase.from('consent_logs').insert([
      {
        lead_id: lead.id,
        email: validated.email,
        consent_type: 'privacy',
        version: '1.0',
        language: validated.language,
        ip_hash: ipHash,
        user_agent_hash: hashString(userAgent),
      },
      ...(validated.consent_marketing
        ? [
            {
              lead_id: lead.id,
              email: validated.email,
              consent_type: 'marketing' as const,
              version: '1.0',
              language: validated.language,
              ip_hash: ipHash,
              user_agent_hash: hashString(userAgent),
            },
          ]
        : []),
    ]);

    return { success: true, leadId: lead.id, requestId: request?.id };
  } catch (error) {
    console.error('Student request error:', error);
    return { success: false, error: 'An error occurred. Please try again.' };
  }
}

// Tourist Request Schema
const touristRequestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(30).optional(),
  listing_id: z.string().uuid(),
  guests: z.number().positive().max(20),
  date_from: z.string(),
  date_to: z.string(),
  message: z.string().max(1000).optional(),
  consent_privacy: z.literal(true),
  consent_marketing: z.boolean().optional(),
  language: z.enum(['it', 'en']),
});

export async function submitTouristRequest(data: {
  name: string;
  email: string;
  phone?: string;
  listing_id: string;
  guests: number;
  date_from: string;
  date_to: string;
  message?: string;
  consent_privacy: boolean;
  consent_marketing?: boolean;
  language: Locale;
}): Promise<{ success: boolean; leadId?: string; requestId?: string; error?: string }> {
  try {
    // Rate limit check
    if (!(await checkRateLimit())) {
      return { success: false, error: 'Too many requests. Please try again later.' };
    }

    // Validate
    const validated = touristRequestSchema.parse(data);

    const supabase = await createClient();

    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser();

    // Insert lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        user_id: user?.id || null,
        lead_type: 'tourist',
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        language: validated.language,
        status: 'new',
        source: 'tourist_request',
      })
      .select('id')
      .single();

    if (leadError || !lead) {
      console.error('Lead insert error:', leadError);
      return { success: false, error: 'Failed to submit. Please try again.' };
    }

    // Insert tourist request
    const { data: request, error: requestError } = await supabase
      .from('tourist_requests')
      .insert({
        lead_id: lead.id,
        listing_id: validated.listing_id,
        guests: validated.guests,
        date_from: validated.date_from,
        date_to: validated.date_to,
        message: validated.message || null,
        status: 'pending',
      })
      .select('id')
      .single();

    if (requestError) {
      console.error('Request insert error:', requestError);
    }

    // Log consent
    const headersList = await headers();
    const ipHash = await getRateLimitKey();
    const userAgent = headersList.get('user-agent') || '';

    await supabase.from('consent_logs').insert([
      {
        lead_id: lead.id,
        email: validated.email,
        consent_type: 'privacy',
        version: '1.0',
        language: validated.language,
        ip_hash: ipHash,
        user_agent_hash: hashString(userAgent),
      },
      ...(validated.consent_marketing
        ? [
            {
              lead_id: lead.id,
              email: validated.email,
              consent_type: 'marketing' as const,
              version: '1.0',
              language: validated.language,
              ip_hash: ipHash,
              user_agent_hash: hashString(userAgent),
            },
          ]
        : []),
    ]);

    return { success: true, leadId: lead.id, requestId: request?.id };
  } catch (error) {
    console.error('Tourist request error:', error);
    return { success: false, error: 'An error occurred. Please try again.' };
  }
}
