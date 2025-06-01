import AppSideBar from "./AppSideBar";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { NavbarButton } from "./ui/resizable-navbar";

export function Appbar() {
  return (
    <div className="w-full h-[8%] flex items-center justify-evenly bg-transparent">
      <AppSideBar />
      <div className="flex items-center gap-4">
        <SignedOut>
          <NavbarButton>
            <SignInButton>
              <div className="cursor-pointer">Sign In</div>
            </SignInButton>
          </NavbarButton>
          <NavbarButton>
            <SignUpButton>
              <div className="cursor-pointer">Sign Up</div>
            </SignUpButton>
          </NavbarButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
