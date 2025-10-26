import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "@/service/HeroService";

type TUseUpdateTypeOfWork = {
  onSuccess?: (data: { name: string; type: string }) => void;
  onError?: (error: unknown) => void;
};

const useUpdateTypeOfWork = (props?: TUseUpdateTypeOfWork) => {
  const useUpdateTypeOfWorkFn = async ({
    id,
    payload,
  }: {
    id: string;
    payload: { name: string; type: string };
  }) => {
    try {
      const response = await HeroServices.put<
        TResponseType<{ name: string; type: string }>
      >(`/typeOfWork/${id}`, payload);

      if (response.status !== 200) return;
      return response?.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data;
    }
  };

  const mutation = useMutation({
    mutationKey: ["useUpdateTypeOfWork"],
    mutationFn: useUpdateTypeOfWorkFn,
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

export default useUpdateTypeOfWork;
