import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Providers from "@/components/Providers";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mercan Auto Parts - Premium Car Parts & Service Booking",
  description: "Shop premium auto parts and accessories for Mercedes, BMW, Audi, Toyota, Honda and more. Professional car maintenance and repair services in Kenya. Fast delivery and expert installation.",
  keywords: "auto parts, car parts Kenya, Mercedes parts, BMW parts, car service Kenya, car maintenance, brake pads, oil filters, performance parts",
  openGraph: {
    title: "Mercan Auto Parts - Premium Car Parts & Service Booking",
    description: "Shop premium auto parts and book professional car services in Kenya",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header showHeader={true} />
          <Breadcrumbs />
          {children}
          <Footer />
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
