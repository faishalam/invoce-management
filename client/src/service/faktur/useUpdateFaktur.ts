import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";
import { TFakturList } from "./types";
import { TFakturForm } from "@/app/(private)/faktur-management/validator";

type TUseUpdateFaktur = {
  onSuccess?: (data: TFakturList) => void;
  onError?: (error: unknown) => void;
};

const useUpdateFaktur = (props?: TUseUpdateFaktur) => {
  const useUpdateFakturFn = async ({
    id,
    payload,
  }: {
    id: string;
    payload: TFakturForm;
  }) => {
    try {
      const updateDebitNote = await HeroServices.put<
        TResponseType<TFakturList>
      >(`/faktur/${id}`, payload);

      const { status } = updateDebitNote;
      if (status !== 200) return;

      return updateDebitNote.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    }
  };

  const mutation = useMutation({
    mutationKey: ["useUpdateFaktur"],
    mutationFn: useUpdateFakturFn,
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

export default useUpdateFaktur;
