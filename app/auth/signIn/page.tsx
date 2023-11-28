"use client";

import LoginForm from "@/components/LoginForm";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const SignIn = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <div className="w-full flex justify-center my-10">
      <LoginForm />
    </div>
  );
};
export default SignIn;
