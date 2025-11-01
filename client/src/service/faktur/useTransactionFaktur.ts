import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";
import { TFakturList } from "./types";
import { TFakturFormTransaction } from "@/app/(private)/faktur-management/validator";

type TUseTransactionFakturProps = {
  onSuccess?: (data: TFakturList) => void;
  onError?: (error: unknown) => void;
};

const useTransactionFaktur = (props?: TUseTransactionFakturProps) => {
  const useTransactionFakturFn = async ({
    id,
    payload,
  }: {
    id: string;
    payload: TFakturFormTransaction;
  }) => {
    try {
      const updateDebitNote = await HeroServices.put<
        TResponseType<TFakturList>
      >(`/faktur-transaction/${id}`, payload);

      const { status } = updateDebitNote;
      if (status !== 200) return;

      return updateDebitNote.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    }
  };

  const mutation = useMutation({
    mutationKey: ["useTransactionFaktur"],
    mutationFn: useTransactionFakturFn,
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

export default useTransactionFaktur;
