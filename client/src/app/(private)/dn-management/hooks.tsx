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
import { TBeritaAcaraList } from "@/service/berita-acara/types";
import {
  FieldErrors,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import useBeritaAcaraById from "@/service/berita-acara/useBeritaAcaraById";
import { createDebitNoteSchema, TDebitNoteForm } from "./validator";
import { zodResolver } from "@hookform/resolvers/zod";
import useCreateDebitNote from "@/service/debit-note/useCreateDebitNote";
import useUpdateDebitNote from "@/service/debit-note/useUpdateDebitNote";
import useDebitNoteById from "@/service/debit-note/useDebitNoteById";
import useDebitNoteList from "@/service/debit-note/useDebitNoteList";
import useDeleteDebitNote from "@/service/debit-note/useDeleteDebitNote";
import { TDebitNoteList } from "@/service/debit-note/types";
import { Radio } from "@mui/material";

const useDebitNoteHooks = () => {
  const [selectedDnId, setSelectedDnId] = useState<string>("");
  const pathName = usePathname();
  const id = useMemo(() => {
    const lastPath = pathName.split("/").pop();

    if (lastPath === "dn-management") return null;
    return lastPath;
  }, [pathName]);
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const modalWarningInfo = useModalWarningInfo();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openModalDocument, setOpenModalDocument] = useState<boolean>(false);
  const { dataCustomer, dataUserProfile } = useGlobal();

  const { data: dataBeritaAcaraById, isPending: isLoadingDataBeritaAcaraById } =
    useBeritaAcaraById({
      params: {
        id: id ?? "",
        enabled: mode === "create",
      },
    });
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
  } = useForm<TDebitNoteForm>({
    resolver: zodResolver(
      createDebitNoteSchema(dataBeritaAcaraById?.data?.jenis_berita_acara || "")
    ),
    defaultValues: {
      harga_terbilang: "",
      berita_acara_id: "",
      uraian: [],
      sub_total: "",
      ppn: "",
      total: "",
      dpp_nilai_lain_fk: "",
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
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

  const { mutate: mutateCreateDebitNote, isPending: isLoadingCreateDebitNote } =
    useCreateDebitNote({
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
        router.push("/dn-management");
        toast.success("Debit Note Berhasil Ditambahkan");
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  const { mutate: mutateUpdateDebitNote, isPending: isLoadingUpdateDebitNote } =
    useUpdateDebitNote({
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
        router.push("/dn-management");
        toast.success("Debit Notes Berhasil Diperbarui");
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  const { data: dataDebitNoteById, isPending: isLoadingDebitNoteById } =
    useDebitNoteById({
      params: {
        id: id ?? "",
        enabled: mode === "edit" || mode === "view",
      },
    });

  const { data: dataDebitNoteList, isPending: isLoadingDebitNoteList } =
    useDebitNoteList();

  const onSubmit: SubmitHandler<TDebitNoteForm> = (data) => {
    if (mode === "create") {
      modalWarningInfo.open({
        title: "Konfirmasi",
        message: (
          <div>
            <p>Apakah anda yakin ingin menambahkan Debit Note ini?</p>
          </div>
        ),
        onConfirm: () => {
          mutateCreateDebitNote(data);
        },
      });
    }

    if (mode === "edit") {
      modalWarningInfo.open({
        title: "Konfirmasi",
        message: (
          <div>
            <p>Apakah anda yakin ingin memperbarui Debit Note ini?</p>
          </div>
        ),
        onConfirm: () => {
          mutateUpdateDebitNote({
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
    if (!dataDebitNoteList) return [];

    const searchLower = filter.search?.toLowerCase?.() ?? "";

    const dataFilter = dataDebitNoteList.filter((x) => {
      const matchCustomer = filter.customer
        ? x.berita_acara?.customer_id === filter.customer
        : true;

      const searchMatch = x.debit_note_number
        ?.toLowerCase()
        .includes(searchLower);

      return matchCustomer && searchMatch;
    });

    return dataFilter;
  }, [dataDebitNoteList, filter, dataCustomer]);

  const { mutate: mutateDeleteDebitNote, isPending: isLoadingDeleteDebitNote } =
    useDeleteDebitNote({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["useDebitNoteList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useBeritaAcaraList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useFakturList"],
        });
        queryClient.invalidateQueries({
          queryKey: ["useTotalList"],
        });
        toast.success("Debit Note Berhasil Dihapus");
      },
      onError: (error) => {
        toast.error(error as string);
      },
    });

  const debitNoteColumnDef = useMemo<ColDef<TDebitNoteList>[]>(() => {
    return [
      {
        width: 80,
        pinned: "left",
        hide: dataUserProfile?.data?.department !== "FAT",
        cellRenderer: (params: ICellRendererParams<TDebitNoteList>) => {
          const idRow = params?.data?.id;
          const isSelected = selectedDnId === idRow;
          return (
            <Radio
              disabled={
                params?.data?.berita_acara?.status !== "Submitted Debit Note"
              }
              checked={isSelected}
              onClick={(e) => {
                e.stopPropagation();
                if (isSelected) {
                  setSelectedDnId("");
                } else if (idRow) {
                  setSelectedDnId(idRow);
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
        cellRenderer: (params: ICellRendererParams<TBeritaAcaraList>) => {
          const rowIndex = params.node?.rowIndex ?? 0;
          return <span>{rowIndex + 1}</span>;
        },
      },
      {
        field: "debit_note_number",
        headerName: "Nomor Debit Note",
        cellRenderer: (params: ICellRendererParams<TDebitNoteList>) => {
          return <span>{params?.data?.debit_note_number}</span>;
        },
      },
      {
        field: "berita_acara.number",
        headerName: "Nomor Berita Acara",
      },
      {
        field: "berita_acara.customer_id",
        headerName: "Nama Customer",
        width: 250,
        cellRenderer: (params: ICellRendererParams<TDebitNoteList>) => {
          const findName = dataCustomer?.data.find(
            (x) => x.id === params?.data?.berita_acara?.customer_id
          );
          return <span>{findName?.name}</span>;
        },
      },
      {
        field: "berita_acara.customer_id",
        headerName: "Kode Customer",
        width: 150,
        cellRenderer: (params: ICellRendererParams<TDebitNoteList>) => {
          const findName = dataCustomer?.data.find(
            (x) => x.id === params?.data?.berita_acara?.customer_id
          );
          return <span>{findName?.code}</span>;
        },
      },
      {
        field: "berita_acara.customer_id",
        headerName: "Phone Customer",
        width: 150,
        cellRenderer: (params: ICellRendererParams<TDebitNoteList>) => {
          const findName = dataCustomer?.data.find(
            (x) => x.id === params?.data?.berita_acara?.customer_id
          );
          return <span>{findName?.phone}</span>;
        },
      },
      {
        field: "berita_acara.customer_id",
        headerName: "Alamat Customer",
        width: 350,
        cellRenderer: (params: ICellRendererParams<TDebitNoteList>) => {
          const findName = dataCustomer?.data.find(
            (x) => x.id === params?.data?.berita_acara?.customer_id
          );
          return <span>{findName?.alamat}</span>;
        },
      },
      {
        field: "berita_acara.status",
        headerName: "BA Status",
        pinned: "right",
        width: 190,
        cellRenderer: (params: ICellRendererParams<TDebitNoteList>) => {
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
        cellRenderer: (params: ICellRendererParams<TDebitNoteList>) => {
          return (
            <div className="flex gap-1 py-1 items-center justify-center">
              <div
                onClick={() => {
                  if (params?.data?.id) {
                    router.push(`/dn-management/${params.data.id}?mode=view`);
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
                            `/dn-management/${params.data.id}?mode=edit`
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
                                  Apakah anda yakin ingin menghapus Debit Note
                                  ini?
                                </p>
                              </div>
                            ),
                            onConfirm: () => {
                              if (params?.data?.id)
                                mutateDeleteDebitNote(params?.data?.id);
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
  }, [mutateDeleteDebitNote, dataGridList, dataCustomer, selectedDnId]);

  useEffect(() => {
    if (id && dataDebitNoteById?.data) {
      reset({
        ...dataDebitNoteById.data,
        uraian: dataDebitNoteById.data.berita_acara?.berita_acara_uraian || [],
      });
    }
  }, [dataDebitNoteById, id, mode, reset]);

  useEffect(() => {
    if (mode === "create" && dataBeritaAcaraById) {
      setValue("berita_acara_id", dataBeritaAcaraById?.data?.id);
      setValue("uraian", dataBeritaAcaraById?.data?.berita_acara_uraian);
    }
  }, [mode, dataBeritaAcaraById]);


  return {
    selectedDnId,
    debitNoteColumnDef,
    dataDebitNoteList,
    mutateDeleteDebitNote,
    isLoadingDebitNoteList,
    isLoadingDeleteDebitNote,
    handleSubmit,
    onSubmit,
    onInvalid,
    control,
    dataBeritaAcaraById,
    clearErrors,
    getValues,
    errors,
    append,
    remove,
    watch,
    setValue,
    setError,
    isLoadingDebitNoteById,
    isLoadingCreateDebitNote,
    isLoadingUpdateDebitNote,
    reset,
    mode,
    openModalDocument,
    setOpenModalDocument,
    dataDebitNoteById,
    filter,
    setFilter,
    dataGridList,
    fields,
    isLoadingDataBeritaAcaraById,
  };
};

const useDebitNoteContext = createContext<
  ReturnType<typeof useDebitNoteHooks> | undefined
>(undefined);

export const DebitNoteProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = useDebitNoteHooks();
  return (
    <useDebitNoteContext.Provider value={value}>
      {children}
    </useDebitNoteContext.Provider>
  );
};

export const useDebitNote = () => {
  const context = useContext(useDebitNoteContext);
  if (context === undefined) {
    throw new Error(
      "useDebitNoteContext must be used within an DebitNoteProvider"
    );
  }
  return context;
};
export default useDebitNote;
