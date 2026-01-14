'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Home, Check, X } from 'lucide-react';
import { Button, Badge, Card, CardContent, Skeleton, Modal, Input, Select, Textarea, Checkbox } from '@/components/ui';
import { useLocale } from '@/hooks/useLocale';
import { createClient } from '@/lib/supabase/client';
import { Listing, City } from '@/types';

export default function AdminListingsPage() {
  const { locale, t } = useLocale();
  const [listings, setListings] = useState<Listing[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [formData, setFormData] = useState({
    title_it: '',
    title_en: '',
    type: 'room',
    area: 0,
    price_monthly: 0,
    price_nightly: 0,
    bills_included: false,
    deposit: 0,
    contract_type: '',
    distance_category: '',
    short_stay_eligible: false,
    description_it: '',
    description_en: '',
    availability_note: '',
    city_id: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const supabase = createClient();

    const [listingsRes, citiesRes] = await Promise.all([
      supabase.from('listings').select('*, city:cities(*)').order('created_at', { ascending: false }),
      supabase.from('cities').select('*').order('name_it'),
    ]);

    setListings(listingsRes.data || []);
    setCities(citiesRes.data || []);
    setLoading(false);
  }

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    setFormData({
      title_it: listing.title_it,
      title_en: listing.title_en,
      type: listing.type,
      area: listing.area,
      price_monthly: listing.price_monthly,
      price_nightly: listing.price_nightly || 0,
      bills_included: listing.bills_included,
      deposit: listing.deposit,
      contract_type: listing.contract_type,
      distance_category: listing.distance_category,
      short_stay_eligible: listing.short_stay_eligible,
      description_it: listing.description_it,
      description_en: listing.description_en,
      availability_note: listing.availability_note || '',
      city_id: listing.city_id,
    });
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingListing(null);
    setFormData({
      title_it: '',
      title_en: '',
      type: 'room',
      area: 0,
      price_monthly: 0,
      price_nightly: 0,
      bills_included: false,
      deposit: 0,
      contract_type: '',
      distance_category: '',
      short_stay_eligible: false,
      description_it: '',
      description_en: '',
      availability_note: '',
      city_id: cities[0]?.id || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const supabase = createClient();

    const data = {
      ...formData,
      price_nightly: formData.short_stay_eligible ? formData.price_nightly : null,
      amenities: [],
      photos: [],
    };

    if (editingListing) {
      await supabase.from('listings').update(data).eq('id', editingListing.id);
    } else {
      await supabase.from('listings').insert(data);
    }

    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(locale === 'it' ? 'Sei sicuro?' : 'Are you sure?')) return;

    const supabase = createClient();
    await supabase.from('listings').delete().eq('id', id);
    fetchData();
  };

  const cityOptions = cities.map((c) => ({
    value: c.id,
    label: locale === 'it' ? c.name_it : c.name_en,
  }));

  const typeOptions = [
    { value: 'room', label: locale === 'it' ? 'Stanza' : 'Room' },
    { value: 'apartment', label: locale === 'it' ? 'Appartamento' : 'Apartment' },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-[var(--color-foreground)]">
          {t.admin.listings}
        </h1>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          {locale === 'it' ? 'Nuovo Annuncio' : 'New Listing'}
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="aspect-video w-full" />
              <CardContent className="p-4">
                <Skeleton className="mb-2 h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <div className="aspect-video bg-[var(--color-background-subtle)]">
                <div className="flex h-full items-center justify-center">
                  <Home className="h-12 w-12 text-[var(--color-foreground-muted)]" />
                </div>
              </div>
              <CardContent className="p-4">
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge>{listing.type}</Badge>
                  {listing.short_stay_eligible && (
                    <Badge variant="warning">Short stay</Badge>
                  )}
                </div>
                <h3 className="font-medium text-[var(--color-foreground)]">
                  {locale === 'it' ? listing.title_it : listing.title_en}
                </h3>
                <p className="text-sm text-[var(--color-foreground-muted)]">
                  €{listing.price_monthly}/mese • {listing.area}m²
                </p>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(listing)}
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    {t.admin.actions.edit}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(listing.id)}
                    className="text-[var(--color-error)]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingListing ? (locale === 'it' ? 'Modifica Annuncio' : 'Edit Listing') : (locale === 'it' ? 'Nuovo Annuncio' : 'New Listing')}
        size="xl"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Titolo (IT)"
              value={formData.title_it}
              onChange={(e) => setFormData({ ...formData, title_it: e.target.value })}
              required
            />
            <Input
              label="Title (EN)"
              value={formData.title_en}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Select
              label={locale === 'it' ? 'Città' : 'City'}
              value={formData.city_id}
              onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
              options={cityOptions}
              required
            />
            <Select
              label={locale === 'it' ? 'Tipo' : 'Type'}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={typeOptions}
              required
            />
            <Input
              label={locale === 'it' ? 'Superficie (m²)' : 'Area (m²)'}
              type="number"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label={locale === 'it' ? 'Prezzo mensile (€)' : 'Monthly price (€)'}
              type="number"
              value={formData.price_monthly}
              onChange={(e) => setFormData({ ...formData, price_monthly: Number(e.target.value) })}
              required
            />
            <Input
              label={locale === 'it' ? 'Deposito (€)' : 'Deposit (€)'}
              type="number"
              value={formData.deposit}
              onChange={(e) => setFormData({ ...formData, deposit: Number(e.target.value) })}
              required
            />
            <Input
              label={locale === 'it' ? 'Contratto' : 'Contract'}
              value={formData.contract_type}
              onChange={(e) => setFormData({ ...formData, contract_type: e.target.value })}
              required
            />
          </div>

          <Input
            label={locale === 'it' ? 'Distanza' : 'Distance'}
            value={formData.distance_category}
            onChange={(e) => setFormData({ ...formData, distance_category: e.target.value })}
            placeholder={locale === 'it' ? 'es. 10 min Politecnico' : 'e.g. 10 min Politecnico'}
            required
          />

          <div className="flex gap-4">
            <Checkbox
              label={locale === 'it' ? 'Spese incluse' : 'Bills included'}
              checked={formData.bills_included}
              onChange={(e) => setFormData({ ...formData, bills_included: e.target.checked })}
            />
            <Checkbox
              label={locale === 'it' ? 'Soggiorno breve' : 'Short stay'}
              checked={formData.short_stay_eligible}
              onChange={(e) => setFormData({ ...formData, short_stay_eligible: e.target.checked })}
            />
          </div>

          {formData.short_stay_eligible && (
            <Input
              label={locale === 'it' ? 'Prezzo per notte (€)' : 'Nightly price (€)'}
              type="number"
              value={formData.price_nightly}
              onChange={(e) => setFormData({ ...formData, price_nightly: Number(e.target.value) })}
            />
          )}

          <Textarea
            label="Descrizione (IT)"
            value={formData.description_it}
            onChange={(e) => setFormData({ ...formData, description_it: e.target.value })}
            rows={3}
            required
          />

          <Textarea
            label="Description (EN)"
            value={formData.description_en}
            onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
            rows={3}
            required
          />

          <Input
            label={locale === 'it' ? 'Nota disponibilità' : 'Availability note'}
            value={formData.availability_note}
            onChange={(e) => setFormData({ ...formData, availability_note: e.target.value })}
          />

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>
              {t.common.cancel}
            </Button>
            <Button className="flex-1" onClick={handleSubmit}>
              {t.common.save}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
