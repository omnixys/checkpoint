import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "QR Event & Ticketing – beautiful, fast, iOS-inspired.",
  appleWebApp: { capable: true, title: "checkpoint" },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}
