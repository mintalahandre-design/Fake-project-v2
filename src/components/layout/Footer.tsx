import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/>
              <circle cx="12" cy="12" r="4"/>
            </svg>
          </div>
          <div>
            <div className={styles.brandName}>Futsal Rajawali</div>
            <div className={styles.brandSub}>Platform Booking Lapangan Futsal</div>
          </div>
        </div>
        <div className={styles.info}>
          <p>📍 Jl. Sukabirus Gg. Selamet 1 No.12, Citeureup</p>
          <p>Kec. Dayeuhkolot, Kabupaten Bandung, Jawa Barat 40257</p>
          <p>📞 087857417132</p>
          <p>🕐 Buka setiap hari, 06:00 – 00:00</p>
        </div>
        <div className={styles.links}>
          <Link href="/">Beranda</Link>
          <Link href="/fields">Lapangan</Link>
          <Link href="/login">Masuk</Link>
          <Link href="/register">Daftar</Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className="container">
          <p>© {new Date().getFullYear()} Futsal Rajawali. Dibuat dengan ❤️ sebagai portofolio project.</p>
        </div>
      </div>
    </footer>
  );
}
