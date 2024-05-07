"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";

import PaymentOptionLink from "./_components/payment-option-link";

export default function Pay() {
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
        const qrCode = await QRCode.toDataURL(upiDeepLink, {
          colorDark: "#000000",
          colorLight: "#ffffff",
          margin: 1,
        });
        setQrCodeUrl(qrCode);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    generateQRCode();
  }, [upi, amount, note]);

  return (
    <div>
      {qrCodeUrl && (
        <div className="p-8 flex flex-col items-center justify-center h-screen bg-zinc-200">
          <div className="bg-white p-4 mt-16 rounded-xl shadow-sm">
            <Image src={qrCodeUrl} alt="QR Code" width={200} height={200} />
          </div>
          <div className="mt-12">
            <p className="text-center text-lg text-gray-700">You are paying</p>
            <p className="text-center text-xl font-semibold">{upi}</p>
          </div>
          {amount && (
            <div className="mt-8">
              <p className="text-center text-lg text-gray-700">amount</p>
              <p className="text-center text-xl font-semibold">{amount}</p>
            </div>
          )}
          {note && (
            <div className="mt-4">
              <p className="text-center text-lg text-gray-700">for</p>
              <p className="text-center text-xl font-semibold">{note}</p>
            </div>
          )}
          <div className="flex gap-x-6 mt-8 p-4">
            <PaymentOptionLink
              deeplink={`gpay://upi/${deeplink}`}
              imagePath="/logos/gpay.png"
              altText="Google Pay"
            />
            <PaymentOptionLink
              deeplink={`phonepay://upi/${deeplink}`}
              imagePath="/logos/phonepe.png"
              altText="PhonePe"
            />
            <PaymentOptionLink
              deeplink={`paytm://upi/${deeplink}`}
              imagePath="/logos/paytm.png"
              altText="Paytm"
            />
            <PaymentOptionLink
              deeplink={`upi://${deeplink}`}
              imagePath="/logos/bhim.png"
              altText="BHIM"
            />
          </div>
          <div className="mt-16">
            <a
              className="text-muted-foreground underline underline-offset-2 text-sm"
              href="https://upi.me"
            >
              Create UPI payment links using{" "}
              <span className="font-semibold">UPI.me</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
