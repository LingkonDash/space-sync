// components/dashboard/host/ManagePanel.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { deleteRoom, editRoom } from "@/lib/action/host/rooms";
import uploadToImgBB from "@/utils/imgbb/uploadToImgBB";
import {
  MdEdit,
  MdDeleteOutline,
  MdClose,
  MdStar,
  MdGroups,
  MdLocationOn,
  MdCloudUpload,
  MdAddBox,
} from "react-icons/md";
import { LuLoaderCircle } from "react-icons/lu";

// ── Domain types ────────────────────────────────────────────────────
type CategoryCode = "co-working" | "meeting-room" | "event-hall" | "studio";
type CategoryLabel = "Co-working" | "Meeting Room" | "Event Hall" | "Studio";
type SpaceStatus = "pending" | "approved" | "rejected";

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
  rating: number;
  reviewCount: number;
  status: SpaceStatus;
  createdAt?: Date;
}

const CATEGORIES: { code: CategoryCode; label: CategoryLabel }[] = [
  { code: "co-working", label: "Co-working" },
  { code: "meeting-room", label: "Meeting Room" },
  { code: "event-hall", label: "Event Hall" },
  { code: "studio", label: "Studio" },
];

const STATUS_STYLES: Record<SpaceStatus, { bg: string; text: string; dot: string; label: string }> = {
  approved: { bg: "bg-[#0D9488]/10", text: "text-[#0D9488]", dot: "bg-[#0D9488]", label: "Approved" },
  pending: { bg: "bg-[#F59E0B]/10", text: "text-[#b45309]", dot: "bg-[#F59E0B]", label: "Pending" },
  rejected: { bg: "bg-red-50", text: "text-red-500", dot: "bg-red-400", label: "Rejected" },
};

interface ManagePanelProps {
  role: "host" | "admin";
  canManage: boolean;
  initialRooms: Space[];
}

interface FormErrors {
  [key: string]: string;
}

interface EditableImage {
  url: string;
  isNew?: boolean;
  file?: File;
  status?: "pending" | "uploading" | "done" | "error";
}

export default function ManagePanel({
  role,
  canManage,
  initialRooms,
}: ManagePanelProps) {
  const [rooms, setRooms] = useState<Space[]>(initialRooms);
  const [editTarget, setEditTarget] = useState<Space | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Space | null>(null);

  if (!canManage) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-10 text-center">
        <p className="text-slate-500 text-sm">
          You don&apos;t have permission to manage spaces.
        </p>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-[#E2E8F0] p-10 text-center">
        <p className="text-slate-600 font-medium mb-1">
          {role === "admin" ? "No spaces have been listed yet." : "You haven't listed any spaces yet."}
        </p>
        <p className="text-sm text-slate-400 mb-5">
          {role === "admin"
            ? "Spaces will show up here once hosts start adding them."
            : "Add your first space to start receiving bookings."}
        </p>
        {role === "host" && (
          <Link
            href="/dashboard/item/add"
            className="inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338ca] text-white font-medium text-sm px-5 py-2.5 shadow-md shadow-[#4F46E5]/25 transition-all"
          >
            <MdAddBox className="size-4" />
            Add a space
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm divide-y divide-[#E2E8F0]">
        {/* Desktop / tablet header row */}
        <div className="hidden md:grid grid-cols-[64px_2.2fr_1.3fr_0.8fr_0.9fr_0.9fr] gap-4 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          <span />
          <span>Space</span>
          <span>Details</span>
          <span>Price</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {rooms.map((room) => {
          const statusStyle = STATUS_STYLES[room.status];
          return (
            <div key={room._id}>
              {/* Mobile card view */}
              <div className="md:hidden p-4 flex gap-3">
                <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                  {room.images[0] && (
                    <img
                      src={room.images[0]}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-semibold text-[#4F46E5] uppercase tracking-wide block mb-0.5">
                    {room.category}
                  </span>
                  <h3 className="font-semibold text-[#0F172A] text-[15px] leading-snug truncate">
                    {room.title}
                  </h3>
                  {role === "admin" && (
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {room.hostName} · {room.hostEmail}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1.5">
                    <span className="flex items-center gap-1">
                      <MdLocationOn className="size-3.5 text-slate-400" />
                      {room.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <MdGroups className="size-3.5 text-slate-400" />
                      {room.capacity}
                    </span>
                    <span className="flex items-center gap-1">
                      <MdStar className="size-3.5 text-[#F59E0B]" />
                      {room.rating.toFixed(1)} ({room.reviewCount})
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#0F172A] text-sm">
                        ৳{room.pricePerHour}
                        <span className="text-slate-400 font-normal text-xs">/hr</span>
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        {statusStyle.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditTarget(room)}
                        className="p-2 rounded-lg text-slate-500 hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] transition-all"
                        aria-label="Edit space"
                      >
                        <MdEdit className="size-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(room)}
                        className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
                        aria-label="Delete space"
                      >
                        <MdDeleteOutline className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop / tablet table row */}
              <div className="hidden md:grid grid-cols-[64px_2.2fr_1.3fr_0.8fr_0.9fr_0.9fr] gap-4 items-center px-5 py-4">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100">
                  {room.images[0] && (
                    <img
                      src={room.images[0]}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-[#4F46E5] uppercase tracking-wide block mb-0.5">
                    {room.category}
                  </span>
                  <h3 className="font-semibold text-[#0F172A] text-[15px] leading-snug truncate">
                    {room.title}
                  </h3>
                  {role === "admin" && (
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {room.hostName} · {room.hostEmail}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1 text-xs text-slate-500 min-w-0">
                  <span className="flex items-center gap-1 truncate">
                    <MdLocationOn className="size-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{room.city}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MdGroups className="size-3.5 text-slate-400 shrink-0" />
                    {room.capacity}
                  </span>
                  <span className="flex items-center gap-1">
                    <MdStar className="size-3.5 text-[#F59E0B] shrink-0" />
                    {room.rating.toFixed(1)} ({room.reviewCount})
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-[#0F172A] text-sm whitespace-nowrap">
                    ৳{room.pricePerHour}
                    <span className="text-slate-400 font-normal text-xs">/hr</span>
                  </span>
                </div>

                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {statusStyle.label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 justify-end">
                  <button
                    onClick={() => setEditTarget(room)}
                    className="p-2 rounded-lg text-slate-500 hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] transition-all"
                    aria-label="Edit space"
                  >
                    <MdEdit className="size-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(room)}
                    className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
                    aria-label="Delete space"
                  >
                    <MdDeleteOutline className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editTarget && (
        <EditModal
          room={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={(updated) => {
            setRooms((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
            setEditTarget(null);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          room={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={(id) => {
            setRooms((prev) => prev.filter((r) => r._id !== id));
            setDeleteTarget(null);
          }}
        />
      )}
    </>
  );
}

// ─── Delete Confirmation Modal ───────────────────────────────────────
function DeleteModal({
  room,
  onClose,
  onDeleted,
}: {
  room: Space;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!room._id) return;
    setIsDeleting(true);
    try {
      const res = await deleteRoom(room._id);
      if (res?.acknowledged && res.deletedCount > 0) {
        toast.success("Space deleted successfully.");
        onDeleted(room._id);
      } else {
        toast.error("Couldn't delete this space. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while deleting. Try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="font-semibold text-[#0F172A] text-lg mb-2">Delete this space?</h3>
        <p className="text-sm text-slate-500 mb-6">
          <span className="font-medium text-slate-700">{room.title}</span> will be permanently
          removed. This can&apos;t be undone.
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium text-sm px-4 py-2.5 transition-all"
          >
            {isDeleting && <LuLoaderCircle className="animate-spin size-4" />}
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────
function EditModal({
  room,
  onClose,
  onSaved,
}: {
  room: Space;
  onClose: () => void;
  onSaved: (updated: Space) => void;
}) {
  const [title, setTitle] = useState(room.title);
  const [shortDescription, setShortDescription] = useState(room.shortDescription);
  const [fullDescription, setFullDescription] = useState(room.fullDescription || "");
  const [categoryCode, setCategoryCode] = useState<CategoryCode>(room.categoryCode);
  const [location, setLocation] = useState(room.location);
  const [city, setCity] = useState(room.city);
  const [pricePerHour, setPricePerHour] = useState(String(room.pricePerHour));
  const [capacity, setCapacity] = useState(String(room.capacity));
  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState<string[]>(room.amenities || []);
  const [images, setImages] = useState<EditableImage[]>(
    room.images.map((url) => ({ url, status: "done" }))
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const addAmenity = () => {
    const trimmed = amenityInput.trim();
    if (trimmed && !amenities.includes(trimmed)) setAmenities((prev) => [...prev, trimmed]);
    setAmenityInput("");
  };

  const removeAmenity = (a: string) => setAmenities((prev) => prev.filter((x) => x !== a));

  const handleAddPhotos = (fileList: FileList | null) => {
    if (!fileList) return;
    const newImages: EditableImage[] = Array.from(fileList).map((file) => ({
      url: URL.createObjectURL(file),
      isNew: true,
      file,
      status: "pending",
    }));
    setImages((prev) => [...prev, ...newImages]);
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!title.trim()) next.title = "Title is required";
    if (!shortDescription.trim()) next.shortDescription = "Short description is required";
    if (!location.trim()) next.location = "Location is required";
    if (!city.trim()) next.city = "City is required";

    const price = Number(pricePerHour);
    if (!pricePerHour || isNaN(price) || price <= 0) next.pricePerHour = "Enter a valid price";

    const cap = Number(capacity);
    if (!capacity || isNaN(cap) || cap <= 0 || !Number.isInteger(cap))
      next.capacity = "Enter a valid whole number";

    if (images.length < 2) next.images = "At least 2 photos are required";

    return next;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    if (!room._id) return;

    setIsSaving(true);
    try {
      const finalUrls: string[] = [];

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (!img.isNew) {
          finalUrls.push(img.url);
          continue;
        }
        setImages((prev) => {
          const next = [...prev];
          next[i] = { ...next[i], status: "uploading" };
          return next;
        });
        const hostedUrl = await uploadToImgBB(img.file as File);
        if (!hostedUrl) {
          setImages((prev) => {
            const next = [...prev];
            next[i] = { ...next[i], status: "error" };
            return next;
          });
          throw new Error(`Failed to upload photo ${i + 1}`);
        }
        finalUrls.push(hostedUrl);
      }

      const selectedCategory = CATEGORIES.find((c) => c.code === categoryCode)!;

      const updatedRoom: Space = {
        ...room,
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim() || undefined,
        images: finalUrls,
        categoryCode: selectedCategory.code,
        category: selectedCategory.label,
        location: location.trim(),
        city: city.trim(),
        pricePerHour: Number(pricePerHour),
        capacity: Number(capacity),
        amenities: amenities.length > 0 ? amenities : undefined,
      };

      const res = await editRoom(updatedRoom, room._id);

      if (res?.acknowledged && res.modifiedCount >= 0) {
        toast.success("Space updated successfully.");
        onSaved(updatedRoom);
      } else {
        toast.error("Couldn't save changes. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between z-10">
          <h3 className="font-semibold text-[#0F172A] text-lg">Edit space</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
          >
            <MdClose className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 transition-all ${
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
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 transition-all ${
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
              rows={3}
              className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.code}
                  type="button"
                  onClick={() => setCategoryCode(cat.code)}
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
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 transition-all ${
                  errors.location ? "border-red-400" : "border-[#E2E8F0]"
                }`}
              />
              {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 transition-all ${
                  errors.city ? "border-red-400" : "border-[#E2E8F0]"
                }`}
              />
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Price per hour (৳)
              </label>
              <input
                type="number"
                min={0}
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 transition-all ${
                  errors.pricePerHour ? "border-red-400" : "border-[#E2E8F0]"
                }`}
              />
              {errors.pricePerHour && (
                <p className="text-xs text-red-500 mt-1">{errors.pricePerHour}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Capacity</label>
              <input
                type="number"
                min={0}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 transition-all ${
                  errors.capacity ? "border-red-400" : "border-[#E2E8F0]"
                }`}
              />
              {errors.capacity && <p className="text-xs text-red-500 mt-1">{errors.capacity}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Amenities</label>
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
                placeholder="e.g. Wi-Fi, Projector"
                className="flex-1 rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 transition-all"
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
                    <button type="button" onClick={() => removeAmenity(a)} className="hover:text-red-500">
                      <MdClose className="size-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-slate-700">Photos</label>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  images.length >= 2 ? "bg-[#0D9488]/10 text-[#0D9488]" : "bg-slate-100 text-slate-500"
                }`}
              >
                {images.length} / 2 minimum
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-[#E2E8F0] group">
                  <img src={img.url} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                  {img.status === "uploading" && (
                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                      <LuLoaderCircle className="animate-spin text-white size-5" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-slate-900/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MdClose className="size-3" />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-xl border-2 border-dashed border-[#E2E8F0] hover:border-[#4F46E5]/40 hover:bg-[#4F46E5]/5 flex flex-col items-center justify-center cursor-pointer transition-all">
                <MdCloudUpload className="size-5 text-slate-400" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleAddPhotos(e.target.files)}
                />
              </label>
            </div>
            {errors.images && <p className="text-xs text-red-500 mt-1.5">{errors.images}</p>}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-[#E2E8F0] px-6 py-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338ca] disabled:bg-slate-300 text-white font-medium text-sm px-5 py-2.5 shadow-md shadow-[#4F46E5]/25 transition-all"
          >
            {isSaving && <LuLoaderCircle className="animate-spin size-4" />}
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}