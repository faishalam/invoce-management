"use client";

import useDepartmentList from "@/service/master/useDepartmentList";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const useGlobalHooks = () => {
  const { data: dataDepartment, isPending: isLoadingDepartment } =
    useDepartmentList();

  const globalLoading = useMemo(() => {
    return isLoadingDepartment;
  }, [isLoadingDepartment]);

  return {
    dataDepartment,
    isLoadingDepartment,
    globalLoading,
  };
};

const useGlobalContext = createContext<
  ReturnType<typeof useGlobalHooks> | undefined
>(undefined);

export const GlobalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = useGlobalHooks();
  return (
    <useGlobalContext.Provider value={value}>
      {children}
    </useGlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(useGlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within an GlobalProvider");
  }
  return context;
};
export default useGlobal;
