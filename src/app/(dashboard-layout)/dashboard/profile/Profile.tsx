"use client";

import { useState } from "react";
import Image from "next/image";
import { BiPencil } from "react-icons/bi";
import { RiMvAiLine } from "react-icons/ri";
import { BsShieldCheck } from "react-icons/bs";
import { LuShieldAlert } from "react-icons/lu";
import { LiaCalendarDaySolid } from "react-icons/lia";
import EditProfileModal from "./EditProfileModal";
import { SessionUser } from "@/types/auth";

export type Role = "user" | "host" | "admin";


const roleStyles: Record<Role, string> = {
  admin: "bg-[#F59E0B]/15 text-[#F59E0B]",
  host: "bg-[#4F46E5]/15 text-[#4F46E5]",
  user: "bg-[#0D9488]/15 text-[#0D9488]",
};

export default function Profile({ user }: { user: SessionUser }) {
  const [editOpen, setEditOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  const joined = new Date(currentUser.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl my-auto">
      <div className="overflow-hidden rounded-2xl border border-neutral-border bg-white shadow-sm">
        {/* Banner */}
        <div className="h-28 w-full bg-gradient-to-r from-[#4F46E5] to-[#0D9488] sm:h-36" />

        <div className="px-5 pb-6 sm:px-8">
          {/* Avatar + edit button */}
          <div className="-mt-14 flex flex-col items-start justify-between gap-4 sm:-mt-16 sm:flex-row sm:items-end">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-neutral-bg shadow-md sm:h-32 sm:w-32">
              {currentUser.image ? (
                <Image
                  src={currentUser.image}
                  alt={currentUser.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-neutral-text/40">
                  {currentUser.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4338CA] active:scale-95"
            >
              <BiPencil size={16} />
              Edit Profile
            </button>
          </div>

          {/* Name + role */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold text-neutral-text sm:text-2xl">
              {currentUser.name}
            </h1>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${roleStyles[currentUser.userRole as Role]}`}
            >
              {currentUser.userRole}
            </span>
          </div>

          {/* Info list */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-neutral-border bg-neutral-bg px-4 py-3">
              <RiMvAiLine size={18} className="shrink-0 text-neutral-text/50" />
              <div className="min-w-0">
                <p className="text-xs text-neutral-text/50">Email</p>
                <p className="truncate text-sm font-medium text-neutral-text">
                  {currentUser.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-neutral-border bg-neutral-bg px-4 py-3">
              {currentUser.emailVerified ? (
                <BsShieldCheck size={18} className="shrink-0 text-[#0D9488]" />
              ) : (
                <LuShieldAlert size={18} className="shrink-0 text-[#F59E0B]" />
              )}
              <div>
                <p className="text-xs text-neutral-text/50">Verification</p>
                <p className="text-sm font-medium text-neutral-text">
                  {currentUser.emailVerified ? "Verified" : "Not verified"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-neutral-border bg-neutral-bg px-4 py-3 sm:col-span-2">
              <LiaCalendarDaySolid size={18} className="shrink-0 text-neutral-text/50" />
              <div>
                <p className="text-xs text-neutral-text/50">Member since</p>
                <p className="text-sm font-medium text-neutral-text">{joined}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editOpen && (
        <EditProfileModal
          user={currentUser}
          onClose={() => setEditOpen(false)}
          onUpdated={(updated) =>
            setCurrentUser((prev) => ({ ...prev, ...updated }))
          }
        />
      )}
    </div>
  );
}