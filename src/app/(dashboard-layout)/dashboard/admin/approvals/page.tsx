import { FiHome, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { getAdminRooms } from "@/lib/api/rooms";
import AdminRoomsTable from "./AdminRoomsTable";

export type CategoryCode = "co-working" | "meeting-room" | "event-hall" | "studio";
export type CategoryLabel = "Co-working" | "Meeting Room" | "Event Hall" | "Studio";
export type SpaceStatus = "pending" | "approved" | "rejected";

export interface Space {
  _id: string;
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
  createdAt?: string | Date;
}

async function AdminApprovalPage() {
  const rooms: Space[] = await getAdminRooms();

  const totalRooms = rooms.length;
  const pendingCount = rooms.filter((r) => r.status === "pending").length;
  const approvedCount = rooms.filter((r) => r.status === "approved").length;
  const rejectedCount = rooms.filter((r) => r.status === "rejected").length;

  return (
    <div className="min-h-screen bg-neutral-bg px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-neutral-text sm:text-2xl">
            Space Approvals
          </h1>
          <p className="mt-1 text-sm text-neutral-text/60">
            Review and moderate spaces submitted by hosts
          </p>
        </div>

        {/* Stat cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={<FiHome size={20} />}
            label="Total spaces"
            value={totalRooms.toString()}
            accent="text-neutral-text"
            bg="bg-neutral-text/5"
          />
          <StatCard
            icon={<FiClock size={20} />}
            label="Pending"
            value={pendingCount.toString()}
            accent="text-[#F59E0B]"
            bg="bg-[#F59E0B]/10"
          />
          <StatCard
            icon={<FiCheckCircle size={20} />}
            label="Approved"
            value={approvedCount.toString()}
            accent="text-[#0D9488]"
            bg="bg-[#0D9488]/10"
          />
          <StatCard
            icon={<FiXCircle size={20} />}
            label="Rejected"
            value={rejectedCount.toString()}
            accent="text-red-600"
            bg="bg-red-500/10"
          />
        </div>

        <AdminRoomsTable rooms={rooms} />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  bg: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm">
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${accent}`}>
        {icon}
      </div>
      <p className="text-xs text-neutral-text/50">{label}</p>
      <p className="mt-1 text-xl font-semibold text-neutral-text">{value}</p>
    </div>
  );
}

export default AdminApprovalPage;