'use client';
import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import styles from './page.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
  _count?: { bookings: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => { setUsers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: 'calc(100vh - 128px)' }}>
      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 28, fontFamily: 'var(--font-heading)', marginBottom: 4 }}>👥 Kelola User</h1>
            <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>{users.length} customer terdaftar</p>
          </div>
          <a href="/admin" className="btn btn-ghost btn-sm">← Dashboard</a>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Nama</th>
                <th>Email</th>
                <th>No. HP</th>
                <th>Booking</th>
                <th>Terdaftar</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.id}>
                  <td className={styles.numCell}>{i + 1}</td>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>{user.name[0]?.toUpperCase()}</div>
                      <span className={styles.userName}>{user.name}</span>
                    </div>
                  </td>
                  <td className={styles.emailCell}>{user.email}</td>
                  <td className={styles.phoneCell}>{user.phone || '-'}</td>
                  <td><span className={styles.bookingCount}>{user._count?.bookings ?? 0}</span></td>
                  <td className={styles.dateCell}>{new Date(user.createdAt).toLocaleDateString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
