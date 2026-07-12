'use client';
import { useState, useEffect } from 'react';
import { formatCurrency, formatDateShort, getStatusLabel, getStatusColor } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import styles from './page.module.css';

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  notes?: string;
  user: { name: string; email: string; phone?: string };
  field: { name: string; surfaceType: string };
  payment?: { status: string; paidAt?: string };
}

const STATUS_OPTIONS = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBookings = () => {
    setLoading(true);
    fetch(`/api/admin/bookings${filter !== 'ALL' ? `?status=${filter}` : ''}`)
      .then(r => r.json())
      .then(data => { setBookings(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    }
    setActionLoading(null);
  };

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: 'calc(100vh - 128px)' }}>
      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontFamily: 'var(--font-heading)', marginBottom: 4 }}>🗓️ Kelola Booking</h1>
            <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>Konfirmasi atau batalkan booking pelanggan</p>
          </div>
          <a href="/admin" className="btn btn-ghost btn-sm">← Dashboard</a>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {STATUS_OPTIONS.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}>
              {s === 'ALL' ? 'Semua' : getStatusLabel(s)}
            </button>
          ))}
        </div>

        {loading ? <LoadingSpinner /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'var(--color-muted)' }}>Tidak ada booking</div>
            ) : bookings.map(b => (
              <div key={b.id} className={`card ${styles.bookingRow}`}>
                <div className={styles.bookingMain}>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>{b.user?.name}</div>
                    <div className={styles.userEmail}>{b.user?.email}</div>
                    {b.user?.phone && <div className={styles.userPhone}>{b.user.phone}</div>}
                  </div>
                  <div className={styles.bookingDetails}>
                    <div className={styles.detailField}>🏀 {b.field?.name}</div>
                    <div className={styles.detailTime}>{formatDateShort(b.date)} · {b.startTime}–{b.endTime}</div>
                    <div className={styles.detailPrice}>{formatCurrency(b.totalPrice)}</div>
                  </div>
                  <div className={styles.bookingStatus}>
                    <span className={`badge ${getStatusColor(b.status)}`}>{getStatusLabel(b.status)}</span>
                    {b.payment && (
                      <span className={`badge ${getStatusColor(b.payment.status)}`} style={{ fontSize: 11 }}>
                        Bayar: {b.payment.status}
                      </span>
                    )}
                  </div>
                </div>
                {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                  <div className={styles.actions}>
                    {b.status === 'PENDING' && (
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={actionLoading === b.id}
                        onClick={() => updateStatus(b.id, 'CONFIRMED')}
                      >
                        {actionLoading === b.id ? '...' : '✅ Konfirmasi'}
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
                      disabled={actionLoading === b.id}
                      onClick={() => updateStatus(b.id, 'CANCELLED')}
                    >
                      {actionLoading === b.id ? '...' : '❌ Batalkan'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
