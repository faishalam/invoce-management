import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "@/service/HeroService";

type TUseCreateTypeOfWorkProps = {
  onSuccess?: (data: { name: string; type: string }) => void;
  onError?: (error: unknown) => void;
};

const useCreateTypeOfWork = (props?: TUseCreateTypeOfWorkProps) => {
  const useCreateTypeOfWorkFn = async (payload: {
    name: string;
    type: string;
  }) => {
    try {
      const response = await HeroServices.post<
        TResponseType<{ name: string; type: string }>
      >(`/typeOfWork`, payload);

      if (response.status !== 201) return;
      return response?.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data;
    }
  };

  const mutation = useMutation({
    mutationKey: ["useCreateTypeOfWork"],
    mutationFn: useCreateTypeOfWorkFn,
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

export default useCreateTypeOfWork;
