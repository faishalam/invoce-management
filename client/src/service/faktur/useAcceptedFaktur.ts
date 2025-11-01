import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";
import { TFakturList } from "./types";
import { TFakturFormAccepted } from "@/app/(private)/faktur-management/validator";

type TUseAcceptedFaktur = {
  onSuccess?: (data: TFakturList) => void;
  onError?: (error: unknown) => void;
};

const useAcceptedFaktur = (props?: TUseAcceptedFaktur) => {
  const useAcceptedFakturFn = async ({
    id,
    payload,
  }: {
    id: string;
    payload: TFakturFormAccepted;
  }) => {
    try {
      const updateDebitNote = await HeroServices.put<
        TResponseType<TFakturList>
      >(`/faktur-accepted/${id}`, payload);

      const { status } = updateDebitNote;
      if (status !== 200) return;

      return updateDebitNote.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    }
  };

  const mutation = useMutation({
    mutationKey: ["UseAcceptedFakturAccepted"],
    mutationFn: useAcceptedFakturFn,
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

export default useAcceptedFaktur;
