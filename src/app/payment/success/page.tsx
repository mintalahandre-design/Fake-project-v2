'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import styles from './page.module.css';

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h1 className={styles.title}>Pembayaran Berhasil!</h1>
        <p className={styles.desc}>
          Booking lapangan kamu telah <strong>dikonfirmasi</strong>. Tunjukkan halaman ini atau riwayat booking kepada petugas saat tiba di lapangan.
        </p>
        <div className={styles.badge}>✅ Status: Dikonfirmasi</div>
        <div className={styles.actions}>
          <Link href="/dashboard/bookings" className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }}>
            Lihat Riwayat Booking
          </Link>
          <Link href="/fields" className="btn btn-outline" style={{ justifyContent: 'center' }}>
            Booking Lagi
          </Link>
        </div>
        <div className={styles.info}>
          <p>📍 Jl. Sukabirus Gg. Selamet 1 No.12, Dayeuhkolot, Bandung</p>
          <p>📞 087857417132</p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return <Suspense><SuccessContent /></Suspense>;
}
