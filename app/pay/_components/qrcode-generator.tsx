import { useState, useEffect } from "react";
import QRCode from "qrcode";
import PaymentOptionLink from "./payment-option-link";
import Image from "next/image";

interface QRCodeGeneratorProps {
  upi: string | null;
  amount: string | null;
  note: string | null;
}

function QRCodeGenerator({ upi, amount, note }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [deeplink, setDeeplink] = useState<string>("");

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
    <>
      {qrCodeUrl && (
        <>
          <div className="flex justify-center">
            <Image
              className="rounded-md bg-white"
              src={qrCodeUrl}
              alt="QR Code"
              width={225}
              height={225}
            />
          </div>
          <div className="mt-6">
            <p className="text-center text-md text-gray-700">You are paying</p>
            <p className="text-center text-lg font-semibold">{upi}</p>
          </div>
          {amount && (
            <div>
              <p className="text-center text-md text-gray-700">amount</p>
              <p className="text-center text-lg font-semibold">{amount}</p>
            </div>
          )}
          {note && (
            <div>
              <p className="text-center text-md text-gray-700">for</p>
              <p className="text-center text-lg font-semibold">{note}</p>
            </div>
          )}
          <div className="flex gap-x-6 p-4">
            <PaymentOptionLink
              deeplink={`gpay://upi/${deeplink}`}
              imagePath="/logos/gpay.png"
              altText="Google Pay"
            />
            <PaymentOptionLink
              deeplink={`phonepe://${deeplink}`}
              imagePath="/logos/phonepe.png"
              altText="PhonePe"
            />
            <PaymentOptionLink
              deeplink={`paytmmp://${deeplink}`}
              imagePath="/logos/paytm.png"
              altText="Paytm"
            />
            <PaymentOptionLink
              deeplink={`upi://${deeplink}`}
              imagePath="/logos/bhim.png"
              altText="BHIM"
            />
          </div>
          <div className="text-center">
            <a className="text-sm font-semibold" href="https://upi.me">
              Create UPI payment links using{" "}
              <span className="font-semibold text-muted-foreground underline underline-offset-2 text-sm">
                UPI.me
              </span>
            </a>
          </div>
        </>
      )}
    </>
  );
}

export default QRCodeGenerator;
