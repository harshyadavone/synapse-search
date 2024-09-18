"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import ResponsiveQuickLinks from "@/components/layout/Quick-Links/ResponsiveQuickLinks";
import Header from "@/components/layout/header/Header";
import SearchBar from "@/components/shared/common/SearchBar";
// import QuickAccess from "@/components/shared/common/QuickAccess";
import Footer from "@/components/shared/common/Footer";
import { CustomizeModal } from "@/components/ui/CustomizeModal";

export interface UserPreferences {
  showWeather: boolean;
  showQuickLinks: boolean;
  // showQuickAccess: boolean;
  showLogo: boolean;
}

export default function Home(): React.ReactElement {
  const [isCustomizeOpen, setIsCustomizeOpen] = useState<boolean>(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    showWeather: true,
    showQuickLinks: false,
    // showQuickAccess: false,
    showLogo: true,
  });
  useEffect(() => {
    const loadPreferences = (): void => {
      const savedPreferences = localStorage.getItem("userPreferences");
      if (savedPreferences) {
        try {
          const parsedPreferences: UserPreferences =
            JSON.parse(savedPreferences);
          setUserPreferences(parsedPreferences);
        } catch (error) {
          console.error("Failed to parse saved preferences:", error);
        }
      }
    };

    loadPreferences();
  }, []);

  const savePreferences = useCallback(
    (newPreferences: UserPreferences): void => {
      setUserPreferences(newPreferences);
      localStorage.setItem("userPreferences", JSON.stringify(newPreferences));
      setIsCustomizeOpen(false);
    },
    []
  );

  const toggleCustomizeModal = useCallback((): void => {
    setIsCustomizeOpen((prev) => !prev);
  }, []);

  return (
    <main className="flex flex-col min-h-screen">
      <Header
        onCustomize={toggleCustomizeModal}
        preferences={userPreferences}
      />
      <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 w-full max-w-5xl mx-auto">
        {userPreferences.showLogo && (
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-semibold text-primary mb-4">
              Synapse
            </h1>
            <p className="text-md md:text-lg text-muted-foreground">
              Discover the power of AI-driven search
            </p>
          </div>
        )}
        <SearchBar />
        <div className="w-full mt-12 space-y-12">
          {userPreferences.showQuickLinks && (
            <Suspense fallback={<div>Loading...</div>}>
              <ResponsiveQuickLinks />
            </Suspense>
          )}
        </div>
        {/* {userPreferences.showQuickAccess && (
              <Suspense fallback={<div>Loading...</div>}>
                <QuickAccess />
              </Suspense>
            )} */}
      </div>
      <Footer onCustomize={toggleCustomizeModal} />
      {isCustomizeOpen && (
        <CustomizeModal
          preferences={userPreferences}
          onSave={savePreferences}
          onClose={toggleCustomizeModal}
        />
      )}
    </main>
  );
}
