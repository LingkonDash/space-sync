import { getHostBookings } from "@/lib/action/bookings";
import { Booking } from "@/types/bookings";
import HostBookingsTable from "./Hostbookingstable";

async function HostBookingsPage() {
  const hostBookings: Booking[] = await getHostBookings();
  

  return (
    <div className="min-h-screen bg-neutral-bg px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-neutral-text sm:text-2xl">
            Host Bookings
          </h1>
          <p className="mt-1 text-sm text-neutral-text/60">
            {hostBookings.length} booking{hostBookings.length !== 1 ? "s" : ""} total
          </p>
        </div>

        <HostBookingsTable bookings={hostBookings} />
      </div>
    </div>
  );
}

export default HostBookingsPage;