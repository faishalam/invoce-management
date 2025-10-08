import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { HeroServices } from "../../HeroService";

type TUseCreateTypeOfWorkProps = {
  onSuccess?: (data: { id: string; name: string; type: string }) => void;
  onError?: (error: unknown) => void;
};

const useTypeOfWorkList = (props?: TUseCreateTypeOfWorkProps) => {
  const useTypeOfWorkListFn = async () => {
    try {
      const response = await HeroServices.get<
        TResponseType<{ id: string; name: string; type: string }[]>
      >(`/typeOfWork`);

      if (response.status !== 200) return;

      return response?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      toast.error(err?.response?.data?.message);
      throw err?.response?.data?.message;
    }
  };

  const query = useQuery({
    queryKey: ["useTypeOfWorkList"],
    queryFn: useTypeOfWorkListFn,
    staleTime: Infinity,
    enabled: true,
  });

  return { ...query };
};

export default useTypeOfWorkList;
