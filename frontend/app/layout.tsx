import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ToasterProvider from "@/components/ui/ToasterProvider";
import ServiceWorkerRegister from "@/components/ui/ServiceWorkerRegister";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinTracker — Personal Finance",
  description: "Track income, expenses, investments and net worth",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "FinTracker" },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50 text-gray-900">
        <AuthProvider>
          {children}
          <ToasterProvider />
          <ServiceWorkerRegister />
        </AuthProvider>
      </body>
    </html>
  );
}
