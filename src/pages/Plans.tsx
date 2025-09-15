"use client";

import { NetworkLayout } from "@/components/NetworkLayout";
import "./plans.css";
import { useEffect, useState } from "react";
import { Globe, Map, Route, Navigation } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { load } from "@cashfreepayments/cashfree-js";

declare global {
  interface Window {}
}

const plans = [
  {
    id: 1,
    icon: Globe,
    name: "Free Plan",
    description: "Perfect for small projects and getting started",
    price: 0,
    period: "month",
    features: [
      "Basic route mapping",
      "Up to 500 KM tracking",
      "Standard support",
    ],
    theme: "plan-green",
  },
  {
    id: 2,
    icon: Map,
    name: "100 KM Plan",
    description: "Ideal for small to medium network projects",
    price: 999,
    period: "month",
    features: ["Advanced mapping tools", "Up to 10000 KM", "Standard support"],
    theme: "plan-blue",
  },
  {
    id: 3,
    icon: Route,
    name: "500 KM Plan",
    description: "Great for expanding networks",
    price: 3999,
    period: "month",
    features: ["Advanced mapping tools", "Up to 10000 KM", "Standard support"],
    theme: "plan-orange",
  },
  {
    id: 4,
    icon: Navigation,
    name: "1000 KM Plan",
    description: "Best for large network projects",
    price: 7999,
    period: "month",
    features: ["Advanced mapping tools", "Up to 10000 KM", "Premium support"],
    theme: "plan-red",
  },
];

export default function Plans() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cashfree, setCashfree] = useState<any>(null);

  // Load Cashfree SDK once
  useEffect(() => {
    async function initializeSDK() {
      const cf = await load({ mode: "sandbox" }); // use "production" in live
      setCashfree(cf);
    }
    initializeSDK();
  }, []);

  const handleSelectPlan = async (price: number) => {
    if (!cashfree) return;
    setLoading(true);

    try {
      // Call backend to create payment session
      const res = await fetch(
        "https://optical.corusinfo.com/api/payment/initiate/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({ phone: "1234567890", amount: price }),
        }
      );

      const data = await res.json();
      console.log("Backend response:", data);

      if (data.payment_session_id) {
        const checkoutOptions = {
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_modal", // popup mode
        };

        cashfree.checkout(checkoutOptions).then((result: any) => {
          if (result.error) {
            console.log("User closed popup or payment error", result.error);
            alert("Payment canceled or failed.");
          }
          if (result.paymentDetails) {
            console.log("Payment completed", result.paymentDetails);
            alert("Payment Successful!");
            // Optionally refresh the page or update plan usage here
          }
        });
      } else {
        console.error("No payment session returned from backend");
        alert("Payment initialization failed. Try again.");
      }
    } catch (err) {
      console.error("Payment initiation failed:", err);
      alert("Payment initiation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NetworkLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col justify-between p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 ${plan.theme}`}
            >
              <div className="icon-box flex justify-center items-center w-10 h-10 rounded-lg mb-4">
                <plan.icon className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

              <div className="text-2xl font-bold">
                ₹{plan.price}
                <span className="text-sm font-normal text-gray-500">
                  {" "}
                  / {plan.period}
                </span>
              </div>

              <ul className="mt-4 space-y-1 text-sm text-gray-700">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-500 mr-2">✔</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                disabled={loading}
                onClick={() => handleSelectPlan(plan.price)}
                className="select-btn mt-6 w-full text-white py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Opening Payment..." : "Select Plan"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </NetworkLayout>
  );
}
