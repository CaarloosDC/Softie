import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegistrationSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-3xl font-bold mb-4">Registration Successful!</h1>
      <p className="text-center mb-8">
        A confirmation email has been sent to your email address. Please check
        your inbox and follow the instructions to verify your account.
      </p>
      <Link href="/login">
        <Button size={"sm"}>Go to Login Page</Button>
      </Link>
    </div>
  );
}
