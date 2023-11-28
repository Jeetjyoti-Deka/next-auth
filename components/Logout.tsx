"use client";

import { signOut } from "next-auth/react";

const Logout = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="bg-red-400 py-2 px-3 rounded-md"
    >
      Logout
    </button>
  );
};
export default Logout;
