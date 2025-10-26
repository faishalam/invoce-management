import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";

type TUseCreataTemplateDebitNoteProps = {
  onSuccess?: (data: { id: string; berita_acara_id: string }) => void;
  onError?: (error: unknown) => void;
};

const useCreateTemplateDebitNote = (
  props?: TUseCreataTemplateDebitNoteProps
) => {
  const useCreateTemplateDebitNoteFn = async (payload: {
    berita_acara_id: string;
    id: string;
  }) => {
    try {
      const response = await HeroServices.post<
        TResponseType<{ id: string; berita_acara_id: string }>
      >(`/template-debit-note`, payload);

      if (response.status !== 201) return;
      return response?.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data;
    }
  };

  const mutation = useMutation({
    mutationKey: ["useCreateTemplateDebitNote"],
    mutationFn: useCreateTemplateDebitNoteFn,
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

export default useCreateTemplateDebitNote;
