"use client";
import EyeIcon from "@/assets/svg/eye-icon.svg";
import { toast } from "sonner";
import IconPencil from "@/assets/svg/icon-pencil.svg";
import DeleteIcon from "@/assets/svg/delete-icon.svg";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import useBeritaAcaraList from "@/service/berita-acara/useBeritaAcaraList";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useDeleteBeritaAcara from "@/service/berita-acara/useDeleteBeritaAcara";
import { useModalWarningInfo } from "@/components/atoms/modal-warning";
import { ColDef, ICellRendererParams } from "@ag-grid-community/core";
import Image from "next/image";
import {
  acceptedSchema,
  revisedSchema,
  TAcceptedForm,
  TBeritaAcaraForm,
  TRevisedForm,
  validateBeritaAcara,
} from "./validator";
import { TBeritaAcaraList } from "@/service/berita-acara/types";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import useCreateBeritaAcara from "@/service/berita-acara/useCreateBeritaAcara";
import useUpdateBeritaAcara from "@/service/berita-acara/useUpdateBeritaAcara";
import useBeritaAcaraById from "@/service/berita-acara/useBeritaAcaraById";
import { Radio } from "@mui/material";
import useGlobal from "@/app/(private)/hooks";
import useApprovedBeritaAcara from "@/service/berita-acara/useApprovedBeritaAcara";
import { zodResolver } from "@hookform/resolvers/zod";
import useUpdateStatus from "@/service/berita-acara/useUpdateStatus";

const useBeritaAcaraManagementHooks = () => {
  const pathName = usePathname();
  const [activeTabs, setActiveTabs] = useState<string>("berita-acara-all");
  const id = useMemo(() => {
    const lastPath = pathName.split("/").pop();
    if (lastPath === "new") {
      return null;
    } else if (lastPath === "ba-management") {
      return null;
    }
    return lastPath;
  }, [pathName]);
  const searchParams = useSearchParams();
  const [openModalAccept, setOpenModalAccept] = useState<boolean>(false);
  const [openModalRevised, setOpenModalRevised] = useState<boolean>(false);
  const mode = searchParams.get("mode");
  const modalWarningInfo = useModalWarningInfo();
  const [selectedBaId, setSelectedBaId] = useState<string>("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openModalDocument, setOpenModalDocument] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
    setError,
    getValues,
    clearErrors,
  } = useForm<TBeritaAcaraForm>({
    defaultValues: {
      tipe_transaksi: "",
      jenis_berita_acara: "",
      reguler: "",
      nill_ditagihkan: "",
      customer_id: "",
      periode: "",
      cut_off: "",
      tipe_customer: "",
      type_of_work_id: "",
      pic: "",
      signers: [
        {
          name: "",
          dept: "",
        },
        {
          name: "",
          dept: "",
        },
        {
          name: "",
          dept: "",
        },
        {
          name: "",
          dept: "",
        },
      ],
      submitted_at: new Date().toISOString().split("T")[0],
      plan_alokasi_periode: [
        {
          plan_alokasi_periode: null,
          harga_per_liter: null,
          plan_liter: null,
          actual_liter: null,
          alokasi_backcharge: null,
          nilai_backcharge: null,
          total_kelebihan: null,
        },
      ],
      berita_acara_uraian: [
        {
          goods_id: null,
          satuan: null,
          quantity: null,
        },
      ],
    },
    mode: "onChange",
  });

  const {
    control: controlAccepted,
    handleSubmit: handleSubmitAccepted,
    watch: watchAccepted,
    formState: { errors: errorsAccepted },
    reset: resetAccepted,
    setValue: setValueAccepted,
  } = useForm<TAcceptedForm>({
    resolver: zodResolver(acceptedSchema),
    defaultValues: {
      link_doc: "",
    },
    mode: "onChange",
  });

  const {
    control: controlRevised,
    handleSubmit: handleSubmitRevised,
    watch: watchRevised,
    formState: { errors: errorsRevised },
    reset: resetRevised,
    setValue: setValueRevised,
  } = useForm<TRevisedForm>({
    resolver: zodResolver(revisedSchema),
    defaultValues: {
      revised: {
        status: "Revised",
        reason: null,
      },
    },
    mode: "onChange",
  });

  const { dataCustomer, dataTypeOfWork, dataUserProfile } = useGlobal();

  const [filter, setFilter] = useState<{
    search: string;
    tipe_transaksi: string | null;
    jenis_berita_acara: string | null;
    tipe_customer: string | null;
    jenis_pekerjaan: string | null;
  }>({
    search: "",
    tipe_transaksi: null,
    jenis_berita_acara: null,
    tipe_customer: null,
    jenis_pekerjaan: null,
  });

  const {
    mutate: mutateCreateBeritaAcara,
    isPending: isLoadingCreateBeritaAcara,
  } = useCreateBeritaAcara({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["useBeritaAcaraList"],
      });
      queryClient.invalidateQueries({
        queryKey: ["useTotalList"],
      });
      reset();
      router.push("/ba-management");
      toast.success("Berita Acara dan Template berhasil ditambahkan");
    },
    onError: (error) => {
      toast.error(error as string);
    },
  });

  const {
    mutate: mutateUpdateBeritaAcara,
    isPending: isLoadingUpdateBeritaAcara,
  } = useUpdateBeritaAcara({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["useBeritaAcaraList"],
      });
      queryClient.invalidateQueries({
        queryKey: ["useBeritaAcaraById"],
      });
      queryClient.invalidateQueries({
        queryKey: ["useDebitNoteList"],
      });
      queryClient.invalidateQueries({
        queryKey: ["useDebitNoteById"],
      });
      queryClient.invalidateQueries({
        queryKey: ["useFakturList"],
      });
      queryClient.invalidateQueries({
        queryKey: ["useFakturById"],
      });
      reset();
      router.push("/ba-management");
      toast.success("Berita Acara Berhasil Diperbarui");
    },
    onError: (error) => {
      toast.error(error as string);
    },
  });

  const { data: dataBeritaAcaraById, isPending: isLoadingDataBeritaAcaraById } =
    useBeritaAcaraById({
      params: {
        id: id || "",
        enabled: true,
      },
    });

  const {
    mutate: mutateApprovedBeritaAcara,
    isPending: isLoadingApprovedBeritaAcara,
  } = useApprovedBeritaAcara({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["useBeritaAcaraList"],
      });
      queryClient.invalidateQueries({
        queryKey: ["useBeritaAcaraById"],
      });
      setSelectedBaId("");
      setOpenModalAccept(false);
      resetAccepted();
      toast.success("Berita Acara Berhasil Disetujui");
    },
    onError: (error) => {
      toast.error(error as string);
    },
  });

  const { mutate: mutateUpdateStatus, isPending: isLoadingUpdateStatus } =
    useUpdateStatus({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["useBeritaAcaraList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useBeritaAcaraById"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useDebitNoteList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useDebitNoteById"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useFakturList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useFakturById"],
        });
        resetRevised();
        setOpenModalRevised(false);
        toast.success("Berhasil Revisi Berita Acara");
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  function extractAllMessages(errors: any): string[] {
    const messages: string[] = [];

    for (const key in errors) {
      const value = errors[key];
      if (typeof value === "string") {
        messages.push(value);
      } else if (Array.isArray(value)) {
        value.forEach((v) => {
          messages.push(...extractAllMessages(v));
        });
      } else if (typeof value === "object" && value !== null) {
        messages.push(...extractAllMessages(value));
      }
    }

    return messages;
  }

  const onSubmit: SubmitHandler<TBeritaAcaraForm> = (data) => {
    const result = validateBeritaAcara(data);

    if (!result.isValid) {
      const messages = extractAllMessages(result.errors);
      messages.forEach((msg, i) => {
        toast.error(msg, { id: `error-${i}`, duration: 4000 });
      });
      return;
    }

    if (mode === "create") {
      modalWarningInfo.open({
        title: "Konfirmasi",
        message: (
          <div>
            <p>Apakah anda yakin ingin menambahkan Berita Acara ini?</p>
          </div>
        ),
        onConfirm: () => {
          mutateCreateBeritaAcara(data);
        },
      });
    }

    if (mode === "edit") {
      modalWarningInfo.open({
        title: "Konfirmasi",
        message: (
          <div>
            <p>Apakah anda yakin ingin memperbarui Berita Acara ini?</p>
          </div>
        ),
        onConfirm: () => {
          mutateUpdateBeritaAcara({
            id: id ?? "",
            payload: data,
          });
        },
      });
    }
  };

  const onInvalid = (errors: FieldErrors) => {
    const showErrors = (errs: FieldErrors) => {
      Object.values(errs).forEach((error) => {
        if (!error) return;
        if (error.message) {
          toast.error(error.message as string);
        }
        if (error && typeof error === "object") {
          if ("types" in error || "_errors" in error) return;
          showErrors(error as FieldErrors);
        }
      });
    };

    showErrors(errors);
  };

  const onSubmitAccepted: SubmitHandler<TAcceptedForm> = (data) => {
    modalWarningInfo.open({
      title: "Konfirmasi",
      message: (
        <div>
          <p>Apakah anda yakin sudah menerima Berita Acara ini?</p>
        </div>
      ),
      onConfirm: () => {
        mutateApprovedBeritaAcara({ id: selectedBaId, payload: data });
      },
    });
  };

  const onInvalidAccepted = (errors: FieldErrors) => {
    const showErrors = (errs: FieldErrors) => {
      Object.values(errs).forEach((error) => {
        if (!error) return;
        if (error.message) {
          toast.error(error.message as string);
        }
        if (error && typeof error === "object") {
          if ("types" in error || "_errors" in error) return;
          showErrors(error as FieldErrors);
        }
      });
    };

    showErrors(errors);
  };

  const onSubmitRevised: SubmitHandler<TRevisedForm> = (data) => {
    modalWarningInfo.open({
      title: "Konfirmasi",
      message: (
        <div>
          <p>Apakah anda yakin akan merevisi Berita Acara ini?</p>
        </div>
      ),
      onConfirm: () => {
        if (!id) return;
        mutateUpdateStatus({ id, payload: data });
      },
    });
  };

  const onInvalidRevised = (errors: FieldErrors) => {
    const showErrors = (errs: FieldErrors) => {
      Object.values(errs).forEach((error) => {
        if (!error) return;
        if (error.message) {
          toast.error(error.message as string);
        }
        if (error && typeof error === "object") {
          if ("types" in error || "_errors" in error) return;
          showErrors(error as FieldErrors);
        }
      });
    };

    showErrors(errors);
  };

  const { data: dataBeritaAcaraList, isPending: isLoadingBeritaAcaraList } =
    useBeritaAcaraList({
      params: {
        status:
          activeTabs === "berita-acara-waiting" ? "Waiting Signed" : undefined,
      },
    });

  const dataGridList = useMemo(() => {
    const dataFilter = dataBeritaAcaraList?.filter((x) => {
      const searchValue = filter.search.toLowerCase();

      const customerName =
        dataCustomer?.data
          ?.find((c) => c.id === x.customer_id)
          ?.name?.toLowerCase() || "";

      const typeOfWorkName =
        dataTypeOfWork?.data
          ?.find((t) => t.id === x.type_of_work_id)
          ?.name?.toLowerCase() || "";

      const search1 = x.number?.toLowerCase().includes(searchValue);
      const search2 = x.tipe_transaksi?.toLowerCase().includes(searchValue);
      const search3 = x.jenis_berita_acara?.toLowerCase().includes(searchValue);
      const search4 = customerName.includes(searchValue);
      const search6 = x.site?.toLowerCase().includes(searchValue);
      const search7 = x.tipe_customer?.toLowerCase().includes(searchValue);
      const search8 = x.reguler?.toLowerCase().includes(searchValue);
      const search9 = typeOfWorkName.includes(searchValue);

      const search =
        search1 ||
        search2 ||
        search3 ||
        search4 ||
        search6 ||
        search7 ||
        search8 ||
        search9;

      const tipe_transaksi = filter.tipe_transaksi
        ? x.tipe_transaksi === filter.tipe_transaksi
        : true;

      const jenis_berita_acara = filter.jenis_berita_acara
        ? x.jenis_berita_acara === filter.jenis_berita_acara
        : true;

      const jenis_pekerjaan = filter.jenis_pekerjaan
        ? x.type_of_work_id === filter.jenis_pekerjaan
        : true;

      const tipe_customer = filter.tipe_customer
        ? x.tipe_customer === filter.tipe_customer
        : true;

      return (
        search &&
        tipe_transaksi &&
        jenis_berita_acara &&
        jenis_pekerjaan &&
        tipe_customer
      );
    });

    return dataFilter;
  }, [dataBeritaAcaraList, filter, dataCustomer, dataTypeOfWork]);

  const {
    mutate: mutateDeleteBeritaAcara,
    isPending: isLoadingDeleteBeritaAcara,
  } = useDeleteBeritaAcara({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["useBeritaAcaraList"],
      });
      queryClient.invalidateQueries({
        queryKey: ["useDebitNoteList"],
      });
      queryClient.invalidateQueries({
        queryKey: ["useFakturList"],
      });
      queryClient.invalidateQueries({
        queryKey: ["useTotalList"],
      });
      toast.success("Berita Acara Berhasil Dihapus");
    },
    onError: (error) => {
      toast.error(error as string);
    },
  });

  const beritaAcaraColumnDef = useMemo<ColDef<TBeritaAcaraList>[]>(() => {
    return [
      {
        width: 80,
        hide: dataUserProfile?.data?.department !== "FAT",
        pinned: "left",
        cellRenderer: (params: ICellRendererParams<TBeritaAcaraList>) => {
          const idRow = params?.data?.id;
          const isSelected = selectedBaId === idRow;
          return (
            <Radio
              disabled={
                (activeTabs === "berita-acara-all" &&
                  params?.data?.status !== "Signed") ||
                (activeTabs === "beria-acara-all" &&
                  params?.data?.nill_ditagihkan === "nill")
              }
              checked={isSelected}
              onClick={(e) => {
                e.stopPropagation();
                if (isSelected) {
                  setSelectedBaId("");
                } else if (idRow) {
                  setSelectedBaId(idRow);
                }
              }}
            />
          );
        },
      },
      {
        width: 70,
        headerName: "No",
        pinned: "left",
        cellRenderer: (params: ICellRendererParams<TBeritaAcaraForm>) => {
          const rowIndex = params.node?.rowIndex ?? 0;
          return <span>{rowIndex + 1}</span>;
        },
      },
      {
        field: "number",
        headerName: "No. BA",
        width: 170,
      },
      {
        field: "tipe_transaksi",
        headerName: "Tipe Transaksi",
        width: 140,
        cellRenderer: (params: ICellRendererParams<TBeritaAcaraForm>) => {
          const value = params.data?.tipe_transaksi;
          const displayValue =
            value === "trade"
              ? "Trade"
              : value === "nontrade"
              ? "Non Trade"
              : "-";
          return <span>{displayValue}</span>;
        },
      },
      {
        field: "jenis_berita_acara",
        headerName: "Berita Acara",
        width: 150,
        cellRenderer: (params: ICellRendererParams<TBeritaAcaraForm>) => {
          const value = params.data?.jenis_berita_acara;
          const displayValue =
            value === "fuel" ? "Fuel" : value === "nonfuel" ? "Non Fuel" : "-";
          return <span>{displayValue}</span>;
        },
      },
      {
        field: "site",
        headerName: "Site",
        width: 120,
      },
      {
        field: "customer_id",
        headerName: "Customer",
        width: 300,
        cellRenderer: (params: ICellRendererParams<TBeritaAcaraForm>) => {
          const customer = dataCustomer?.data.find(
            (c) => c.id === params.data?.customer_id
          );
          return <span>{customer?.name ?? "-"}</span>;
        },
      },
      {
        headerName: "Code Customer",
        width: 160,
        cellRenderer: (params: ICellRendererParams<TBeritaAcaraForm>) => {
          const customer = dataCustomer?.data.find(
            (c) => c.id === params.data?.customer_id
          );
          return <span>{customer?.code ?? "-"}</span>;
        },
      },
      {
        field: "periode",
        headerName: "Periode",
        width: 130,
        cellRenderer: (params: ICellRendererParams<TBeritaAcaraForm>) => {
          const value = params.data?.periode;

          if (!value || value.length !== 4) return <span>-</span>;

          const monthIndex = parseInt(value.slice(0, 2), 10) - 1;
          const year = "20" + value.slice(2, 4);

          const monthNames = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
          ];

          const monthName = monthNames[monthIndex] || "-";

          return <span>{`${monthName} ${year}`}</span>;
        },
      },
      {
        field: "cut_off",
        headerName: "Cut Off",
        width: 130,
      },
      {
        field: "tipe_customer",
        headerName: "Tipe Customer",
        width: 140,
      },
      {
        field: "type_of_work_id",
        headerName: "Jenis Pekerjaan",
        width: 180,
        cellRenderer: (params: ICellRendererParams<TBeritaAcaraForm>) => {
          const typeOfWork = dataTypeOfWork?.data?.find(
            (t) => t.id === params.data?.type_of_work_id
          );
          return <span>{typeOfWork?.name ?? "-"}</span>;
        },
      },
      {
        field: "reguler",
        headerName: "Reguler / Non Reguler",
        width: 180,
      },
      {
        field: "pic",
        headerName: "PIC",
        width: 160,
      },
      {
        field: "submitted_at",
        headerName: "Submitted Date",
        width: 160,
      },
      {
        field: "status",
        headerName: "Status",
        pinned: "right",
        width: 190,
        cellRenderer: (params: ICellRendererParams<TBeritaAcaraList>) => {
          // const status = params?.data?.status || "-";
          const status = params?.data?.revised
            ? params?.data?.revised?.status
            : params?.data?.status || "-";
          const getBadgeColor = (status: string) => {
            switch (status) {
              case "Waiting Signed":
                return "bg-blue-100 text-blue-700 rounded-xl text-xs";
              case "Signed":
                return "bg-green-100 text-green-700 rounded-xl text-xs";
              case "Submitted Debit Note":
                return "bg-yellow-100 text-yellow-700 rounded-xl text-xs";
              case "Submitted Faktur":
                return "bg-purple-100 text-purple-700 rounded-xl text-xs";
              case "Faktur Accepted":
                return "bg-orange-100 text-orange-700 rounded-xl text-xs";
              case "Revised":
                return "bg-yellow-100 text-yellow-700 rounded-xl text-xs";
              case "Cancelled":
                return "bg-red-100 text-red-700 rounded-xl text-xs";
              default:
                return "bg-gray-100 text-gray-600 rounded-xl text-xs";
            }
          };
          return (
            <span
              className={`px-3 py-1 text-sm font-medium ${getBadgeColor(
                status
              )}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        headerName: "Actions",
        width: 130,
        sortable: false,
        pinned: "right",
        cellRenderer: (params: ICellRendererParams<TBeritaAcaraList>) => {
          return (
            <div className="flex gap-1 py-1 items-center justify-center">
              <div
                onClick={() => {
                  if (params?.data?.id) {
                    router.push(`/ba-management/${params.data.id}?mode=view`);
                  }
                }}
                className="cursor-pointer"
              >
                <Image src={EyeIcon} alt="view" />
              </div>

              {params?.data?.revised?.status === "Revised" && (
                <div
                  onClick={() => {
                    if (params?.data?.id) {
                      router.push(`/ba-management/${params.data.id}?mode=edit`);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <Image src={IconPencil} alt="edit" />
                </div>
              )}
              {dataUserProfile?.data?.department === "FAT" &&
                params?.data?.status !== "Cancelled" && (
                  <div
                    onClick={() => {
                      if (params?.data?.id) {
                        modalWarningInfo.open({
                          title: "Konfirmasi",
                          message: (
                            <div>
                              <p>
                                Apakah anda yakin ingin Cancel Berita Acara ini?
                              </p>
                            </div>
                          ),
                          onConfirm: () => {
                            if (params?.data?.id)
                              // mutateDeleteBeritaAcara(params?.data?.id);
                              mutateUpdateStatus({
                                id: params?.data?.id,
                                payload: {
                                  status: "Cancelled",
                                },
                              });
                          },
                        });
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <Image src={DeleteIcon} alt="delete" />
                  </div>
                )}
            </div>
          );
        },
      },
    ];
  }, [
    selectedBaId,
    mutateDeleteBeritaAcara,
    dataCustomer,
    dataTypeOfWork,
    activeTabs,
    router,
  ]);

  useEffect(() => {
    if (id && dataBeritaAcaraById?.data && mode !== "create") {
      reset(dataBeritaAcaraById?.data);
    }
  }, [dataBeritaAcaraById?.data, mode, id]);

  return {
    selectedBaId,
    beritaAcaraColumnDef,
    dataBeritaAcaraList,
    mutateDeleteBeritaAcara,
    isLoadingBeritaAcaraList,
    isLoadingDeleteBeritaAcara,
    mutateCreateBeritaAcara,
    mutateUpdateBeritaAcara,
    handleSubmit,
    onSubmit,
    onInvalid,
    control,
    clearErrors,
    getValues,
    errors,
    watch,
    setValue,
    setError,
    isLoadingDataBeritaAcaraById,
    isLoadingCreateBeritaAcara,
    isLoadingUpdateBeritaAcara,
    reset,
    mode,
    openModalDocument,
    setOpenModalDocument,
    dataBeritaAcaraById,
    filter,
    setFilter,
    dataGridList,
    activeTabs,
    mutateApprovedBeritaAcara,
    isLoadingApprovedBeritaAcara,
    setActiveTabs,
    openModalAccept,
    setOpenModalAccept,
    controlAccepted,
    handleSubmitAccepted,
    onSubmitAccepted,
    setSelectedBaId,
    onInvalidAccepted,
    errorsAccepted,
    watchAccepted,
    setValueAccepted,
    setOpenModalRevised,
    openModalRevised,
    controlRevised,
    handleSubmitRevised,
    watchRevised,
    errorsRevised,
    resetRevised,
    setValueRevised,
    mutateUpdateStatus,
    isLoadingUpdateStatus,
    onSubmitRevised,
    onInvalidRevised,
  };
};

const useBeritaAcaraContext = createContext<
  ReturnType<typeof useBeritaAcaraManagementHooks> | undefined
>(undefined);

export const BeritaAcaraProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = useBeritaAcaraManagementHooks();
  return (
    <useBeritaAcaraContext.Provider value={value}>
      {children}
    </useBeritaAcaraContext.Provider>
  );
};

export const useBeritaAcara = () => {
  const context = useContext(useBeritaAcaraContext);
  if (context === undefined) {
    throw new Error(
      "useBeritaAcaraContext must be used within an BeritaAcaraProvider"
    );
  }
  return context;
};
export default useBeritaAcara;
