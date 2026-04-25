import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "LocalSuite — WhatsApp AI Receptionist",
  description: "Turn WhatsApp into your 24/7 AI receptionist. Never miss a lead again. Built for Indian salons, clinics, and gyms.",
  keywords: "WhatsApp bot, AI receptionist, salon management, booking automation, India",
  openGraph: {
    title: "LocalSuite — ₹2000/month AI Receptionist",
    description: "Your 24/7 WhatsApp AI that books appointments, answers price queries, and captures leads automatically.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-950 text-gray-100`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1f2937",
              color: "#f9fafb",
              border: "1px solid #374151",
            },
          }}
        />
      </body>
    </html>
  );
}
