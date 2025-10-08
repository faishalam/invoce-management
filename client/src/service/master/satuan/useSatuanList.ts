import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { HeroServices } from "../../HeroService";

type TUseSatuanListProps = {
  onSuccess?: (data: { id: string; name: string }) => void;
  onError?: (error: unknown) => void;
};

const useSatuanList = (props?: TUseSatuanListProps) => {
  const useSatuanListFn = async () => {
    try {
      const response = await HeroServices.get<
        TResponseType<{ id: string; name: string }[]>
      >(`/satuan`);

      if (response.status !== 200) return;

      return response?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      toast.error(err?.response?.data?.message);
      throw err?.response?.data?.message;
    }
  };

  const query = useQuery({
    queryKey: ["useSatuanList"],
    queryFn: useSatuanListFn,
    staleTime: Infinity,
    enabled: true,
  });

  return { ...query };
};

export default useSatuanList;
