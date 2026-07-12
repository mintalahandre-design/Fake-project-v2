# ⚽ FutsalKu — Futsal Rajawali Booking System

Platform booking lapangan futsal berbasis web untuk Futsal Rajawali, Dayeuhkolot, Bandung. Dibangun sebagai proyek portofolio full-stack.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 📅 Booking Real-Time | Lihat ketersediaan slot per jam, langsung booking |
| 🔐 Autentikasi | Register & login dengan JWT (NextAuth.js) |
| 💳 Pembayaran Mock | Simulasi QRIS/QR Code (siap swap ke Midtrans) |
| 👑 Admin Panel | Dashboard statistik, kelola booking & lapangan |
| 📱 Responsive | Mobile-first design |

---

## 🏟️ Data Lapangan

| Lapangan | Jenis Lantai | Tipe | Harga/Jam |
|----------|-------------|------|-----------|
| Lapangan A | Rumput Sintetis | Indoor | Rp 100.000 |
| Lapangan B | Semen | Indoor | Rp 75.000 |

---

## 🚀 Setup & Instalasi

### Prasyarat
- Node.js v18+
- Docker Desktop (untuk PostgreSQL)
- npm

### 1. Clone & Install

```bash
git clone <repo-url>
cd futsal-rajawali
npm install
```

### 2. Setup Environment

Buat file `.env.local` di root project:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=futsal-rajawali-super-secret-key-2026

# PostgreSQL via Docker (gunakan command di bawah untuk start)
DATABASE_URL=postgresql://futsal_user:futsal_pass123@localhost:5432/futsal_rajawali

# Payment Mode: 'mock' untuk demo, 'midtrans' untuk production
PAYMENT_MODE=mock
```

### 3. Jalankan PostgreSQL via Docker

```bash
docker run -d \
  --name futsal-postgres \
  -e POSTGRES_USER=futsal_user \
  -e POSTGRES_PASSWORD=futsal_pass123 \
  -e POSTGRES_DB=futsal_rajawali \
  -p 5432:5432 \
  --restart unless-stopped \
  postgres:16-alpine
```

### 4. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Buat tabel di database
npx prisma migrate dev --name init

# Seed data awal (admin + 2 lapangan)
npx prisma db seed
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🔑 Akun Demo

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@futsalrajawali.com | admin123 |
| **Customer** | demo@futsalrajawali.com | customer123 |

---

## 🗂️ Struktur Proyek

```
src/
├── app/
│   ├── (halaman publik)  page.tsx, fields/, login/, register/
│   ├── booking/[fieldId]/ Konfirmasi & buat booking
│   ├── payment/[bookingId]/ QR Code pembayaran
│   ├── dashboard/bookings/ Riwayat booking customer
│   ├── admin/             Dashboard & manajemen admin
│   └── api/               REST API endpoints
├── components/
│   ├── layout/            Navbar, Footer
│   ├── ui/                Button, Badge, Spinner
│   ├── booking/           TimeSlotGrid, BookingSummary
│   └── providers/         SessionProvider
├── lib/
│   ├── prisma.ts          Prisma client singleton
│   ├── auth.ts            NextAuth config
│   └── utils.ts           Helper functions
└── types/                 TypeScript declarations
```

---

## 🧰 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Database | PostgreSQL 16 |
| ORM | Prisma 7 |
| Auth | NextAuth.js v4 |
| Payment | Mock QRIS (Midtrans-ready) |
| Charts | Recharts |
| Icons | Lucide React |
| Hosting DB | Docker (dev) / Supabase (prod) |

---

## 📜 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:studio    # Buka Prisma Studio (GUI DB)
npm run db:reset     # Reset database (HATI-HATI!)
```

---

## 🏆 Portfolio Highlights

1. **Real-time slot conflict detection** — Server-side validation + Prisma unique constraint mencegah double booking
2. **Mock-to-real payment swap** — Arsitektur `PAYMENT_MODE` env memudahkan integrasi Midtrans nyata
3. **RBAC dengan Next.js Middleware** — Proteksi route admin di edge sebelum rendering
4. **Aggregated stats query** — Dashboard admin menggunakan `Promise.all` untuk parallel DB queries
5. **End-to-end TypeScript** — Prisma types → Zod validation → React components, zero runtime type errors

---

## 📍 Lokasi

**Futsal Rajawali**  
Jl. Sukabirus Gg. Selamet 1 No.12, Citeureup  
Kec. Dayeuhkolot, Kabupaten Bandung, Jawa Barat 40257  
📞 087857417132 | ⭐ 4.4/5 (428 ulasan Google)

---

*Dibuat sebagai proyek portofolio Full-Stack Developer — 2026*
