import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "@/service/HeroService";

type TUseUpdateGoodsProps = {
  onSuccess?: (data: { name: string }) => void;
  onError?: (error: unknown) => void;
};

const useUpdateGoods = (props?: TUseUpdateGoodsProps) => {
  const useUpdateGoodsFn = async ({
    id,
    payload,
  }: {
    id: string;
    payload: { name: string; code: string };
  }) => {
    try {
      const response = await HeroServices.put<
        TResponseType<{ name: string; code: string }>
      >(`/goods/${id}`, payload);

      if (response.status !== 200) return;
      return response?.data?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data;
    }
  };

  const mutation = useMutation({
    mutationKey: ["useUpdateGoods"],
    mutationFn: useUpdateGoodsFn,
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

export default useUpdateGoods;
