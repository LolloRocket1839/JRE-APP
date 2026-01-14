'use client';

import { useEffect, useState } from 'react';
import { Search, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Input, Select, Badge, Card, CardContent, Skeleton } from '@/components/ui';
import { useLocale } from '@/hooks/useLocale';
import { createClient } from '@/lib/supabase/client';
import { Lead } from '@/types';

export default function AdminLeadsPage() {
  const { locale, t } = useLocale();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    fetchLeads();
  }, [page, typeFilter, statusFilter]);

  async function fetchLeads() {
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (typeFilter !== 'all') {
      query = query.eq('lead_type', typeFilter);
    }

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, count } = await query;
    setLeads(data || []);
    setTotalCount(count || 0);
    setLoading(false);
  }

  const handleSearch = () => {
    setPage(1);
    fetchLeads();
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    const supabase = createClient();
    await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
    fetchLeads();
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Type', 'Status', 'Language', 'Source', 'Created At'];
    const rows = leads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone || '',
      lead.lead_type,
      lead.status,
      lead.language,
      lead.source || '',
      new Date(lead.created_at).toISOString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const typeOptions = [
    { value: 'all', label: locale === 'it' ? 'Tutti i tipi' : 'All types' },
    { value: 'investor', label: locale === 'it' ? 'Investitori' : 'Investors' },
    { value: 'student', label: locale === 'it' ? 'Studenti' : 'Students' },
    { value: 'tourist', label: locale === 'it' ? 'Turisti' : 'Tourists' },
    { value: 'waitlist', label: 'Waitlist' },
  ];

  const statusOptions = [
    { value: 'all', label: locale === 'it' ? 'Tutti gli stati' : 'All statuses' },
    { value: 'new', label: locale === 'it' ? 'Nuovo' : 'New' },
    { value: 'contacted', label: locale === 'it' ? 'Contattato' : 'Contacted' },
    { value: 'qualified', label: locale === 'it' ? 'Qualificato' : 'Qualified' },
    { value: 'rejected', label: locale === 'it' ? 'Rifiutato' : 'Rejected' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return 'info';
      case 'contacted':
        return 'warning';
      case 'qualified':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-3xl font-bold text-[var(--color-foreground)]">
          {t.admin.leads}
        </h1>
        <Button onClick={exportCSV} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          {t.admin.export}
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-foreground-muted)]" />
                <input
                  type="text"
                  placeholder={locale === 'it' ? 'Cerca per nome o email...' : 'Search by name or email...'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="input pl-10"
                />
              </div>
            </div>
            <Select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              options={typeOptions}
              className="sm:w-40"
            />
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              options={statusOptions}
              className="sm:w-40"
            />
            <Button onClick={handleSearch}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

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
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-foreground-muted)]">
                  {locale === 'it' ? 'Tipo' : 'Type'}
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
                        <Skeleton className="h-5 w-48" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-5 w-20" />
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
                : leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-[var(--color-card-border)]">
                      <td className="px-4 py-3 text-sm font-medium text-[var(--color-foreground)]">
                        {lead.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-foreground-muted)]">
                        {lead.email}
                      </td>
                      <td className="px-4 py-3">
                        <Badge>{lead.lead_type}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={getStatusBadge(lead.status) as 'success' | 'warning' | 'error' | 'info'}>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-foreground-muted)]">
                        {new Date(lead.created_at).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US')}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className="input py-1 text-sm"
                        >
                          <option value="new">{locale === 'it' ? 'Nuovo' : 'New'}</option>
                          <option value="contacted">{locale === 'it' ? 'Contattato' : 'Contacted'}</option>
                          <option value="qualified">{locale === 'it' ? 'Qualificato' : 'Qualified'}</option>
                          <option value="rejected">{locale === 'it' ? 'Rifiutato' : 'Rejected'}</option>
                        </select>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[var(--color-card-border)] px-4 py-3">
          <p className="text-sm text-[var(--color-foreground-muted)]">
            {locale === 'it'
              ? `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, totalCount)} di ${totalCount}`
              : `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, totalCount)} of ${totalCount}`}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
