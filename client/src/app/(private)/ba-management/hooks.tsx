"use client";
import EyeIcon from "@/assets/svg/eye-icon.svg";
import IconPencil from "@/assets/svg/icon-pencil.svg";
import DeleteIcon from "@/assets/svg/delete-icon.svg";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import useBeritaAcaraList from "@/service/berita-acara/useBeritaAcaraList";
import useCreateBeritaAcara from "@/service/berita-acara/useCreateBeritaAcara";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useUpdateBeritaAcara from "@/service/berita-acara/useUpdateBeritaAcara";
import useDeleteBeritaAcara from "@/service/berita-acara/useDeleteBeritaAcara";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBeritaAcaraSchema, TBeritaAcaraForm } from "./validator";
import { useModalWarningInfo } from "@/components/atoms/modal-warning";
import { ColDef, ICellRendererParams } from "@ag-grid-community/core";
import { TBeritaAcara } from "@/service/berita-acara/types";
import Image from "next/image";

const useBeritaAcaraManagementHooks = () => {
  const [selectedBeritaAcaraId, setSelectedBeritaAcaraId] =
    useState<string>("");

  const modalWarningInfo = useModalWarningInfo();
  const router = useRouter();
  const queryClient = useQueryClient();
  const limit = 99999;
  const [mode, setMode] = useState<"create" | "edit" | "view">("create");
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
    setError,
    clearErrors,
  } = useForm({
    // resolver: zodResolver(createBeritaAcaraSchema),
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
      goods_id: "",
      quantity: "",
      satuan_id: "",
      submitted_at: new Date().toISOString().split("T")[0],
      alokasi_backcharge_total: "",
      planAlokasiPeriode: [
        {
          planAlokasiPeriode: "",
          harga_per_liter: "",
          plan_liter: "",
          actual_liter: "",
          total_kelebihan: "",
          alokasi_backcharge: "",
          nilai_backcharge: "",
        },
      ],
    },
    mode: "onChange",
  });

  const { data: dataBeritaAcaraList, isPending: isLoadingBeritaAcaraList } =
    useBeritaAcaraList();

  const {
    mutate: mutateCreateBeritaAcara,
    isPending: isLoadingCreateBeritaAcara,
  } = useCreateBeritaAcara({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["useBeritaAcaraList"],
      });
      router.push("/ba-management");
      toast.success("Berita Acara Berhasil Ditambahkan");
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
      router.push("/ba-management");
      toast.success("Berita Acara Berhasil Diperbarui");
    },
    onError: (error) => {
      toast.error(error as string);
    },
  });

  const {
    mutate: mutateDeleteBeritaAcara,
    isPending: isLoadingDeleteBeritaAcara,
  } = useDeleteBeritaAcara({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["useBeritaAcaraList"],
      });
      toast.success("Berita Acara Berhasil Dihapus");
    },
    onError: (error) => {
      toast.error(error as string);
    },
  });

  const onSubmit: SubmitHandler<TBeritaAcaraForm> = (data) => {
    console.log('masuk')
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
            <p>Apakah anda yakin ingin mengubah Berita Acara ini?</p>
          </div>
        ),
        onConfirm: () => {
          mutateUpdateBeritaAcara({
            id: selectedBeritaAcaraId ?? "",
            payload: data,
          });
        },
      });
    }
  };

  const onInvalid = (errors: FieldErrors<TBeritaAcaraForm>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(errors).forEach(([_, error]) => {
      // console.log(key);
      if (error?.message) {
        toast.error(error.message);
      }
    });
  };

  const beritaAcaraColumnDef = useMemo<ColDef<TBeritaAcara>[]>(() => {
    return [
      {
        width: 90,
        headerName: "No",
        cellRenderer: (params: ICellRendererParams<TBeritaAcara>) => {
          const rowIndex = params.node?.rowIndex ?? 0;
          return <span>{rowIndex + 1}</span>;
        },
      },
      {
        headerName: "No. Berita Acara",
        field: "number",
        flex: 1.2,
      },
      {
        headerName: "Tipe Transaksi",
        field: "tipe_transaksi",
        flex: 1,
        cellRenderer: (params: ICellRendererParams<TBeritaAcara>) => {
          const val = params.value;
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                val === "trade"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {val.toUpperCase()}
            </span>
          );
        },
      },
      {
        headerName: "Jenis Berita Acara",
        field: "jenis_berita_acara",
        flex: 1,
        cellRenderer: (params: ICellRendererParams<TBeritaAcara>) => {
          const val = params.value;
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                val === "fuel"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {val}
            </span>
          );
        },
      },
      {
        headerName: "Customer",
        field: "customer_id",
        flex: 1.2,
      },
      {
        headerName: "Periode",
        field: "periode",
        flex: 0.8,
      },
      {
        headerName: "Cut Off",
        field: "cut_off",
        flex: 0.8,
      },
      {
        headerName: "PIC",
        field: "pic",
        flex: 1,
      },
      {
        headerName: "Status",
        field: "status_id",
        flex: 1,
        cellRenderer: (params: ICellRendererParams<TBeritaAcara>) => {
          const val = params.value || "draft";
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                val === "approved"
                  ? "bg-green-100 text-green-700"
                  : val === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {val.toUpperCase()}
            </span>
          );
        },
      },
      {
        width: 120,
        headerName: "Actions",
        sortable: false,
        pinned: "right",
        cellRenderer: (params: ICellRendererParams<TBeritaAcara>) => {
          return (
            <div className="flex gap-1 py-1 items-center justify-center">
              <div
                onClick={() => {
                  if (params && params?.data?.id) {
                    setSelectedBeritaAcaraId(params.data.id);
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
                    setSelectedBeritaAcaraId(params?.data?.id);
                    setSelectedBeritaAcaraId(params.data.id);
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
                          <p>
                            Apakah anda yakin ingin menghapus Berita Acara ini?
                          </p>
                        </div>
                      ),
                      onConfirm: () => {
                        if (params && params.data?.id) {
                          mutateDeleteBeritaAcara(params?.data?.id);
                        }
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
  }, [dataBeritaAcaraList]);

  return {
    beritaAcaraColumnDef,
    dataBeritaAcaraList,
    selectedBeritaAcaraId,
    setSelectedBeritaAcaraId,
    mode,
    setMode,
    mutateCreateBeritaAcara,
    mutateUpdateBeritaAcara,
    mutateDeleteBeritaAcara,
    handleSubmit,
    onSubmit,
    onInvalid,
    control,
    clearErrors,
    errors,
    watch,
    setValue,
    setError,
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
