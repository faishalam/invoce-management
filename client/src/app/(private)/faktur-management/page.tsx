"use client";
import DataGrid from "@/components/molecules/datagrid";
import { CAutoComplete, CInput } from "@/components/atoms";
import { SearchIcon } from "lucide-react";
import useGlobal from "@/app/(private)/hooks";
import FakturSkeleton from "./components/LoadingSkeleton";
import useFaktur from "./hooks";
import CardHeader from "./components/CardHeader";

export default function Page() {
  const {
    fakturColumnDefs,
    dataGridList,
    filter,
    setFilter,
    isLoadingDataFakturList,
    isLoadingDeleteFaktur,
  } = useFaktur();
  const { dataCustomer, globalLoading } = useGlobal();
  return (
    <>
      {globalLoading ? (
        <FakturSkeleton />
      ) : (
        <div className="w-full flex flex-col gap-6">
          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col">
              <p className="text-2xl font-bold">Faktur Dashboard</p>
              <p className="text-sm text-gray-600">Kelola Data Faktur</p>
            </div>
          </div>

          <CardHeader />

          <div className="w-full bg-white shadow rounded-md">
            <div className="w-full flex gap-3 p-4">
              <div className="flex max-w-full w-full">
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
              <div className="flex max-w-1/3 w-full  gap-3">
                <CAutoComplete
                  options={dataCustomer?.data || []}
                  className="w-full"
                  getOptionKey={(option) => option.name}
                  renderOption={(props, option) => (
                    <li {...props} key={option.name}>
                      {option.name}
                    </li>
                  )}
                  onChange={(_, customer) => {
                    setFilter({
                      ...filter,
                      customer: customer?.id,
                    });
                  }}
                  getOptionLabel={(option) => option.name}
                  placeholder="Customer"
                />
              </div>
            </div>
            <div className="w-full h-[54vh] overflow-y-scroll">
              <DataGrid
                columnDefs={fakturColumnDefs}
                rowData={dataGridList}
                loading={isLoadingDataFakturList || isLoadingDeleteFaktur}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
