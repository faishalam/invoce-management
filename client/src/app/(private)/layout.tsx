"use client";
import Cookies from "js-cookie";
import Sidebar from "@/components/molecules/sidebar";
import { GlobalProvider } from "./hooks";
import Navbar from "@/components/atoms/navbar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type TProps = {
  children?: React.ReactNode;
};

const PrivateLayout: React.FC<TProps> = ({ children }) => {
  const router = useRouter();
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
      return;
    }
  }, [accessToken, router]);
  return (
    <GlobalProvider>
      <div className="w-full max-w-full min-h-screen bg-blue-50 overflow-hidden">
        <div className="w-full flex h-screen overflow-hidden">
          <div className="w-1/6">
            <Sidebar />
          </div>
          <div className="w-full max-w-full overflow-y-auto">
            <Navbar />
            <main>
              <div className="px-8 pb-8 pt-2 overflow-hidden">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </GlobalProvider>
  );
};

export default PrivateLayout;
