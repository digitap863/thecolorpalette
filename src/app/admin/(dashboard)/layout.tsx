import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  await dbConnect();
  const pendingCount = await Booking.countDocuments({ status: "pending" }).catch(() => 0);

  return (
    <div className="min-h-screen bg-[#f7f1eb] text-[#1c1917] font-poppins flex flex-col md:flex-row selection:bg-[#c2a878]/30 selection:text-[#1c1917] antialiased">
      {/* Admin Sidebar */}
      <AdminSidebar admin={admin} pendingCount={pendingCount} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {children}
        </main>
        <footer className="border-t border-[#c2a878]/25 py-5 px-6 text-center text-xs text-[#1c1917]/60">
          <p>© {new Date().getFullYear()} The Color Palette · Clinical Administration</p>
        </footer>
      </div>
    </div>
  );
}
