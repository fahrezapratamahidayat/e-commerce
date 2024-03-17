import Image from "next/image";
import { Inter } from "next/font/google";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();
  return (
    <>
      <div className="mx-32 min-h-screen flex-1">
        <div className="flex items-center justify-between border">
          <h1>STORE</h1>
          <div className="flex items-center gap-10 justify-between">
            <h1>Home</h1>
            <h1>Contact</h1>
            <h1>product</h1>
            <h1>Services</h1>
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
