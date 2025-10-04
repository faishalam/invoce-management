"use client";

import useUserLogged from "@/service/user/userLoggedIn";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const useAuthHooks = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const { data: dataUser, isLoadingGetUserLoggedIn } = useUserLogged({
    enabled: enabled,
  });

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (pathname === "/login" && token) {
      setEnabled(true);
    } else if (pathname !== "/login" && token) {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [pathname]);

  return {
    dataUser,
    isLoadingGetUserLoggedIn,
    sidebarOpen,
    setSidebarOpen,
  };
};

const useAuthContext = createContext<
  ReturnType<typeof useAuthHooks> | undefined
>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = useAuthHooks();
  return (
    <useAuthContext.Provider value={value}>{children}</useAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(useAuthContext);
  if (context === undefined) {
    throw new Error("useuseAuthContext must be used within an AuthProvider");
  }
  return context;
};
export default useAuth;
