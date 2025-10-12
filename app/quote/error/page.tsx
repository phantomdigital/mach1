import { Metadata } from "next";
import ErrorClient from "./error-client";

export const metadata: Metadata = {
  title: "Error | MACH 1 Logistics",
  robots: {
    index: false,
    follow: false,
  },
};

export default function QuoteErrorPage() {
  return <ErrorClient />;
}

