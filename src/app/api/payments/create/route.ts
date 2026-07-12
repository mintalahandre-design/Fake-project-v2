import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderId } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = await request.json();
    if (!bookingId) {
      return NextResponse.json({ error: "bookingId diperlukan" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId, userId: session.user.id },
      include: { payment: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking tidak ditemukan" }, { status: 404 });
    }
    if (booking.payment) {
      return NextResponse.json({ error: "Pembayaran sudah dibuat sebelumnya" }, { status: 409 });
    }

    const paymentMode = process.env.PAYMENT_MODE || "mock";

    if (paymentMode === "mock") {
      // ─── MOCK PAYMENT ────────────────────────────────────────────
      const orderId = generateOrderId();
      // Generate fake QR code URL (using a QR code service)
      const qrData = encodeURIComponent(`FUTSAL-RAJAWALI:${orderId}:${booking.totalPrice}`);
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`;

      const payment = await prisma.payment.create({
        data: {
          bookingId,
          amount: booking.totalPrice,
          method: "QRIS",
          status: "PENDING",
          orderId,
          qrCodeUrl,
        },
      });

      return NextResponse.json({
        mode: "mock",
        paymentId: payment.id,
        orderId,
        qrCodeUrl,
        amount: booking.totalPrice,
        expiresInSeconds: 900, // 15 menit
      });
    }

    // ─── MIDTRANS (placeholder) ─────────────────────────────────
    // TODO: Implementasi Midtrans ketika PAYMENT_MODE=midtrans
    return NextResponse.json({ error: "Midtrans belum dikonfigurasi" }, { status: 501 });
  } catch (error) {
    console.error("[PAYMENT_CREATE]", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
