import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const date = searchParams.get("date");

    const bookings = await prisma.booking.findMany({
      where: {
        ...(status && status !== "ALL" ? { status: status as any } : {}),
        ...(date ? { date: new Date(date) } : {}),
      },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        field: { select: { name: true, surfaceType: true } },
        payment: { select: { status: true, paidAt: true, amount: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("[ADMIN_BOOKINGS_GET]", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
