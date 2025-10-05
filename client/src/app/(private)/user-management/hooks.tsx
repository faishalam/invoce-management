"use client";
import EyeIcon from "@/assets/svg/eye-icon.svg";
import IconPencil from "@/assets/svg/icon-pencil.svg";
import DeleteIcon from "@/assets/svg/delete-icon.svg";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";
import {
  createUserSchema,
  TUserForm,
  updateUserSchema,
  userSchema,
} from "./validator";
import useUserList from "@/service/user/useUserList";
import useCreateUser from "@/service/user/useCreateUser";
import useDeleteUser from "@/service/user/useDeleteUser";
import useUpdateUser from "@/service/user/useUpdateUser";
import {
  ColDef,
  ColGroupDef,
  ICellRendererParams,
} from "@ag-grid-community/core";
import { TUserListResponse } from "@/service/user/types";
import { TUserList, TUserListCol } from "./types";
import Image from "next/image";
import { useModalWarningInfo } from "@/components/atoms/modal-warning";
import useUserById from "@/service/user/useUserById";
import useGlobal from "@/app/context/hooks";

const useUserManagementHooks = () => {
  const modalWarningInfo = useModalWarningInfo();
  const queryClient = useQueryClient();
  const [openModalUser, setOpenModalUser] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [mode, setMode] = useState<"create" | "edit" | "view">("create");
  const { dataDepartment, isLoadingDepartment } = useGlobal();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<TUserForm>({
    resolver: zodResolver(
      mode === "create" ? createUserSchema : updateUserSchema
    ),
    defaultValues: {
      id: "",
      email: "",
      name: "",
      password: "",
      is_active: true,
      role: "",
      departmentId: "",
    },
    mode: "onChange",
  });
  const [filter, setFilter] = useState<{
    search: string;
    role: string | null;
    departmentId: string | null;
  }>({ search: "", role: null, departmentId: null });
  const { data: dataUser, isPending: isLoadingDataUser } = useUserList();

  const { data: dataUserById, isPending: isLoadingDataUserById } = useUserById({
    params: {
      id: selectedUserId,
    },
  });

  const { mutate: mutateCreateUser, isPending: isLoadingCreateUser } =
    useCreateUser({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useUserList"] });
        setOpenModalUser(false);
        toast.success("User Berhasil Ditambahkan");
        reset();
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  const { mutate: mutateDeleteUser, isPending: isLoadingDeleteUser } =
    useDeleteUser({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useUserList"] });
        setOpenModalUser(false);
        toast.success("User Berhasil Dihapus");
        reset();
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  const { mutate: mutateUpdateUser, isPending: isLoadingUpdateUser } =
    useUpdateUser({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useUserList"] });
        setOpenModalUser(false);
        toast.success("User Berhasil Diupdate");
        reset();
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  const onSubmit: SubmitHandler<TUserForm> = (data) => {
    if (data.id) {
      modalWarningInfo.open({
        title: "Konfirmasi",
        message: (
          <div>
            <p>Apakah anda yakin ingin mengupdate user ini?</p>
          </div>
        ),
        onConfirm: () => {
          if (data.id) mutateUpdateUser({ id: data.id, payload: data });
        },
      });
    } else {
      modalWarningInfo.open({
        title: "Konfirmasi",
        message: (
          <div>
            <p>Apakah anda yakin ingin menambahkan user ini?</p>
          </div>
        ),
        onConfirm: () => {
          mutateCreateUser(data);
        },
      });
    }
  };

  const onInvalid = (errors: FieldErrors<TUserForm>) => {
    Object.entries(errors).forEach(([key, error]) => {
      if (error?.message) {
        toast.error(error.message);
      }
    });
  };

  const dataGrid = useMemo(() => {
    const dataFilter = dataUser?.data?.filter((x: TUserListResponse) => {
      const search1 = x.name
        .toLowerCase()
        .includes(filter.search.toLowerCase());
      const search2 = x.email
        .toLowerCase()
        .includes(filter.search.toLowerCase());
      const search3 = x.role
        .toLowerCase()
        .includes(filter.search.toLowerCase());

      const departmentName =
        dataDepartment?.data
          .find((d) => d.id === x.departmentId)
          ?.name?.toLowerCase() ?? "";
      const search4 = departmentName
        .toLowerCase()
        .includes(filter.search.toLowerCase());

      const search = search1 || search2 || search3 || search4;

      const byRoles = filter.role ? x.role === filter.role : true;
      const byDepartment = filter?.departmentId
        ? x.departmentId === filter?.departmentId
        : true;
      return search && byRoles && byDepartment;
    });
    return dataFilter;
  }, [dataUser, filter]);

  const usersColumnsDef = useMemo<ColDef<TUserListCol>[]>(() => {
    return [
      {
        width: 90,
        headerName: "No",
        cellRenderer: (params: ICellRendererParams<TUserListResponse>) => {
          const rowIndex = params.node?.rowIndex ?? 0;
          return <span>{rowIndex + 1}</span>;
        },
      },
      {
        field: "email",
        headerName: "Email",
        width: 250,
      },
      {
        field: "name",
        headerName: "Name",
        flex: 2,
      },
      { field: "role", headerName: "Role", flex: 1 },
      {
        field: "is_active",
        headerName: "Active",
        flex: 1,
        cellRenderer: (params: ICellRendererParams<TUserListResponse>) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              params.data?.is_active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {params.data?.is_active ? "Aktif" : "Tidak Aktif"}
          </span>
        ),
      },
      {
        field: "departmentId",
        headerName: "Department",
        flex: 1,
        cellRenderer: (params: ICellRendererParams<TUserListResponse>) => {
          const departmentName =
            dataDepartment?.data?.find(
              (dept) => dept.id === params.data?.departmentId
            )?.name ?? "-";
          return <span>{departmentName}</span>;
        },
      },
      {
        width: 120,
        headerName: "Actions",
        sortable: false,
        pinned: "right",
        cellRenderer: (params: ICellRendererParams<TUserListResponse>) => {
          return (
            <div className="flex gap-1 py-1 items-center justify-center">
              <div
                onClick={() => {
                  if (params && params.data?.id) {
                    setSelectedUserId(params.data.id);
                    setOpenModalUser(true);
                    setMode("view");
                  }
                }}
                className="cursor-pointer"
              >
                <Image src={EyeIcon} alt="edit" />
              </div>

              <div
                onClick={() => {
                  if (params && params.data?.id) {
                    setSelectedUserId(params?.data?.id);
                    setOpenModalUser(true);
                    setMode("edit");
                  }
                }}
                className="cursor-pointer"
              >
                <Image src={IconPencil} alt="edit" />
              </div>

              <div
                onClick={() => {
                  if (params && params.data) {
                    modalWarningInfo.open({
                      title: "Konfirmasi",
                      message: (
                        <div>
                          <p>Apakah anda yakin ingin menghapus user ini?</p>
                        </div>
                      ),
                      onConfirm: () => {
                        if (params && params.data?.id)
                          mutateDeleteUser(params.data.id);
                      },
                    });
                  }
                }}
                className="cursor-pointer"
              >
                <Image src={DeleteIcon} alt="edit" />
              </div>
            </div>
          );
        },
      },
    ];
  }, [dataUser, dataDepartment]);

  useEffect(() => {
    if (dataUserById && (mode === "view" || mode === "edit")) {
      if (dataUserById.data) {
        const formData: TUserForm = {
          id: dataUserById.data.id,
          email: dataUserById.data.email,
          password: dataUserById.data.password ?? "",
          departmentId: dataUserById.data.departmentId,
          role: dataUserById.data.role,
          name: dataUserById.data.name,
          is_active: dataUserById.data.is_active,
        };
        reset(formData);
      }
    } else if (mode === "create") {
      reset({
        email: "",
        name: "",
        password: "",
        role: "",
        is_active: true,
        departmentId: "",
      });
    }
  }, [dataUserById, mode, reset]);

  return {
    dataUserById,
    isLoadingDataUserById,
    usersColumnsDef,
    openModalUser,
    setOpenModalUser,
    control,
    handleSubmit,
    watch,
    errors,
    reset,
    onSubmit,
    onInvalid,
    dataUser,
    isLoadingDataUser,
    isLoadingCreateUser,
    isLoadingDeleteUser,
    isLoadingUpdateUser,
    mutateDeleteUser,
    dataGrid,
    filter,
    setFilter,
    mode,
    setSelectedUserId,
    selectedUserId,
    setMode,
    isLoadingDepartment,
  };
};

const useUserManagementContext = createContext<
  ReturnType<typeof useUserManagementHooks> | undefined
>(undefined);

export const UserManagementProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = useUserManagementHooks();
  return (
    <useUserManagementContext.Provider value={value}>
      {children}
    </useUserManagementContext.Provider>
  );
};

export const useUserManagement = () => {
  const context = useContext(useUserManagementContext);
  if (context === undefined) {
    throw new Error(
      "useUserManagementContext must be used within an UserManagementProvider"
    );
  }
  return context;
};
export default useUserManagement;
