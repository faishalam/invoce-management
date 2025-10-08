import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";
import { TBeritaAcara } from "./types";

type TUseUpdateBeritaAcaraProps = {
  onSuccess?: (data: TBeritaAcara) => void;
  onError?: (error: unknown) => void;
};

const useUpdateBeritaAcara = (props?: TUseUpdateBeritaAcaraProps) => {
  const useUpdateBeritaAcaraFn = async ({
    id,
    payload,
  }: {
    id: string;
    payload: any;
  }) => {
    try {
      const response = await HeroServices.put<TResponseType<TBeritaAcara>>(
        `/berita-acara/${id}`,
        payload
      );

      const { status } = response;

      if (status !== 200) return;
      return response.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    }
  };

  const mutation = useMutation({
    mutationKey: ["useUpdateBeritaAcara"],
    mutationFn: useUpdateBeritaAcaraFn,
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

export default useUpdateBeritaAcara;
