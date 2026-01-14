'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Building } from 'lucide-react';
import { Button, Badge, Card, CardContent, Skeleton, Modal, Input, Select, Textarea } from '@/components/ui';
import { useLocale } from '@/hooks/useLocale';
import { createClient } from '@/lib/supabase/client';
import { Property, City } from '@/types';

export default function AdminPropertiesPage() {
  const { locale, t } = useLocale();
  const [properties, setProperties] = useState<Property[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address_area: '',
    description_it: '',
    description_en: '',
    min_ticket_eur: 100,
    target_raise_eur: 0,
    status: 'draft',
    city_id: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const supabase = createClient();

    const [propertiesRes, citiesRes] = await Promise.all([
      supabase.from('properties').select('*, city:cities(*)').order('created_at', { ascending: false }),
      supabase.from('cities').select('*').order('name_it'),
    ]);

    setProperties(propertiesRes.data || []);
    setCities(citiesRes.data || []);
    setLoading(false);
  }

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      name: property.name,
      address_area: property.address_area,
      description_it: property.description_it,
      description_en: property.description_en,
      min_ticket_eur: property.min_ticket_eur,
      target_raise_eur: property.target_raise_eur,
      status: property.status,
      city_id: property.city_id,
    });
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingProperty(null);
    setFormData({
      name: '',
      address_area: '',
      description_it: '',
      description_en: '',
      min_ticket_eur: 100,
      target_raise_eur: 0,
      status: 'draft',
      city_id: cities[0]?.id || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const supabase = createClient();

    if (editingProperty) {
      await supabase.from('properties').update(formData).eq('id', editingProperty.id);
    } else {
      await supabase.from('properties').insert(formData);
    }

    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(locale === 'it' ? 'Sei sicuro?' : 'Are you sure?')) return;

    const supabase = createClient();
    await supabase.from('properties').delete().eq('id', id);
    fetchData();
  };

  const cityOptions = cities.map((c) => ({
    value: c.id,
    label: locale === 'it' ? c.name_it : c.name_en,
  }));

  const statusOptions = [
    { value: 'draft', label: locale === 'it' ? 'Bozza' : 'Draft' },
    { value: 'live', label: 'Live' },
    { value: 'closed', label: locale === 'it' ? 'Chiuso' : 'Closed' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return 'success';
      case 'closed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-[var(--color-foreground)]">
          {t.admin.properties}
        </h1>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          {locale === 'it' ? 'Nuova Proprietà' : 'New Property'}
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="aspect-video w-full" />
              <CardContent className="p-4">
                <Skeleton className="mb-2 h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="mx-auto h-12 w-12 text-[var(--color-foreground-muted)]" />
            <p className="mt-4 text-[var(--color-foreground-muted)]">
              {locale === 'it' ? 'Nessuna proprietà' : 'No properties'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Card key={property.id}>
              <div className="aspect-video bg-[var(--color-background-subtle)]">
                {property.cover_image_url ? (
                  <img
                    src={property.cover_image_url}
                    alt={property.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Building className="h-12 w-12 text-[var(--color-foreground-muted)]" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="mb-2 flex gap-2">
                  <Badge variant={getStatusBadge(property.status) as 'success' | 'error' | 'default'}>
                    {property.status}
                  </Badge>
                </div>
                <h3 className="font-medium text-[var(--color-foreground)]">
                  {property.name}
                </h3>
                <p className="text-sm text-[var(--color-foreground-muted)]">
                  {property.address_area}
                </p>
                <p className="mt-2 text-sm text-[var(--color-foreground-muted)]">
                  Min €{property.min_ticket_eur} • Target €{property.target_raise_eur.toLocaleString()}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(property)}
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    {t.admin.actions.edit}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(property.id)}
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
        title={editingProperty ? (locale === 'it' ? 'Modifica Proprietà' : 'Edit Property') : (locale === 'it' ? 'Nuova Proprietà' : 'New Property')}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={locale === 'it' ? 'Nome' : 'Name'}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Select
              label={locale === 'it' ? 'Città' : 'City'}
              value={formData.city_id}
              onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
              options={cityOptions}
              required
            />
          </div>

          <Input
            label={locale === 'it' ? 'Zona/Indirizzo' : 'Area/Address'}
            value={formData.address_area}
            onChange={(e) => setFormData({ ...formData, address_area: e.target.value })}
            required
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={statusOptions}
              required
            />
            <Input
              label={locale === 'it' ? 'Investimento min (€)' : 'Min investment (€)'}
              type="number"
              value={formData.min_ticket_eur}
              onChange={(e) => setFormData({ ...formData, min_ticket_eur: Number(e.target.value) })}
              required
            />
            <Input
              label={locale === 'it' ? 'Target (€)' : 'Target (€)'}
              type="number"
              value={formData.target_raise_eur}
              onChange={(e) => setFormData({ ...formData, target_raise_eur: Number(e.target.value) })}
              required
            />
          </div>

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
