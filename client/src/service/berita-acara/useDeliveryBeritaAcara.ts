import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";
import { TBeritaAcaraList } from "./types";
import { TDeliveryForm } from "@/app/(private)/ba-management/validator";

type TUseDeliveryBeritaAcaraProps = {
  onSuccess?: (data: null) => void;
  onError?: (error: unknown) => void;
};

const useDeliveryBeritaAcara = (props?: TUseDeliveryBeritaAcaraProps) => {
  const useDeliveryBeritaAcaraFn = async ({
    id,
    payload,
  }: {
    id: string;
    payload: TDeliveryForm;
  }) => {
    try {
      const updateBeritaAcaraRes = await HeroServices.patch<
        TResponseType<TBeritaAcaraList>
      >(`/berita-acara-delivery/${id}`, payload);

      const { status } = updateBeritaAcaraRes;
      if (status !== 200) return;

      return null;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    }
  };

  const mutation = useMutation({
    mutationKey: ["useDeliveryBeritaAcara"],
    mutationFn: useDeliveryBeritaAcaraFn,
    onSuccess: (response) => {
      props?.onSuccess?.(response ?? null);
    },
    onError: (error) => {
      if (props?.onError) {
        props.onError(error?.message);
      }
    },
  });

  return { ...mutation };
};

export default useDeliveryBeritaAcara;
