import Banner from "@/components/Banner";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <main className="flex-1 w-full">
        {/* Banner Section */}
        <Banner />

        {/* About Us Section */}
        <AboutSection />
      </main>
    </div>
  );
}
