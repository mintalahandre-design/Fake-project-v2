'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

import { Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Email atau password salah');
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="m4.93 4.93 4.24 4.24"/>
              <circle cx="12" cy="12" r="4"/>
            </svg>
          </div>
          <h1 className={styles.title}>Selamat Datang</h1>
          <p className={styles.subtitle}>Masuk ke akun Futsal Rajawali kamu</p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 16 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="input-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="contoh@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="Masukkan password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>atau</span>
        </div>

        <div className={styles.demoAccounts}>
          <p className={styles.demoTitle}>Akun Demo</p>
          <button
            className={styles.demoBtn}
            onClick={() => setForm({ email: 'admin@futsalrajawali.com', password: 'admin123' })}
          >
            <span className={styles.demoRole}>Admin</span>
            admin@futsalrajawali.com
          </button>
          <button
            className={styles.demoBtn}
            onClick={() => setForm({ email: 'demo@futsalrajawali.com', password: 'customer123' })}
          >
            <span className={styles.demoRole}>Customer</span>
            demo@futsalrajawali.com
          </button>
        </div>

        <p className={styles.footer}>
          Belum punya akun?{' '}
          <Link href="/register">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginContent />
    </Suspense>
  );
}

