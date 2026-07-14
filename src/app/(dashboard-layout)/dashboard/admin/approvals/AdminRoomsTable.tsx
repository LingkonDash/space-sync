"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { updateRoomStatus } from "@/lib/action/admin/rooms";
import { FiMapPin, FiUsers, FiMail } from "react-icons/fi";
import { toast } from "react-toastify";

export type SpaceStatus = "pending" | "approved" | "rejected";

export interface Space {
    _id: string;
    title: string;
    shortDescription: string;
    images: string[];
    category: string;
    location: string;
    hostEmail: string;
    hostName: string;
    city: string;
    pricePerHour: number;
    capacity: number;
    status: SpaceStatus;
    createdAt?: string | Date;
}

// Soft, low-contrast badge tones
const statusStyles: Record<SpaceStatus, string> = {
    pending: "bg-[#F59E0B]/10 text-[#B45309]",
    approved: "bg-[#0D9488]/10 text-[#0F766E]",
    rejected: "bg-[#EF4444]/10 text-[#B91C1C]",
};

// Muted, low-contrast action buttons — tinted backgrounds instead of solid fills
const actionsMap: Record<SpaceStatus, { next: SpaceStatus; label: string; className: string }[]> = {
    pending: [
        { next: "approved", label: "Approve", className: "cursor-pointer bg-[#0D9488]/10 text-[#0F766E] hover:bg-[#0D9488]/15" },
        { next: "rejected", label: "Reject", className: "cursor-pointer bg-[#EF4444]/10 text-[#B91C1C] hover:bg-[#EF4444]/15" },
    ],
    approved: [
        { next: "rejected", label: "Reject", className: "cursor-pointer bg-[#EF4444]/10 text-[#B91C1C] hover:bg-[#EF4444]/15" },
        { next: "pending", label: "Set Pending", className: "cursor-pointer bg-[#F59E0B]/10 text-[#B45309] hover:bg-[#F59E0B]/15" },
    ],
    rejected: [
        { next: "approved", label: "Approve", className: "cursor-pointer bg-[#0D9488]/10 text-[#0F766E] hover:bg-[#0D9488]/15" },
        { next: "pending", label: "Set Pending", className: "cursor-pointer bg-[#F59E0B]/10 text-[#B45309] hover:bg-[#F59E0B]/15" },
    ],
};

export default function AdminRoomsTable({ rooms }: { rooms: Space[] }) {
    const [rows, setRows] = useState(rooms);

    if (rows.length === 0) return <EmptyState />;

    const handleStatusChange = (spaceId: string, newStatus: SpaceStatus) => {
        setRows((prev) => prev.map((r) => (r._id === spaceId ? { ...r, status: newStatus } : r)));
    };

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {rows.map((room) => (
                <RoomTile key={room._id} room={room} onStatusChange={handleStatusChange} />
            ))}
        </div>
    );
}

function StatusControl({
    room,
    onStatusChange,
}: {
    room: Space;
    onStatusChange: (spaceId: string, newStatus: SpaceStatus) => void;
}) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const actions = actionsMap[room.status];

    const handleClick = (next: SpaceStatus) => {
        setError(null);
        startTransition(async () => {
            try {
                const res = await updateRoomStatus(room._id, next);
                if (res && (res.acknowledged === false || res.modifiedCount === 0)) {
                    toast.error('Update failed. try again')
                    setError("Update failed.");
                    return;
                }
                toast.success(`Status updated to ${next}`)
                onStatusChange(room._id, next);
            } catch {
                setError("Something went wrong.");
                toast.error('something went wrong. try again')
            }
        });
    };

    return (
        <div className="flex flex-col gap-2">
            <span
                className={`inline-block w-fit whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${statusStyles[room.status]}`}
            >
                {room.status}
            </span>
            <div className="flex flex-wrap gap-1.5">
                {actions.map((action) => (
                    <button
                        key={action.next}
                        type="button"
                        onClick={() => handleClick(action.next)}
                        disabled={isPending}
                        className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${action.className}`}
                    >
                        {isPending ? "Updating…" : action.label}
                    </button>
                ))}
            </div>
            {error && <span className="text-[11px] text-[#B91C1C]">{error}</span>}
        </div>
    );
}

function RoomTile({
    room,
    onStatusChange,
}: {
    room: Space;
    onStatusChange: (spaceId: string, newStatus: SpaceStatus) => void;
}) {
    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-border bg-white shadow-sm">
            <div className="relative aspect-[4/3] w-full shrink-0 bg-neutral-bg">
                {room.images?.[0] ? (
                    <Image
                        src={room.images[0]}
                        alt={room.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-text/30">
                        No image
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-3.5">
                <div>
                    <p className="truncate text-sm font-medium text-neutral-text">{room.title}</p>
                    <p className="truncate text-xs text-neutral-text/50">{room.category}</p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-text/60">
                    <FiMapPin size={12} className="shrink-0 text-neutral-text/35" />
                    <span className="truncate">{room.city}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-text/60">
                    <FiMail size={12} className="shrink-0 text-neutral-text/35" />
                    <span className="truncate">{room.hostName}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-text/60">
                    <span className="font-semibold text-neutral-text">
                        ৳{Number(room.pricePerHour).toFixed(2)}/hr
                    </span>
                    <span className="flex items-center gap-1">
                        <FiUsers size={12} className="shrink-0 text-neutral-text/35" />
                        {room.capacity}
                    </span>
                </div>

                <div className="mt-auto pt-2">
                    <StatusControl room={room} onStatusChange={onStatusChange} />
                </div>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-border bg-white py-16 text-center">
            <p className="text-sm font-medium text-neutral-text">No spaces submitted yet</p>
            <p className="mt-1 text-sm text-neutral-text/50">
                Once hosts list a space, it will show up here for review.
            </p>
        </div>
    );
}