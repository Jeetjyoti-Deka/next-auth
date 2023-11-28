"use client";

import { sendEmailFromServer } from "@/lib/mailer";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignUp, SetIsSignUp] = useState(false);

  const handleChange = (e: any) => {
    const value = e.target.value;
    const name = e.target.name;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMessage("");
    if (isSignUp) {
      const res = await fetch("/api/Users", {
        method: "POST",
        body: JSON.stringify({ formData }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        setErrorMessage("Something went wrong. Please try again later");
        router.refresh();
      }

      const data = await res.json();

      if (data.message === "Duplicate email") {
        setErrorMessage("User already exist. Please Sign In");
        SetIsSignUp(false);
      }

      if (data.message === "User Created") {
        await sendEmailFromServer({
          email: data.user.email,
          userId: data.user._id,
        });
        setErrorMessage(
          "An email verification link has been sent to your provided address. Please check to complete the verification process."
        );
        SetIsSignUp(false);
      }
    } else {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.ok === false && res.status === 401) {
        setErrorMessage("Invalid Credentials");
      }
      if (res?.ok === false) {
        setErrorMessage("Something went wrong. Please try again later");
      }

      if (res?.ok && res.status === 200) {
        router.push(callbackUrl || "/");
        router.refresh();
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full items-center ">
      <h1 className="text-center mb-4">{isSignUp ? "Register" : "Login"}</h1>
      <button
        className="bg-gray-200 w-1/2 py-2 rounded-md flex items-center justify-center gap-4 text-xl"
        onClick={() => signIn("google", { callbackUrl: callbackUrl || "" })}
      >
        <Image src="/google.svg" alt="google" width={30} height={30} />
        Google
      </button>
      <hr className="my-2 w-1/2 h-[2px] bg-gray-400" />
      <form
        onSubmit={handleSubmit}
        method="post"
        className="flex flex-col gap-3 w-1/2"
      >
        <label>Email</label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={handleChange}
          required={true}
          value={formData.email}
          className="m-2 bg-slate-400 rounded"
        />
        <label>Password</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={handleChange}
          required={true}
          value={formData.password}
          className="m-2 bg-slate-400 rounded"
        />
        <input
          type="submit"
          value={isSignUp ? "Sign Up" : "Login"}
          className="bg-blue-300 hover:bg-blue-100 py-2 rounded-lg my-2"
        />
      </form>
      {isSignUp ? (
        <p>
          Already a user?{" "}
          <button className="underline" onClick={() => SetIsSignUp(false)}>
            Login
          </button>
        </p>
      ) : (
        <p>
          Not registered yet?{" "}
          <button className="underline" onClick={() => SetIsSignUp(true)}>
            Sign Up
          </button>
        </p>
      )}

      <p className="text-red-500 font-semibold text-2xl">{errorMessage}</p>
    </div>
  );
};
export default LoginForm;
