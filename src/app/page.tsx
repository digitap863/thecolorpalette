import Banner from "@/components/home/Banner";
import AboutSection from "@/components/home/AboutSection";
import VideoSection from "@/components/home/VideoSection";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import BookingSection from "@/components/contact/BookingSection";
import FaqSection from "@/components/contact/FaqSection";
 
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
        
        {/* Features Grid Section */}
        <FeaturesSection />

        {/* Customer Testimonials Section */}
        <TestimonialSection />


        {/* Book A Seat / Contact Section */}
        <BookingSection />
      
        {/* FAQ Section */}
        <FaqSection />
      </main>

    </div>
  );
}
