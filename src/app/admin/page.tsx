'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import styles from './page.module.css';

interface Stats {
  totalBookingsToday: number;
  totalBookingsMonth: number;
  confirmedBookingsMonth: number;
  revenueToday: number;
  revenueMonth: number;
  totalUsers: number;
  fieldStats: { fieldId: string; fieldName: string; count: number }[];
  revenueByDay: { day: string; total: number }[];
}

const StatCard = ({ title, value, icon, sub }: { title: string; value: string | number; icon: string; sub?: string }) => (
  <div className={`card ${styles.statCard}`}>
    <div className={styles.statIcon}>{icon}</div>
    <div className={styles.statBody}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statTitle}>{title}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          setStats({
            ...data,
            revenueByDay: Array.isArray(data.revenueByDay) ? data.revenueByDay : [],
            fieldStats: Array.isArray(data.fieldStats) ? data.fieldStats : [],
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <div style={{ padding: 60, textAlign: 'center' }}>Gagal memuat data.</div>;

  return (
    <div className={styles.container}>
      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 30, fontFamily: 'var(--font-heading)', marginBottom: 6 }}>📊 Dashboard Admin</h1>
          <p style={{ color: 'var(--color-muted)' }}>Ringkasan performa Futsal Rajawali</p>
        </div>

        {/* Stat Cards */}
        <div className={styles.statsGrid}>
          <StatCard title="Booking Hari Ini" value={stats.totalBookingsToday} icon="📅" />
          <StatCard title="Booking Bulan Ini" value={stats.totalBookingsMonth} icon="📆" sub={`${stats.confirmedBookingsMonth} dikonfirmasi`} />
          <StatCard title="Pendapatan Hari Ini" value={formatCurrency(stats.revenueToday)} icon="💰" />
          <StatCard title="Pendapatan Bulan Ini" value={formatCurrency(stats.revenueMonth)} icon="📈" />
          <StatCard title="Total Customer" value={stats.totalUsers} icon="👥" />
        </div>

        {/* Revenue Chart */}
        <div className={`card ${styles.chartCard}`}>
          <h2 className={styles.sectionTitle}>Pendapatan 7 Hari Terakhir</h2>
          {(!stats.revenueByDay || stats.revenueByDay.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}>Belum ada data pendapatan</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.revenueByDay} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--color-muted)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted)' }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: any) => formatCurrency(v)} labelStyle={{ color: 'var(--color-text)' }} />
                <Bar dataKey="total" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Field Stats */}
        <div className={`card ${styles.fieldStatsCard}`}>
          <h2 className={styles.sectionTitle}>Booking per Lapangan</h2>
          {(stats.fieldStats || []).map((f, i) => (
            <div key={f.fieldId} className={styles.fieldStatRow}>
              <div className={styles.fieldStatRank}>#{i + 1}</div>
              <div className={styles.fieldStatName}>{f.fieldName}</div>
              <div className={styles.fieldStatCount}>{f.count} booking</div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className={styles.quickLinks}>
          <Link href="/admin/bookings" className={`card ${styles.quickLink}`}>
            <span style={{ fontSize: 28 }}>🗓️</span>
            <span>Kelola Booking</span>
          </Link>
          <Link href="/admin/fields" className={`card ${styles.quickLink}`}>
            <span style={{ fontSize: 28 }}>🏀</span>
            <span>Kelola Lapangan</span>
          </Link>
          <Link href="/admin/users" className={`card ${styles.quickLink}`}>
            <span style={{ fontSize: 28 }}>👥</span>
            <span>Kelola User</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
