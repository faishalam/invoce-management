import { useMutation } from "@tanstack/react-query";
import { AuthServices } from "../AuthService";
import { TInputLogin, TLoginResponse } from "./types";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { useState } from "react";
import { AxiosError } from "axios";

type TUseLoginProps = {
  onSuccess?: (data: TLoginResponse) => void;
  onError?: (error: unknown) => void;
};

const useLogin = (props?: TUseLoginProps) => {
  const [isLoadingLogin, setIsloading] = useState<boolean>(false);
  const useLoginFn = async (formLogin: TInputLogin) => {
    try {
      setIsloading(true);
      const response = await AuthServices.post<TResponseType<TLoginResponse>>(
        `/login`,
        formLogin
      );

      const { status, data } = response;

      if (status !== 200) return;

      return data?.data;
    } catch (error) {
      setIsloading(false);
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    } finally {
      setIsloading(false);
    }
  };

  const mutation = useMutation({
    mutationKey: ["useLogin"],
    mutationFn: useLoginFn,
    onSuccess: (response) => {
      if (response) {
        props?.onSuccess?.(response);
      }
    },
    onError: (error) => {
      if (props?.onError) {
        props.onError(error);
      }
    },
  });

  return { ...mutation, isLoadingLogin };
};

export default useLogin;
