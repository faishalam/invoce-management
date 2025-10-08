"use client";

import useCustomerList from "@/service/master/customer/useCustomerList";
import useDepartmentList from "@/service/master/department/useDepartmentList";
import useGoodsList from "@/service/master/goods/useGoodsList";
import useSatuanList from "@/service/master/satuan/useSatuanList";
import useTypeOfWorkList from "@/service/master/typeOfWork/useTypeOfWorkList";
import useUserProfile from "@/service/user/useUserProfile";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const useGlobalHooks = () => {
  const { data: dataDepartment, isPending: isLoadingDepartment } =
    useDepartmentList();

  const { data: dataCustomer, isPending: isLoadingCustomer } =
    useCustomerList();

  const { data: dataTypeOfWork, isPending: isLoadingTypeOfWork } =
    useTypeOfWorkList();

  const { data: dataUserProfile, isPending: isLoadingUserProfile } =
    useUserProfile();

  const { data: dataSatuan, isPending: isLoadingSatuan } = useSatuanList();

  const { data: dataGoods, isPending: isLoadingGoods } = useGoodsList();

  const globalLoading = useMemo(() => {
    return (
      isLoadingUserProfile ||
      isLoadingDepartment ||
      isLoadingCustomer ||
      isLoadingTypeOfWork ||
      isLoadingSatuan ||
      isLoadingGoods
    );
  }, [
    isLoadingDepartment,
    isLoadingCustomer,
    isLoadingTypeOfWork,
    isLoadingSatuan,
    isLoadingGoods,
    isLoadingUserProfile,
  ]);

  return {
    dataUserProfile,
    dataGoods,
    dataSatuan,
    dataTypeOfWork,
    isLoadingUserProfile,
    isLoadingCustomer,
    dataCustomer,
    dataDepartment,
    isLoadingDepartment,
    isLoadingTypeOfWork,
    isLoadingSatuan,
    globalLoading,
    isLoadingGoods,
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
