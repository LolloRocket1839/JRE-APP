'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { hashString } from '@/lib/utils';
import { z } from 'zod';
import { Locale, VerificationType } from '@/types';

const verificationSchema = z.object({
  lead_id: z.string().uuid(),
  verification_type: z.enum(['student', 'investor']),
  full_name: z.string().min(2).max(200),
  dob: z.string(),
  nationality: z.string().min(2).max(100),
  address_line: z.string().max(300),
  city: z.string().max(100),
  postal_code: z.string().max(20),
  country: z.string().max(100),
  id_doc_type: z.string(),
  id_doc_number: z.string().max(100),
  consent_privacy: z.literal(true),
  consent_marketing: z.boolean().optional(),
  language: z.enum(['it', 'en']),
});

export async function submitVerification(data: {
  lead_id: string;
  verification_type: VerificationType;
  full_name: string;
  dob: string;
  nationality: string;
  address_line: string;
  city: string;
  postal_code: string;
  country: string;
  id_doc_type: string;
  id_doc_number: string;
  id_files: File[];
  proof_files: File[];
  consent_privacy: boolean;
  consent_marketing?: boolean;
  language: Locale;
}): Promise<{ success: boolean; verificationId?: string; error?: string }> {
  try {
    // Validate
    const validated = verificationSchema.parse({
      ...data,
      consent_privacy: data.consent_privacy as true,
    });

    const supabase = await createClient();
    const adminSupabase = await createAdminClient();

    // Upload ID documents
    const idDocPaths: string[] = [];
    for (const file of data.id_files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${validated.lead_id}/${Date.now()}_id_${Math.random().toString(36).slice(2)}.${fileExt}`;

      const arrayBuffer = await file.arrayBuffer();
      const { error: uploadError } = await adminSupabase.storage
        .from('id_docs')
        .upload(fileName, arrayBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (!uploadError) {
        idDocPaths.push(fileName);
      }
    }

    // Upload proof of address (for investors)
    const proofPaths: string[] = [];
    if (validated.verification_type === 'investor') {
      for (const file of data.proof_files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${validated.lead_id}/${Date.now()}_proof_${Math.random().toString(36).slice(2)}.${fileExt}`;

        const arrayBuffer = await file.arrayBuffer();
        const { error: uploadError } = await adminSupabase.storage
          .from('proof_of_address')
          .upload(fileName, arrayBuffer, {
            contentType: file.type,
            upsert: false,
          });

        if (!uploadError) {
          proofPaths.push(fileName);
        }
      }
    }

    // Insert verification record
    const { data: verification, error: verificationError } = await supabase
      .from('verifications')
      .insert({
        lead_id: validated.lead_id,
        verification_type: validated.verification_type,
        full_name: validated.full_name,
        dob: validated.dob,
        nationality: validated.nationality,
        address_line: validated.address_line || '',
        city: validated.city || '',
        postal_code: validated.postal_code || '',
        country: validated.country || '',
        id_doc_type: validated.id_doc_type,
        id_doc_number: validated.id_doc_number,
        id_doc_files: idDocPaths,
        proof_of_address_files: proofPaths,
        consent_privacy: true,
        consent_marketing: validated.consent_marketing || false,
        status: 'submitted',
      })
      .select('id')
      .single();

    if (verificationError) {
      console.error('Verification insert error:', verificationError);
      return { success: false, error: 'Failed to submit verification. Please try again.' };
    }

    // Log consent
    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0] || 'unknown';
    const ipHash = hashString(ip);
    const userAgent = headersList.get('user-agent') || '';

    // Get lead email
    const { data: lead } = await supabase
      .from('leads')
      .select('email')
      .eq('id', validated.lead_id)
      .single();

    if (lead) {
      await supabase.from('consent_logs').insert([
        {
          lead_id: validated.lead_id,
          email: lead.email,
          consent_type: 'privacy',
          version: '1.0',
          language: validated.language,
          ip_hash: ipHash,
          user_agent_hash: hashString(userAgent),
        },
        ...(validated.consent_marketing
          ? [
              {
                lead_id: validated.lead_id,
                email: lead.email,
                consent_type: 'marketing' as const,
                version: '1.0',
                language: validated.language,
                ip_hash: ipHash,
                user_agent_hash: hashString(userAgent),
              },
            ]
          : []),
      ]);
    }

    return { success: true, verificationId: verification?.id };
  } catch (error) {
    console.error('Verification error:', error);
    return { success: false, error: 'An error occurred. Please try again.' };
  }
}
