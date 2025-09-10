'use client';
import { signIn, useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (session?.user && !isPending) {
      redirect("/student");
    }
  }, [session, isPending]);

  const handleGoogleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/student",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Digital ID</h1>
          <h2 className="text-xl text-gray-600 mb-4">IIT (BHU) Varanasi</h2>
          <p className="text-gray-500">Sign in with your institutional email</p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors"
        >
          <FaGoogle size={20} />
          Sign in with Google
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Only @itbhu.ac.in email addresses are allowed
        </p>
      </div>
    </div>
  );
}