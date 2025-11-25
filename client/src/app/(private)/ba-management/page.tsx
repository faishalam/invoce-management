"use client";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import DataGrid from "@/components/molecules/datagrid";
import useBeritaAcara from "./hooks";
import { CAutoComplete, CInput } from "@/components/atoms";
import { SearchIcon } from "lucide-react";
import useGlobal from "@/app/(private)/hooks";
import CardHeader from "./components/CardHeader";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import BeritaAcaraPageSkeleton from "./components/LoadingSkeleton";
import CardHeaderTotal from "./components/CardHeaderTotal";
import ModalAcceptBa from "./components/ModalAccept";
import ModalCancelled from "./[id]/components/ModalCancelled";

export default function BeritaAcaraPage() {
  const {
    beritaAcaraColumnDef,
    dataGridList,
    filter,
    setFilter,
    isLoadingBeritaAcaraList,
    setOpenModalAccept,
    openModalAccept,
    setSelectedBaId,
    isLoadingDeleteBeritaAcara,
    selectedBaId,
    reset,
    setActiveTabs,
    isLoadingApprovedBeritaAcara,
    activeTabs,
    onDownloadBeritaAcara,
    openModalCancelled,
  } = useBeritaAcara();
  const { dataTypeOfWork, globalLoading, dataUserProfile } = useGlobal();
  const router = useRouter();

  if (globalLoading) {
    return <BeritaAcaraPageSkeleton />;
  }
  return (
    <>
      <div className="w-full flex flex-col gap-6">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-2xl font-bold">Berita Acara Dashboard</p>
            <p className="text-sm text-gray-600">Kelola Berita Acara Dokumen</p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              color="secondary"
              className="!rounded-md"
              disabled={!selectedBaId || activeTabs === "berita-acara-waiting"}
              onClick={() => {
                router.push(`/dn-management/${selectedBaId}?mode=create`);
              }}
            >
              Create DN
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              color="primary"
              className="!rounded-md"
              onClick={() => {
                reset({
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
                });
                router.push("/ba-management/new?mode=create");
              }}
            >
              Create BA
            </Button>
          </div>
        </div>
        <CardHeader />
        <CardHeaderTotal />

        <div className="w-full bg-white shadow rounded-md">
          <div className="w-full flex items-center px-4 pt-4">
            <div className="w-full font-semibold">Berita Acara</div>
            <div className="flex gap-2 w-1/4 justify-end">
              {dataUserProfile?.data?.department === "FAT" && (
                <>
                  <Button
                    onClick={() => {
                      setActiveTabs("berita-acara-waiting");
                      setSelectedBaId("");
                    }}
                    variant={
                      activeTabs === "berita-acara-waiting"
                        ? "contained"
                        : "outlined"
                    }
                    color={
                      activeTabs === "berita-acara-waiting"
                        ? "secondary"
                        : "inherit"
                    }
                    className={`w-full !text-xs ${
                      activeTabs === "berita-acara-waiting"
                        ? "!bg-secondary !text-white"
                        : "!bg-white !text-gray-600 border-gray-300"
                    }`}
                  >
                    Waiting
                  </Button>

                  <Button
                    onClick={() => {
                      setActiveTabs("berita-acara-all");
                      setSelectedBaId("");
                    }}
                    variant={
                      activeTabs === "berita-acara-all"
                        ? "contained"
                        : "outlined"
                    }
                    color={
                      activeTabs === "berita-acara-all"
                        ? "secondary"
                        : "inherit"
                    }
                    className={`w-full !text-xs ${
                      activeTabs === "berita-acara-all"
                        ? "!bg-secondary !text-white"
                        : "!bg-white !text-gray-600 border-gray-300"
                    }`}
                  >
                    All
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="w-full flex gap-3 p-4">
            <div className="flex max-w-lg w-[50%]">
              <CInput
                className="w-full"
                type="text"
                placeholder="Search"
                icon={<SearchIcon className="text-black" />}
                onChange={(e) =>
                  setFilter({ ...filter, search: e.target.value })
                }
                value={filter.search}
              />
            </div>
            <div className="flex max-w-full gap-3 w-full">
              <CAutoComplete
                options={[
                  { value: "trade", label: "Trade" },
                  { value: "nontrade", label: "Non Trade" },
                ]}
                className="w-full"
                getOptionKey={(option) => option.value}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
                onChange={(_, tipe_transaksi) => {
                  setFilter({
                    ...filter,
                    tipe_transaksi: tipe_transaksi?.value,
                  });
                }}
                getOptionLabel={(option) => option.label}
                placeholder="Tipe Transaksi"
              />
              <CAutoComplete
                options={[
                  { value: "fuel", label: "Fuel" },
                  { value: "nonfuel", label: "Non Fuel" },
                ]}
                className="w-full"
                getOptionKey={(option) => option.value}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
                onChange={(_, jenis_berita_acara) => {
                  setFilter({
                    ...filter,
                    jenis_berita_acara: jenis_berita_acara?.value,
                  });
                }}
                getOptionLabel={(option) => option.label}
                placeholder="Jenis Berita Acara"
              />
              <CAutoComplete
                options={[
                  { value: "customer", label: "Customer" },
                  { value: "vendor", label: "Vendor" },
                ]}
                className="w-full"
                getOptionKey={(option) => option.value}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
                onChange={(_, tipe_customer) => {
                  setFilter({
                    ...filter,
                    tipe_customer: tipe_customer?.value,
                  });
                }}
                getOptionLabel={(option) => option.label}
                placeholder="Jenis Customer"
              />
              <CAutoComplete
                options={dataTypeOfWork?.data || []}
                className="w-full"
                getOptionKey={(option) => option.name}
                renderOption={(props, option) => (
                  <li {...props} key={option.name}>
                    {option.name}
                  </li>
                )}
                onChange={(_, jenis_pekerjaan) => {
                  setFilter({
                    ...filter,
                    jenis_pekerjaan: jenis_pekerjaan?.name,
                  });
                }}
                getOptionLabel={(option) => option.name}
                placeholder="Jenis Pekerjaan"
              />
              <Button
                onClick={() => {
                  onDownloadBeritaAcara();
                }}
                className=""
                color="primary"
                variant="contained"
              >
                <span>{<DownloadIcon />}</span>
              </Button>
            </div>
          </div>
          <div className="w-full h-[34vh] overflow-y-scroll">
            <DataGrid
              columnDefs={beritaAcaraColumnDef}
              rowData={dataGridList}
              loading={
                isLoadingBeritaAcaraList ||
                isLoadingDeleteBeritaAcara ||
                isLoadingApprovedBeritaAcara
              }
            />
          </div>
          {activeTabs === "berita-acara-waiting" && (
            <div className="w-full flex justify-end items-center px-4 pb-3 -mt-4">
              <Button
                onClick={() => {
                  setOpenModalAccept(true);
                }}
                variant="contained"
                disabled={!selectedBaId}
                color="secondary"
                className="!bg-secondary !text-white !text-xs"
              >
                Accept
              </Button>
            </div>
          )}
        </div>
        {openModalAccept && <ModalAcceptBa />}
        {openModalCancelled && <ModalCancelled />}
      </div>
    </>
  );
}
