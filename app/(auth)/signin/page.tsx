"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) setError("Incorrect email or password.");
    else router.push("/");
  }

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <h1 className="font-display text-3xl mb-1">Welcome back</h1>
      <p className="text-sm text-porcelain/50 mb-8">Sign in to check out faster.</p>

      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full border border-white/15 rounded-full py-3 text-sm font-medium hover:bg-white/5 transition mb-4"
      >
        Continue with Google
      </button>

      <div className="flex items-center gap-3 text-xs text-porcelain/35 my-4">
        <div className="flex-1 h-px bg-white/10" /> or <div className="flex-1 h-px bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email address" required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-porcelain/35 focus:outline-none focus:ring-2 focus:ring-citrus/50"
        />
        <input
          value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-porcelain/35 focus:outline-none focus:ring-2 focus:ring-citrus/50"
        />
        {error && <p className="text-xs text-citrus">{error}</p>}
        <button type="submit" className="w-full bg-citrus text-ink font-semibold py-3 rounded-full hover:brightness-110 transition">
          Sign in
        </button>
      </form>
      <p className="text-sm text-porcelain/45 mt-6 text-center">
        No account? <Link href="/signup" className="text-porcelain underline">Create one</Link>
      </p>
    </div>
  );
}
