"use client";

import { MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VerifyInfoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <MailCheck className="mx-auto text-sky-600" size={48} />

        <h2 className="text-2xl font-bold mt-4 text-gray-800">
          Verify Your Email
        </h2>

        <p className="text-gray-600 mt-3">
          We’ve sent you an activation link to your email address.
          <br />
          Please click the link to activate your account.
        </p>

        <button
          onClick={() => router.push("/auth/login")}
          className="mt-6 w-full bg-sky-600 text-white py-3 rounded-xl"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}