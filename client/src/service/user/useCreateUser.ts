import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { TUserForm, TUserListResponse } from "./types";
import { HeroServices } from "../HeroService";

type TUserCreateUser = {
  onSuccess?: (data: TUserListResponse) => void;
  onError?: (error: unknown) => void;
};

const useCreateUser = (props?: TUserCreateUser) => {
  const useCreateUserFn = async (payload: TUserForm) => {
    try {
      const response = await HeroServices.post<
        TResponseType<TUserListResponse>
      >(`/users`, payload);

      if (response.status !== 201) return;
      return response?.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data;
    }
  };

  const mutation = useMutation({
    mutationKey: ["useCreateUser"],
    mutationFn: useCreateUserFn,
    onSuccess: (response) => {
      if (response) {
        props?.onSuccess?.(response);
      }
    },
    onError: (error) => {
      if (props?.onError) {
        props.onError(error?.message);
      }
    },
  });

  return { ...mutation };
};

export default useCreateUser;
