import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const fields = await prisma.field.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(fields);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

const fieldSchema = z.object({
  name: z.string().min(1),
  surfaceType: z.enum(["SYNTHETIC_GRASS", "CONCRETE"]),
  description: z.string().optional(),
  pricePerHour: z.number().positive(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const body = await request.json();
    const parsed = fieldSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const field = await prisma.field.create({ data: parsed.data });
    return NextResponse.json(field, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
