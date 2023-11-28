"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      const res = await fetch("/api/verifyemail", {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
    };
    verifyEmail();
  }, [token]);

  return (
    <div className="bg-green-400 w-full flex justify-center items-center">
      <h1 className="text-white text-2xl">
        Email Verified. Now you can <Link href="/auth/signIn">Sign In</Link>
      </h1>
    </div>
  );
};
export default VerifyEmail;
