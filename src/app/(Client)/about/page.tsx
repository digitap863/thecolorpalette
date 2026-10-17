import AboutBannerSection from "@/components/about/AboutBannerSection";
import AboutStudioSection from "@/components/about/AboutStudioSection";
import ValuesSection from "@/components/about/ValuesSection";
import ExpertsSection from "@/components/about/ExpertsSection";
import BookingSection from "@/components/contact/BookingSection";
import FaqSection from "@/components/contact/FaqSection";
import FadeInSection from "@/components/common/FadeInSection";

export default function AboutPage() { 
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <main className="flex-1 w-full">
        {/* About Page Banner */}
        <FadeInSection>
          <AboutBannerSection />
        </FadeInSection>

        {/* New Luxury Aesthetic Studio Overview Section */}
        <FadeInSection>
          <AboutStudioSection />
        </FadeInSection>

        {/* Our Values Section */}
        <FadeInSection>
          <ValuesSection />
        </FadeInSection>

        {/* Our Experts / Team Section */}
        <FadeInSection>
          <ExpertsSection />
        </FadeInSection>

        {/* Booking / Reserve Form */}
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
