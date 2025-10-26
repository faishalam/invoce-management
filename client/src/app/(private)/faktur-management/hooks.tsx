"use client";
import EyeIcon from "@/assets/svg/eye-icon.svg";
import { toast } from "sonner";
import IconPencil from "@/assets/svg/icon-pencil.svg";
import DeleteIcon from "@/assets/svg/delete-icon.svg";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useModalWarningInfo } from "@/components/atoms/modal-warning";
import { ColDef, ICellRendererParams } from "@ag-grid-community/core";
import Image from "next/image";
import useGlobal from "@/app/(private)/hooks";
import useFakturList from "@/service/faktur/useFakturList";
import { TFakturList, TUraian } from "@/service/faktur/types";
import useDeleteFaktur from "@/service/faktur/useDeleteFaktur";
import {
  FieldErrors,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { fakturSchema, TFakturForm } from "./validator";
import { zodResolver } from "@hookform/resolvers/zod";
import useDebitNoteById from "@/service/debit-note/useDebitNoteById";
import useCreateFaktur from "@/service/faktur/useCreateFaktur";
import useUpdateFaktur from "@/service/faktur/useUpdateFaktur";
import useFakturById from "@/service/faktur/useFakturById";

const useFakturManagement = () => {
  const pathName = usePathname();
  const id = useMemo(() => {
    const lastPath = pathName.split("/").pop();
    if (lastPath === "faktur-management") return null;
    return lastPath;
  }, [pathName]);
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const modalWarningInfo = useModalWarningInfo();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { dataCustomer } = useGlobal();
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
  } = useForm<TFakturForm>({
    resolver: zodResolver(fakturSchema),
    defaultValues: {
      berita_acara_id: "",
      debit_note_id: "",
      nomor_seri_faktur: "",
      masa_pajak: "",
      tahun: "",
      npwp: "",
      customer_id: "",
      sub_total: "",
      dpp_nilai_lain_fk: "",
      ppn_fk: "",
      jumlah_ppn_fk: "",
      kode_objek: "",
      uraian: [],
      ppn_of: "",
    },
    mode: "onChange",
  });

  const { fields, append } = useFieldArray({
    control,
    name: "uraian",
  });

  const [filter, setFilter] = useState<{
    search: string;
    customer: string;
  }>({
    search: "",
    customer: "",
  });

  const { data: dataFakturList, isPending: isLoadingDataFakturList } =
    useFakturList();

  const { data: dataFakturById, isPending: isLoadingFakturById } =
    useFakturById({
      params: {
        id: id ?? "",
        enabled: mode !== "create",
      },
    });

  const { data: dataDebitNoteById, isPending: isLoadingDebitNoteById } =
    useDebitNoteById({
      params: {
        id: id ?? "",
        enabled: mode === "create",
      },
    });

  const { mutate: mutateCreateFaktur, isPending: isLoadingCreateFaktur } =
    useCreateFaktur({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["useFakturList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useDebitNoteList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useBeritaAcaraList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useTotalList"],
        });
        router.push("/faktur-management");
        toast.success("Debit Note Berhasil Ditambahkan");
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  const { mutate: mutateUpdateFaktur, isPending: isLoadingUpdateFaktur } =
    useUpdateFaktur({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["useFakturList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useFakturById"],
        });
        router.push("/faktur-management");
        toast.success("Faktur Berhasil Diperbarui");
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  const onSubmit: SubmitHandler<TFakturForm> = (data) => {
    if (mode === "create") {
      modalWarningInfo.open({
        title: "Konfirmasi",
        message: (
          <div>
            <p>Apakah anda yakin ingin menambahkan Faktur ini?</p>
          </div>
        ),
        onConfirm: () => {
          mutateCreateFaktur(data);
        },
      });
    }

    if (mode === "edit") {
      modalWarningInfo.open({
        title: "Konfirmasi",
        message: (
          <div>
            <p>Apakah anda yakin ingin memperbarui Faktur ini?</p>
          </div>
        ),
        onConfirm: () => {
          mutateUpdateFaktur({
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

  const dataGridList = useMemo(() => {
    const dataFilter = dataFakturList?.filter((x) => {
      const matchCustomer = filter.customer
        ? x.berita_acara?.customer_id === filter.customer
        : true;

      const search1 = x.nomor_seri_faktur
        ?.toLowerCase()
        .includes(filter.search.toLowerCase());
      const search2 = x.masa_pajak
        ?.toLowerCase()
        .includes(filter.search.toLowerCase());
      const search3 = x.tahun
        ?.toLowerCase()
        .includes(filter.search.toLowerCase());
      const search4 = x.npwp
        ?.toLowerCase()
        .includes(filter.search.toLowerCase());
      const search5 = x.sub_total
        ?.toLowerCase()
        .includes(filter.search.toLowerCase());

      const search = search1 || search2 || search3 || search4 || search5;
      return search && matchCustomer;
    });
    return dataFilter;
  }, [dataFakturList, filter]);

  const { mutate: mutateDeleteFaktur, isPending: isLoadingDeleteFaktur } =
    useDeleteFaktur({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["useFakturList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useDebitNoteList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useBeritaAcaraList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useTotalList"],
        });
        toast.success("Faktur Berhasil Dihapus");
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  const fakturColumnDefs = useMemo<ColDef<TFakturList>[]>(() => {
    return [
      {
        width: 70,
        headerName: "No",
        pinned: "left",
        cellRenderer: (params: ICellRendererParams<TFakturList>) => {
          const rowIndex = params.node?.rowIndex ?? 0;
          return <span>{rowIndex + 1}</span>;
        },
      },
      {
        field: "berita_acara",
        headerName: "No. BA",
        cellRenderer: (params: ICellRendererParams<TFakturList>) => {
          return <span>{params?.data?.berita_acara?.number}</span>;
        },
      },
      {
        field: "debit_note",
        headerName: "No. Debit Note",
        cellRenderer: (params: ICellRendererParams<TFakturList>) => {
          return <span>{params?.data?.debit_note?.debit_note_number}</span>;
        },
      },
      {
        field: "masa_pajak",
        headerName: "Masa Pajak",
        width: 250,
      },
      {
        field: "tahun",
        headerName: "Tahun",
        width: 150,
      },
      {
        field: "npwp",
        headerName: "NPWP",
        width: 250,
      },
      {
        field: "customer_id",
        headerName: "Customer",
        width: 250,
        cellRenderer: (params: ICellRendererParams<TFakturList>) => {
          const findName = dataCustomer?.data.find(
            (x) => x.id === params?.data?.customer_id
          );
          return <span>{findName?.name}</span>;
        },
      },
      {
        field: "sub_total",
        headerName: "Sub Total",
        width: 150,
        cellRenderer: (params: ICellRendererParams<TFakturList>) => {
          const value = params?.data?.sub_total;
          const formatted = value
            ? `Rp ${Number(value).toLocaleString("id-ID")}`
            : "-";
          return <span>{formatted}</span>;
        },
      },
      {
        field: "dpp_nilai_lain_fk",
        headerName: "DPP Nilai Lain",
        width: 150,
        cellRenderer: (params: ICellRendererParams<TFakturList>) => {
          const value = params?.data?.dpp_nilai_lain_fk;
          const formatted = value
            ? `Rp ${Number(value).toLocaleString("id-ID")}`
            : "-";
          return <span>{formatted}</span>;
        },
      },
      {
        field: "jumlah_ppn_fk",
        headerName: "Jumlah PPN",
        width: 150,
        cellRenderer: (params: ICellRendererParams<TFakturList>) => {
          const value = params?.data?.jumlah_ppn_fk;
          const formatted = value
            ? `Rp ${Number(value).toLocaleString("id-ID")}`
            : "-";
          return <span>{formatted}</span>;
        },
      },
      {
        headerName: "Actions",
        width: 130,
        sortable: false,
        pinned: "right",
        cellRenderer: (params: ICellRendererParams<TFakturList>) => {
          return (
            <div className="flex gap-1 py-1 items-center justify-center">
              <div
                onClick={() => {
                  if (params?.data?.id) {
                    router.push(
                      `/faktur-management/${params.data.id}?mode=view`
                    );
                  }
                }}
                className="cursor-pointer"
              >
                <Image src={EyeIcon} alt="view" />
              </div>

              <div
                onClick={() => {
                  if (params?.data?.id) {
                    router.push(
                      `/faktur-management/${params.data.id}?mode=edit`
                    );
                  }
                }}
                className="cursor-pointer"
              >
                <Image src={IconPencil} alt="edit" />
              </div>

              <div
                onClick={() => {
                  if (params?.data?.id) {
                    modalWarningInfo.open({
                      title: "Konfirmasi",
                      message: (
                        <div>
                          <p>Apakah anda yakin ingin menghapus Faktur ini?</p>
                        </div>
                      ),
                      onConfirm: () => {
                        if (params?.data?.id)
                          mutateDeleteFaktur(params?.data?.id);
                      },
                    });
                  }
                }}
                className="cursor-pointer"
              >
                <Image src={DeleteIcon} alt="delete" />
              </div>
            </div>
          );
        },
      },
    ];
  }, [dataGridList, dataCustomer]);

  useEffect(() => {
    if (id && dataFakturById) {
      reset({
        ...dataFakturById?.data,
        uraian: dataFakturById?.data?.debit_note?.uraian,
      });
    }
  }, [dataFakturById, mode, id]);

  useEffect(() => {
    if (mode === "create" && dataDebitNoteById?.data) {
      setValue("debit_note_id", dataDebitNoteById?.data?.id);
      setValue("berita_acara_id", dataDebitNoteById?.data?.berita_acara?.id);
      setValue("uraian", dataDebitNoteById?.data?.uraian as TUraian[]);
      setValue(
        "customer_id",
        dataDebitNoteById?.data?.berita_acara?.customer_id
      );
    }
  }, [mode, dataDebitNoteById, id]);

  console.log(getValues());
  return {
    isLoadingDataFakturList,
    isLoadingDeleteFaktur,
    fakturColumnDefs,
    dataFakturList,
    mode,
    filter,
    setFilter,
    dataGridList,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    setError,
    getValues,
    clearErrors,
    errors,
    dataDebitNoteById,
    isLoadingDebitNoteById,
    isLoadingFakturById,
    onSubmit,
    isLoadingUpdateFaktur,
    isLoadingCreateFaktur,
    onInvalid,
    dataFakturById,
    fields,
    append,
  };
};

const FakturContext = createContext<
  ReturnType<typeof useFakturManagement> | undefined
>(undefined);

export const FakturProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = useFakturManagement();
  return (
    <FakturContext.Provider value={value}>{children}</FakturContext.Provider>
  );
};

export const useFaktur = () => {
  const context = useContext(FakturContext);
  if (context === undefined) {
    throw new Error("FakturContext must be used within an FakturProvider");
  }
  return context;
};
export default useFaktur;
