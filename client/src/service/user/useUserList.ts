import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { TUserListResponse } from "./types";
import { HeroServices } from "../HeroService";

type TUseUserListProps = {
  onSuccess?: (data: TUserListResponse) => void;
  onError?: (error: unknown) => void;
};

const useUserList = (props?: TUseUserListProps) => {
  const useUserListFn = async () => {
    try {
      const response = await HeroServices.get<TResponseType<TUserListResponse[]>>(
        `/users`
      );

      if (response.status !== 200) return;

      return response?.data
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      toast.error(err?.response?.data?.message);
      throw err?.response?.data?.message;
    }
  };

  const query = useQuery({
    queryKey: ["useUserList"],
    queryFn: useUserListFn,
    staleTime: Infinity,
    enabled: true,
  });

  return { ...query };
};

export default useUserList;
