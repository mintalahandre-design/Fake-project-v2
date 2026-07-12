'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: 480, margin: '0 auto', padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
          <h2 style={{ fontSize: 22, fontFamily: 'var(--font-heading)', marginBottom: 8 }}>
            Akses Ditolak
          </h2>
          <p style={{ color: 'var(--color-muted)', marginBottom: 24, fontSize: 14 }}>
            Halaman ini khusus untuk Administrator Futsal Rajawali. Silakan login menggunakan akun Admin.
          </p>
          <Link href="/login" className="btn btn-primary">
            Login sebagai Admin
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { href: '/admin', label: '📊 Ringkasan Dasbor', exact: true },
    { href: '/admin/bookings', label: '🗓️ Kelola Booking' },
    { href: '/admin/fields', label: '🏟️ Kelola Lapangan' },
    { href: '/admin/users', label: '👥 Customer FutsalKu' },
  ];

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: 'calc(100vh - 64px)' }}>
      {/* Admin Subheader Bar */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 64,
        zIndex: 40
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          paddingTop: 14,
          paddingBottom: 14
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              ADMIN MODE
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>
              Panel Pengelola Futsal Rajawali
            </span>
          </div>

          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {tabs.map((t) => {
              const active = t.exact
                ? pathname === t.href
                : pathname?.startsWith(t.href) && t.href !== '/admin';

              return (
                <Link
                  key={t.href}
                  href={t.href}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 13,
                    fontWeight: active ? 600 : 500,
                    textDecoration: 'none',
                    background: active ? 'var(--color-primary)' : 'transparent',
                    color: active ? '#fff' : 'var(--color-text)',
                    border: active ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                    transition: 'all var(--transition-fast)',
                    boxShadow: active ? '0 4px 12px rgba(16, 185, 129, 0.2)' : 'none'
                  }}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Admin Content */}
      {children}
    </div>
  );
}
