"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname } from "@/lib/locale-helpers";
import { defaultLocale } from "@/prismicio";
import type { FooterDocument } from "@/types.generated";
import Footer from "./footer";

interface FooterWrapperProps {
  initialFooter: FooterDocument | null;
}

export default function FooterWrapper({ initialFooter }: FooterWrapperProps) {
  const pathname = usePathname();
  const [footerData, setFooterData] = useState<FooterDocument | null>(initialFooter);
  const previousFooterRef = useRef<FooterDocument | null>(initialFooter);
  const currentLocaleRef = useRef<string | null>(initialFooter?.lang || null);
  const hasInitialFooter = useRef(!!initialFooter);

  useEffect(() => {
    const fetchFooter = async () => {
      const locale = getLocaleFromPathname(pathname);

      if (hasInitialFooter.current && currentLocaleRef.current === locale) {
        hasInitialFooter.current = false;
        return;
      }

      if (currentLocaleRef.current === locale) {
        return;
      }

      try {
        const response = await fetch(`/api/footer?lang=${locale}`, {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          setFooterData(data);
          previousFooterRef.current = data;
          currentLocaleRef.current = locale;
          return;
        }

        const defaultResponse = await fetch(`/api/footer?lang=${defaultLocale}`, {
          cache: "no-store",
        });
        if (defaultResponse.ok) {
          const defaultData = await defaultResponse.json();
          setFooterData(defaultData);
          previousFooterRef.current = defaultData;
          currentLocaleRef.current = defaultLocale;
        } else if (previousFooterRef.current) {
          setFooterData(previousFooterRef.current);
        }
      } catch (error) {
        console.error("Failed to fetch footer:", error);
        if (previousFooterRef.current) {
          setFooterData(previousFooterRef.current);
        }
      }
    };

    fetchFooter();
  }, [pathname]);

  return <Footer footer={footerData || previousFooterRef.current} />;
}
