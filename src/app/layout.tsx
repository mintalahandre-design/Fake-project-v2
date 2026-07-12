import type { Metadata } from "next";
import { SessionProvider } from "@/components/providers/SessionProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";
export const metadata: Metadata = {
  title: "Futsal Rajawali — Booking Lapangan Futsal Online",
  description:
    "Pesan lapangan futsal di Futsal Rajawali dengan mudah. Cek ketersediaan real-time, pilih jam, dan bayar online. Tersedia 2 lapangan indoor di Dayeuhkolot, Bandung.",
  keywords: "futsal, booking lapangan, futsal bandung, dayeuhkolot, reservasi lapangan",
  authors: [{ name: "Futsal Rajawali" }],
  openGraph: {
    title: "Futsal Rajawali — Booking Lapangan Futsal Online",
    description: "Pesan lapangan futsal mudah, cepat, dan terpercaya di Bandung.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <SessionProvider>
          <Navbar />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
