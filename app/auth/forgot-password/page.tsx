"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import emailjs from '@emailjs/browser';
import api from "@/utils/baseUrl";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
// useEffect(() => {
//   emailjs.init("YOUR_PUBLIC_KEY"); // ✅ YOUR PUBLIC KEY
// }, []);
  const submit = async () => {
    if (!email) return toast.error("Please enter your email");
    try {
      setLoading(true);

      const res = await api.post("/auth/forgot-password", { email });
      const { resetUrl, name, email: userEmail } = res.data;
// console.log(res.data);


      const templateParams = {
        user_name: name,
        user_email: userEmail,
        reset_link: resetUrl,
      };
// console.log(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
//         process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!, process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setSuccess(
        "If an account exists, a reset link has been sent. Check your email."
      );
      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);
      setSuccess("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Forgot Password
        </h2>

        <p className="text-gray-600 mb-4 text-center">
          Enter your email address below and we'll send you a reset link.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {success && (
          <p className="mt-4 text-center text-green-600 font-medium">{success}</p>
        )}

        <button
          onClick={() => router.back()}
          className="mt-6 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-medium transition"
        >
          Back
        </button>
      </div>
    </div>
  );
}
