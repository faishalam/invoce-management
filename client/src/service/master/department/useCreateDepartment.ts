import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "@/service/HeroService";

type TUseCreateDepartmentProps = {
  onSuccess?: (data: { name: string }) => void;
  onError?: (error: unknown) => void;
};

const useCreateDepartment = (props?: TUseCreateDepartmentProps) => {
  const useCreateDepartmentFn = async (payload: { name: string }) => {
    try {
      const response = await HeroServices.post<TResponseType<{ name: string }>>(
        `/department`,
        payload
      );
      console.log(response)
      if (response.status !== 201) return;
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data;
    }
  };

  const mutation = useMutation({
    mutationKey: ["useCreateDepartment"],
    mutationFn: useCreateDepartmentFn,
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

export default useCreateDepartment;
