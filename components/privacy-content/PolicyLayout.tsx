"use client";

import { useEffect } from "react";

interface PolicyLayoutProps {
  children: React.ReactNode;
}

export default function PolicyLayout({ children }: PolicyLayoutProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <main>{children}</main>
  
    </div>
  );
}