'use client';
import { useState, useEffect } from 'react';
import { formatCurrency, getSurfaceLabel } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import styles from './page.module.css';

interface Field {
  id: string;
  name: string;
  surfaceType: string;
  description?: string;
  pricePerHour: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminFieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    surfaceType: 'SYNTHETIC_GRASS',
    description: '',
    pricePerHour: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchFields = () => {
    fetch('/api/admin/fields')
      .then(r => r.json())
      .then(data => { setFields(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchFields(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const res = await fetch('/api/admin/fields', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        surfaceType: form.surfaceType,
        description: form.description,
        pricePerHour: Number(form.pricePerHour),
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSuccess('Lapangan berhasil ditambahkan!');
      setShowForm(false);
      setForm({ name: '', surfaceType: 'SYNTHETIC_GRASS', description: '', pricePerHour: '' });
      fetchFields();
      setTimeout(() => setSuccess(''), 3000);
    } else {
      const data = await res.json();
      setError(data.error || 'Gagal menyimpan lapangan');
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/admin/fields/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    });
    setFields(prev => prev.map(f => f.id === id ? { ...f, isActive: !current } : f));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: 'calc(100vh - 128px)' }}>
      <div className="container" style={{ padding: '40px 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontFamily: 'var(--font-heading)', marginBottom: 4 }}>🏟️ Kelola Lapangan</h1>
            <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>{fields.length} lapangan terdaftar</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href="/admin" className="btn btn-ghost btn-sm">← Dashboard</a>
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Batal' : '+ Tambah Lapangan'}
            </button>
          </div>
        </div>

        {success && <div className="alert alert-success" style={{ marginBottom: 16 }}>✅ {success}</div>}

        {/* Add Form */}
        {showForm && (
          <div className={`card ${styles.formCard}`}>
            <h2 className={styles.formTitle}>Tambah Lapangan Baru</h2>
            {error && <div className="alert alert-danger" style={{ marginBottom: 16 }}>{error}</div>}
            <form onSubmit={handleSave} className={styles.form}>
              <div className="form-group">
                <label className="input-label">Nama Lapangan</label>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Contoh: Lapangan C" required />
              </div>
              <div className="form-group">
                <label className="input-label">Jenis Lantai</label>
                <select className="input" value={form.surfaceType} onChange={e => setForm({ ...form, surfaceType: e.target.value })}>
                  <option value="SYNTHETIC_GRASS">Rumput Sintetis</option>
                  <option value="CONCRETE">Semen</option>
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Harga per Jam (Rp)</label>
                <input className="input" type="number" value={form.pricePerHour} onChange={e => setForm({ ...form, pricePerHour: e.target.value })} placeholder="100000" required min={1} />
              </div>
              <div className="form-group">
                <label className="input-label">Deskripsi (opsional)</label>
                <textarea className="input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi lapangan..." style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                  {saving ? 'Menyimpan...' : 'Simpan Lapangan'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Field Cards */}
        <div className={styles.fieldGrid}>
          {fields.map(field => (
            <div key={field.id} className={`card ${styles.fieldCard} ${!field.isActive ? styles.inactive : ''}`}>
              <div className={styles.fieldHeader}>
                <span className={styles.fieldEmoji}>{field.surfaceType === 'SYNTHETIC_GRASS' ? '🌿' : '🏗️'}</span>
                <div className={styles.fieldMeta}>
                  <div className={styles.fieldName}>{field.name}</div>
                  <div className={styles.fieldSurface}>{getSurfaceLabel(field.surfaceType)}</div>
                </div>
                <div className={styles.fieldStatus}>
                  <span className={`badge ${field.isActive ? 'badge-success' : 'badge-default'}`}>
                    {field.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
              </div>
              {field.description && <p className={styles.fieldDesc}>{field.description}</p>}
              <div className={styles.fieldFooter}>
                <div className={styles.fieldPrice}>
                  {formatCurrency(field.pricePerHour)}<span style={{ fontSize: 12, fontWeight: 400, color: 'var(--color-muted)' }}>/jam</span>
                </div>
                <button
                  className={`btn btn-sm ${field.isActive ? 'btn-outline' : 'btn-primary'}`}
                  onClick={() => toggleActive(field.id, field.isActive)}
                >
                  {field.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
