import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  const features = [
    {
      icon: "📅",
      title: "Booking Real-Time",
      desc: "Lihat ketersediaan slot lapangan secara langsung. Tidak perlu telepon atau WhatsApp.",
    },
    {
      icon: "⚡",
      title: "Proses Cepat",
      desc: "Dari pilih lapangan hingga konfirmasi pembayaran hanya butuh beberapa menit.",
    },
    {
      icon: "🔒",
      title: "Aman & Terpercaya",
      desc: "Data dan transaksi kamu terlindungi. Bukti booking digital tersimpan otomatis.",
    },
    {
      icon: "📱",
      title: "Bayar Digital",
      desc: "Pembayaran via QRIS — bisa pakai GoPay, OVO, Dana, atau mobile banking.",
    },
  ];

  const fields = [
    {
      id: "field-a",
      name: "Lapangan A",
      surface: "Rumput Sintetis",
      type: "Indoor",
      price: 100000,
      emoji: "🌿",
      highlights: ["Permukaan lembut", "Ramah lutut", "Standar futsal nasional"],
      badgeColor: "#22C55E",
    },
    {
      id: "field-b",
      name: "Lapangan B",
      surface: "Semen",
      type: "Indoor",
      price: 75000,
      emoji: "🏗️",
      highlights: ["Harga terjangkau", "Lantai kokoh & tahan lama", "Sirkulasi udara baik"],
      badgeColor: "#3B82F6",
    },
  ];

  const testimonials = [
    { name: "Iqbal", rating: 5, text: "Lapangnya recomended buat yg mau ikut les futsal academy. Mantap!", date: "2 tahun lalu" },
    { name: "Gilang S.", rating: 4, text: "Untuk lapangan cukup oke, sangat nyaman untuk bermain bersama teman.", date: "2 bulan lalu" },
    { name: "Customer", rating: 5, text: "Lapangan baru nya bagus, overall lumayan untuk daerah telkom bandung.", date: "1 bulan lalu" },
  ];

  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span>⚽</span> Platform Booking Futsal #1 di Dayeuhkolot
            </div>
            <h1 className={styles.heroTitle}>
              Booking Lapangan Futsal{" "}
              <span className={styles.heroHighlight}>Lebih Mudah</span>{" "}
              dari Sebelumnya
            </h1>
            <p className={styles.heroDesc}>
              Futsal Rajawali hadir dengan platform booking digital. Cek
              ketersediaan slot real-time, pilih jam bermain, dan selesaikan
              pembayaran — semua dalam satu tempat.
            </p>
            <div className={styles.heroActions}>
              <Link href="/fields" className="btn btn-primary btn-lg">
                Pesan Lapangan Sekarang
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link href="/fields" className="btn btn-outline btn-lg">
                Lihat Jadwal
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <span className={styles.statNum}>2</span>
                <span className={styles.statLabel}>Lapangan</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statNum}>4.4★</span>
                <span className={styles.statLabel}>Rating Google</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statNum}>06:00</span>
                <span className={styles.statLabel}>Buka Setiap Hari</span>
              </div>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardHeader}>
                <div className={styles.heroCardDot} style={{ background: '#EF4444' }} />
                <div className={styles.heroCardDot} style={{ background: '#EAB308' }} />
                <div className={styles.heroCardDot} style={{ background: '#22C55E' }} />
                <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--color-muted)' }}>futsal-rajawali.vercel.app</span>
              </div>
              <div className={styles.heroCardBody}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Ketersediaan — Hari Ini
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['06:00','07:00','08:00','09:00','10:00'].map((time, i) => (
                    <div key={time} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 12, color: 'var(--color-muted)', width: 40 }}>{time}</span>
                      <div style={{
                        flex: 1, height: 28, borderRadius: 6, fontSize: 11, fontWeight: 600,
                        display: 'flex', alignItems: 'center', paddingLeft: 10,
                        background: i === 1 || i === 3 ? '#FEF2F2' : '#F0FDF4',
                        color: i === 1 || i === 3 ? '#DC2626' : '#16A34A',
                        border: `1px solid ${i === 1 || i === 3 ? '#FECACA' : '#BBF7D0'}`,
                      }}>
                        {i === 1 || i === 3 ? '🔴 Sudah Dibooking' : '🟢 Tersedia'}
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/fields" className="btn btn-primary btn-sm" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>
                  Booking Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────────── */}
      <section className={`section ${styles.featuresSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Kenapa Booking di Sini?</h2>
            <p>Platform yang dirancang untuk kemudahan pemain futsal modern</p>
          </div>
          <div className="grid-4" style={{ marginTop: 40 }}>
            {features.map((f) => (
              <div key={f.title} className={`card ${styles.featureCard}`}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FIELDS ───────────────────────────────────────────────── */}
      <section className={`section ${styles.fieldsSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Pilihan Lapangan Kami</h2>
            <p>2 lapangan indoor berkualitas untuk pengalaman futsal terbaik</p>
          </div>
          <div className="grid-2" style={{ marginTop: 40 }}>
            {fields.map((field) => (
              <div key={field.id} className={`card card-hover ${styles.fieldCard}`}>
                <div className={styles.fieldVisual} style={{ background: `linear-gradient(135deg, ${field.badgeColor}15, ${field.badgeColor}30)` }}>
                  <span style={{ fontSize: 64 }}>{field.emoji}</span>
                  <div className={styles.fieldTypeBadge} style={{ background: field.badgeColor }}>
                    {field.type}
                  </div>
                </div>
                <div className={styles.fieldContent}>
                  <div className={styles.fieldHeader}>
                    <div>
                      <h3 className={styles.fieldName}>{field.name}</h3>
                      <p className={styles.fieldSurface}>{field.surface}</p>
                    </div>
                    <div className={styles.fieldPrice}>
                      <span className={styles.priceNum}>Rp {(field.price / 1000).toFixed(0)}K</span>
                      <span className={styles.priceUnit}>/jam</span>
                    </div>
                  </div>
                  <ul className={styles.fieldHighlights}>
                    {field.highlights.map((h) => (
                      <li key={h}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        {h}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/booking/${field.id}`} className="btn btn-primary" style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}>
                    Booking {field.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/fields" className="btn btn-outline">
              Lihat Ketersediaan Lengkap →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className={`section ${styles.testimonialsSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Kata Mereka</h2>
            <p>Rating 4.4 ⭐ dari 428 ulasan di Google Maps</p>
          </div>
          <div className="grid-3" style={{ marginTop: 40 }}>
            {testimonials.map((t) => (
              <div key={t.name} className={`card ${styles.testimonialCard}`}>
                <div className={styles.stars}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{t.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2>Siap Main Futsal?</h2>
            <p>Daftar sekarang dan booking lapangan favoritmu dalam 2 menit</p>
            <div className={styles.ctaActions}>
              <Link href="/register" className="btn btn-accent btn-lg">
                Buat Akun Gratis
              </Link>
              <Link href="/fields" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                Cek Jadwal Dulu
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
