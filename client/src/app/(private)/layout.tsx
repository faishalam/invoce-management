"use client";

import { useRouter } from "next/navigation";
import useAuth from "../hooks";
import { useEffect } from "react";
import Sidebar from "@/components/molecules/sidebar";
import MobileSidebar from "@/components/molecules/mobileSidebar";
import Navbar from "@/components/molecules/navbar";

type TProps = {
  children?: React.ReactNode;
};
const PrivateLayout: React.FC<TProps> = ({ children }) => {
  const router = useRouter();
  const { dataUser } = useAuth();
  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);
  return (
    <div className="w-full max-w-full min-h-screen bg-gray-100">
      <Sidebar />
      <Navbar />
      <MobileSidebar />
      <div className="lg:pl-72 w-full max-w-full">
        <main className="py-6 w-full max-w-full ">
          <div className="px-4 sm:px-6 lg:px-8 w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};
export default PrivateLayout;
