import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";
import { TBeritaAcaraForm } from "@/app/(private)/ba-management/validator";
import { TBeritaAcaraList } from "./types";

type TUseUpdateBeritaAcaraProps = {
  onSuccess?: (data: TBeritaAcaraList) => void;
  onError?: (error: unknown) => void;
};

const useUpdateBeritaAcara = (props?: TUseUpdateBeritaAcaraProps) => {
  const useUpdateBeritaAcaraFn = async ({
    id,
    payload,
  }: {
    id: string;
    payload: TBeritaAcaraForm;
  }) => {
    try {
      const updateBeritaAcaraRes = await HeroServices.put<
        TResponseType<TBeritaAcaraList>
      >(`/berita-acara/${id}`, payload);
      const { status } = updateBeritaAcaraRes;
      if (status !== 200) return;

      if (updateBeritaAcaraRes?.data?.data?.tipe_transaksi === "trade") {
        return updateBeritaAcaraRes?.data?.data;
      }

      const updateTemplateBeritaAcaraRes = await HeroServices.put<
        TResponseType<{ id: string }>
      >(`/template-berita-acara/${id}`);

      if (updateTemplateBeritaAcaraRes.status !== 200) return;

      const updateStatusRevised = await HeroServices.patch<
        TResponseType<TBeritaAcaraList>
      >(`/berita-acara-status/${id}`, {
        revised: null,
      });

      if (updateStatusRevised.status !== 200) return;

      if (updateBeritaAcaraRes?.data?.data.debit_note?.id) {
        await HeroServices.put<TResponseType<{ id: string }>>(
          `/template-debit-note/${updateBeritaAcaraRes?.data?.data.debit_note?.id}`
        );
      }

      return updateBeritaAcaraRes.data?.data;
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
