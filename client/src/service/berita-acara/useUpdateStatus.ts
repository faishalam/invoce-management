import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";
import { TRevisedForm } from "@/app/(private)/ba-management/validator";
import { TBeritaAcaraList } from "./types";

type TUseUpdateStatusProps = {
  onSuccess?: (data: TBeritaAcaraList) => void;
  onError?: (error: unknown) => void;
};

const useUpdateStatus = (props?: TUseUpdateStatusProps) => {
  const useUpdateStatusFn = async ({
    id,
    payload,
  }: {
    id: string;
    payload: TRevisedForm | { status: string };
  }) => {
    try {
      const updateBeritaAcaraRes = await HeroServices.patch<
        TResponseType<TBeritaAcaraList>
      >(`/berita-acara-status/${id}`, payload);
      const { status } = updateBeritaAcaraRes;
      if (status !== 200) return;

      return updateBeritaAcaraRes.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    }
  };

  const mutation = useMutation({
    mutationKey: ["useUpdateStatus"],
    mutationFn: useUpdateStatusFn,
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

export default useUpdateStatus;
