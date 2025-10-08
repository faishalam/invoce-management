import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { HeroServices } from "../../HeroService";

type TUseGoodsListProps = {
  onSuccess?: (data: { id: string; name: string; code: string }) => void;
  onError?: (error: unknown) => void;
};

const useGoodsList = (props?: TUseGoodsListProps) => {
  const useGoodsListFn = async () => {
    try {
      const response = await HeroServices.get<
        TResponseType<{ id: string; name: string; code: string }[]>
      >(`/goods`);

      if (response.status !== 200) return;

      return response?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      toast.error(err?.response?.data?.message);
      throw err?.response?.data?.message;
    }
  };

  const query = useQuery({
    queryKey: ["useGoodsList"],
    queryFn: useGoodsListFn,
    staleTime: Infinity,
    enabled: true,
  });

  return { ...query };
};

export default useGoodsList;
