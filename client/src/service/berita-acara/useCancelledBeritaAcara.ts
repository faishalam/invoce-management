import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";
import { TBeritaAcaraList } from "./types";
import { TCancelledForm } from "@/app/(private)/ba-management/validator";

type TUseCancelledBeritaAcaraProps = {
  onSuccess?: (data: null) => void;
  onError?: (error: unknown) => void;
};

const useCancelledBeritaAcara = (props?: TUseCancelledBeritaAcaraProps) => {
  const useCancelledBeritaAcaraFn = async ({
    id,
    payload,
  }: {
    id: string;
    payload: TCancelledForm;
  }) => {
    try {
      const updateBeritaAcaraRes = await HeroServices.patch<
        TResponseType<TBeritaAcaraList>
      >(`/berita-acara-cancelled/${id}`, payload);

      const { status } = updateBeritaAcaraRes;
      if (status !== 200) return;

      return null;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    }
  };

  const mutation = useMutation({
    mutationKey: ["useCancelledBeritaAcara"],
    mutationFn: useCancelledBeritaAcaraFn,
    onSuccess: (response) => {
      props?.onSuccess?.(response ?? null);
    },
    onError: (error) => {
      if (props?.onError) {
        props.onError(error?.message);
      }
    },
  });

  return { ...mutation };
};

export default useCancelledBeritaAcara;
