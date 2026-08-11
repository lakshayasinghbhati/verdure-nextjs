"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignUpPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
  console.log(await res.text());
  setError("Signup failed");
  return;
}
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    router.push("/");
  }

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <h1 className="font-display text-3xl mb-1">Create your account</h1>
      <p className="text-sm text-porcelain/50 mb-8">Save addresses, orders, and your wishlist.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-porcelain/35 focus:outline-none focus:ring-2 focus:ring-citrus/50"
        />
        <input
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Email address" required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-porcelain/35 focus:outline-none focus:ring-2 focus:ring-citrus/50"
        />
        <input
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" placeholder="Password (min 8 characters)" required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-porcelain/35 focus:outline-none focus:ring-2 focus:ring-citrus/50"
        />
        {error && <p className="text-xs text-citrus">{error}</p>}
        <button type="submit" className="w-full bg-citrus text-ink font-semibold py-3 rounded-full hover:brightness-110 transition">
          Create account
        </button>
      </form>
      <p className="text-sm text-porcelain/45 mt-6 text-center">
        Already have an account? <Link href="/signin" className="text-porcelain underline">Sign in</Link>
      </p>
    </div>
  );
}
