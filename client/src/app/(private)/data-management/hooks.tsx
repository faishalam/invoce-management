"use client";
import IconPencil from "@/assets/svg/icon-pencil.svg";
import { createContext, useContext, useMemo, useState } from "react";
import { useModalWarningInfo } from "@/components/atoms/modal-warning";
import { useQueryClient } from "@tanstack/react-query";
import useGlobal from "@/app/(private)/hooks";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  customerSchema,
  departmentSchema,
  goodsSchema,
  satuanSchema,
  typeOfWorkSchema,
} from "./validator";
import useCreateDepartment from "@/service/master/department/useCreateDepartment";
import { toast } from "sonner";
import useCreateSatuan from "@/service/master/satuan/useCreateSatuan";
import useCreateTypeOfWork from "@/service/master/typeOfWork/useCreateTypeOfWork";
import useCreateCustomer from "@/service/master/customer/useCreateCustomer";
import useDeleteCustomer from "@/service/master/customer/useDeleteCustomer";
import useDeleteSatuan from "@/service/master/satuan/useDeleteSatuan";
import useDeleteTypeOfWork from "@/service/master/typeOfWork/useDeleteTypeOfWork";
import useDeleteDepartment from "@/service/master/department/useDeleteDepartment";
import { ColDef, ICellRendererParams } from "@ag-grid-community/core";
import Image from "next/image";
import useUpdateCustomer from "@/service/master/customer/useUpdateCustomer";
import useUpdateTypeOfWork from "@/service/master/typeOfWork/useUpdateTypeOfWork";
import useUpdateSatuan from "@/service/master/satuan/useUpdateSatuan";
import useUpdateDepartment from "@/service/master/department/useUpdateDepartment";
import useCreateGoods from "@/service/master/goods/useCreateGoods";
import useUpdateGoods from "@/service/master/goods/useUpdateGoods";

const useDataManagementHooks = () => {
  const modalWarningInfo = useModalWarningInfo();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string>("");
  const [modeCustomer, setModeCustomer] = useState<string>("");
  const [modeTypeOfWork, setModeTypeOfWork] = useState<string>("");
  const [modeSatuan, setModeSatuan] = useState<string>("");
  const [modeGoods, setModeGoods] = useState<string>("");
  const [modeDepartment, setModeDepartment] = useState<string>("");
  const [openModalDepartment, setOpenModalDepartment] =
    useState<boolean>(false);
  const [openModalSatuan, setOpenModalSatuan] = useState<boolean>(false);
  const [openModalGoods, setOpenModalGoods] = useState<boolean>(false);
  const [openModalTypeOfWork, setOpenModalTypeOfWork] =
    useState<boolean>(false);
  const [openModalCustomer, setOpenModalCustomer] = useState<boolean>(false);

  const {
    dataDepartment,
    dataCustomer,
    dataTypeOfWork,
    dataSatuan,
    dataGoods,
    isLoadingGoods,
    isLoadingCustomer,
    isLoadingDepartment,
    isLoadingTypeOfWork,
    isLoadingSatuan,
  } = useGlobal();

  const {
    handleSubmit: handleSubmitDepartment,
    reset: resetDepartment,
    control: controlDepartment,
    formState: { errors: errorsDepartment },
  } = useForm<{ name: string }>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
    },
  });

  const {
    handleSubmit: handleSubmitSatuan,
    reset: resetSatuan,
    control: controlSatuan,
    formState: { errors: errorsSatuan },
  } = useForm<{ name: string }>({
    resolver: zodResolver(satuanSchema),
    defaultValues: {
      name: "",
    },
  });

  const {
    handleSubmit: handleSubmitTypeOfWork,
    reset: resetTypeOfWork,
    control: controlTypeOfWork,
    formState: { errors: errorsTypeOfWork },
  } = useForm<{ name: string; type: string }>({
    resolver: zodResolver(typeOfWorkSchema),
    defaultValues: {
      name: "",
      type: "",
    },
  });

  const {
    handleSubmit: handleSubmitCustomer,
    reset: resetCustomer,
    control: controlCustomer,
    formState: { errors: errorsCustomer },
  } = useForm<{ name: string; code: string }>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const {
    handleSubmit: handleSubmitGoods,
    reset: resetGoods,
    control: controlGoods,
    formState: { errors: errorsGoods },
  } = useForm<{ name: string; code: string }>({
    resolver: zodResolver(goodsSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const {
    mutate: mutateCreateDepartment,
    isPending: isLoadingCreateDepartment,
  } = useCreateDepartment({
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["useDepartmentList"] });
      setOpenModalDepartment(false);
      resetDepartment();
      toast.success("Department Berhasil Dibuat");
    },
    onError: (error) => {
      toast.error(error as string);
    },
  });

  const { mutate: mutateCreateSatuan, isPending: isLoadingCreateSatuan } =
    useCreateSatuan({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useSatuanList"] });
        setOpenModalSatuan(false);
        resetSatuan();
        toast.success("Satuan Berhasil Dibuat");
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  const { mutate: mutateCreateGoods, isPending: isLoadingCreateGoods } =
    useCreateGoods({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useGoodsList"] });
        setOpenModalGoods(false);
        resetGoods();
        toast.success("Goods Berhasil Dibuat");
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  const {
    mutate: mutateCreateTypeOfWork,
    isPending: isLoadingCreateTypeOfWork,
  } = useCreateTypeOfWork({
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["useTypeOfWorkList"] });
      setOpenModalTypeOfWork(false);
      resetTypeOfWork();
      toast.success("Jenis Pekerjaan Berhasil Dibuat");
    },
    onError: (error) => {
      toast.error(error as string);
    },
  });

  const { mutate: mutateCreateCustomer, isPending: isLoadingCreateCustomer } =
    useCreateCustomer({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useCustomerList"] });
        setOpenModalCustomer(false);
        resetCustomer();
        toast.success("Customer Berhasil Dibuat");
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  const { mutate: mutateUpdateCustomer, isPending: isLoadingUpdateCustomer } =
    useUpdateCustomer({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useCustomerList"] });
        setOpenModalCustomer(false);
        resetCustomer();
        setSelectedId("");
        toast.success("Berhasil Diperbarui");
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  const {
    mutate: mutateUpdateDepartment,
    isPending: isLoadignUpdateDepartment,
  } = useUpdateDepartment({
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["useDepartmentList"] });
      setOpenModalDepartment(false);
      resetDepartment();
      setSelectedId("");
      toast.success("Berhasil Diperbarui");
    },
    onError: (error) => {
      toast.error(error as string);
    },
  });

  const {
    mutate: mutateUpdateTypeOfWork,
    isPending: isLoadingUpdateTypeOfWork,
  } = useUpdateTypeOfWork({
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["useTypeOfWorkList"] });
      setOpenModalTypeOfWork(false);
      resetTypeOfWork();
      setSelectedId("");
      toast.success("Berhasil Diperbarui");
    },
    onError: (error) => {
      toast.error(error as string);
    },
  });

  const { mutate: mutateUpdateSatuan, isPending: isLoadingUpdateSatuan } =
    useUpdateSatuan({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useSatuanList"] });
        setOpenModalSatuan(false);
        resetSatuan();
        setSelectedId("");
        toast.success("Berhasil Diperbarui");
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  const { mutate: mutateUpdateGoods, isPending: isLoadingUpdateGoods } =
    useUpdateGoods({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useGoodsList"] });
        setOpenModalGoods(false);
        resetGoods();
        setSelectedId("");
        toast.success("Berhasil Diperbarui");
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  const onSubmitDepartment: SubmitHandler<{ name: string }> = (data) => {
    if (modeDepartment === "create") {
      modalWarningInfo.open({
        title: "Konfirmasi",
        message: (
          <div>
            <p>Apakah anda yakin ingin menambahkan department ini?</p>
          </div>
        ),
        onConfirm: () => {
          mutateCreateDepartment(data);
        },
      });
    }

    if (modeDepartment === "edit") {
      modalWarningInfo.open({
        title: "Konfirmasi",
        message: (
          <div>
            <p>Apakah anda yakin ingin memperbarui department ini?</p>
          </div>
        ),
        onConfirm: () => {
          mutateUpdateDepartment({ id: selectedId, payload: data });
        },
      });
    }
  };

  const onInvalidDepartment = (errors: FieldErrors<{ name: string }>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(errors).forEach(([_, error]) => {
      if (error?.message) {
        toast.error(error.message);
      }
    });
  };

  const onSubmitSatuan: SubmitHandler<{ name: string }> = (data) => {
    if (modeSatuan === "create") {
      modalWarningInfo.open({
        title: "Konfirmasi",
        message: (
          <div>
            <p>Apakah anda yakin ingin menambahkan satuan ini?</p>
          </div>
        ),
        onConfirm: () => {
          mutateCreateSatuan(data);
        },
      });
    }

    if (modeSatuan === "edit") {
      modalWarningInfo.open({
        title: "Konfirmasi",
        message: (
          <div>
            <p>Apakah anda yakin ingin memperbarui satuan ini?</p>
          </div>
        ),
        onConfirm: () => {
          mutateUpdateSatuan({ id: selectedId, payload: data });
        },
      });
    }
  };

  const onSubmitGoods: SubmitHandler<{ name: string; code: string }> = (
    data
  ) => {
    if (modeGoods === "create") {
      modalWarningInfo.open({
        title: "Konfirmasi",
        message: (
          <div>
            <p>Apakah anda yakin ingin menambahkan goods ini?</p>
          </div>
        ),
        onConfirm: () => {
          mutateCreateGoods(data);
        },
      });
    }

    if (modeGoods === "edit") {
      modalWarningInfo.open({
        title: "Konfirmasi",
        message: (
          <div>
            <p>Apakah anda yakin ingin memperbarui goods ini?</p>
          </div>
        ),
        onConfirm: () => {
          mutateUpdateGoods({ id: selectedId, payload: data });
        },
      });
    }
  };

  const onInvalidSatuan = (errors: FieldErrors<{ name: string }>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(errors).forEach(([_, error]) => {
      if (error?.message) {
        toast.error(error.message);
      }
    });
  };

  const onInvalidGoods = (errors: FieldErrors<{ name: string }>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(errors).forEach(([_, error]) => {
      if (error?.message) {
        toast.error(error.message);
      }
    });
  };

  const onSubmitTypeOfWork: SubmitHandler<{ name: string; type: string }> = (
    data
  ) => {
    if (modeTypeOfWork === "create") {
      modalWarningInfo.open({
        title: "Konfirmasi",
        message: (
          <div>
            <p>Apakah anda yakin ingin menambahkan type of work ini?</p>
          </div>
        ),
        onConfirm: () => {
          mutateCreateTypeOfWork(data);
        },
      });
    }

    if (modeTypeOfWork === "edit") {
      modalWarningInfo.open({
        title: "Konfirmasi",
        message: (
          <div>
            <p>Apakah anda yakin ingin memperbarui type of work ini?</p>
          </div>
        ),
        onConfirm: () => {
          mutateUpdateTypeOfWork({ id: selectedId, payload: data });
        },
      });
    }
  };

  const onInvalidTypeOfWork = (
    errors: FieldErrors<{ name: string; type: string }>
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(errors).forEach(([_, error]) => {
      if (error?.message) {
        toast.error(error.message);
      }
    });
  };

  const onSubmitCustomer: SubmitHandler<{
    name: string;
    code: string;
  }> = (data) => {
    if (modeCustomer === "create") {
      modalWarningInfo.open({
        title: "Konfirmasi",
        message: (
          <div>
            <p>Apakah anda yakin ingin menambahkan customer ini?</p>
          </div>
        ),
        onConfirm: () => {
          mutateCreateCustomer(data);
        },
      });
    }
    if (modeCustomer === "edit") {
      modalWarningInfo.open({
        title: "Konfirmasi",
        message: (
          <div>
            <p>Apakah anda yakin ingin memperbarui customer ini?</p>
          </div>
        ),
        onConfirm: () => {
          const payload = {
            id: selectedId,
            payload: data,
          };
          mutateUpdateCustomer(payload);
        },
      });
    }
  };

  const onInvalidCustomer = (
    errors: FieldErrors<{ name: string; code: string }>
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(errors).forEach(([_, error]) => {
      if (error?.message) {
        toast.error(error.message);
      }
    });
  };

  const {
    mutate: mutateDeleteDepartment,
    isPending: isLoadingDeleteDepartment,
  } = useDeleteDepartment({
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["useDepartmentList"] });
      toast.success("Department Berhasil Dihapus");
    },
    onError: (error) => {
      toast.error(error as string);
    },
  });

  const { mutate: mutateDeleteSatuan, isPending: isLoadingDeleteSatuan } =
    useDeleteSatuan({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useSatuanList"] });
        toast.success("Satuan Berhasil Dihapus");
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  const {
    mutate: mutateDeleteTypeOfWork,
    isPending: isLoadingDeleteTypeOfWork,
  } = useDeleteTypeOfWork({
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["useTypeOfWorkList"] });
      toast.success("Jenis Pekerjeaan Berhasil Dihapus");
    },
    onError: (error) => {
      toast.error(error as string);
    },
  });

  const { mutate: mutateDeleteCustomer, isPending: isLoadingDeleteCustomer } =
    useDeleteCustomer({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useCustomerList"] });
        toast.success("Customer Berhasil Dihapus");
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  //department
  const [filterDepartment, setFilterDepartment] = useState<{
    search: string;
  }>({ search: "" });

  const dataGridDepartment = useMemo(() => {
    const dataFilter = dataDepartment?.data?.filter(
      (x: { id: string; name: string }) => {
        const search1 = x.name
          .toLowerCase()
          .includes(filterDepartment.search.toLowerCase());

        const search = search1;
        return search;
      }
    );
    return dataFilter;
  }, [dataDepartment, filterDepartment]);

  const departmentColumnDef = useMemo<
    ColDef<{ id: string; name: string }>[]
  >(() => {
    return [
      {
        width: 90,
        headerName: "No",
        cellRenderer: (
          params: ICellRendererParams<{ id: string; name: string }>
        ) => {
          const rowIndex = params.node?.rowIndex ?? 0;
          return <span>{rowIndex + 1}</span>;
        },
      },
      {
        field: "name",
        headerName: "Name",
        flex: 1,
      },
      {
        width: 120,
        headerName: "Actions",
        sortable: false,
        pinned: "right",
        cellRenderer: (
          params: ICellRendererParams<{ id: string; name: string }>
        ) => {
          return (
            <div className="flex w-full gap-1 py-1 items-center justify-center">
              <div className="flex gap-1 py-1 items-center justify-center">
                <div
                  onClick={() => {
                    if (params && params.data?.id) {
                      setSelectedId(params.data.id);
                      resetDepartment({
                        name: params.data.name,
                      });
                      setModeDepartment("edit");
                      setOpenModalDepartment(true);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <Image src={IconPencil} alt="edit" />
                </div>
              </div>
            </div>
          );
        },
      },
    ];
  }, [dataGridDepartment, filterDepartment]);

  //satuan
  const [filterSatuan, setFilterSatuan] = useState<{
    search: string;
  }>({ search: "" });

  const dataGridSatuan = useMemo(() => {
    const dataFilter = dataSatuan?.data?.filter((x: { name: string }) => {
      const search1 = x.name
        .toLowerCase()
        .includes(filterDepartment.search.toLowerCase());

      const search = search1;
      return search;
    });
    return dataFilter;
  }, [dataSatuan, filterSatuan]);

  const satuanColumnDef = useMemo<
    ColDef<{ id: string; name: string }>[]
  >(() => {
    return [
      {
        width: 90,
        headerName: "No",
        cellRenderer: (
          params: ICellRendererParams<{ id: string; name: string }>
        ) => {
          const rowIndex = params.node?.rowIndex ?? 0;
          return <span>{rowIndex + 1}</span>;
        },
      },
      {
        field: "name",
        headerName: "Name",
        width: 250,
        flex: 1,
      },
      {
        width: 120,
        headerName: "Actions",
        sortable: false,
        pinned: "right",
        cellRenderer: (
          params: ICellRendererParams<{ id: string; name: string }>
        ) => {
          return (
            <div className="w-full flex gap-1 py-1 items-center justify-center">
              <div
                onClick={() => {
                  if (params && params.data?.id) {
                    setSelectedId(params.data.id);
                    resetSatuan({
                      name: params.data.name,
                    });
                    setModeSatuan("edit");
                    setOpenModalSatuan(true);
                  }
                }}
                className="cursor-pointer"
              >
                <Image src={IconPencil} alt="edit" />
              </div>
            </div>
          );
        },
      },
    ];
  }, [dataGridSatuan, filterSatuan]);

  //typeOfWork
  const [filterTypeOfWork, setFilterTypeOfWork] = useState<{
    search: string;
  }>({ search: "" });

  const dataGridTypeOfWork = useMemo(() => {
    const dataFilter = dataTypeOfWork?.data?.filter(
      (x: { id: string; name: string; type: string }) => {
        const search1 = x.name
          .toLowerCase()
          .includes(filterDepartment.search.toLowerCase());
        const search2 = x.type
          .toLowerCase()
          .includes(filterDepartment.search.toLowerCase());

        const search = search1 || search2;
        return search;
      }
    );
    return dataFilter;
  }, [dataTypeOfWork, filterTypeOfWork]);

  const typeOfWorkColumnDef = useMemo<
    ColDef<{ id: string; name: string; type: string }>[]
  >(() => {
    return [
      {
        width: 90,
        headerName: "No",
        cellRenderer: (
          params: ICellRendererParams<{ id: string; name: string }>
        ) => {
          const rowIndex = params.node?.rowIndex ?? 0;
          return <span>{rowIndex + 1}</span>;
        },
      },
      {
        field: "name",
        headerName: "Name",
        width: 250,
        flex: 1,
      },
      {
        field: "type",
        headerName: "Tipe",
        width: 250,
        flex: 1,
      },
      {
        width: 120,
        headerName: "Actions",
        sortable: false,
        pinned: "right",
        cellRenderer: (
          params: ICellRendererParams<{
            id: string;
            name: string;
            type: string;
          }>
        ) => {
          return (
            <div className="w-full flex gap-1 py-1 items-center justify-center">
              <div className="flex gap-1 py-1 items-center justify-center">
                <div
                  onClick={() => {
                    if (params && params.data?.id) {
                      setSelectedId(params.data.id);
                      resetTypeOfWork({
                        name: params.data.name,
                        type: params.data?.type,
                      });
                      setModeTypeOfWork("edit");
                      setOpenModalTypeOfWork(true);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <Image src={IconPencil} alt="edit" />
                </div>
              </div>
            </div>
          );
        },
      },
    ];
  }, [dataGridDepartment, filterTypeOfWork]);

  //customer
  const [filterCustomer, setFilterCustomer] = useState<{
    search: string;
  }>({ search: "" });

  const dataGridCustomer = useMemo(() => {
    const dataFilter = dataCustomer?.data?.filter(
      (x: { name: string; code: string }) => {
        const search1 = x.name
          .toLowerCase()
          .includes(filterCustomer.search.toLowerCase());
        const search2 = x?.code
          ?.toLowerCase()
          ?.includes(filterCustomer.search.toLowerCase());

        const search = search1 || search2;
        return search;
      }
    );
    return dataFilter;
  }, [dataCustomer, filterCustomer]);

  const customerColumnDef = useMemo<
    ColDef<{ name: string; code: string }>[]
  >(() => {
    return [
      {
        width: 90,
        headerName: "No",
        cellRenderer: (
          params: ICellRendererParams<{ id: string; name: string }>
        ) => {
          const rowIndex = params.node?.rowIndex ?? 0;
          return <span>{rowIndex + 1}</span>;
        },
      },
      {
        field: "name",
        headerName: "Name",
        width: 250,
        flex: 1,
      },
      {
        field: "code",
        headerName: "Code",
        width: 250,
        flex: 1,
      },
      {
        width: 120,
        headerName: "Actions",
        sortable: false,
        pinned: "right",
        cellRenderer: (
          params: ICellRendererParams<{
            id: string;
            code: string;
            name: string;
          }>
        ) => {
          return (
            <div className=" w-full flex gap-1 py-1 items-center justify-center">
              <div className="flex gap-1 py-1 items-center justify-center">
                <div
                  onClick={() => {
                    if (params && params.data) {
                      setSelectedId(params.data.id);
                      resetCustomer({
                        name: params.data.name,
                        code: params.data?.code,
                      });
                      setModeCustomer("edit");
                      setOpenModalCustomer(true);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <Image src={IconPencil} alt="edit" />
                </div>
              </div>
            </div>
          );
        },
      },
    ];
  }, [dataGridCustomer, filterCustomer]);

  const [filterGoods, setFilterGoods] = useState<{
    search: string;
  }>({ search: "" });

  const dataGridGoods = useMemo(() => {
    const dataFilter = dataGoods?.data?.filter((x: { name: string }) => {
      const search1 = x.name
        .toLowerCase()
        .includes(filterDepartment.search.toLowerCase());

      const search = search1;
      return search;
    });
    return dataFilter;
  }, [dataGoods, filterGoods]);

  const goodsColumnDef = useMemo<
    ColDef<{ id: string; name: string; code: string }>[]
  >(() => {
    return [
      {
        width: 90,
        headerName: "No",
        cellRenderer: (
          params: ICellRendererParams<{ id: string; name: string }>
        ) => {
          const rowIndex = params.node?.rowIndex ?? 0;
          return <span>{rowIndex + 1}</span>;
        },
      },
      {
        field: "name",
        headerName: "Name",
        width: 250,
        flex: 1,
      },
      {
        field: "code",
        headerName: "Code",
        flex: 1,
      },
      {
        width: 120,
        headerName: "Actions",
        sortable: false,
        pinned: "right",
        cellRenderer: (
          params: ICellRendererParams<{ id: string; name: string }>
        ) => {
          return (
            <div className="w-full flex gap-1 py-1 items-center justify-center">
              <div
                onClick={() => {
                  if (params && params.data?.id) {
                    setSelectedId(params.data.id);
                    resetGoods({
                      name: params.data.name,
                    });
                    setModeGoods("edit");
                    setOpenModalGoods(true);
                  }
                }}
                className="cursor-pointer"
              >
                <Image src={IconPencil} alt="edit" />
              </div>
            </div>
          );
        },
      },
    ];
  }, [dataGridGoods, filterGoods]);

  const loadingDepartment = useMemo(() => {
    return (
      isLoadingCreateDepartment ||
      isLoadingDeleteDepartment ||
      isLoadingDepartment ||
      isLoadignUpdateDepartment
    );
  }, [
    isLoadingCreateDepartment,
    isLoadingDeleteDepartment,
    isLoadingDepartment,
    isLoadignUpdateDepartment,
  ]);

  const loadingGoods = useMemo(() => {
    return isLoadingCreateGoods || isLoadingGoods || isLoadingUpdateGoods;
  }, [isLoadingCreateGoods, isLoadingGoods, isLoadingUpdateGoods]);

  const loadingTypeOfWork = useMemo(() => {
    return (
      isLoadingCreateTypeOfWork ||
      isLoadingDeleteTypeOfWork ||
      isLoadingTypeOfWork ||
      isLoadingUpdateTypeOfWork
    );
  }, [
    isLoadingCreateTypeOfWork,
    isLoadingDeleteTypeOfWork,
    isLoadingTypeOfWork,
    isLoadingUpdateTypeOfWork,
  ]);

  const loadingCustomer = useMemo(() => {
    return (
      isLoadingCreateCustomer ||
      isLoadingDeleteCustomer ||
      isLoadingCustomer ||
      isLoadingUpdateCustomer
    );
  }, [
    isLoadingCreateCustomer,
    isLoadingDeleteCustomer,
    isLoadingCustomer,
    isLoadingUpdateCustomer,
  ]);

  const loadingSatuan = useMemo(() => {
    return (
      isLoadingCreateSatuan ||
      isLoadingDeleteSatuan ||
      isLoadingSatuan ||
      isLoadingUpdateSatuan
    );
  }, [
    isLoadingCreateSatuan,
    isLoadingDeleteSatuan,
    isLoadingSatuan,
    isLoadingUpdateSatuan,
  ]);

  return {
    loadingGoods,
    dataGridGoods,
    goodsColumnDef,
    onSubmitGoods,
    errorsGoods,
    onInvalidGoods,
    openModalGoods,
    setOpenModalGoods,
    modeGoods,
    setModeGoods,
    dataGridCustomer,
    customerColumnDef,
    filterCustomer,
    setFilterCustomer,
    dataGridDepartment,
    departmentColumnDef,
    filterTypeOfWork,
    setFilterTypeOfWork,
    loadingCustomer,
    loadingDepartment,
    loadingTypeOfWork,
    loadingSatuan,
    dataGridSatuan,
    satuanColumnDef,
    filterDepartment,
    setFilterDepartment,
    filterSatuan,
    setFilterSatuan,
    dataGridTypeOfWork,
    typeOfWorkColumnDef,
    setOpenModalDepartment,
    setOpenModalCustomer,
    setOpenModalTypeOfWork,
    setOpenModalSatuan,
    openModalDepartment,
    openModalCustomer,
    openModalTypeOfWork,
    openModalSatuan,
    handleSubmitCustomer,
    errorsCustomer,
    resetCustomer,
    onSubmitCustomer,
    onInvalidCustomer,
    controlCustomer,
    isLoadingCreateCustomer,
    handleSubmitDepartment,
    errorsDepartment,
    isLoadingCreateDepartment,
    onSubmitDepartment,
    onInvalidDepartment,
    controlDepartment,
    handleSubmitTypeOfWork,
    errorsTypeOfWork,
    isLoadingCreateTypeOfWork,
    onSubmitTypeOfWork,
    onInvalidTypeOfWork,
    controlTypeOfWork,
    handleSubmitSatuan,
    errorsSatuan,
    isLoadingCreateSatuan,
    onSubmitSatuan,
    onInvalidSatuan,
    controlSatuan,
    modeCustomer,
    setModeCustomer,
    handleSubmitGoods,
    controlGoods,
    isLoadingGoods,
    resetTypeOfWork,
    setModeTypeOfWork,
    resetDepartment,
    setModeDepartment,
    resetSatuan,
    setModeSatuan,
    filterGoods,
    setFilterGoods,
    resetGoods,
    mutateCreateCustomer,
    mutateDeleteCustomer,
    mutateDeleteSatuan,
    mutateDeleteTypeOfWork,
    mutateDeleteDepartment,
  };
};

const useDataManagementContext = createContext<
  ReturnType<typeof useDataManagementHooks> | undefined
>(undefined);

export const DataManagementProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = useDataManagementHooks();
  return (
    <useDataManagementContext.Provider value={value}>
      {children}
    </useDataManagementContext.Provider>
  );
};

export const useDataManagement = () => {
  const context = useContext(useDataManagementContext);
  if (context === undefined) {
    throw new Error(
      "useDataManagementContext must be used within an DataManagementProvider"
    );
  }
  return context;
};
export default useDataManagement;
