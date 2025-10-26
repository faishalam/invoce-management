import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";

type TUseCreateTemplateBeritaAcaraProps = {
  onSuccess?: (data: { id: string }) => void;
  onError?: (error: unknown) => void;
};

const useCreateTemplateBeritaAcara = (
  props?: TUseCreateTemplateBeritaAcaraProps
) => {
  const useCreateTemplateBeritaAcaraFn = async (payload: {
    berita_acara_id: string;
  }) => {
    try {
      const response = await HeroServices.post<TResponseType<{ id: string }>>(
        `/template-berita-acara`,
        payload
      );

      if (response.status !== 201) return;
      return response?.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data;
    }
  };

  const mutation = useMutation({
    mutationKey: ["useCreateTemplateBeritaAcara"],
    mutationFn: useCreateTemplateBeritaAcaraFn,
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

export default useCreateTemplateBeritaAcara;
