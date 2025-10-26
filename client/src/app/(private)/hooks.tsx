"use client";

import useTotalList from "@/service/master/calculate/useGetTotal";
import useCustomerList from "@/service/master/customer/useCustomerList";
import useDepartmentList from "@/service/master/department/useDepartmentList";
import useGoodsList from "@/service/master/goods/useGoodsList";
import useSatuanList from "@/service/master/satuan/useSatuanList";
import useTypeOfWorkList from "@/service/master/typeOfWork/useTypeOfWorkList";
import useUserProfile from "@/service/user/useUserProfile";
import { createContext, useContext, useMemo } from "react";

const useGlobalHooks = () => {
  const { data: dataDepartment, isPending: isLoadingDepartment } =
    useDepartmentList();

  const { data: dataCustomer, isPending: isLoadingCustomer } =
    useCustomerList();

  const { data: dataTypeOfWork, isPending: isLoadingTypeOfWork } =
    useTypeOfWorkList();

  const { data: dataUserProfile, isPending: isLoadingUserProfile } =
    useUserProfile();

  const { data: dataTotalList, isPending: isLoadingTotalList } = useTotalList();

  const { data: dataSatuan, isPending: isLoadingSatuan } = useSatuanList();

  const { data: dataGoods, isPending: isLoadingGoods } = useGoodsList();

  const globalLoading = useMemo(() => {
    return (
      isLoadingUserProfile ||
      isLoadingDepartment ||
      isLoadingCustomer ||
      isLoadingTypeOfWork ||
      isLoadingSatuan ||
      isLoadingGoods ||
      isLoadingTotalList
    );
  }, [
    isLoadingDepartment,
    isLoadingCustomer,
    isLoadingTypeOfWork,
    isLoadingSatuan,
    isLoadingGoods,
    isLoadingUserProfile,
    isLoadingTotalList,
  ]);

  return {
    dataTotalList,
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

const GlobalContext = createContext<
  ReturnType<typeof useGlobalHooks> | undefined
>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value = useGlobalHooks();
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};

export default useGlobal;
