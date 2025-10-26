import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";
import { TDebitNoteList } from "./types";
import { TDebitNoteForm } from "@/app/(private)/dn-management/validator";

type TUseCreateDebitNoteProps = {
  onSuccess?: (data: TDebitNoteList) => void;
  onError?: (error: unknown) => void;
};

const useCreateDebitNote = (props?: TUseCreateDebitNoteProps) => {
  const useCreateDebitNoteFn = async (payload: TDebitNoteForm) => {
    try {
      const createDebitNoteRes = await HeroServices.post<
        TResponseType<TDebitNoteList>
      >(`/debit-note`, payload);
      if (createDebitNoteRes.status !== 201) return;

      const templateDebitNoteRes = await HeroServices.post<
        TResponseType<{ id: string; berita_acara_id: string }>
      >(`/template-debit-note`, {
        id: createDebitNoteRes?.data?.data?.id,
        berita_acara_id: createDebitNoteRes?.data?.data?.berita_acara_id,
      });
      if (templateDebitNoteRes.status !== 201) return;

      return createDebitNoteRes?.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data;
    }
  };

  const mutation = useMutation({
    mutationKey: ["useCreateDebitNote"],
    mutationFn: useCreateDebitNoteFn,
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

export default useCreateDebitNote;
