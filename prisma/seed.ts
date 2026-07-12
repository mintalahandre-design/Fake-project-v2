import { PrismaClient, Role, SurfaceType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

// Load env
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL not set in .env.local");

const isLocal =
  connectionString.includes("localhost") ||
  connectionString.includes("127.0.0.1");

const pool = new pg.Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Admin User ────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@futsalrajawali.com" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@futsalrajawali.com",
      password: hashedPassword,
      phone: "087857417132",
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // ─── Demo Customer ─────────────────────────────────────────────
  const customerPassword = await bcrypt.hash("customer123", 12);
  const customer = await prisma.user.upsert({
    where: { email: "demo@futsalrajawali.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "demo@futsalrajawali.com",
      password: customerPassword,
      phone: "081234567890",
      role: Role.CUSTOMER,
    },
  });
  console.log(`✅ Demo customer created: ${customer.email}`);

  // ─── Lapangan A — Rumput Sintetis ──────────────────────────────
  const fieldA = await prisma.field.upsert({
    where: { id: "field-a" },
    update: {},
    create: {
      id: "field-a",
      name: "Lapangan A",
      surfaceType: SurfaceType.SYNTHETIC_GRASS,
      description:
        "Lapangan indoor dengan rumput sintetis berkualitas tinggi. Permukaan lembut dan nyaman untuk bermain futsal. Cocok untuk semua kalangan.",
      pricePerHour: 100000,
      isActive: true,
    },
  });
  console.log(`✅ Field created: ${fieldA.name} (Rumput Sintetis)`);

  // ─── Lapangan B — Semen ────────────────────────────────────────
  const fieldB = await prisma.field.upsert({
    where: { id: "field-b" },
    update: {},
    create: {
      id: "field-b",
      name: "Lapangan B",
      surfaceType: SurfaceType.CONCRETE,
      description:
        "Lapangan indoor dengan lantai semen yang kokoh dan tahan lama. Harga lebih terjangkau dengan kualitas permainan yang tetap optimal.",
      pricePerHour: 75000,
      isActive: true,
    },
  });
  console.log(`✅ Field created: ${fieldB.name} (Semen)`);

  // ─── Contoh Booking Hari Ini (Supaya Muncul TERISI Merah) ─────
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  await prisma.booking.upsert({
    where: {
      fieldId_date_startTime: {
        fieldId: "field-a",
        date: todayDate,
        startTime: "19:00",
      },
    },
    update: {},
    create: {
      userId: customer.id,
      fieldId: "field-a",
      date: todayDate,
      startTime: "19:00",
      endTime: "21:00",
      durationHours: 2,
      totalPrice: 200000,
      status: "CONFIRMED",
      notes: "Booking demo rutin malam",
    },
  });
  console.log("✅ Demo booking created for today 19:00 - 21:00 (TERISI)");

  console.log("\n🎉 Seeding selesai!");

  console.log("─────────────────────────────────");
  console.log("👤 Admin Login:");
  console.log("   Email   : admin@futsalrajawali.com");
  console.log("   Password: admin123");
  console.log("─────────────────────────────────");
  console.log("👤 Demo Customer Login:");
  console.log("   Email   : demo@futsalrajawali.com");
  console.log("   Password: customer123");
  console.log("─────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
