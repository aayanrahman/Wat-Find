"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function Home() {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    if (!email.endsWith("@uwaterloo.ca")) {
      alert("Only @uwaterloo.ca emails allowed!");
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:3000" // later change to production URL
      }
    });
    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the magic link!");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="text-center w-full max-w-md">
      <h1 className="text-4xl font-bold mb-4">WATFind</h1>
      
      {/* Navigation buttons to test pages */}
      <div className="mb-6 flex gap-2 justify-center flex-wrap">
        <Link href="/lost" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
          Lost Items
        </Link>
        <Link href="/found" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
          Found Items
        </Link>
        <Link href="/post" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors">
          Post Item
        </Link>
      </div>
      
      <input
        type="email"
        placeholder="you@uwaterloo.ca"
        className="p-2 rounded bg-gray-800 text-white placeholder-gray-400 w-full text-center"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="mt-4 bg-yellow-400 text-black px-4 py-2 rounded"
      >
        Send Magic Link
      </button>
      </div>
    </main>
  );
}
