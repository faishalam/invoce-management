import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";
import { TFakturList } from "./types";
import { TFakturForm } from "@/app/(private)/faktur-management/validator";

type TUseCreateFakturProps = {
  onSuccess?: (data: TFakturList) => void;
  onError?: (error: unknown) => void;
};

const useCreateFaktur = (props?: TUseCreateFakturProps) => {
  const useCreateFakturFn = async (payload: TFakturForm) => {
    try {
      const createDebitNoteRes = await HeroServices.post<
        TResponseType<TFakturList>
      >(`/faktur`, payload);
      if (createDebitNoteRes.status !== 201) return;

      return createDebitNoteRes?.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data;
    }
  };

  const mutation = useMutation({
    mutationKey: ["useCreateFaktur"],
    mutationFn: useCreateFakturFn,
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

export default useCreateFaktur;
