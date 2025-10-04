import { useMutation } from "@tanstack/react-query";
import { AuthServices } from "../AuthService";
import { TInputRegister, TRegisterResponse } from "./types";
import { TResponseType } from "@/utils/response-type";

type TuseRegisterProps = {
  onSuccess?: (data: TRegisterResponse) => void;
  onError?: (error: unknown) => void;
};

const useRegister = (props?: TuseRegisterProps) => {
  const useRegisterFn = async (formRegister: TInputRegister) => {
    try {
      const response = await AuthServices.post<
        TResponseType<TRegisterResponse>
      >(`/register`, formRegister);

      const { status, data } = response;

      if (status !== 200) return;

      return data.data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationKey: ["useRegister"],
    mutationFn: useRegisterFn,
    onSuccess: (data) => {
      if (data) {
        props?.onSuccess?.(data);
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

export default useRegister;
