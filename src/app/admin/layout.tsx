import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Suite | The Color Palette",
  description: "Administrative clinical management portal for The Color Palette",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-poppins admin-theme min-h-screen antialiased">
      {children}
    </div>
  );
}
