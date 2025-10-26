import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { HeroServices } from "../HeroService";
import { TFakturList } from "./types";

const useFakturList = () => {
  const useFakturListFn = async () => {
    try {
      const response = await HeroServices.get<TResponseType<TFakturList[]>>(
        `/faktur`
      );

      if (response.status !== 200) return;

      return response?.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      toast.error(err?.response?.data?.message);
      throw err?.response?.data?.message;
    }
  };

  const query = useQuery({
    queryKey: ["useFakturList"],
    queryFn: useFakturListFn,
    staleTime: Infinity,
    enabled: true,
  });

  return { ...query };
};

export default useFakturList;
