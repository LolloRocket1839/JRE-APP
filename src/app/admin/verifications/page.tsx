'use client';

import { useEffect, useState } from 'react';
import { Shield, Eye, Check, X, Download, ExternalLink } from 'lucide-react';
import { Button, Badge, Card, CardContent, Skeleton, Modal, Textarea } from '@/components/ui';
import { useLocale } from '@/hooks/useLocale';
import { createClient } from '@/lib/supabase/client';
import { Verification, Lead } from '@/types';

interface VerificationWithLead extends Verification {
  lead: Lead;
}

export default function AdminVerificationsPage() {
  const { locale, t } = useLocale();
  const [verifications, setVerifications] = useState<VerificationWithLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<VerificationWithLead | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchVerifications();
  }, []);

  async function fetchVerifications() {
    const supabase = createClient();
    const { data } = await supabase
      .from('verifications')
      .select('*, lead:leads(*)')
      .order('created_at', { ascending: false });

    setVerifications((data || []) as VerificationWithLead[]);
    setLoading(false);
  }

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    setUpdating(true);
    const supabase = createClient();

    await supabase
      .from('verifications')
      .update({
        status: newStatus,
        admin_notes: adminNotes || null,
      })
      .eq('id', id);

    // If approved, update lead status to qualified
    if (newStatus === 'approved' && selectedVerification) {
      await supabase
        .from('leads')
        .update({ status: 'qualified' })
        .eq('id', selectedVerification.lead_id);
    }

    setUpdating(false);
    setSelectedVerification(null);
    setAdminNotes('');
    fetchVerifications();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'info';
      case 'in_review':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getDocumentUrl = async (bucket: string, path: string) => {
    const supabase = createClient();
    const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 3600);
    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-[var(--color-foreground)]">
          {t.admin.verifications}
        </h1>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {['submitted', 'in_review', 'approved', 'rejected'].map((status) => (
          <Card key={status}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-[var(--color-foreground)]">
                {verifications.filter((v) => v.status === status).length}
              </p>
              <p className="text-sm text-[var(--color-foreground-muted)]">
                {t.verification.status[status as keyof typeof t.verification.status]}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-card-border)]">
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-foreground-muted)]">
                  {locale === 'it' ? 'Nome' : 'Name'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-foreground-muted)]">
                  {locale === 'it' ? 'Tipo' : 'Type'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-foreground-muted)]">
                  {locale === 'it' ? 'Documento' : 'Document'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-foreground-muted)]">
                  {locale === 'it' ? 'Stato' : 'Status'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-foreground-muted)]">
                  {locale === 'it' ? 'Data' : 'Date'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-foreground-muted)]">
                  {locale === 'it' ? 'Azioni' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-[var(--color-card-border)]">
                      <td className="px-4 py-3">
                        <Skeleton className="h-5 w-32" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-5 w-20" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-5 w-24" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-5 w-20" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-5 w-24" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-8 w-24" />
                      </td>
                    </tr>
                  ))
                : verifications.map((v) => (
                    <tr key={v.id} className="border-b border-[var(--color-card-border)]">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-[var(--color-foreground)]">
                            {v.full_name}
                          </p>
                          <p className="text-xs text-[var(--color-foreground-muted)]">
                            {v.lead?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge>{v.verification_type}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-foreground-muted)]">
                        {v.id_doc_type} - {v.id_doc_number}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={getStatusBadge(v.status) as 'success' | 'warning' | 'error' | 'info'}>
                          {t.verification.status[v.status as keyof typeof t.verification.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-foreground-muted)]">
                        {new Date(v.created_at).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US')}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedVerification(v);
                            setAdminNotes(v.admin_notes || '');
                          }}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          {t.admin.actions.view}
                        </Button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedVerification}
        onClose={() => setSelectedVerification(null)}
        title={locale === 'it' ? 'Dettagli Verifica' : 'Verification Details'}
        size="lg"
      >
        {selectedVerification && (
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-[var(--color-foreground-muted)]">
                  {t.verification.fullName}
                </p>
                <p className="font-medium text-[var(--color-foreground)]">
                  {selectedVerification.full_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-foreground-muted)]">
                  {t.verification.dob}
                </p>
                <p className="font-medium text-[var(--color-foreground)]">
                  {new Date(selectedVerification.dob).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-foreground-muted)]">
                  {t.verification.nationality}
                </p>
                <p className="font-medium text-[var(--color-foreground)]">
                  {selectedVerification.nationality}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-foreground-muted)]">
                  {locale === 'it' ? 'Tipo' : 'Type'}
                </p>
                <Badge>{selectedVerification.verification_type}</Badge>
              </div>
            </div>

            {/* Address */}
            {selectedVerification.address_line && (
              <div>
                <p className="text-sm text-[var(--color-foreground-muted)]">
                  {t.verification.address}
                </p>
                <p className="font-medium text-[var(--color-foreground)]">
                  {selectedVerification.address_line}, {selectedVerification.city}{' '}
                  {selectedVerification.postal_code}, {selectedVerification.country}
                </p>
              </div>
            )}

            {/* Documents */}
            <div>
              <p className="mb-2 text-sm text-[var(--color-foreground-muted)]">
                {t.verification.idDocType}: {selectedVerification.id_doc_type}
              </p>
              <p className="mb-3 text-sm text-[var(--color-foreground-muted)]">
                {t.verification.idDocNumber}: {selectedVerification.id_doc_number}
              </p>

              <div className="flex flex-wrap gap-2">
                {(selectedVerification.id_doc_files as string[]).map((path, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => getDocumentUrl('id_docs', path)}
                  >
                    <ExternalLink className="mr-1 h-4 w-4" />
                    ID Doc {i + 1}
                  </Button>
                ))}
                {(selectedVerification.proof_of_address_files as string[]).map((path, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => getDocumentUrl('proof_of_address', path)}
                  >
                    <ExternalLink className="mr-1 h-4 w-4" />
                    Proof {i + 1}
                  </Button>
                ))}
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <Textarea
                label={locale === 'it' ? 'Note Admin' : 'Admin Notes'}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Actions */}
            {selectedVerification.status !== 'approved' &&
              selectedVerification.status !== 'rejected' && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 border-[var(--color-error)] text-[var(--color-error)] hover:bg-[var(--color-error)]/10"
                    onClick={() => handleStatusChange(selectedVerification.id, 'rejected')}
                    loading={updating}
                  >
                    <X className="h-4 w-4" />
                    {t.admin.actions.reject}
                  </Button>
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => handleStatusChange(selectedVerification.id, 'approved')}
                    loading={updating}
                  >
                    <Check className="h-4 w-4" />
                    {t.admin.actions.approve}
                  </Button>
                </div>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
}
