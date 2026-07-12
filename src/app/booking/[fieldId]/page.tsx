'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { formatCurrency, formatDate, getSurfaceLabel } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import styles from './page.module.css';

interface Field {
  id: string;
  name: string;
  surfaceType: string;
  pricePerHour: number;
}

function BookingContent({ fieldId }: { fieldId: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const [field, setField] = useState<Field | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');

  const date = searchParams.get('date') || '';
  const startTime = searchParams.get('startTime') || '';
  const endTime = searchParams.get('endTime') || '';

  useEffect(() => {
    fetch('/api/fields')
      .then(r => r.json())
      .then(fields => {
        const f = fields.find((x: Field) => x.id === fieldId);
        setField(f || null);
        setLoading(false);
      });
  }, [fieldId]);

  if (loading) return <LoadingSpinner />;
  if (!field || !date || !startTime || !endTime) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <p>Data booking tidak lengkap.</p>
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => router.push('/fields')}>
          Kembali ke Lapangan
        </button>
      </div>
    );
  }

  const [sh] = startTime.split(':').map(Number);
  const [eh] = endTime.split(':').map(Number);
  const duration = eh - sh;
  const totalPrice = duration * Number(field.pricePerHour);

  const handleConfirm = async () => {
    if (!session) { router.push('/login'); return; }
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fieldId, date, startTime, endTime, notes }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Booking gagal'); return; }
      router.push(`/payment/${data.id}`);
    } catch {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className="container" style={{ maxWidth: 600, padding: '40px 20px' }}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Kembali
          </button>
        </div>

        <h1 style={{ fontSize: 28, fontFamily: 'var(--font-heading)', marginBottom: 8 }}>Konfirmasi Booking</h1>
        <p style={{ color: 'var(--color-muted)', marginBottom: 32 }}>Periksa detail booking sebelum melanjutkan pembayaran</p>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 20 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>
            </svg>
            {error}
          </div>
        )}

        {/* Summary Card */}
        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <h2 style={{ marginBottom: 20, fontFamily: 'var(--font-heading)', color: 'var(--color-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 12 }}>
            Detail Booking
          </h2>
          <div className={styles.rows}>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Lapangan</span>
              <span className={styles.rowValue}>{field.name}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Jenis Lantai</span>
              <span className={styles.rowValue}>{getSurfaceLabel(field.surfaceType)}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Tanggal</span>
              <span className={styles.rowValue}>{formatDate(date + 'T00:00:00')}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Waktu</span>
              <span className={styles.rowValue}>{startTime} – {endTime}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Durasi</span>
              <span className={styles.rowValue}>{duration} jam</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Harga/Jam</span>
              <span className={styles.rowValue}>{formatCurrency(Number(field.pricePerHour))}</span>
            </div>
          </div>
          <div className={styles.totalRow}>
            <span>Total Pembayaran</span>
            <span className={styles.totalPrice}>{formatCurrency(totalPrice)}</span>
          </div>
        </div>

        {/* Notes */}
        <div className="form-group" style={{ marginBottom: 24 }}>
          <label className="input-label">Catatan (opsional)</label>
          <textarea
            className="input"
            rows={3}
            placeholder="Contoh: Untuk turnamen internal, tolong hidupkan AC."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Customer Info */}
        {session && (
          <div className="card" style={{ padding: 20, marginBottom: 24, background: 'var(--color-surface-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                {session.user.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{session.user.name}</div>
                <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>{session.user.email}</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => router.back()} style={{ flex: 1, justifyContent: 'center' }}>
            Batal
          </button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={submitting}
            style={{ flex: 2, justifyContent: 'center' }}
          >
            {submitting ? 'Memproses...' : `Konfirmasi & Bayar`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default async function BookingPage({ params }: { params: Promise<{ fieldId: string }> }) {
  const { fieldId } = await params;
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BookingContent fieldId={fieldId} />
    </Suspense>
  );
}
