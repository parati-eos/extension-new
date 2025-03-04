import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { X } from "lucide-react"; // Import close icon
import confetti from "canvas-confetti"; // Import confetti

interface OfferModalProps {
  open: boolean;
  onClose: () => void;
}

export default function OfferModal({ open, onClose }: OfferModalProps) {
  const [currency, setCurrency] = useState("INR"); // Default currency is INR
  const [price, setPrice] = useState({ current: 499, original: 249 });

  useEffect(() => {
    // Fetch user location to determine currency
    const fetchCurrency = async () => {
      try {
        const response = await axios.get("https://zynth.ai/api/users/ip-info");
        console.log("IP Info Response:", response.data);
        if (response.data?.country !== "IN") {
          setCurrency("USD");
          setPrice({ current: 9, original: 19 }); // Prices in USD
        }
      } catch (error) {
        console.error("Failed to fetch IP info:", error);
      }
    };

    fetchCurrency();
  }, []);

  // Trigger confetti animation when modal opens
  useEffect(() => {
    if (open) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6},
      });
    }
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-104 text-center">
          <Dialog.Close className="absolute top-3 right-3 text-gray-500 hover:text-black">
            <X size={24} />
          </Dialog.Close>
          <Dialog.Title className="text-2xl font-bold text-black animate-bounce" style={{ animation: 'bounce 1s ease infinite', animationDuration: '1s', animationIterationCount: '4' }}>🎉 50% OFF 🎉</Dialog.Title>
          <p className="text-lg mt-2 text-gray-700">
            <span className="text-2xl font-bold text-red-500">
              {currency} - {price.original}
            </span>
            <span className="text-xl text-gray-500 line-through ml-2">
              {currency} - {price.current}
            </span>
          </p>
          <p className="text-lg mt-2">Export to Google Slides for complete presentation control.</p>

          <ul className="text-left text-gray-700 mt-4 space-y-2">
            <li>
              <svg className="inline-block w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Edit and format text seamlessly.
            </li>
            <li>
              <svg className="inline-block w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Add or replace graphics and images as needed.
            </li>
            <li>
              <svg className="inline-block w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Complete sync between Zynth and Google Slides.
            </li>
          </ul>

          <button
            className="mt-6 px-6 py-2 bg-blue-900 text-white text-lg font-semibold rounded-lg hover:bg-blue-900 transition transform hover:scale-105"
            onClick={onClose}
          >
            Export Now and Save 50%
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
