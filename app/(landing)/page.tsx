"use client";

import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QRCodeGenerator from "../pay/_components/qrcode-generator";

export default function Home() {
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [upiLink, setUpiLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange =
    (setter: Function) => (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
      setUpiLink("");
    };

  const generateUpiLink = () => {
    const trimmedUpiId = upiId.trim();
    const trimmedAmount = amount.trim();
    const trimmedNote = note.trim();

    let link = `${window.location.href}pay?pa=${trimmedUpiId}`;
    if (trimmedAmount !== "") link += `&am=${trimmedAmount}`;
    if (trimmedNote !== "") link += `&tn=${trimmedNote}`;

    setUpiLink(link);
    setCopied(false); // Reset copied state when new link is generated
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiLink);
    setCopied(true); // Set copied state to true when link is copied
    setTimeout(() => {
      setCopied(false); // Reset copied state after 3 seconds
    }, 2000);
  };

  const isUpiIdValid = upiId.trim() !== "";

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen">
      <div className="md:flex-1 min-w-[350px] xl:max-w-[700px] my-12 lg:p-8">
        <div>
          <h1 className="text-3xl p-4 font-bold text-center">
            Create a UPI Link
          </h1>
        </div>
        <div className="flex flex-col gap-y-4 w-full p-12">
          <Input
            placeholder="Enter your UPI ID"
            value={upiId}
            onChange={handleChange(setUpiId)}
          />
          <Input
            placeholder="Amount (optional)"
            value={amount}
            type="number"
            onChange={handleChange(setAmount)}
          />
          <Input
            placeholder="Note (optional)"
            value={note}
            onChange={handleChange(setNote)}
          />
          <Button disabled={!isUpiIdValid} onClick={generateUpiLink}>
            Generate Link
          </Button>
          {upiLink && (
            <div className="mt-4">
              <p className="font-medium">UPI Link:</p>
              <input
                className="border border-gray-300 rounded px-3 py-2 w-full mt-2"
                type="text"
                value={upiLink}
                readOnly
              />
              <Button onClick={copyToClipboard} className="mt-2">
                {copied ? "Copied" : "Copy to Clipboard"}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-1 justify-center mb-8 md:mb-0 items-center md:min-h-screen rounded-2xl md:rounded-none bg-zinc-200">
        <div className="flex flex-col-reverse">
          <div className="relative flex flex-col justify-center h-[680px] w-[315px]  border-[5px] border-black rounded-2xl">
            <div className="flex justify-center">
              <span className="bg-center border border-black bg-black w-4 h-4 rounded-full"></span>
            </div>

            <div className="gap-y-3 p-8 flex flex-col items-center justify-center">
              <QRCodeGenerator
                upi={upiId || "--"}
                amount={amount || "--"}
                note={note || "--"}
              />
            </div>
            <span className="absolute -right-2 top-20 border-4 border-black h-10 rounded-md"></span>
            <span className="absolute -right-2 top-44 border-4 border-black h-24 rounded-md"></span>
            <p></p>
          </div>
        </div>
      </div>
    </div>
  );
}
