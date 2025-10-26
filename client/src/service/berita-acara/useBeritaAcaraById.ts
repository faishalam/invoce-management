import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { HeroServices } from "../HeroService";
import { TBeritaAcaraList } from "./types";

type TBeritaAcaraByIdProps = {
  onSuccess?: (data: TBeritaAcaraList) => void;
  onError?: (error: unknown) => void;
  params: {
    id?: string;
    enabled?: boolean;
  };
};

const useBeritaAcaraById = (props?: TBeritaAcaraByIdProps) => {
  const useBeritaAcaraByIdFn = async () => {
    try {
      const response = await HeroServices.get<TResponseType<TBeritaAcaraList>>(
        `/berita-acara/${props?.params?.id}`
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
    queryKey: ["useBeritaAcaraById", props?.params.id],
    queryFn: useBeritaAcaraByIdFn,
    staleTime: Infinity,
    enabled: !!props?.params?.id && !!props?.params?.enabled,
  });

  return { ...query };
};

export default useBeritaAcaraById;
