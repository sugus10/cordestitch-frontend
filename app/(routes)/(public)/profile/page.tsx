// page.tsx
"use client";

import Layout from "@/components/Layout";
import ProfileContent from "@/components/ProfileContent";
import ProfileContainer from "@/components/ProfileLayout";

export default function ProfilePage() {
  return (
    <Layout>
    <ProfileContainer>
      <ProfileContent />
    </ProfileContainer>
    </Layout>
  );
}