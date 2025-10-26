import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { HeroServices } from "../../HeroService";

const useTotalList = () => {
  const useTotalListFn = async () => {
    try {
      const response = await HeroServices.get<
        TResponseType<{
          totalBeritaAcara: number;
          totalDebitNote: number;
          totalFaktur: number;
        }>
      >(`/berita-acara-calculate`);

      if (response.status !== 200) return;

      return response?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      toast.error(err?.response?.data?.message);
      throw err?.response?.data?.message;
    }
  };

  const query = useQuery({
    queryKey: ["useTotalList"],
    queryFn: useTotalListFn,
    staleTime: Infinity,
    enabled: true,
  });

  return { ...query };
};

export default useTotalList;
