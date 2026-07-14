"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import uploadToImgBB from "@/utils/imgbb/uploadToImgBB";
import { FiLoader } from "react-icons/fi";
import { RxCrosshair2 } from "react-icons/rx";
import { MdOutlineCameraAlt } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { SessionUser } from "@/types/auth";

interface EditProfileModalProps {
  user: SessionUser;
  onClose: () => void;
  onUpdated: (updated: Partial<SessionUser>) => void;
}

export default function EditProfileModal({
  user,
  onClose,
  onUpdated,
}: EditProfileModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user.name);
  const [imagePreview, setImagePreview] = useState<string | null | undefined>(
    user.image
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name can't be empty.");
      return;
    }

    setSaving(true);
    try {
      let imageUrl = user.image;

      if (imageFile) {
        imageUrl = await uploadToImgBB(imageFile);
      }

      // Only name + image are editable — email/role/banned are excluded on purpose.
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: imageUrl,
      });

      if (error) {
        toast.error(error.message ?? "Failed to update profile.");
        return;
      }

      toast.success("Profile updated successfully.");
      onUpdated({ name: name.trim(), image: imageUrl });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating your profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-text">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-neutral-text/50 transition hover:bg-neutral-bg"
          >
            <IoCloseSharp size={20} />
          </button>
        </div>

        {/* Avatar upload */}
        <div className="mb-5 flex justify-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative h-24 w-24 overflow-hidden rounded-full border-2 border-neutral-border"
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Profile preview"
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-neutral-bg text-2xl font-semibold text-neutral-text/40">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
              <MdOutlineCameraAlt size={20} className="text-white" />
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* Editable field */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-neutral-text">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-neutral-border px-3 py-2 text-sm text-neutral-text outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
          />
        </div>

        {/* Locked fields — shown, not editable */}
        <div className="mb-2">
          <label className="mb-1 block text-sm font-medium text-neutral-text/50">
            Email
          </label>
          <input
            type="text"
            value={user.email}
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-neutral-border bg-neutral-bg px-3 py-2 text-sm text-neutral-text/50"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-neutral-text/50">
            Role
          </label>
          <input
            type="text"
            value={user.userRole}
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-neutral-border bg-neutral-bg px-3 py-2 text-sm capitalize text-neutral-text/50"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-neutral-border px-4 py-2 text-sm font-medium text-neutral-text transition hover:bg-neutral-bg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4338CA] disabled:opacity-60"
          >
            {saving && <FiLoader size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}