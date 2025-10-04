"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HeroServices } from "../HeroService";
import { TResponseType } from "@/utils/response-type";
import { TUserLoggedInResponse } from "./types";

type TParams = {
  enabled: boolean;
};

const useUserLogged = (props: TParams) => {
  const [isLoadingGetUserLoggedIn, setIsLoading] = useState<boolean>(false);
  const useUserLoggedFn = async () => {
    try {
      setIsLoading(true);
      const response = await HeroServices.get<
        TResponseType<TUserLoggedInResponse>
      >("/getLoggedInUser");

      if (response.status !== 200) return;

      return response.data;
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const query = useQuery({
    queryKey: ["useUserLogged"],
    queryFn: useUserLoggedFn,
    staleTime: Infinity,
    enabled: !!props.enabled,
  });

  return { ...query, isLoadingGetUserLoggedIn };
};

export default useUserLogged;
