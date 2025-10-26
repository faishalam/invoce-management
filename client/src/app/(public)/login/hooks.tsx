"use client";
import useLogin from "@/service/auth/login";
import { useRouter } from "next/navigation";
import { createContext, useContext } from "react";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginSchema, TLoginForm } from "./validator";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";

const useUserLoginHooks = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    resetField,
  } = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    mutate: mutateLogin,
    data: dataLogin,
    isPending: isLoadingLogin,
  } = useLogin({
    onSuccess: (data) => {
      if (!data) return;
      Cookies.set("accessToken", data.access_token, {
        expires: 7,
        sameSite: "lax",
        path: "/",
      });
      router.push("/ba-management");
      toast.success("Login Berhasil");
    },
    onError: (error) => {
      toast.error(error as string);
      reset();
    },
  });

  const onSubmit: SubmitHandler<TLoginForm> = (data) => {
    mutateLogin(data);
  };

  const onInvalid = (errors: FieldErrors<TLoginForm>) => {
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
