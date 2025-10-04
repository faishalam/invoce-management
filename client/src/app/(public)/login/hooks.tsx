import useLogin from "@/service/user/login";
import { TInputLogin, TLoginResponse } from "@/service/user/types";
import { useRouter } from "next/navigation";
import { createContext, useContext } from "react";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const useUserLoginHooks = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    resetField,
  } = useForm<TInputLogin>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    mutate: mutateLogin,
    data: dataLogin,
    isLoadingLogin,
  } = useLogin({
    onSuccess: (data: TLoginResponse) => {
      if (!data) return;
      localStorage.setItem("Authorization", data.access_token);
      router.push("/");
    },
    onError: (error: unknown) => {
      toast.error(error as string);
      reset();
    },
  });

  const onSubmit: SubmitHandler<TInputLogin> = (data) => {
    mutateLogin(data);
  };

  const onInvalid = (errors: FieldErrors<TInputLogin>) => {
    Object.entries(errors).forEach(([key, error]) => {
      console.log(key);
      if (error?.message) {
        toast.error(error.message);
      }
    });
  };

  return {
    onInvalid,
    onSubmit,
    control,
    register,
    handleSubmit,
    errors,
    reset,
    resetField,
    mutateLogin,
    dataLogin,
    isLoadingLogin,
  };
};

const useUserContext = createContext<
  ReturnType<typeof useUserLoginHooks> | undefined
>(undefined);

export const UserProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = useUserLoginHooks();
  return (
    <useUserContext.Provider value={value}>{children}</useUserContext.Provider>
  );
};

export const useUserLogin = () => {
  const context = useContext(useUserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within an UserProvider");
  }
  return context;
};
export default useUserLogin;
