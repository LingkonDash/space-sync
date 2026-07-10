"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BsGoogle } from "react-icons/bs";
import { FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import logo from "@/images/spaceSyncLogo.svg";

// ─── TYPES ──────────────────────────────────────────────────────────────────
interface FormErrors {
  email?: string;
  password?: string;
  agreed?: string;
  server?: string;
}

type UserRole = "user" | "host" | "admin";

// ─── COMPONENT ──────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();

  // --- Form state ---
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("Abc@1234");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agreed, setAgreed] = useState<boolean>(true);

  // --- Error / submit state ---
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  // ── Validation ────────────────────────────────────────────────────────────
  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Password is required.";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (!agreed) errs.agreed = "You must accept the Terms & Privacy Policy.";
    return errs;
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Step 1: Validate
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please checkout all inputs before continuing.");
      return;
    }
    setErrors({});

    try {
      setSubmitting(true);

      // Step 2: Sign in via Better Auth
      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "Login failed. Please check your credentials.");
        setErrors({ server: error.message || "Invalid email or password." });
        return;
      }

      // Step 3: Role-based redirect
      const userRole = (data?.user?.role as UserRole) || "user";

      let destination = "/";

      if (userRole === "host") {
        destination = "/dashboard/host";
      } else if (userRole === "admin") {
        destination = "/dashboard/admin";
      }

      if (userRole === "user") toast.success("Welcome back! Redirecting to Home.");
      else toast.success("Welcome back! Redirecting to your dashboard.");

      setTimeout(() => {
        router.push(destination);
      }, 1500);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setErrors({ server: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  // ── Google sign-in ───────────────────────────────────────────────────────
  async function handleGoogleSignIn() {
    const googleToast = toast.loading("Connecting to Google…");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      toast.success("Redirecting…", { id: googleToast });
    } catch {
      toast.error("Google sign-in failed. Please try again.", { id: googleToast });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section className="min-h-[80vh] bg-[var(--color-neutral-bg)] flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-[40px] overflow-hidden shadow-xl">

        {/* ── Login Form ───────────────────────────────────────────────────── */}
        <div className="p-8 md:p-14 flex items-center">
          <div className="w-full max-w-lg mx-auto">

            {/* Mobile logo */}
            <Link href="/" className="flex lg:hidden items-center gap-2 mb-10">
              <Image src={logo} alt="SpaceSync logo" className="h-9 w-auto" />
              <h2 className="text-3xl font-bold text-[var(--color-neutral-text)]">SpaceSync</h2>
            </Link>

            <h2 className="text-4xl font-extrabold text-[var(--color-neutral-text)] tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-3 text-slate-500 leading-7">
              Login to access your dashboard, manage bookings, or list a new space.
            </p>

            {/* Server-level error */}
            {errors.server && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm font-medium">
                {errors.server}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">

              {/* ── Email ── */}
              <div>
                <label className="text-sm font-semibold text-[var(--color-neutral-text)]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full mt-2 border rounded-xl px-5 py-4 outline-none focus:ring-2 transition bg-white text-[var(--color-neutral-text)]
                    ${errors.email
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-[var(--color-neutral-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/15"
                    }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* ── Password ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-[var(--color-neutral-text)]">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-slate-500 hover:text-[var(--color-primary)] hover:underline transition"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full border rounded-xl px-5 py-4 pr-12 outline-none focus:ring-2 transition bg-white text-[var(--color-neutral-text)]
                      ${errors.password
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-[var(--color-neutral-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/15"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* ── Terms checkbox ── */}
              <div>
                <div className="flex items-start gap-3">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreed}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setAgreed(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      onClick={() => setAgreed((v) => !v)}
                      className={`w-5 h-5 rounded-md border-2 cursor-pointer flex items-center justify-center transition-all
                        ${agreed
                          ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                          : errors.agreed
                            ? "border-red-400 bg-red-50"
                            : "border-[var(--color-neutral-border)] bg-white"
                        }`}
                    >
                      {agreed && <FiCheck size={11} className="text-white stroke-[3]" />}
                    </div>
                  </div>
                  <label
                    htmlFor="terms"
                    className="text-sm text-slate-600 leading-5 cursor-pointer"
                    onClick={() => setAgreed((v) => !v)}
                  >
                    I agree to the SpaceSync{" "}
                    <Link href="/terms" className="text-[var(--color-primary)] hover:underline font-medium">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[var(--color-primary)] hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.agreed && (
                  <p className="mt-1 text-xs text-red-500 pl-8">{errors.agreed}</p>
                )}
              </div>

              {/* ── Submit ── */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 disabled:bg-[var(--color-primary)]/50 text-white py-4 rounded-xl font-semibold transition duration-300 cursor-pointer shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* ── Divider ── */}
            <div className="my-7 flex items-center gap-4">
              <div className="flex-1 h-px bg-[var(--color-neutral-border)]" />
              <span className="text-slate-400 text-sm font-medium">OR</span>
              <div className="flex-1 h-px bg-[var(--color-neutral-border)]" />
            </div>

            {/* ── Google ── */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full border border-[var(--color-primary)] rounded-xl hover:bg-[var(--color-primary)]/5 py-4 px-5 flex items-center justify-center gap-3 text-[var(--color-primary)] transition duration-300 cursor-pointer font-medium"
            >
              <BsGoogle size={20} />
              Sign in with Google
            </button>

            <p className="mt-7 text-center text-slate-500">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/register"
                className="text-[var(--color-primary)] font-semibold hover:underline transition"
              >
                Register Now
              </Link>
            </p>

          </div>
        </div>

      </div>
    </section>
  );
}