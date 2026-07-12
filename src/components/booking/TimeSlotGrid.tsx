'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { formatCurrency, formatDate } from '@/lib/utils';
import styles from './TimeSlotGrid.module.css';

interface Slot {
  time: string;
  isAvailable: boolean;
}

interface Props {
  fieldId: string;
  date: string;
  fieldName: string;
  pricePerHour: number;
}

export default function TimeSlotGrid({ fieldId, date, fieldName, pricePerHour }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSelectedStart(null);
    setSelectedEnd(null);
    fetch(`/api/fields/${fieldId}/slots?date=${date}`)
      .then(r => r.json())
      .then(data => { setSlots(data.slots || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [fieldId, date]);

  const getSlotStatus = (time: string): 'available' | 'booked' | 'selected' => {
    const slot = slots.find(s => s.time === time);
    if (!slot) return 'booked';
    if (!slot.isAvailable) return 'booked';

    if (selectedStart && selectedEnd) {
      const [sh] = selectedStart.split(':').map(Number);
      const [eh] = selectedEnd.split(':').map(Number);
      const [th] = time.split(':').map(Number);
      if (th >= sh && th < eh) return 'selected';
    } else if (selectedStart) {
      if (time === selectedStart) return 'selected';
    }
    return 'available';
  };

  const handleSlotClick = (time: string) => {
    const slot = slots.find(s => s.time === time);
    if (!slot?.isAvailable) return;

    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(time);
      setSelectedEnd(null);
      setSelecting(true);
    } else {
      const [sh] = selectedStart.split(':').map(Number);
      const [ch] = time.split(':').map(Number);
      if (ch <= sh) {
        setSelectedStart(time);
        setSelectedEnd(null);
        return;
      }
      // Check if all slots in range are available
      const slotsInRange = slots.filter(s => {
        const [h] = s.time.split(':').map(Number);
        return h >= sh && h < ch;
      });
      const allAvailable = slotsInRange.every(s => s.isAvailable);
      if (!allAvailable) {
        alert('Ada slot yang sudah dibooking dalam rentang waktu tersebut. Pilih waktu lain.');
        return;
      }
      const endH = ch + 1;
      const endTime = `${endH.toString().padStart(2, '0')}:00`;
      setSelectedEnd(endTime);
      setSelecting(false);
    }
  };

  const duration = selectedStart && selectedEnd
    ? (() => { const [sh] = selectedStart.split(':').map(Number); const [eh] = selectedEnd.split(':').map(Number); return eh - sh; })()
    : 0;

  const totalPrice = duration * pricePerHour;

  const handleBooking = () => {
    if (!session) {
      router.push('/login');
      return;
    }
    if (!selectedStart || !selectedEnd) return;
    const params = new URLSearchParams({
      fieldId,
      date,
      startTime: selectedStart,
      endTime: selectedEnd,
    });
    router.push(`/booking/${fieldId}?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className={styles.loadingGrid}>
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className={`skeleton ${styles.skeletonSlot}`} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}><div className={`${styles.legendDot} ${styles.available}`} /> Tersedia</div>
        <div className={styles.legendItem}><div className={`${styles.legendDot} ${styles.booked}`} /> Terisi</div>
        <div className={styles.legendItem}><div className={`${styles.legendDot} ${styles.selected}`} /> Dipilih</div>
      </div>

      <p className={styles.instruction}>
        {!selectedStart
          ? '⬇️ Klik slot waktu untuk memilih jam mulai'
          : !selectedEnd
          ? `✅ Jam mulai: ${selectedStart} — Klik slot lain untuk memilih jam selesai`
          : `⏱️ ${selectedStart} – ${selectedEnd} (${duration} jam) · Klik lagi untuk mengubah pilihan`
        }
      </p>

      {/* Grid */}
      <div className={styles.grid}>
        {slots.map(slot => {
          const status = getSlotStatus(slot.time);
          return (
            <button
              key={slot.time}
              className={`${styles.slot} ${styles[status]}`}
              onClick={() => handleSlotClick(slot.time)}
              disabled={!slot.isAvailable}
              title={slot.isAvailable ? `Pilih ${slot.time}` : 'Sudah dibooking'}
            >
              <span className={styles.slotTime}>{slot.time}</span>
              {status === 'booked' && <span className={styles.slotLabel}>TERISI</span>}

              {status === 'selected' && <span className={styles.slotLabel}>Dipilih</span>}
              {status === 'available' && <span className={styles.slotLabel}>Tersedia</span>}
            </button>
          );
        })}
      </div>

      {/* Booking Summary */}
      {selectedStart && selectedEnd && (
        <div className={styles.summary}>
          <div className={styles.summaryInfo}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Lapangan</span>
              <span className={styles.summaryValue}>{fieldName}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Tanggal</span>
              <span className={styles.summaryValue}>{formatDate(date + 'T00:00:00')}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Waktu</span>
              <span className={styles.summaryValue}>{selectedStart} – {selectedEnd}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Durasi</span>
              <span className={styles.summaryValue}>{duration} jam</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span className={styles.summaryLabel}>Total</span>
              <span className={styles.totalPrice}>{formatCurrency(totalPrice)}</span>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={handleBooking} style={{ width: '100%', justifyContent: 'center' }}>
            {session ? 'Lanjut ke Booking' : 'Masuk untuk Booking'}
          </button>
        </div>
      )}
    </div>
  );
}
