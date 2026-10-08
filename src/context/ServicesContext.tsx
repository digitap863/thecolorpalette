"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ServiceCategoryData, ServiceData } from "@/types/services";

interface ServicesContextType {
  categories: ServiceCategoryData[];
  services: ServiceData[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
}

const ServicesContext = createContext<ServicesContextType>({
  categories: [],
  services: [],
  isLoading: true,
  isError: false,
  refetch: async () => {},
});

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<ServiceCategoryData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [catRes, srvRes] = await Promise.all([
        fetch("/api/service-categories"),
        fetch("/api/services"),
      ]);

      if (catRes.ok) {
        const catData = await catRes.json();
        if (Array.isArray(catData)) {
          setCategories(catData);
        }
      }

      if (srvRes.ok) {
        const srvData = await srvRes.json();
        if (Array.isArray(srvData)) {
          setServices(srvData);
        }
      }
    } catch (err) {
      console.error("Error fetching services context data:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <ServicesContext.Provider
      value={{
        categories,
        services,
        isLoading,
        isError,
        refetch: fetchData,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
}

export function useServicesContext() {
  return useContext(ServicesContext);
}
