"use client";

import { BackgroundLines } from "@/components/ui/background-lines";
import {
  Navbar,
  NavbarButton,
  NavbarLogo,
  NavBody,
  NavItems,
} from "@/components/ui/resizable-navbar";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
  useClerk,
} from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

// Light - #060621
// Dark - #000C18

export default function Home() {
  const { getToken } = useAuth();
  const { openSignIn } = useClerk();
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "/pricings",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];
  return (
    <div className="w-[100vw] h-[100vh]">
      <div className="w-full h-[8%] flex items-center">
        <Navbar>
          <NavBody>
            <NavbarLogo />
            <NavItems items={navItems} />
            <div className="flex items-center gap-4">
              <SignedOut>
                <NavbarButton>
                  <SignInButton mode="redirect">
                    <div className="cursor-pointer">Sign In</div>
                  </SignInButton>
                </NavbarButton>
                <NavbarButton>
                  <SignUpButton mode="redirect">
                    <div className="cursor-pointer">Sign Up</div>
                  </SignUpButton>
                </NavbarButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </NavBody>
        </Navbar>
      </div>
      <div className="bg-black text-white w-full h-[92%]">
        <BackgroundLines className="bg-black text-center flex flex-col items-center justify-center gap-5 z-10">
          <div className="text-6xl font-semibold w-[50%]">
            Bolty Builds. You Chill.
          </div>
          <div className="text-5xl font-semibold">
            Launch your dream site today with Bolty AI
          </div>

          <div
            className="w-min-[150px] h-[50px] cursor-pointer text-xl font-semibold flex items-center justify-center px-4 gap-2 rounded-lg bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 hover:shadow-[0_0_30px_rgba(59,130,246,1)] z-20 duration-200 ease-in"
            onClick={async (e: React.MouseEvent) => {
              e.preventDefault();
              const token = await getToken();
              if (!token) {
                openSignIn();
                return;
              }
              window.open("http://localhost:3000/genie", "_blank");
            }}
          >
            <div>Get Started</div>
            <ArrowRight />
          </div>
        </BackgroundLines>
      </div>
    </div>
  );
}
