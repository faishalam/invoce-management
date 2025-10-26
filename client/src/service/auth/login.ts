import { useMutation } from "@tanstack/react-query";
import { AuthServices } from "../AuthService";
import { TInputLogin, TLoginResponse } from "./types";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";

type TUseLoginProps = {
  onSuccess?: (data: TLoginResponse) => void;
  onError?: (error: unknown) => void;
};

const useLogin = (props?: TUseLoginProps) => {
  const useLoginFn = async (formLogin: TInputLogin) => {
    try {
      const response = await AuthServices.post<TResponseType<TLoginResponse>>(
        `/login`,
        formLogin
      );

      const { status, data } = response;

      if (status !== 200) return;

      return data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
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

  return { ...mutation };
};

export default useLogin;
