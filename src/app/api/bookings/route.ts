import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { calculateDuration, calculateTotalPrice } from "@/lib/utils";

const bookingSchema = z.object({
  fieldId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal: YYYY-MM-DD"),
  startTime: z.string().regex(/^\d{2}:00$/, "Format waktu: HH:00"),
  endTime: z.string().regex(/^\d{2}:00$/, "Format waktu: HH:00"),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { fieldId, date, startTime, endTime, notes } = parsed.data;

    // Validasi waktu
    const [startH] = startTime.split(":").map(Number);
    const [endH] = endTime.split(":").map(Number);

    if (startH >= endH) {
      return NextResponse.json(
        { error: "Waktu selesai harus lebih besar dari waktu mulai" },
        { status: 400 }
      );
    }
    if (startH < 6 || endH > 24) {
      return NextResponse.json(
        { error: "Jam operasional 06:00 - 24:00" },
        { status: 400 }
      );
    }

    // Ambil data lapangan
    const field = await prisma.field.findUnique({ where: { id: fieldId, isActive: true } });
    if (!field) {
      return NextResponse.json({ error: "Lapangan tidak ditemukan" }, { status: 404 });
    }

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    // Cek konflik booking (semua jam dalam range harus kosong)
    const conflicts = await prisma.booking.findFirst({
      where: {
        fieldId,
        date: bookingDate,
        status: { in: ["PENDING", "CONFIRMED"] },
        OR: [
          // Booking yang sudah ada overlap dengan range baru
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gt: startTime } },
            ],
          },
        ],
      },
    });

    if (conflicts) {
      return NextResponse.json(
        { error: "Slot waktu tersebut sudah dibooking. Silakan pilih waktu lain." },
        { status: 409 }
      );
    }

    const durationHours = calculateDuration(startTime, endTime);
    const totalPrice = calculateTotalPrice(field.pricePerHour, durationHours);

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        fieldId,
        date: bookingDate,
        startTime,
        endTime,
        durationHours,
        totalPrice,
        notes,
        status: "PENDING",
      },
      include: {
        field: { select: { name: true, surfaceType: true } },
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    // Unique constraint violation (double booking race condition)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Slot waktu sudah diambil orang lain. Silakan pilih waktu lain." },
        { status: 409 }
      );
    }
    console.error("[BOOKINGS_POST]", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
