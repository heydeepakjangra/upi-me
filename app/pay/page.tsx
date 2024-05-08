"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QRCodeGenerator from "./_components/qrcode-generator";

export default function Pay() {
  const searchParams = useSearchParams();

  const upi = searchParams.get("pa");
  const amount = searchParams.get("am");
  const note = searchParams.get("tn");
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      }
    >
      <div className="gap-y-6 p-6 flex flex-col items-center justify-center h-screen bg-zinc-200">
        <QRCodeGenerator upi={upi} amount={amount} note={note} />
      </div>
    </Suspense>
  );
}
