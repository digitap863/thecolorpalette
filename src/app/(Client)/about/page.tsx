import AboutBannerSection from "@/components/about/AboutBannerSection";
import AboutStudioSection from "@/components/about/AboutStudioSection";
import AboutSection from "@/components/home/AboutSection";
import ValuesSection from "@/components/about/ValuesSection";
import ExpertsSection from "@/components/about/ExpertsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import BookingSection from "@/components/contact/BookingSection";
import FaqSection from "@/components/contact/FaqSection";

export default function AboutPage() { 
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <main className="flex-1 w-full">
        {/* About Page Banner with ~80vh height & testimonial image */}
        <AboutBannerSection />

        {/* New Luxury Aesthetic Studio Overview Section */}
        <AboutStudioSection />

       

        {/* Our Values Section */}
        <ValuesSection />

        {/* Our Experts / Team Section */}
        <ExpertsSection />

        {/* Booking / Reserve Form */}
        <BookingSection />

        <FaqSection/>
      </main>
    </div>
  );
}
