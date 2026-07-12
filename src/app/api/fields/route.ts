import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const fields = await prisma.field.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(fields);
  } catch (error) {
    console.error("[FIELDS_GET]", error);
    return NextResponse.json({ error: "Gagal mengambil data lapangan" }, { status: 500 });
  }
}
