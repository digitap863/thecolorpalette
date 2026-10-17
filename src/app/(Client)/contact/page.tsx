import ContactDetailsSection from "@/components/contact/ContactDetailsSection";
import BookingSection from "@/components/contact/BookingSection";
import FaqSection from "@/components/contact/FaqSection";
import FadeInSection from "@/components/common/FadeInSection";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <main className="flex-1 w-full">
        <FadeInSection>
          <BookingSection />
        </FadeInSection>

        <FadeInSection>
          <ContactDetailsSection />
        </FadeInSection>

        <FadeInSection>
          <FaqSection />
        </FadeInSection>
      </main>
    </div>
  );
}