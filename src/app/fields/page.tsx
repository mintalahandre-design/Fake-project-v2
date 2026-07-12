'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { formatCurrency, getSurfaceLabel } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import TimeSlotGrid from '@/components/booking/TimeSlotGrid';
import styles from './page.module.css';

interface Field {
  id: string;
  name: string;
  surfaceType: string;
  description: string;
  pricePerHour: number;
  imageUrl?: string;
  isActive: boolean;
}

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fields')
      .then(r => r.json())
      .then(data => {
        setFields(data);
        if (data.length > 0) setSelectedField(data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ padding: '40px 0', background: 'var(--color-bg)', minHeight: 'calc(100vh - 128px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontFamily: 'var(--font-heading)', marginBottom: 8 }}>Pilih Lapangan</h1>
          <p style={{ color: 'var(--color-muted)' }}>Cek ketersediaan slot secara real-time dan langsung booking</p>
        </div>

        {/* Field Tabs */}
        <div className={styles.fieldTabs}>
          {fields.map(field => (
            <button
              key={field.id}
              className={`${styles.fieldTab} ${selectedField?.id === field.id ? styles.active : ''}`}
              onClick={() => setSelectedField(field)}
            >
              <span className={styles.fieldTabIcon}>{field.surfaceType === 'SYNTHETIC_GRASS' ? '🌿' : '🏗️'}</span>
              <div>
                <div className={styles.fieldTabName}>{field.name}</div>
                <div className={styles.fieldTabSurface}>{getSurfaceLabel(field.surfaceType)}</div>
              </div>
              <div className={styles.fieldTabPrice}>
                {formatCurrency(field.pricePerHour)}<span style={{fontSize:11, fontWeight:400}}>/jam</span>
              </div>
            </button>
          ))}
        </div>

        {/* Date Picker */}
        <div className={styles.datePicker}>
          <label className="input-label" style={{ marginBottom: 8, display: 'block' }}>Pilih Tanggal</label>
          <input
            type="date"
            className="input"
            style={{ maxWidth: 220 }}
            value={selectedDate}
            min={today}
            max={maxDateStr}
            onChange={e => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Slot Grid */}
        {selectedField && (
          <TimeSlotGrid
            fieldId={selectedField.id}
            date={selectedDate}
            fieldName={selectedField.name}
            pricePerHour={Number(selectedField.pricePerHour)}
          />
        )}
      </div>
    </div>
  );
}
