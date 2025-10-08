import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { HeroServices } from "../HeroService";
import { TBeritaAcara } from "./types";

type TUseBeritaAcaraListProps = {
  onSuccess?: (data: TBeritaAcara) => void;
  onError?: (error: unknown) => void;
};

const useBeritaAcaraList = (props?: TUseBeritaAcaraListProps) => {
  const useBeritaAcaraListFn = async () => {
    try {
      const response = await HeroServices.get<TResponseType<TBeritaAcara[]>>(
        `/berita-acara`
      );

      if (response.status !== 200) return;

      return response?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      toast.error(err?.response?.data?.message);
      throw err?.response?.data?.message;
    }
  };

  const query = useQuery({
    queryKey: ["useBeritaAcaraList"],
    queryFn: useBeritaAcaraListFn,
    staleTime: Infinity,
    enabled: true,
  });

  return { ...query };
};

export default useBeritaAcaraList;
