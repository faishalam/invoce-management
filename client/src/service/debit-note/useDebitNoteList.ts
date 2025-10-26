import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { HeroServices } from "../HeroService";
import { TDebitNoteList } from "./types";

const useDebitNoteList = () => {
  const useDebitNoteListFn = async () => {
    try {
      const response = await HeroServices.get<TResponseType<TDebitNoteList[]>>(
        `/debit-note`
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
    queryKey: ["useDebitNoteList"],
    queryFn: useDebitNoteListFn,
    staleTime: Infinity,
    enabled: true,
  });

  return { ...query };
};

export default useDebitNoteList;
