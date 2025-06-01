"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth, useClerk } from "@clerk/nextjs";

const plans = [
  {
    name: "Basic",
    price: "Free",
    description: "Get started with core features",
    features: ["5 Project", "Limited Support", "Community Access"],
    buttonText: "Get Started",
  },
  {
    name: "Premium",
    price: "$19/month",
    description: "Ideal for freelancers and devs",
    features: ["10 Projects", "Priority Support", "Custom Domains"],
    buttonText: "Upgrade",
  },
  {
    name: "Business",
    price: "$49/month",
    description: "Best for teams and agencies",
    features: ["Unlimited Projects", "Dedicated Support", "Advanced Analytics"],
    buttonText: "Contact Sales",
  },
];

export default function Pricing() {
  const { getToken } = useAuth();
  const { openSignIn } = useClerk();
  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">
      <h2 className="text-4xl font-bold mb-4 text-center">Pricing Plans</h2>
      <p className="text-gray-400 text-lg mb-12 text-center max-w-2xl">
        Choose a plan that fits your needs. Upgrade anytime as you grow.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`bg-gray-900 border border-gray-800 text-white shadow-md rounded-2xl flex flex-col justify-between hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] duration-200 cursor-pointer`}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <p className="text-xl mt-2 font-semibold">{plan.price}</p>
              <p className="text-sm text-gray-400 mt-1">{plan.description}</p>
            </CardHeader>

            <CardContent>
              <ul className="space-y-2 mt-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-gray-300 flex items-center">
                    ✅ <span className="ml-2">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                variant={"secondary"}
                className="w-full text-white h-[50px] cursor-pointer text-lg font-semibold flex items-center justify-center px-4 gap-2 rounded-lg bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 hover:shadow-[0_0_10px_rgba(59,130,246,1)] z-20 duration-200 ease-in"
                onClick={async (e: React.MouseEvent) => {
                  e.preventDefault();
                  const token = await getToken();
                  if (plan.name === "Basic") {
                    if (!token) {
                      openSignIn();
                      return;
                    }
                  } else {
                    // Add Payment Gateway
                    return;
                  }
                  window.open("http://localhost:3000/genie", "_blank");
                }}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
