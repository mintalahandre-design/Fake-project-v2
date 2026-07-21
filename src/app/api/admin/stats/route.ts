import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Stats queries in parallel
    const [
      totalBookingsToday,
      totalBookingsMonth,
      confirmedBookingsMonth,
      revenueMonth,
      revenueToday,
      totalUsers,
      bookingsByField,
      revenueByDay,
    ] = await Promise.all([
      // Booking hari ini
      prisma.booking.count({
        where: { date: { gte: today, lt: tomorrow } },
      }),
      // Booking bulan ini
      prisma.booking.count({
        where: { date: { gte: thisMonthStart } },
      }),
      // Booking dikonfirmasi bulan ini
      prisma.booking.count({
        where: { date: { gte: thisMonthStart }, status: "CONFIRMED" },
      }),
      // Pendapatan bulan ini (hanya yang PAID)
      prisma.payment.aggregate({
        where: { status: "PAID", paidAt: { gte: thisMonthStart } },
        _sum: { amount: true },
      }),
      // Pendapatan hari ini
      prisma.payment.aggregate({
        where: { status: "PAID", paidAt: { gte: today, lt: tomorrow } },
        _sum: { amount: true },
      }),
      // Total user terdaftar
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      // Booking per lapangan
      prisma.booking.groupBy({
        by: ["fieldId"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      // Revenue 7 hari terakhir
      prisma.$queryRaw<{ day: string; total: number }[]>`
        SELECT 
          TO_CHAR("paidAt", 'YYYY-MM-DD') as day,
          SUM(amount)::float as total
        FROM payments
        WHERE status = 'PAID' 
          AND "paidAt" >= NOW() - INTERVAL '7 days'
        GROUP BY day
        ORDER BY day ASC
      `,

    ]);

    // Resolve field names
    const fields = await prisma.field.findMany({ select: { id: true, name: true } });
    const fieldMap = Object.fromEntries(fields.map((f: { id: string; name: string }) => [f.id, f.name]));

    const fieldStats = bookingsByField.map((b: any) => ({
      fieldId: b.fieldId,
      fieldName: fieldMap[b.fieldId] || b.fieldId,
      count: b._count.id,
    }));

    return NextResponse.json({
      totalBookingsToday,
      totalBookingsMonth,
      confirmedBookingsMonth,
      revenueToday: Number(revenueToday._sum.amount || 0),
      revenueMonth: Number(revenueMonth._sum.amount || 0),
      totalUsers,
      fieldStats,
      revenueByDay,
    });
  } catch (error) {
    console.error("[ADMIN_STATS]", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
