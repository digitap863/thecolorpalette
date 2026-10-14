"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      setSuccess(`Welcome back, ${data.admin?.name || "Admin"}! Redirecting...`);
      setTimeout(() => {
        router.push(returnTo);
        router.refresh();
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid credentials";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f1eb] text-[#1c1917] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden selection:bg-[#c2a878]/30 selection:text-[#1c1917]">
      {/* Soft warm gold ambient glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#dfcca5]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#c2a878]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ebd8b7]/25 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle warm dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #1c1917 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Navigation Bar Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-belleza text-[#1c1917]/70 hover:text-[#1c1917] transition-colors group font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            Back to Studio
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-poppins tracking-wider uppercase bg-[#c2a878]/20 border border-[#c2a878]/40 text-[#8c6d36] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8c6d36]" />
            Admin Suite
          </span>
        </div>

        {/* Card */}
        <div className="backdrop-blur-xl bg-white border border-[#c2a878]/35 rounded-2xl p-7 sm:p-9 shadow-xl shadow-stone-900/5 relative overflow-hidden">
          {/* Top Gold Accent Border */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#dfcca5] via-[#c2a878] to-[#dfcca5]" />

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#f7f1eb] border border-[#c2a878]/35 mb-4 shadow-xs relative group">
              <Image
                src="/logo.png"
                alt="The Color Palette"
                width={42}
                height={42}
                className="object-contain"
                priority
              />
            </div>

            <h1 className="font-belleza text-2xl sm:text-3xl tracking-[0.12em] text-[#1c1917] uppercase font-normal mb-1.5">
              Admin Portal
            </h1>
            <p className="font-poppins text-xs text-[#1c1917]/70 font-light tracking-wide">
              The Color Palette — Management & Clinical Operations
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs font-poppins animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-5 p-3.5 rounded-xl bg-stone-900 border border-stone-800 flex items-start gap-3 text-[#f7f1eb] text-xs font-poppins animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="w-4 h-4 text-[#c2a878] shrink-0 mt-0.5" />
              <div className="flex-1">{success}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-[0.15em] font-belleza text-[#1c1917] font-semibold mb-2"
              >
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1c1917]/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@thecolorpalette.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#f7f1eb]/60 border border-[#c2a878]/40 rounded-xl text-sm font-poppins text-[#1c1917] placeholder-[#1c1917]/35 focus:outline-none focus:border-[#1c1917] focus:ring-1 focus:ring-[#1c1917] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs uppercase tracking-[0.15em] font-belleza text-[#1c1917] font-semibold"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1c1917]/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-[#f7f1eb]/60 border border-[#c2a878]/40 rounded-xl text-sm font-poppins text-[#1c1917] placeholder-[#1c1917]/35 focus:outline-none focus:border-[#1c1917] focus:ring-1 focus:ring-[#1c1917] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#1c1917]/50 hover:text-[#1c1917] transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#1c1917] text-[#f7f1eb] font-belleza uppercase tracking-[0.2em] text-xs font-semibold hover:bg-black active:scale-[0.99] transition-all duration-200 shadow-md shadow-stone-900/15 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#f7f1eb] border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In To Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-[#1c1917]/50 font-poppins font-light">
          &copy; {new Date().getFullYear()} The Color Palette. Authorized access only.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f1eb] flex items-center justify-center font-belleza text-stone-600">
          Loading Admin Portal...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
