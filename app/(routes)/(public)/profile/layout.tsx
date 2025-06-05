import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | User Dashboard",
  description: "Manage your personal profile information",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}