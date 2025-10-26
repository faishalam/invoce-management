import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";

type TUseUpdateTemplateDebitNoteProps = {
  onSuccess?: (data: { id: string }) => void;
  onError?: (error: unknown) => void;
};

const useUpdateTemplateDebitNote = (
  props?: TUseUpdateTemplateDebitNoteProps
) => {
  const useUpdateTemplateDebitNoteFn = async ({ id }: { id: string }) => {
    try {
      const response = await HeroServices.put<TResponseType<{ id: string }>>(
        `/template-debit-note/${id}`
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
    mutationKey: ["useUpdateTemplateDebitNote"],
    mutationFn: useUpdateTemplateDebitNoteFn,
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

export default useUpdateTemplateDebitNote;
