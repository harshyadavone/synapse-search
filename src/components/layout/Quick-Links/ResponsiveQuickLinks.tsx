"use client";
import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";

const QuickLinks = dynamic(() => import("./QuickLinks"), { ssr: false });
const QuickLinksMobile = dynamic(() => import("./QuickLinksMobile"), {
  ssr: false,
});

const ResponsiveQuickLinks: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? (
    <Suspense fallback={<div>Loading...</div>}>
      <QuickLinksMobile />
    </Suspense>
  ) : (
    <Suspense fallback={<div>Loading...</div>}>
      <QuickLinks />
    </Suspense>
  );
};

export default ResponsiveQuickLinks;
