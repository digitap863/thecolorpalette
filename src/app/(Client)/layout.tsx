import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { ServicesProvider } from "@/context/ServicesContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ServicesProvider>
      <Navbar />
      <div className="flex-1 w-full flex flex-col">{children}</div>
      <Footer />
    </ServicesProvider>
  );
}
