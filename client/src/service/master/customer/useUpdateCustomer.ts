import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "@/service/HeroService";

type TUseUpdateCustomer = {
  onSuccess?: (data: {
    name: string;
    code: string;
    alamat: string;
    phone: string;
  }) => void;
  onError?: (error: unknown) => void;
};

const useUpdateCustomer = (props?: TUseUpdateCustomer) => {
  const useUpdateCustomerFn = async ({
    id,
    payload,
  }: {
    id: string;
    payload: { name: string; code: string; alamat: string; phone: string };
  }) => {
    try {
      const response = await HeroServices.put<
        TResponseType<{
          name: string;
          code: string;
          alamat: string;
          phone: string;
        }>
      >(`/customer/${id}`, payload);

      if (response.status !== 200) return;
      return response?.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data;
    }
  };

  const mutation = useMutation({
    mutationKey: ["useUpdateCustomer"],
    mutationFn: useUpdateCustomerFn,
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

export default useUpdateCustomer;
