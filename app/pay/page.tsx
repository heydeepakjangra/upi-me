"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";

import PaymentOptionLink from "./_components/payment-option-link";

function PayContent() {
  const searchParams = useSearchParams();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [deeplink, setDeeplink] = useState<string>("");

  const upi = searchParams.get("pa");
  const amount = searchParams.get("am");
  const note = searchParams.get("tn");

  useEffect(() => {
    const generateQRCode = async () => {
      if (!upi) {
        console.error("Invalid UPI payment link");
        return;
      }

      try {
        let generatedDeeplink = `pay?pa=${upi}`;
        if (amount) generatedDeeplink += `&am=${amount}`;
        if (note) generatedDeeplink += `&tn=${note}`;

        setDeeplink(generatedDeeplink);

        const upiDeepLink = `upi://${generatedDeeplink}`;
        const canvas = document.createElement("canvas");
        QRCode.toCanvas(canvas, upiDeepLink, function (error) {
          if (error) {
            console.error(error);
            return;
          }
          // Convert the canvas to a data URL
          const qrCodeUrl = canvas.toDataURL();
          setQrCodeUrl(qrCodeUrl);
        });
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    generateQRCode();
  }, [upi, amount, note]);

  return (
    <div>
      {qrCodeUrl && (
        <div className="p-6 flex flex-col items-center justify-center h-screen bg-zinc-200">
          <div className="bg-white p-1 mt-12 rounded-xl shadow-sm">
            <Image src={qrCodeUrl} alt="QR Code" width={225} height={225} />
          </div>
          <div className="mt-12">
            <p className="text-center text-md text-gray-700">You are paying</p>
            <p className="text-center text-lg font-semibold">{upi}</p>
          </div>
          {amount && (
            <div className="mt-8">
              <p className="text-center text-md text-gray-700">amount</p>
              <p className="text-center text-lg font-semibold">{amount}</p>
            </div>
          )}
          {note && (
            <div className="mt-4">
              <p className="text-center text-md text-gray-700">for</p>
              <p className="text-center text-lg font-semibold">{note}</p>
            </div>
          )}
          <div className="flex gap-x-6 mt-6 p-4">
            <PaymentOptionLink
              deeplink={`gpay://upi/${deeplink}`}
              imagePath="/logos/gpay.png"
              altText="Google Pay"
            />
            <PaymentOptionLink
              deeplink={`phonepe://upi/${deeplink}`}
              imagePath="/logos/phonepe.png"
              altText="PhonePe"
            />
            <PaymentOptionLink
              deeplink={`paytmmp://upi/${deeplink}`}
              imagePath="/logos/paytm.png"
              altText="Paytm"
            />
            <PaymentOptionLink
              deeplink={`upi://${deeplink}`}
              imagePath="/logos/bhim.png"
              altText="BHIM"
            />
          </div>
          <div className="mt-6">
            <a className="text-sm font-semibold" href="https://upi.me">
              Create UPI payment links using{" "}
              <span className="font-semibold text-muted-foreground underline underline-offset-2 text-sm">
                UPI.me
              </span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Pay() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PayContent />
    </Suspense>
  );
}
