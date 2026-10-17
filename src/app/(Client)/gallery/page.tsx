import GalleryBannerSection from "@/components/gallery/GalleryBannerSection";
import GalleryGridSection from "@/components/gallery/GalleryGridSection";
import BookingSection from "@/components/contact/BookingSection";
import FadeInSection from "@/components/common/FadeInSection";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <main className="flex-1 w-full">
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
