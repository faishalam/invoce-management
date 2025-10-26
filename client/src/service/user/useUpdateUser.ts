import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { TUserForm, TUserListResponse } from "./types";
import { HeroServices } from "../HeroService";

type TUserUpdateUser = {
  onSuccess?: (data: TUserListResponse) => void;
  onError?: (error: unknown) => void;
};

const useUpdateUser = (props?: TUserUpdateUser) => {
  const useUpdateUserFn = async ({
    id,
    payload,
  }: {
    id: string;
    payload: TUserForm;
  }) => {
    try {
      const response = await HeroServices.put<TResponseType<TUserListResponse>>(
        `/users/${id}`,
        payload
      );

      const { status } = response;

      if (status !== 200) return;
      return response.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    }
  };

  const mutation = useMutation({
    mutationKey: ["useUpdateUser"],
    mutationFn: useUpdateUserFn,
    onSuccess: (data) => {
      if (data) {
        props?.onSuccess?.(data);
      }
    },
    onError: (error) => {
      if (props?.onError) {
        props.onError(error);
      }
    },
  });

  return { ...mutation };
};

export default useUpdateUser;
