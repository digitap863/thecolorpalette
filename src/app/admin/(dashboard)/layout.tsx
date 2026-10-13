import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
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

  return (
    <div className="min-h-screen bg-[#f7f1eb] text-[#1c1917] flex flex-col md:flex-row selection:bg-[#c2a878]/30 selection:text-[#1c1917]">
      {/* Dedicated Admin Sidebar */}
      <AdminSidebar admin={admin} />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {children}
        </main>
        <footer className="border-t border-[#c2a878]/25 bg-[#f7f1eb] py-6 text-center text-xs text-[#1c1917]/60 font-poppins">
          <p>The Color Palette — Administrative Clinical Management Suite</p>
        </footer>
      </div>
    </div>
  );
}
