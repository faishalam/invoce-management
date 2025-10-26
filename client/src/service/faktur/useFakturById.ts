import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { HeroServices } from "../HeroService";
import { TFakturList } from "./types";

type TUseFakturByIdProps = {
  onSuccess?: (data: TFakturList) => void;
  onError?: (error: unknown) => void;
  params: {
    id?: string;
    enabled?: boolean;
  };
};

const useFakturById = (props?: TUseFakturByIdProps) => {
  const useFakturByIdFn = async () => {
    try {
      const response = await HeroServices.get<TResponseType<TFakturList>>(
        `/faktur/${props?.params?.id}`
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
    queryKey: ["useFakturById", props?.params.id],
    queryFn: useFakturByIdFn,
    staleTime: Infinity,
    enabled: !!props?.params.id && !!props?.params.enabled,
  });

  return { ...query };
};

export default useFakturById;
