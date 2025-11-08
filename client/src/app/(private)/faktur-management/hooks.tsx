"use client";
import EyeIcon from "@/assets/svg/eye-icon.svg";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
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
import { TFakturList } from "@/service/faktur/types";
import useDeleteFaktur from "@/service/faktur/useDeleteFaktur";
import {
  FieldErrors,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  fakturSchema,
  fakturSchemaAccepted,
  fakturTransaction,
  TFakturForm,
  TFakturFormAccepted,
  TFakturFormTransaction,
} from "./validator";
import { zodResolver } from "@hookform/resolvers/zod";
import useDebitNoteById from "@/service/debit-note/useDebitNoteById";
import useCreateFaktur from "@/service/faktur/useCreateFaktur";
import useUpdateFaktur from "@/service/faktur/useUpdateFaktur";
import useFakturById from "@/service/faktur/useFakturById";
import { Radio } from "@mui/material";
import useAcceptedFaktur from "@/service/faktur/useAcceptedFaktur";
import useTransactionFaktur from "@/service/faktur/useTransactionFaktur";

const useFakturManagement = () => {
  const pathName = usePathname();
  const id = useMemo(() => {
    const lastPath = pathName.split("/").pop();
    if (lastPath === "faktur-management") return null;
    return lastPath;
  }, [pathName]);
  const [statusFaktur, setStatusFaktur] = useState<string>("");
  const [openModalAccepted, setOpenModalAccepted] = useState<boolean>(false);
  const [openModalTransaction, setOpenModalTransaction] =
    useState<boolean>(false);
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const modalWarningInfo = useModalWarningInfo();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedFakturId, setSelectedFakturId] = useState<string>("");
  const { dataCustomer, dataUserProfile, dataGoods } = useGlobal();
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

  const {
    control: controlAccepted,
    handleSubmit: handleSubmitAccepted,
    formState: { errors: errorsAccepted },
    reset: resetAccepted,
  } = useForm<TFakturFormAccepted>({
    resolver: zodResolver(fakturSchemaAccepted),
    defaultValues: {
      nomor_seri_faktur: "",
      kode_objek: "",
    },
    mode: "onChange",
  });

  const {
    control: controlTransaction,
    handleSubmit: handleSubmitTransaction,
    formState: { errors: errorsTransaction },
    reset: resetTransaction,
  } = useForm<TFakturFormTransaction>({
    resolver: zodResolver(fakturTransaction),
    defaultValues: {
      transaction_id: "",
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
          queryKey: ["useDebitNoteList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useDebitNoteById"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useBeritaAcaraList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useBeritaAcaraById"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useFakturById"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useFakturList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useTotalList"],
        });
        router.push("/faktur-management");
        toast.success("Faktur Berhasil Ditambahkan");
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  const { mutate: mutateUpdateFaktur, isPending: isLoadingUpdateFaktur } =
    useUpdateFaktur({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["useDebitNoteList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useDebitNoteById"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useBeritaAcaraList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useBeritaAcaraById"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useFakturById"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useFakturList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useTotalList"],
        });
        router.push("/faktur-management");
        toast.success("Faktur Berhasil Diperbarui");
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  const { mutate: mutateAcceptedFaktur, isPending: isLoadingAcceptedFaktur } =
    useAcceptedFaktur({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["useDebitNoteList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useDebitNoteById"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useBeritaAcaraList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useBeritaAcaraById"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useFakturById"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useFakturList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useTotalList"],
        });
        setSelectedFakturId("");
        resetAccepted();
        setOpenModalAccepted(false);
        toast.success("Faktur Berhasil Diterima!");
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  const {
    mutate: mutateTransactionFaktur,
    isPending: isLoadingTransactionFaktur,
  } = useTransactionFaktur({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["useDebitNoteList"],
      });
      queryClient.invalidateQueries({
        queryKey: ["useDebitNoteById"],
      });
      queryClient.invalidateQueries({
        queryKey: ["useBeritaAcaraList"],
      });
      queryClient.invalidateQueries({
        queryKey: ["useBeritaAcaraById"],
      });
      queryClient.invalidateQueries({
        queryKey: ["useFakturById"],
      });
      queryClient.invalidateQueries({
        queryKey: ["useFakturList"],
      });
      queryClient.invalidateQueries({
        queryKey: ["useTotalList"],
      });
      setSelectedFakturId("");
      resetTransaction();
      setOpenModalTransaction(false);
      toast.success("Faktur Berhasil Diterima!");
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

  const onSubmitAccepted: SubmitHandler<TFakturFormAccepted> = (data) => {
    modalWarningInfo.open({
      title: "Konfirmasi",
      message: (
        <div>
          <p>
            Apakah anda yakin ingin telah menerima kembali Faktur ini dari HO?
          </p>
        </div>
      ),
      onConfirm: () => {
        mutateAcceptedFaktur({ id: selectedFakturId, payload: data });
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

  const onSubmitTransaction: SubmitHandler<TFakturFormTransaction> = (data) => {
    modalWarningInfo.open({
      title: "Konfirmasi",
      message: (
        <div>
          <p>
            Apakah anda yakin ingin telah mendapatkan transaction id Faktur ini?
          </p>
        </div>
      ),
      onConfirm: () => {
        mutateTransactionFaktur({ id: selectedFakturId, payload: data });
      },
    });
  };

  const onInvalidTransaction = (errors: FieldErrors) => {
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
        width: 80,
        pinned: "left",
        hide: dataUserProfile?.data?.department !== "FAT",
        cellRenderer: (params: ICellRendererParams<TFakturList>) => {
          const idRow = params?.data?.id;
          const isSelected = selectedFakturId === idRow;
          return (
            <Radio
              disabled={params?.data?.berita_acara?.status === "Done"}
              checked={isSelected}
              onClick={(e) => {
                e.stopPropagation();
                if (isSelected) {
                  setSelectedFakturId("");
                  setStatusFaktur("");
                } else if (idRow) {
                  setSelectedFakturId(idRow);
                  setStatusFaktur(params?.data?.berita_acara?.status ?? "");
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
        field: "range_periode",
        headerName: "Range",
        width: 150,
        cellRenderer: (params: ICellRendererParams<TFakturList>) => {
          return <span>{params?.data?.range_periode || "-"} Hari</span>;
        },
      },
      {
        field: "berita_acara.status",
        headerName: "BA Status",
        pinned: "right",
        width: 190,
        cellRenderer: (params: ICellRendererParams<TFakturList>) => {
          const status = params?.data?.berita_acara?.revised
            ? params?.data?.berita_acara?.revised?.status
            : params?.data?.berita_acara?.status || "-";
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
              {dataUserProfile?.data?.department === "FAT" &&
                params?.data?.berita_acara?.status !== "Cancelled" && (
                  <>
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
                                <p>
                                  Apakah anda yakin ingin menghapus Faktur ini?
                                </p>
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
                  </>
                )}
            </div>
          );
        },
      },
    ];
  }, [dataGridList, dataCustomer, selectedFakturId]);

  const onDownloadFaktur = () => {
    try {
      if (!dataFakturById) {
        toast.error("Tidak ada data Faktur");
        return;
      }

      const formatRupiah = (value: string | number) => {
        if (value == null || value === "") return "";
        const number = Number(value);
        if (isNaN(number)) return value;
        return `Rp ${number.toLocaleString("id-ID")}`;
      };

      // === Sheet 1: Data Faktur Uraian (OF) ===
      const ofData =
        dataFakturById?.data?.berita_acara?.berita_acara_uraian?.map(
          (item, index) => {
            const found = dataGoods?.data?.find((g) => g.id === item.goods_id);
            return {
              "Nomor Seri Faktur":
                index === 0
                  ? dataFakturById?.data?.nomor_seri_faktur ?? ""
                  : "",
              "Kode Objek":
                index === 0 ? dataFakturById?.data?.kode_objek ?? "" : "",
              "Nama Objek": found?.name || "-",
              "Harga Satuan": formatRupiah(item?.harga),
              "Jumlah Barang": item?.quantity ?? "",
              "Harga Total": formatRupiah(item?.total),
              Diskon: "",
              "DPP Nilai Lain":
                item?.dpp_nilai_lain_of &&
                formatRupiah(item?.dpp_nilai_lain_of),
              PPN: item?.jumlah_ppn_of && formatRupiah(item?.jumlah_ppn_of),
              "Tarif PPNBM": "",
              PPNBM: "",
            };
          }
        ) ?? [];

      if (!ofData.length) {
        toast.error("Data faktur tidak memiliki uraian.");
        return;
      }

      // === Sheet 2: Data Faktur FK ===
      const cust = dataCustomer?.data?.find(
        (item) => item?.id === dataFakturById?.data?.customer_id
      );

      const fkData = [
        {
          "Nomor Seri Faktur": dataFakturById?.data?.nomor_seri_faktur ?? "",
          "Masa Pajak": dataFakturById?.data?.masa_pajak ?? "",
          Tahun: dataFakturById?.data?.tahun ?? "",
          NPWP: dataFakturById?.data?.npwp ?? "",
          Nama: cust?.name ?? "",
          "Alamat Lengkap": cust?.alamat ?? "",
          "Sub Total": formatRupiah(dataFakturById?.data?.sub_total),
          "DPP Nilai Lain": formatRupiah(
            dataFakturById?.data?.dpp_nilai_lain_fk
          ),
          "Jumlah PPN": formatRupiah(dataFakturById?.data?.jumlah_ppn_fk),
          "Jumlah PPNBM": "",
          "ID Keterangan Tambahan": "",
          "FG Uang Muka": "",
          "Uang Muka DPP": "",
          "Uang Muka PPN": "",
          "Uang Muka PPNBM": "",
          Referensi: dataFakturById?.data?.debit_note?.debit_note_number ?? "",
        },
      ];

      // === Gabungkan ke 1 file Excel ===
      const wb = XLSX.utils.book_new();
      const wsOF = XLSX.utils.json_to_sheet(ofData);
      const wsFK = XLSX.utils.json_to_sheet(fkData);

      XLSX.utils.book_append_sheet(wb, wsFK, "FK");
      XLSX.utils.book_append_sheet(wb, wsOF, "OF");

      // === Export ===
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(blob, `Data Faktur.xlsx`);
      toast.success("Berhasil mengunduh file Faktur (2 sheet)");
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Terjadi kesalahan");
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (id && dataFakturById) {
      reset({
        ...dataFakturById?.data,
        uraian: dataFakturById?.data?.berita_acara
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
          ?.berita_acara_uraian as any[],
      });
    }
  }, [dataFakturById, mode, id]);

  useEffect(() => {
    if (mode === "create" && dataDebitNoteById?.data) {
      setValue("debit_note_id", dataDebitNoteById?.data?.id);
      setValue("berita_acara_id", dataDebitNoteById?.data?.berita_acara?.id);
      setValue(
        "uraian",
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        dataDebitNoteById?.data?.berita_acara?.berita_acara_uraian as any[]
      );
      setValue(
        "customer_id",
        dataDebitNoteById?.data?.berita_acara?.customer_id
      );
    }
  }, [mode, dataDebitNoteById, id]);

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
    selectedFakturId,
    setSelectedFakturId,
    openModalAccepted,
    setOpenModalAccepted,
    isLoadingAcceptedFaktur,
    onSubmitAccepted,
    handleSubmitAccepted,
    onInvalidAccepted,
    controlAccepted,
    errorsAccepted,
    statusFaktur,
    setOpenModalTransaction,
    openModalTransaction,
    setStatusFaktur,
    handleSubmitTransaction,
    controlTransaction,
    resetTransaction,
    onSubmitTransaction,
    errorsTransaction,
    onInvalidTransaction,
    isLoadingTransactionFaktur,
    onDownloadFaktur,
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
