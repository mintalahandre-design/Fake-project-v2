'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/>
              <path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/>
              <circle cx="12" cy="12" r="4"/>
            </svg>
          </div>
          <span>Futsal <strong>Rajawali</strong></span>
        </Link>

        {/* Desktop Nav */}
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Beranda</Link>
          <Link href="/fields" className={styles.navLink}>Lapangan</Link>
          {session?.user.role === 'ADMIN' && (
            <Link href="/admin" className={styles.navLink}>Admin Panel</Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className={styles.authSection}>
          {session ? (
            <>
              {session.user.role !== 'ADMIN' && (
                <Link href="/dashboard/bookings" className={`btn btn-ghost btn-sm ${styles.hideOnMobile}`}>
                  Riwayat Booking
                </Link>
              )}
              <div className={styles.userMenu}>
                <div className={styles.avatar}>
                  {session.user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{session.user.name}</span>
                  <button
                    className={styles.signOutBtn}
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    Keluar
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className={`btn btn-ghost btn-sm ${styles.hideOnMobile}`}>Masuk</Link>
              <Link href="/register" className="btn btn-primary btn-sm">Daftar</Link>
            </>
          )}

          {/* Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen
                ? <path d="M18 6L6 18M6 6l12 12"/>
                : <path d="M4 6h16M4 12h16M4 18h16"/>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" onClick={() => setMenuOpen(false)}>Beranda</Link>
          <Link href="/fields" onClick={() => setMenuOpen(false)}>Lapangan</Link>
          {session ? (
            <>
              {session.user.role !== 'ADMIN' && (
                <Link href="/dashboard/bookings" onClick={() => setMenuOpen(false)}>Riwayat Booking</Link>
              )}
              {session.user.role === 'ADMIN' && (
                <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
              )}
              <button onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }); }}>Keluar</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>Masuk</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)}>Daftar</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
