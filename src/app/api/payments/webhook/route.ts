import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Mock webhook: simulate payment success
// In production, this would receive and verify Midtrans webhook signature
export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId diperlukan" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { orderId },
      include: { booking: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Pembayaran tidak ditemukan" }, { status: 404 });
    }

    if (payment.status === "PAID") {
      return NextResponse.json({ message: "Sudah dibayar", bookingId: payment.bookingId });
    }

    // Update payment and booking in a transaction
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: "PAID", paidAt: new Date() },
      }),
      prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: "CONFIRMED" },
      }),
    ]);

    return NextResponse.json({
      message: "Pembayaran berhasil dikonfirmasi",
      bookingId: payment.bookingId,
    });
  } catch (error) {
    console.error("[PAYMENT_WEBHOOK]", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
