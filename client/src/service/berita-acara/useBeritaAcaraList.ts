import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { HeroServices } from "../HeroService";
import { TBeritaAcaraList } from "./types";

type TUseBeritaAcaraListProps = {
  onSuccess?: (data: TBeritaAcaraList) => void;
  onError?: (error: unknown) => void;
  params: {
    status?: string;
  };
};

const useBeritaAcaraList = (props: TUseBeritaAcaraListProps) => {
  const useBeritaAcaraListFn = async () => {
    try {
      const response = await HeroServices.get<
        TResponseType<TBeritaAcaraList[]>
      >(`/berita-acara`, {
        params: {
          ...(props?.params?.status && { status: props.params.status }),
        },
      });

      if (response.status !== 200) return;

      return response?.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      toast.error(err?.response?.data?.message);
      throw err?.response?.data?.message;
    }
  };

  const query = useQuery({
    queryKey: ["useBeritaAcaraList", props?.params?.status],
    queryFn: useBeritaAcaraListFn,
    staleTime: Infinity,
    enabled: true,
  });

  return { ...query };
};

export default useBeritaAcaraList;
