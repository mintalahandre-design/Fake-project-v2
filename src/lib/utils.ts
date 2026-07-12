type DecimalLike = number | string | { toNumber(): number } | { toString(): string } | any;

// ─── Format Currency ──────────────────────────────────────────────
export function formatCurrency(amount: number | DecimalLike): string {
  const num = typeof amount === "object" ? Number(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

// ─── Format Date ──────────────────────────────────────────────────
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

// ─── Generate Time Slots ──────────────────────────────────────────
export function generateTimeSlots(
  startHour = 6,
  endHour = 24
): string[] {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    const hStr = h.toString().padStart(2, "0");
    slots.push(`${hStr}:00`);
  }
  return slots;
}

// ─── Calculate Duration ───────────────────────────────────────────
export function calculateDuration(startTime: string, endTime: string): number {
  const [startH] = startTime.split(":").map(Number);
  const [endH] = endTime.split(":").map(Number);
  return endH - startH;
}

// ─── Calculate Total Price ────────────────────────────────────────
export function calculateTotalPrice(
  pricePerHour: number | DecimalLike,
  durationHours: number
): number {
  const price = typeof pricePerHour === "object" ? Number(pricePerHour) : pricePerHour;
  return price * durationHours;
}

// ─── Generate Order ID ────────────────────────────────────────────
export function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `FRJ-${timestamp}-${random}`;
}

// ─── Get Status Color ─────────────────────────────────────────────
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "badge-warning",
    CONFIRMED: "badge-success",
    CANCELLED: "badge-danger",
    COMPLETED: "badge-info",
    PAID: "badge-success",
    FAILED: "badge-danger",
    REFUNDED: "badge-info",
  };
  return colors[status] || "badge-default";
}

// ─── Get Status Label ─────────────────────────────────────────────
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Menunggu Pembayaran",
    CONFIRMED: "Dikonfirmasi",
    CANCELLED: "Dibatalkan",
    COMPLETED: "Selesai",
    PAID: "Dibayar",
    FAILED: "Gagal",
    REFUNDED: "Dikembalikan",
  };
  return labels[status] || status;
}

// ─── Surface Type Label ───────────────────────────────────────────
export function getSurfaceLabel(surface: string): string {
  const labels: Record<string, string> = {
    SYNTHETIC_GRASS: "Rumput Sintetis",
    CONCRETE: "Semen",
  };
  return labels[surface] || surface;
}

// ─── Clamp number ─────────────────────────────────────────────────
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
