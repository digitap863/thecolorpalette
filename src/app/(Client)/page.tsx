import Banner from "@/components/home/Banner";
import AboutSection from "@/components/home/AboutSection";
import VideoSection from "@/components/home/VideoSection";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import VideoTestimonialsSection from "@/components/home/VideoTestimonialsSection";
import BookingSection from "@/components/contact/BookingSection";
import FaqSection from "@/components/contact/FaqSection";
import FadeInSection from "@/components/common/FadeInSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f1eb] text-black flex flex-col">
      <main className="flex-1 w-full bg-[#f7f1eb]">
        {/* Banner Section */}
        <FadeInSection>
          <Banner />
        </FadeInSection>

        {/* About Us Section */}
        <FadeInSection>
          <AboutSection />
        </FadeInSection>

        {/* Fullscreen Autoplay Video Section */}
        <FadeInSection>
          <VideoSection />
        </FadeInSection>

        {/* Services Section */}
        <FadeInSection>
          <ServicesSection />
        </FadeInSection>

        {/* Features Grid Section */}
        <FadeInSection>
          <FeaturesSection />
        </FadeInSection>

        {/* Customer Testimonials Section */}
        <FadeInSection>
          <TestimonialSection />
        </FadeInSection>

        {/* Video Testimonials Section */}
        <FadeInSection>
          <VideoTestimonialsSection />
        </FadeInSection>

        {/* Book A Seat / Contact Section */}
        <FadeInSection>
          <BookingSection />
        </FadeInSection>

        {/* FAQ Section */}
        <FadeInSection>
          <FaqSection />
        </FadeInSection>
      </main>
    </div>
  );
}
