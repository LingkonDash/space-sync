"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { addRoom } from "@/lib/action/host/rooms";
import uploadToImgBB from "@/utils/imgbb/uploadToImgBB";
import {
  MdCloudUpload,
  MdClose,
  MdMeetingRoom,
  MdLocationOn,
  MdAttachMoney,
  MdGroups,
  MdLocalOffer,
} from "react-icons/md";
import { LuLoaderCircle } from "react-icons/lu";
import { CategoryCode, CategoryLabel } from "@/types/space";

interface Space {
  _id?: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  images: string[];
  categoryCode: CategoryCode;
  category: CategoryLabel;
  location: string;
  hostEmail: string;
  hostName: string;
  city: string;
  pricePerHour: number;
  capacity: number;
  amenities?: string[];
}

const CATEGORIES: { code: CategoryCode; label: CategoryLabel }[] = [
  { code: "co-working", label: "Co-working" },
  { code: "meeting-room", label: "Meeting Room" },
  { code: "event-hall", label: "Event Hall" },
  { code: "studio", label: "Studio" },
];

interface UploadedImage {
  file: File;
  previewUrl: string;
  status: "pending" | "uploading" | "done" | "error";
  hostedUrl?: string;
}

interface FormErrors {
  [key: string]: string;
}

function AddItemsPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [categoryCode, setCategoryCode] = useState<CategoryCode | "">("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [capacity, setCapacity] = useState("");
  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Image handling ──────────────────────────────────────────────
  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList) return;
    const newImages: UploadedImage[] = Array.from(fileList).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      status: "pending",
    }));
    setImages((prev) => [...prev, ...newImages]);
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].previewUrl);
      next.splice(index, 1);
      return next;
    });
  };

  const addAmenity = () => {
    const trimmed = amenityInput.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities((prev) => [...prev, trimmed]);
    }
    setAmenityInput("");
  };

  const removeAmenity = (a: string) => {
    setAmenities((prev) => prev.filter((item) => item !== a));
  };

  // ── Validation ───────────────────────────────────────────────────
  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!title.trim()) next.title = "Title is required";
    if (!shortDescription.trim()) next.shortDescription = "Short description is required";
    if (!categoryCode) next.categoryCode = "Select a category";
    if (!location.trim()) next.location = "Location is required";
    if (!city.trim()) next.city = "City is required";

    const price = Number(pricePerHour);
    if (!pricePerHour || isNaN(price) || price <= 0) {
      next.pricePerHour = "Enter a valid price greater than 0";
    }

    const cap = Number(capacity);
    if (!capacity || isNaN(cap) || cap <= 0 || !Number.isInteger(cap)) {
      next.capacity = "Enter a valid whole number greater than 0";
    }

    if (images.length < 2) {
      next.images = "Upload at least 2 photos to continue";
    }

    return next;
  };

  // ── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted fields before continuing.");
      return;
    }

    if (!session?.user?.email) {
      toast.error("You must be signed in as a host to add a space.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload only images that haven't been uploaded yet
      const uploadedUrls: string[] = [];

      for (let i = 0; i < images.length; i++) {
        const img = images[i];

        if (img.hostedUrl) {
          uploadedUrls.push(img.hostedUrl);
          continue;
        }

        setImages((prev) => {
          const next = [...prev];
          next[i] = { ...next[i], status: "uploading" };
          return next;
        });

        const hostedUrl = await uploadToImgBB(img.file);

        if (!hostedUrl) {
          setImages((prev) => {
            const next = [...prev];
            next[i] = { ...next[i], status: "error" };
            return next;
          });
          throw new Error(`Failed to upload image ${i + 1}`);
        }

        setImages((prev) => {
          const next = [...prev];
          next[i] = { ...next[i], status: "done", hostedUrl };
          return next;
        });

        uploadedUrls.push(hostedUrl);
      }

      const selectedCategory = CATEGORIES.find((c) => c.code === categoryCode)!;

      const space: Space = {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim() || undefined,
        images: uploadedUrls,
        categoryCode: selectedCategory.code,
        category: selectedCategory.label,
        location: location.trim(),
        city: city.trim(),
        hostEmail: session.user.email,
        hostName: session.user.name || "Host",
        pricePerHour: Number(pricePerHour),
        capacity: Number(capacity),
        amenities: amenities.length > 0 ? amenities : undefined,
      };

      const res = await addRoom(space);

      if (res?.acknowledged) {
        toast.success("Space added successfully!");
        router.push("/dashboard/items/manage");
      } else {
        toast.error("Something went wrong while adding your space. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            List a new space
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Add the details below and we&apos;ll get it queued for approval.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Basic Info ── */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <MdMeetingRoom className="text-[#4F46E5] size-5" />
              <h2 className="font-semibold text-[#0F172A]">Basic information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sunlit Rooftop Meeting Room"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 transition-all ${
                    errors.title ? "border-red-400" : "border-[#E2E8F0]"
                  }`}
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Short description
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="One line that sells the space"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 transition-all ${
                    errors.shortDescription ? "border-red-400" : "border-[#E2E8F0]"
                  }`}
                />
                {errors.shortDescription && (
                  <p className="text-xs text-red-500 mt-1">{errors.shortDescription}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full description <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the space, layout, and what makes it a good fit"
                  className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.code}
                      type="button"
                      onClick={() => {
                        setCategoryCode(cat.code);
                        setErrors((prev) => ({ ...prev, categoryCode: "" }));
                      }}
                      className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
                        categoryCode === cat.code
                          ? "border-[#4F46E5] bg-[#4F46E5]/5 text-[#4F46E5]"
                          : "border-[#E2E8F0] text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                {errors.categoryCode && (
                  <p className="text-xs text-red-500 mt-1">{errors.categoryCode}</p>
                )}
              </div>
            </div>
          </section>

          {/* ── Location & Pricing ── */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <MdLocationOn className="text-[#4F46E5] size-5" />
              <h2 className="font-semibold text-[#0F172A]">Location & pricing</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Address / Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. House 12, Road 4, Banani"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 transition-all ${
                    errors.location ? "border-red-400" : "border-[#E2E8F0]"
                  }`}
                />
                {errors.location && (
                  <p className="text-xs text-red-500 mt-1">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Dhaka"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 transition-all ${
                    errors.city ? "border-red-400" : "border-[#E2E8F0]"
                  }`}
                />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Price per hour (৳)
                </label>
                <div className="relative">
                  <MdAttachMoney className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <input
                    type="number"
                    min={0}
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(e.target.value)}
                    placeholder="500"
                    className={`w-full rounded-xl border pl-9 pr-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 transition-all ${
                      errors.pricePerHour ? "border-red-400" : "border-[#E2E8F0]"
                    }`}
                  />
                </div>
                {errors.pricePerHour && (
                  <p className="text-xs text-red-500 mt-1">{errors.pricePerHour}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Capacity
                </label>
                <div className="relative">
                  <MdGroups className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <input
                    type="number"
                    min={0}
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="Number of people"
                    className={`w-full rounded-xl border pl-9 pr-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 transition-all ${
                      errors.capacity ? "border-red-400" : "border-[#E2E8F0]"
                    }`}
                  />
                </div>
                {errors.capacity && (
                  <p className="text-xs text-red-500 mt-1">{errors.capacity}</p>
                )}
              </div>
            </div>
          </section>

          {/* ── Amenities ── */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <MdLocalOffer className="text-[#4F46E5] size-5" />
              <h2 className="font-semibold text-[#0F172A]">
                Amenities <span className="text-slate-400 font-normal text-sm">(optional)</span>
              </h2>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAmenity();
                  }
                }}
                placeholder="e.g. Wi-Fi, Projector, Whiteboard"
                className="flex-1 rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 transition-all"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="rounded-xl border border-[#E2E8F0] px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
              >
                Add
              </button>
            </div>

            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {amenities.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B]/10 text-[#b45309] text-xs font-medium px-3 py-1.5"
                  >
                    {a}
                    <button
                      type="button"
                      onClick={() => removeAmenity(a)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <MdClose className="size-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* ── Photos ── */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <MdCloudUpload className="text-[#4F46E5] size-5" />
                <h2 className="font-semibold text-[#0F172A]">Photos</h2>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  images.length >= 2
                    ? "bg-[#0D9488]/10 text-[#0D9488]"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {images.length} / 2 minimum
              </span>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`w-full rounded-xl border-2 border-dashed py-8 flex flex-col items-center justify-center gap-2 transition-all ${
                errors.images
                  ? "border-red-300 bg-red-50/40"
                  : "border-[#E2E8F0] hover:border-[#4F46E5]/40 hover:bg-[#4F46E5]/5"
              }`}
            >
              <MdCloudUpload className="size-7 text-slate-400" />
              <p className="text-sm text-slate-500">
                Click to upload photos <span className="text-slate-400">(at least 2)</span>
              </p>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            {errors.images && <p className="text-xs text-red-500 mt-1.5">{errors.images}</p>}

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden border border-[#E2E8F0] group"
                  >
                    <img
                      src={img.previewUrl}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {img.status === "uploading" && (
                      <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                        <LuLoaderCircle className="animate-spin text-white size-6" />
                      </div>
                    )}
                    {img.status === "error" && (
                      <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Failed</span>
                      </div>
                    )}
                    {!isSubmitting && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1.5 right-1.5 bg-slate-900/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MdClose className="size-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Submit ── */}
          <div className="flex justify-end pb-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338ca] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium text-sm px-6 py-3 shadow-md shadow-[#4F46E5]/25 transition-all active:scale-[0.98]"
            >
              {isSubmitting && <LuLoaderCircle className="animate-spin size-4" />}
              {isSubmitting ? "Adding space..." : "Add Space"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItemsPage;