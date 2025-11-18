import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import HeaderServerWrapper from "./components/header/header-server-wrapper";
import Footer from "./components/footer/footer";
import GSAPSmoothScrollProvider from "@/components/gsap-smooth-scroll-provider";
import { DropdownStateProvider } from "./components/header/dropdown-state-context";

import { generateMetadata as generateBaseMetadata, generateOrganizationSchema } from "@/lib/metadata";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

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
      <body className={`${jetbrainsMono.variable} ${manrope.variable} font-sans antialiased`}>
          <GSAPSmoothScrollProvider>
            <DropdownStateProvider>
              <HeaderServerWrapper />
              <main>{children}</main>
              <Footer />
            </DropdownStateProvider>
          </GSAPSmoothScrollProvider>
          {/* Privacy-friendly analytics by Plausible */}
          <Script
            src="https://plausible.io/js/pa-MgCdtXHVcpVBqSjqd-DX3.js"
            strategy="afterInteractive"
          />
          <Script
            id="plausible-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)};
                plausible.init=plausible.init||function(i){plausible.o=i||{}};
                plausible.init();
              `,
            }}
          />
      </body>
    </html>
  );
}
