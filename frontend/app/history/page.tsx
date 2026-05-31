import { Suspense } from "react";
import HistoryPageContent from "./HistoryPageContent";

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0C0C0C]" />}>
      <HistoryPageContent />
    </Suspense>
  );
}
