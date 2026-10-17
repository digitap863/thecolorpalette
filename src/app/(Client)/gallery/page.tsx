import GalleryBannerSection from "@/components/gallery/GalleryBannerSection";
import GalleryGridSection from "@/components/gallery/GalleryGridSection";
import BookingSection from "@/components/contact/BookingSection";
import FadeInSection from "@/components/common/FadeInSection";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#f7f1eb] text-black flex flex-col">
      <main className="flex-1 w-full bg-[#f7f1eb]">
        <FadeInSection>
          <GalleryBannerSection />
        </FadeInSection>

        <FadeInSection>
          <GalleryGridSection />
        </FadeInSection>

        <FadeInSection>
          <BookingSection />
        </FadeInSection>
      </main>
    </div>
  );
}
