import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { HeroServices } from "../../HeroService";

type TUseCustomerList = {
  onSuccess?: (data: { id: string; name: string; code: string }) => void;
  onError?: (error: unknown) => void;
};

const useCustomerList = (props?: TUseCustomerList) => {
  const useCustomerListFn = async () => {
    try {
      const response = await HeroServices.get<
        TResponseType<{ id: String; name: string; code: string }[]>
      >(`/customer`);

      if (response.status !== 200) return;

      return response?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      toast.error(err?.response?.data?.message);
      throw err?.response?.data?.message;
    }
  };

  const query = useQuery({
    queryKey: ["useCustomerList"],
    queryFn: useCustomerListFn,
    staleTime: Infinity,
    enabled: true,
  });

  return { ...query };
};

export default useCustomerList;
