import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { HeroServices } from "../HeroService";
import { TDebitNoteList } from "./types";

type TUseDebitNoteByIdProps = {
  onSuccess?: (data: TDebitNoteList) => void;
  onError?: (error: unknown) => void;
  params: {
    id?: string;
    enabled?: boolean;
  };
};

const useDebitNoteById = (props?: TUseDebitNoteByIdProps) => {
  const useDebitNoteByIdFn = async () => {
    try {
      const response = await HeroServices.get<TResponseType<TDebitNoteList>>(
        `/debit-note/${props?.params?.id}`
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
    queryKey: ["useDebitNoteById", props?.params.id],
    queryFn: useDebitNoteByIdFn,
    staleTime: Infinity,
    enabled: !!props?.params.id && !!props?.params.enabled,
  });

  return { ...query };
};

export default useDebitNoteById;
