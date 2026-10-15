"use client";

import { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ServicesHero from "./ServicesHero";
import ServiceFilters from "./ServiceFilters";
import CategoryNavigation from "./CategoryNavigation";
import ServiceCategorySection from "./ServiceCategorySection";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import ServiceDetailModal from "./ServiceDetailModal";
import { useServicesContext } from "@/context/ServicesContext";
import FaqSection from "../contact/FaqSection";
import { ServiceData } from "@/types/services";

export default function ServicesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategoryFromUrl = searchParams.get("category") || "all";

  const { categories, services: treatments, isLoading, isError, refetch: fetchData } = useServicesContext();

  const [selectedCategory, setSelectedCategory] = useState<string>(currentCategoryFromUrl);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTreatment, setSelectedTreatment] = useState<ServiceData | null>(null);

  const [, startTransition] = useTransition();

  // Sync state with URL category parameter
  useEffect(() => {
    const categoryInUrl = searchParams.get("category") || "all";
    if (categoryInUrl !== selectedCategory) {
      setSelectedCategory(categoryInUrl);
    }
  }, [searchParams]);

  // Handle Category selection change (updates URL without full page reload)
  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (categorySlug === "all") {
        params.delete("category");
      } else {
        params.set("category", categorySlug);
      }
      const newQuery = params.toString();
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.push(newUrl, { scroll: false });
    });
  };

  // Scroll to search / catalogue section when hero CTA clicked
  const handleExploreClick = () => {
    const catalogueEl = document.getElementById("catalogue");
    if (catalogueEl) {
      catalogueEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filter treatments based on search query
  const filteredTreatments = treatments.filter((t) => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase().trim();
    return (
      t.name.toLowerCase().includes(term) ||
      t.shortDescription.toLowerCase().includes(term)
    );
  });

  // Filter categories to display
  const activeCategories = categories.filter((cat) => {
    // If a single category is selected in tab navigation, filter to it
    if (selectedCategory !== "all" && cat.slug !== selectedCategory) {
      return false;
    }

    // Check if category has matching active treatments
    const catTreatments = filteredTreatments.filter(
      (t) => t.categoryId === cat.slug || t.categoryId === cat.id
    );

    return catTreatments.length > 0;
  });

  const selectedCategoryName = selectedTreatment
    ? categories.find(
        (cat) => cat.slug === selectedTreatment.categoryId || cat.id === selectedTreatment.categoryId
      )?.name
    : undefined;

  return (
    <div className="w-full bg-[#F7F1EB] min-h-screen text-stone-900 flex flex-col font-sans">
      {/* 1. HERO SECTION */}
      <ServicesHero onExploreClick={handleExploreClick} />

      {/* 3. TREATMENT SEARCH & FILTERS */}
      <div id="catalogue" className="scroll-mt-24">
        <ServiceFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* 4. CATEGORY NAVIGATION (Sticky Bar) */}
      {!isLoading && !isError && (
        <CategoryNavigation
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      )}

      {/* MAIN CATALOGUE CONTENT AREA */}
      <main className="flex-1 w-full">
        {isLoading ? (
          <LoadingSkeleton />
        ) : isError ? (
          <ErrorState onRetry={fetchData} />
        ) : activeCategories.length === 0 ? (
          <EmptyState
            message={
              searchQuery
                ? `No treatments matching "${searchQuery}"`
                : "No treatments available in this category."
            }
            onReset={() => {
              setSearchQuery("");
              handleCategorySelect("all");
            }}
          />
        ) : (
          /* 5. DYNAMIC CATEGORY SECTIONS */
          <div className="flex flex-col">
            {activeCategories.map((category, index) => {
              const categoryTreatments = filteredTreatments.filter(
                (t) => t.categoryId === category.slug || t.categoryId === category.id
              );

              return (
                <ServiceCategorySection
                  key={category.id || category.slug}
                  category={category}
                  treatments={categoryTreatments}
                  index={index}
                  onSelectTreatment={(treatment) => setSelectedTreatment(treatment)}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* DYNAMIC TREATMENT DETAILS MODAL */}
      <ServiceDetailModal
        treatment={selectedTreatment}
        categoryName={selectedCategoryName}
        onClose={() => setSelectedTreatment(null)}
      />

      {/* 6. FINAL CTA SECTION */}
      <FaqSection />
    </div>
  );
}
