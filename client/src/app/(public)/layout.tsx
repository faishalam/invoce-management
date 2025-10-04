"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type TProps = {
  children?: React.ReactNode;
};
const PublicLayout: React.FC<TProps> = ({ children }) => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);
  return (
    <div className="h-screen w-screen no-scrollbar">
      <div className="w-full h-[calc(100vh-4.25rem)]">{children}</div>
    </div>
  );
};
export default PublicLayout;
