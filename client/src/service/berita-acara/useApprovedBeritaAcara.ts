import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";
import { TBeritaAcaraForm } from "@/app/(private)/ba-management/validator";
import { TBeritaAcaraList } from "./types";

type TUseApprovedBeritraAcara = {
  onSuccess?: (data: TBeritaAcaraList) => void;
  onError?: (error: unknown) => void;
};

const useApprovedBeritaAcara = (props?: TUseApprovedBeritraAcara) => {
  const useApprovedBeritaAcaraFn = async ({ id }: { id: string }) => {
    try {
      const updateBeritaAcaraRes = await HeroServices.put<
        TResponseType<TBeritaAcaraList>
      >(`/berita-acara-approved/${id}`);
      const { status } = updateBeritaAcaraRes;
      if (status !== 200) return;

      return updateBeritaAcaraRes.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    }
  };

  const mutation = useMutation({
    mutationKey: ["useApprovedBeritaAcara"],
    mutationFn: useApprovedBeritaAcaraFn,
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

export default useApprovedBeritaAcara;
