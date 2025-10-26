import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { TUserListResponse } from "./types";
import { HeroServices } from "../HeroService";

type TUseUserById = {
  onSuccess?: (data: TUserListResponse) => void;
  onError?: (error: unknown) => void;
  params: {
    id: string;
  };
};

const useUserById = (props?: TUseUserById) => {
  const useUserByIdFn = async () => {
    try {
      const response = await HeroServices.get<TResponseType<TUserListResponse>>(
        `/users/${props?.params?.id}`
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
    queryKey: ["useUserById", props?.params.id],
    queryFn: useUserByIdFn,
    staleTime: Infinity,
    enabled: !!props?.params.id && props?.params.id !== "",
  });

  return { ...query };
};

export default useUserById;
