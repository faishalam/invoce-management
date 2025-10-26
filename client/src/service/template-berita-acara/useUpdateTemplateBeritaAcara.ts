import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";

type TUseUpdateTemplateBeritaAcaraProps = {
  onSuccess?: (data: { id: string }) => void;
  onError?: (error: unknown) => void;
};

const useUpdateTemplateBeritaAcara = (
  props?: TUseUpdateTemplateBeritaAcaraProps
) => {
  const useUpdateTemplateBeritaAcaraFn = async ({ id }: { id: string }) => {
    try {
      const response = await HeroServices.put<TResponseType<{ id: string }>>(
        `/template-berita-acara/${id}`
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
    mutationKey: ["useUpdateTemplateBeritaAcara"],
    mutationFn: useUpdateTemplateBeritaAcaraFn,
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

export default useUpdateTemplateBeritaAcara;
