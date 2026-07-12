import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTimeSlots } from "@/lib/utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ fieldId: string }> }
) {
  try {
    const { fieldId } = await params;
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json({ error: "Parameter 'date' diperlukan" }, { status: 400 });
    }

    const date = new Date(dateParam);
    date.setHours(0, 0, 0, 0);

    // Ambil semua booking yang sudah ada untuk lapangan + tanggal ini
    const existingBookings = await prisma.booking.findMany({
      where: {
        fieldId,
        date: date,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      select: { startTime: true, endTime: true },
    });

    // Build occupied slots set
    const occupiedSlots = new Set<string>();
    for (const booking of existingBookings) {
      const [startH] = booking.startTime.split(":").map(Number);
      const [endH] = booking.endTime.split(":").map(Number);
      for (let h = startH; h < endH; h++) {
        occupiedSlots.add(`${h.toString().padStart(2, "0")}:00`);
      }
    }

    // Generate all slots 06:00 - 23:00 (last bookable start)
    const allSlots = generateTimeSlots(6, 24);
    const slots = allSlots.map((time) => ({
      time,
      isAvailable: !occupiedSlots.has(time),
    }));

    return NextResponse.json({ date: dateParam, fieldId, slots });
  } catch (error) {
    console.error("[SLOTS_GET]", error);
    return NextResponse.json({ error: "Gagal mengambil data slot" }, { status: 500 });
  }
}
