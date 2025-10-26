import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";
import { TBeritaAcaraForm } from "@/app/(private)/ba-management/validator";
import { TBeritaAcaraList } from "./types";

type TUseCreateBeritaAcaraProps = {
  onSuccess?: (data: TBeritaAcaraList) => void;
  onError?: (error: unknown) => void;
};

const useCreateBeritaAcara = (props?: TUseCreateBeritaAcaraProps) => {
  const useCreateBeritaAcaraFn = async (payload: TBeritaAcaraForm) => {
    try {
      const beritaAcaraRes = await HeroServices.post<
        TResponseType<TBeritaAcaraList>
      >(`/berita-acara`, payload);
      if (beritaAcaraRes.status !== 201) return;

      if (beritaAcaraRes?.data?.data?.tipe_transaksi === "trade") {
        return beritaAcaraRes?.data?.data;
      }

      const templateBeritaAcaraRes = await HeroServices.post<
        TResponseType<{ id: string }>
      >(`/template-berita-acara`, {
        berita_acara_id: beritaAcaraRes?.data?.data?.id,
      });

      if (templateBeritaAcaraRes.status !== 201) return;

      return beritaAcaraRes?.data?.data;
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
