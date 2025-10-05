"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/molecules/sidebar";
import Cookies from "js-cookie";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { GlobalProvider } from "../context/hooks";

type TProps = {
  children?: React.ReactNode;
};

const PrivateLayout: React.FC<TProps> = ({ children }) => {
  return (
    <AppRouterCacheProvider>
      <GlobalProvider>
        <div className="w-full max-w-full min-h-screen bg-blue-50">
          <div className="w-full flex h-screen">
            <div className="w-1/6">
              <Sidebar />
            </div>
            <div className="w-full max-w-full overflow-y-auto">
              <main>
                <div className="p-8">{children}</div>
              </main>
            </div>
          </div>
        </div>
      </GlobalProvider>
    </AppRouterCacheProvider>
  );
};

export default PrivateLayout;
