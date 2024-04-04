import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import { LogIn } from "lucide-react";
import FileUpload from "@/components/ui/FileUpload";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  return (
    <main className="w-full min-h-screen bg-gradient-to-r from-indigo-100 via-red-100 to-yellow-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1">
            <h1 className="mr-5 text-4xl md:text-5xl font-semibold">
              Chat with any PDF
            </h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="flex mt-5">
            {isAuth && <Button>Start Now</Button>}
          </div>
          <p className="text-md md:text-lg mt-1 max-w-lg">
            Join millions of professionals, researchers, and students in using
            AI to analyze research and provide answers to problems.
          </p>
          <div className="mt-4 w-full">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button>
                  Login to get started
                  <LogIn className="size-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
