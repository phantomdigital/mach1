import { Metadata } from "next";
import SummaryClient from "./summary-client";

export const metadata: Metadata = {
  title: "Quote Summary | Mach1 Logistics",
  robots: {
    index: false,
    follow: false,
  },
};

export default function QuoteSummaryPage() {
  return <SummaryClient />;
}

