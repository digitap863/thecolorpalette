import Banner from "@/components/Banner";
import AboutSection from "@/components/AboutSection";
import VideoSection from "@/components/VideoSection";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <main className="flex-1 w-full">
        {/* Banner Section */}
        <Banner />

        {/* About Us Section */}
        <AboutSection />

        {/* Fullscreen Autoplay Video Section */}
        <VideoSection />

        {/* Services Section */}
        <ServicesSection />
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
