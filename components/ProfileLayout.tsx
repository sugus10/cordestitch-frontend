"use client";

import Layout from "./Layout";
import Sidebar from "./ProfileSidebar";

interface ProfileContainerProps {
  children: React.ReactNode;
}

export default function ProfileContainer({ children }: ProfileContainerProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}