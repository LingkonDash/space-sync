// app/dashboard/items/manage/page.tsx
import ManagePanel from "@/components/dashboard/ManagePanel";
import { manageValidator } from "@/utils/manageValidator";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

async function HostManagePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page || "1";

  const { role, canManage, roomData} =
    await manageValidator(`?page=${page}`);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              {role === "admin" ? "Manage all spaces" : "Manage your spaces"}
            </h1>
            <p className="text-sm text-slate-500 mt-1.5">
              {role === "admin"
                ? "Every listed space across the platform, in one place."
                : "Edit details or remove spaces you've listed."}
            </p>
          </div>
        </div>

        <ManagePanel
          role={role}
          canManage={canManage}
          initialRooms={roomData}
        />
      </div>
    </div>
  );
}

export default HostManagePage;