import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";
import { TDebitNoteList } from "./types";
import { TDebitNoteForm } from "@/app/(private)/dn-management/validator";

type TUseDebitNoteProps = {
  onSuccess?: (data: TDebitNoteList) => void;
  onError?: (error: unknown) => void;
};

const useUpdateDebitNote = (props?: TUseDebitNoteProps) => {
  const useUpdateDebitNoteFn = async ({
    id,
    payload,
  }: {
    id: string;
    payload: TDebitNoteForm;
  }) => {
    try {
      const updateDebitNote = await HeroServices.put<
        TResponseType<TDebitNoteList>
      >(`/debit-note/${id}`, payload);

      const { status } = updateDebitNote;
      if (status !== 200) return;

      const updateTemplateDebitNote = await HeroServices.put<
        TResponseType<{ id: string }>
      >(`/template-debit-note/${updateDebitNote?.data?.data?.id}`);

      if (updateTemplateDebitNote.status !== 200) return;

      return updateDebitNote.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    }
  };

  const mutation = useMutation({
    mutationKey: ["useUpdateDebitNote"],
    mutationFn: useUpdateDebitNoteFn,
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

export default useUpdateDebitNote;
