import Image from "next/image";
import { Inter } from "next/font/google";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();
  return (
    <>
      <div className="mx-32 min-h-screen">
        <div className="flex items-center justify-between py-2">
          <h1 className="font-bold tracking-wide">ZASTORE</h1>
          <div className="flex items-center gap-10 justify-between">
            <Link href={"/"} className="font-semibold hover:text-primary">
              Home
            </Link>
            <Link
              href={"/contact"}
              className="font-semibold hover:text-primary"
            >
              Contact
            </Link>
            <Link
              href={"/product"}
              className="font-semibold hover:text-primary"
            >
              products
            </Link>
            <Link
              href={"/services"}
              className="font-semibold hover:text-primary"
            >
              Services
            </Link>
          </div>
          <div className="flex items-center ">
            <Button
              className=""
              onClick={() => (session ? signOut() : signIn())}
            >
              {session ? "Sign Out" : "Sign In"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
