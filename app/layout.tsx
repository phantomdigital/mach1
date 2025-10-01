import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Inter_Tight } from "next/font/google";
import "./globals.css";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import LenisProvider from "@/components/lenis-provider";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

import { generateMetadata as generateBaseMetadata, generateOrganizationSchema } from "@/lib/metadata";

export const metadata: Metadata = generateBaseMetadata({
  title: "Professional Logistics & Transportation Services",
  description: "MACH1 Logistics provides expert logistics solutions including FCL/LCL import/export, dangerous goods handling, airfreight services, and specialized transportation across Australia.",
  keywords: ["professional logistics", "transportation services", "freight forwarding", "Australia logistics"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        className={`${archivo.variable} ${jetbrainsMono.variable} ${interTight.variable} font-sans antialiased`}
      >
        <LenisProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
