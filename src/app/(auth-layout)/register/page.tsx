"use client";

import { useState, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BsGoogle } from "react-icons/bs";
import {
  FiUploadCloud,
  FiX,
  FiCheck,
  FiUser,
  FiHome,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import uploadToImgBB from "@/utils/imgbb/uploadToImgBB";
import { toast } from "react-toastify";
import logo from "@/images/spaceSyncLogo.svg";

// ─── TYPES ──────────────────────────────────────────────────────────────────
type Role = "user" | "host";

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreed?: string;
  image?: string;
}

// ─── HELPERS ────────────────────────────────────────────────────────────────
function validatePassword(pw: string): string | null {
  if (pw.length < 8) return "Must be at least 8 characters.";
  if (!/[A-Z]/.test(pw)) return "Must contain at least one uppercase letter.";
  return null;
}

// ─── COMPONENT ──────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();

  // --- Form state ---
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("Abc@1234");
  const [confirmPassword, setConfirmPassword] = useState<string>("Abc@1234");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [role, setRole] = useState<Role>("user");
  const [agreed, setAgreed] = useState<boolean>(true);

  // --- Image state ---
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- Error/status state ---
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [serverError, setServerError] = useState<string>("");

  // ── Image pick ────────────────────────────────────────────────────────────
  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Only image files are allowed." }));
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be under 4 MB." }));
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: undefined }));
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── Inline validation ────────────────────────────────────────────────────
  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!fullName.trim()) errs.fullName = "Full name is required.";
    if (!email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email.";
    const pwErr = validatePassword(password);
    if (pwErr) errs.password = pwErr;
    if (!confirmPassword) errs.confirmPassword = "Please confirm your password.";
    else if (confirmPassword !== password) errs.confirmPassword = "Passwords do not match.";
    if (!agreed) errs.agreed = "You must accept the Terms & Privacy Policy.";
    // image is optional — no hard error
    return errs;
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");
    setSuccessMsg("");

    // ── Step 1: Client-side validation ──────────────────────────────────────
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please fill up all fields correctly before continuing.");
      return;
    }
    setErrors({});

    try {
      setSubmitting(true);

      // ── Step 2: Image upload (optional) ───────────────────────────────────
      let imageUrl = "";
      if (imageFile) {
        setImageUploading(true);
        try {
          imageUrl = await uploadToImgBB(imageFile);
        } catch {
          toast.error("Photo upload failed. Please try again.");
          setErrors((prev) => ({ ...prev, image: "Image upload failed. Please try again." }));
          setSubmitting(false);
          setImageUploading(false);
          return;
        }
        setImageUploading(false);
      }

      // ── Step 3: Register via Better Auth ──────────────────────────────────
      const { error } = await authClient.signUp.email({
        name: fullName.trim(),
        email: email.trim(),
        password,
        userRole: role,
        image: imageUrl || "",
      });

      if (error) {
        toast.error(error.message || "Registration failed. Please try again.");
        setServerError(error.message || "Registration failed. Please try again.");
        return;
      }

      // ── Step 4: Success → role-based redirect ─────────────────────────────
      toast.success("Account created! Redirecting you to home...");
      setSuccessMsg("Account created! Redirecting…");

      setTimeout(() => {
        router.refresh()
        router.push("/");
      }, 1200);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Google signup ────────────────────────────────────────────────────────
  async function handleGoogleSignUp() {
    await authClient.signIn.social({ provider: "google", callbackURL: "/" });
  }

  // ── Password strength indicator ──────────────────────────────────────────
  const pwStrength: number = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][pwStrength];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"][pwStrength];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section className="min-h-screen bg-[var(--color-neutral-bg)] flex items-center justify-center px-6 py-12">
      <div className=" bg-white rounded-[40px] overflow-hidden shadow-xl grid grid-cols-1">

        <div className="p-8 md:p-14 order-2 flex items-start lg:items-center ">
          <div className="w-full max-w-lg mx-auto py-4">

            {/* Mobile logo */}
            <Link href="/" className="flex lg:hidden items-center gap-2 mb-10">
              <Image src={logo} alt="SpaceSync logo" className="h-9 w-auto" />
              <h2 className="text-3xl font-bold text-[var(--color-neutral-text)]">SpaceSync</h2>
            </Link>

            <h2 className="text-4xl font-extrabold text-[var(--color-neutral-text)] tracking-tight">
              Create Account
            </h2>
            <p className="mt-3 text-slate-500 leading-7">
              Join SpaceSync and start booking co-working desks, meeting rooms, and event spaces
              in top cities.
            </p>

            {/* Server-level feedback */}
            {serverError && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm font-medium">
                {serverError}
              </div>
            )}
            {successMsg && (
              <div className="mt-6 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-2">
                <FiCheck /> {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">

              {/* ── Full Name ── */}
              <div>
                <label className="text-sm font-semibold text-[var(--color-neutral-text)]">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className={`w-full mt-2 border rounded-xl px-5 py-4 outline-none focus:ring-2 transition bg-white text-[var(--color-neutral-text)]
                    ${errors.fullName
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-[var(--color-neutral-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/15"
                    }`}
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
              </div>

              {/* ── Email ── */}
              <div>
                <label className="text-sm font-semibold text-[var(--color-neutral-text)]">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full mt-2 border rounded-xl px-5 py-4 outline-none focus:ring-2 transition bg-white text-[var(--color-neutral-text)]
                    ${errors.email
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-[var(--color-neutral-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/15"
                    }`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* ── Password ── */}
              <div>
                <label className="text-sm font-semibold text-[var(--color-neutral-text)]">Password</label>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create your password"
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

                {/* Strength bar */}
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-full transition-all duration-300"
                          style={{ backgroundColor: i <= pwStrength ? strengthColor : "#e5e7eb" }}
                        />
                      ))}
                    </div>
                    <p className="text-xs mt-1 font-medium" style={{ color: strengthColor }}>
                      {strengthLabel}
                    </p>
                  </div>
                )}

                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                <p className="mt-1 text-xs text-slate-400">Min. 8 characters with at least one uppercase letter.</p>
              </div>

              {/* ── Confirm Password ── */}
              <div>
                <label className="text-sm font-semibold text-[var(--color-neutral-text)]">Confirm Password</label>
                <div className="relative mt-2">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className={`w-full border rounded-xl px-5 py-4 pr-12 outline-none focus:ring-2 transition bg-white text-[var(--color-neutral-text)]
                      ${errors.confirmPassword
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : confirmPassword && confirmPassword === password
                          ? "border-green-400 focus:border-green-400 focus:ring-green-100"
                          : "border-[var(--color-neutral-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/15"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
                {!errors.confirmPassword && confirmPassword && confirmPassword === password && (
                  <p className="mt-1 text-xs text-green-500 flex items-center gap-1">
                    <FiCheck size={11} /> Passwords match
                  </p>
                )}
              </div>

              {/* ── Role Select ─────────────────────────────────────────────── */}
              <div>
                <label className="text-sm font-semibold text-[var(--color-neutral-text)]">Account Role</label>
                <p className="text-xs text-slate-400 mt-0.5">Choose what describes you best.</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {(
                    [
                      { value: "user", label: "Renter", icon: FiUser, desc: "Browse & book spaces" },
                      { value: "host", label: "Host", icon: FiHome, desc: "List & manage your spaces" },
                    ] as const
                  ).map(({ value, label, icon: Icon, desc }) => (
                    <label
                      key={value}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
                        ${role === value
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-sm"
                          : "border-[var(--color-neutral-border)] bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={value}
                        checked={role === value}
                        onChange={() => setRole(value)}
                        className="sr-only"
                      />
                      {/* Check badge */}
                      <span
                        className={`absolute top-2.5 right-2.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition
                          ${role === value
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                            : "border-slate-300"
                          }`}
                      >
                        {role === value && <FiCheck size={10} className="text-white stroke-[3]" />}
                      </span>

                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition
                          ${role === value ? "bg-[var(--color-primary)] text-white" : "bg-slate-100 text-slate-500"}`}
                      >
                        <Icon size={20} />
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          role === value ? "text-[var(--color-primary)]" : "text-slate-700"
                        }`}
                      >
                        {label}
                      </span>
                      <span className="text-[11px] text-slate-400 text-center leading-4">{desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Profile Image Upload ─────────────────────────────────────── */}
              <div>
                <label className="text-sm font-semibold text-[var(--color-neutral-text)]">Profile Photo</label>
                <p className="text-xs text-slate-400 mt-0.5">Optional — max 4 MB. JPG, PNG, or WebP.</p>

                {!imagePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`mt-3 border-2 border-dashed rounded-2xl px-6 py-8 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200
                      ${errors.image
                        ? "border-red-300 bg-red-50"
                        : "border-[var(--color-neutral-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
                      }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <FiUploadCloud size={22} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-700">Click to upload a photo</p>
                      <p className="text-xs text-slate-400 mt-0.5">or drag and drop here</p>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-medium">
                      JPG · PNG · WebP · up to 4 MB
                    </span>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-4 border border-[var(--color-neutral-border)] rounded-2xl p-4 bg-slate-50">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-[var(--color-neutral-border)] shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{imageFile?.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {imageFile ? (imageFile.size / 1024).toFixed(1) : "0"} KB
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-xs text-green-600 font-medium">Ready to upload</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition flex-shrink-0"
                      aria-label="Remove image"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
              </div>

              {/* ── Terms checkbox ── */}
              <div>
                <div className="flex items-start gap-3">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
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
                    <Link href="#" className="text-[var(--color-primary)] hover:underline font-medium">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-[var(--color-primary)] hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.agreed && <p className="mt-1 text-xs text-red-500 pl-8">{errors.agreed}</p>}
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
                    {imageUploading ? "Uploading photo…" : "Creating account…"}
                  </>
                ) : (
                  "Create Account"
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
              onClick={handleGoogleSignUp}
              className="w-full border border-[var(--color-primary)] rounded-xl hover:bg-[var(--color-primary)]/5 py-4 px-5 flex items-center justify-center gap-3 text-[var(--color-primary)] transition duration-300 cursor-pointer font-medium"
            >
              <BsGoogle size={20} />
              Sign up with Google
            </button>

            <p className="mt-7 text-center text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-[var(--color-primary)] font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}