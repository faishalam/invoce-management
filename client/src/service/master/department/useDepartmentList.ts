import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError, TResponseType } from "@/utils/response-type";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { HeroServices } from "../../HeroService";
import { TDepartmentResponse } from "./types";

type TUseDepartmentProps = {
  onSuccess?: (data: TDepartmentResponse) => void;
  onError?: (error: unknown) => void;
};

const useDepartmentList = (props?: TUseDepartmentProps) => {
  const useDepartmentListFn = async () => {
    try {
      const response = await HeroServices.get<
        TResponseType<TDepartmentResponse[]>
      >(`/department`);

      if (response.status !== 200) return;

      return response?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      toast.error(err?.response?.data?.message);
      throw err?.response?.data?.message;
    }
  };

  const query = useQuery({
    queryKey: ["useDepartmentList"],
    queryFn: useDepartmentListFn,
    staleTime: Infinity,
    enabled: true,
  });

  return { ...query };
};

export default useDepartmentList;
