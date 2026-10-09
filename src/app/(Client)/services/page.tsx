import { Metadata } from "next";
import { Suspense } from "react";
import ServicesPage from "@/components/services/ServicesPage";
import LoadingSkeleton from "@/components/services/LoadingSkeleton";

export const metadata: Metadata = {
  title: "Our Treatments & Services | The Color Palette Aesthetic Studio",
  description:
    "Explore our range of advanced aesthetic, skin, hair, and scalp wellness treatments, thoughtfully selected for your individual care and beauty goals.",
  openGraph: {
    title: "Our Treatments & Services | The Color Palette Aesthetic Studio",
    description:
      "Explore our range of advanced aesthetic, skin, hair, and scalp wellness treatments at The Color Palette.",
    images: ["/images/about_clinical_studio.png"],
  },
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ServicesPage />
    </Suspense>
  );
}
