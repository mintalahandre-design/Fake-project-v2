'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  createdAt: string;
  field: { id: string; name: string; surfaceType: string };
  payment?: { status: string };
}

const STATUS_FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

export default function DashboardBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetch(`/api/bookings/my${filter !== 'ALL' ? `?status=${filter}` : ''}`)
      .then(r => r.json())
      .then(data => { setBookings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filter]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.container}>
      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 30, fontFamily: 'var(--font-heading)', marginBottom: 6 }}>Riwayat Booking</h1>
          <p style={{ color: 'var(--color-muted)' }}>Semua booking yang pernah kamu buat</p>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              className={`${styles.filterBtn} ${filter === s ? styles.active : ''}`}
              onClick={() => { setFilter(s); setLoading(true); }}
            >
              {s === 'ALL' ? 'Semua' : getStatusLabel(s)}
            </button>
          ))}
        </div>

        {/* Booking List */}
        {bookings.length === 0 ? (
          <div className={styles.empty}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <h3>Belum ada booking</h3>
            <p>Kamu belum pernah booking lapangan. Yuk, mulai booking!</p>
            <Link href="/fields" className="btn btn-primary" style={{ marginTop: 20 }}>Booking Sekarang</Link>
          </div>
        ) : (
          <div className={styles.list}>
            {bookings.map(booking => (
              <div key={booking.id} className={`card ${styles.bookingCard}`}>
                <div className={styles.cardLeft}>
                  <div className={styles.fieldEmoji}>
                    {booking.field?.surfaceType === 'SYNTHETIC_GRASS' ? '🌿' : '🏗️'}
                  </div>
                  <div className={styles.bookingInfo}>
                    <div className={styles.fieldName}>{booking.field?.name}</div>
                    <div className={styles.bookingDate}>
                      {formatDateShort(booking.date)} · {booking.startTime} – {booking.endTime}
                    </div>
                    <div className={styles.bookingPrice}>{formatCurrency(booking.totalPrice)}</div>
                  </div>
                </div>
                <div className={styles.cardRight}>
                  <span className={`badge ${getStatusColor(booking.status)}`}>
                    {getStatusLabel(booking.status)}
                  </span>
                  {booking.status === 'PENDING' && (
                    <Link href={`/payment/${booking.id}`} className="btn btn-accent btn-sm">
                      Bayar Sekarang
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
