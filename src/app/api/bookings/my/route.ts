import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
        ...(status && status !== "ALL" ? { status: status as any } : {}),
      },
      include: {
        field: { select: { id: true, name: true, surfaceType: true, imageUrl: true } },
        payment: { select: { status: true, paidAt: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("[MY_BOOKINGS_GET]", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
