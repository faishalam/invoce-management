import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "@/service/HeroService";

type TUseCreateCustomer = {
  onSuccess?: (data: { name: string; code: string }) => void;
  onError?: (error: unknown) => void;
};

const useCreateCustomer = (props?: TUseCreateCustomer) => {
  const useCreateCustomerFn = async (payload: {
    name: string;
    code: string;
  }) => {
    try {
      const response = await HeroServices.post<
        TResponseType<{ name: string; code: string }>
      >(`/customer`, payload);

      if (response.status !== 201) return;
      return response?.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data;
    }
  };

  const mutation = useMutation({
    mutationKey: ["useCreateCustomer"],
    mutationFn: useCreateCustomerFn,
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

export default useCreateCustomer;
