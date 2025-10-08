import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";
import { TBeritaAcara } from "./types";
import { TBeritaAcaraForm } from "@/app/(private)/ba-management/validator";

type TUseCreateBeritaAcaraProps = {
  onSuccess?: (data: TBeritaAcara) => void;
  onError?: (error: unknown) => void;
};

const useCreateBeritaAcara = (props?: TUseCreateBeritaAcaraProps) => {
  const useCreateBeritaAcaraFn = async (payload: TBeritaAcaraForm) => {
    try {
      const response = await HeroServices.post<TResponseType<TBeritaAcara>>(
        `/berita-acara`,
        payload
      );

      if (response.status !== 201) return;
      return response?.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data;
    }
  };

  const mutation = useMutation({
    mutationKey: ["useCreateBeritaAcara"],
    mutationFn: useCreateBeritaAcaraFn,
    onSuccess: (response) => {
      if (response) {
        props?.onSuccess?.(response);
      }
    },
    onError: (error) => {
      if (props?.onError) {
        props.onError(error?.message);
      }
    },
  });

  return { ...mutation };
};

export default useCreateBeritaAcara;
