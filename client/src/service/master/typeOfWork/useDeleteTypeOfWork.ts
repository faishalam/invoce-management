import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "@/service/HeroService";

type TUseCreateTypeOfWorkProps = {
  onSuccess?: (data: null) => void;
  onError?: (error: unknown) => void;
};

const useDeleteTypeOfWork = (props?: TUseCreateTypeOfWorkProps) => {
  const useDeleteTypeOfWorkFn = async (id: string) => {
    try {
      const response = await HeroServices.delete<TResponseType<null>>(
        `/typeOfWork/${id}`
      );

      const { status } = response;

      if (status !== 200) return;

      return null;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data;
    }
  };

  const mutation = useMutation({
    mutationKey: ["useDeleteTypeOfWork"],
    mutationFn: useDeleteTypeOfWorkFn,
    onSuccess: (response) => {
      props?.onSuccess?.(response ?? null);
    },
    onError: (error) => {
      if (props?.onError) {
        props.onError(error?.message);
      }
    },
  });

  return { ...mutation };
};

export default useDeleteTypeOfWork;
