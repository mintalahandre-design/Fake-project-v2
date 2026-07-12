'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import styles from './page.module.css';
import { use } from 'react';

interface BookingData {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  field: { name: string; surfaceType: string };
  payment?: { qrCodeUrl?: string; orderId?: string; status: string };
}

const EXPIRE_SECONDS = 900; // 15 minutes

function PaymentContent({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [payment, setPayment] = useState<{ qrCodeUrl?: string; orderId?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [timeLeft, setTimeLeft] = useState(EXPIRE_SECONDS);
  const [error, setError] = useState('');

  const fetchBooking = useCallback(async () => {
    const res = await fetch(`/api/bookings/my`);
    if (!res.ok) return;
    const bookings: BookingData[] = await res.json();
    const found = bookings.find(b => b.id === bookingId);
    if (found) setBooking(found);
  }, [bookingId]);

  useEffect(() => { fetchBooking().finally(() => setLoading(false)); }, [fetchBooking]);

  // Create payment on mount
  useEffect(() => {
    if (!booking) return;
    if (booking.payment?.qrCodeUrl) {
      setPayment({ qrCodeUrl: booking.payment.qrCodeUrl, orderId: booking.payment.orderId });
      return;
    }
    const createPayment = async () => {
      setCreating(true);
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setPayment({ qrCodeUrl: data.qrCodeUrl, orderId: data.orderId });
      }
      setCreating(false);
    };
    createPayment();
  }, [booking]);

  // Countdown
  useEffect(() => {
    if (!payment) return;
    const interval = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, [payment]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isExpired = timeLeft === 0;

  const handleMockPay = async () => {
    if (!payment?.orderId) return;
    setConfirming(true);
    setError('');
    try {
      const res = await fetch('/api/payments/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: payment.orderId }),
      });
      if (res.ok) {
        router.push('/payment/success?bookingId=' + bookingId);
      } else {
        setError('Konfirmasi gagal. Coba lagi.');
      }
    } catch { setError('Terjadi kesalahan.'); }
    finally { setConfirming(false); }
  };

  if (loading || creating) return <LoadingSpinner />;
  if (!booking) return <div style={{ padding: 60, textAlign: 'center' }}>Booking tidak ditemukan.</div>;
  if (booking.status === 'CONFIRMED') {
    router.push('/payment/success?bookingId=' + bookingId);
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1>Selesaikan Pembayaran</h1>
          <p>Scan QR Code di bawah menggunakan e-wallet atau mobile banking</p>
        </div>

        <div className={styles.card}>
          {/* Booking Info */}
          <div className={styles.bookingInfo}>
            <div className={styles.infoRow}><span>Lapangan</span><strong>{booking.field?.name}</strong></div>
            <div className={styles.infoRow}><span>Tanggal</span><strong>{formatDate(booking.date)}</strong></div>
            <div className={styles.infoRow}><span>Waktu</span><strong>{booking.startTime} – {booking.endTime}</strong></div>
          </div>
          <div className={styles.totalBox}>
            <span>Total Bayar</span>
            <span className={styles.totalAmount}>{formatCurrency(booking.totalPrice)}</span>
          </div>
        </div>

        {/* QR Code */}
        {payment?.qrCodeUrl && (
          <div className={styles.qrSection}>
            <div className={styles.qrWrapper}>
              <div className={styles.qrHeader}>
                <span className={styles.qrLabel}>QRIS</span>
                <span className={styles.qrBrand}>Futsal Rajawali</span>
              </div>
              <img src={payment.qrCodeUrl} alt="QR Code Pembayaran" className={styles.qrImage} width={200} height={200} />
              <div className={styles.qrFooter}>
                {!isExpired ? (
                  <span className={`${styles.countdown} ${timeLeft <= 120 ? styles.countdownWarn : ''}`}>
                    ⏱ Berlaku {minutes.toString().padStart(2,'0')}:{seconds.toString().padStart(2,'0')}
                  </span>
                ) : (
                  <span className={styles.countdownExpired}>⚠️ QR Code Kadaluarsa</span>
                )}
              </div>
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger" style={{ marginBottom: 16 }}>{error}</div>}

        {/* Mock Pay Button */}
        <div className={styles.mockSection}>
          <div className={styles.mockBadge}>🧪 Mode Demo</div>
          <p className={styles.mockDesc}>Ini adalah simulasi pembayaran. Klik tombol di bawah untuk mensimulasikan pembayaran berhasil.</p>
          <button
            className="btn btn-accent btn-lg"
            onClick={handleMockPay}
            disabled={confirming || isExpired}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {confirming ? 'Memproses...' : '✅ Simulasi Bayar Berhasil'}
          </button>
        </div>

        <button className={styles.cancelBtn} onClick={() => router.push('/dashboard/bookings')}>
          Bayar Nanti
        </button>
      </div>
    </div>
  );
}

export default function PaymentPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = use(params);
  return <PaymentContent bookingId={bookingId} />;
}
