import GalleryBannerSection from "@/components/gallery/GalleryBannerSection";
import GalleryGridSection from "@/components/gallery/GalleryGridSection";
import BookingSection from "@/components/contact/BookingSection";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <main className="flex-1 w-full">
        <GalleryBannerSection />
        <GalleryGridSection />
        <BookingSection />
      </main>
    </div>
  );
}
