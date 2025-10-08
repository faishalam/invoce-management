"use client";
import DataGrid from "@/components/molecules/datagrid";
import useDataManagement from "./hooks";
import { CInput } from "@/components/atoms";
import ButtonSubmit from "@/components/atoms/button-submit";
import ModalCustomer from "./components/ModalCustomer";
import ModalDepartment from "./components/ModalDepartment";
import ModalTypeOfWork from "./components/ModalTypeOfWork";
import ModalSatuan from "./components/ModalSatuan";
import useGlobal from "@/app/context/hooks";
import { BlockingLoader } from "@/components/atoms/loader";
import ModalGoods from "./components/ModalGoods";

export default function DataManagementPage() {
  const {
    dataGridCustomer,
    dataGridDepartment,
    customerColumnDef,
    filterCustomer,
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
    resetCustomer,
    setModeCustomer,
    resetTypeOfWork,
    setModeTypeOfWork,
    resetDepartment,
    setModeDepartment,
    resetSatuan,
    setModeSatuan,
    openModalGoods,
    filterGoods,
    setModeGoods,
    setFilterGoods,
    setOpenModalGoods,
    resetGoods,
    dataGridGoods,
    isLoadingGoods,
    goodsColumnDef,
  } = useDataManagement();

  const { globalLoading } = useGlobal();

  return (
    <div className="w-[100%] h-full">
      {globalLoading ? (
        <BlockingLoader />
      ) : (
        <div className="w-full flex flex-col gap-6">
          <div className="h-full w-full flex flex-col gap-4 bg-white shadow-md rounded-md p-4">
            <div>
              <p className="text-lg font-semibold">Master Department</p>
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="w-1/3">
                <CInput
                  value={filterDepartment.search}
                  className="w-full"
                  onChange={(e) =>
                    setFilterDepartment({
                      ...filterDepartment,
                      search: e.target.value,
                    })
                  }
                  placeholder="Search"
                />
              </div>
              <div className="w-1/7">
                <ButtonSubmit
                  classname="flex w-full justify-center items-center cursor-pointer !text-xs gap-2 text-white !bg-blue-900 hover:!bg-blue-950 p-2 !rounded-md"
                  btnText="Add Department"
                  onClick={() => {
                    resetDepartment({
                      name: "",
                    });
                    setModeDepartment("create");
                    setOpenModalDepartment(true);
                  }}
                />
              </div>
            </div>
            <DataGrid
              rowData={dataGridDepartment}
              columnDefs={departmentColumnDef}
              loading={loadingDepartment}
              pagination={true}
              paginationPageSize={5}
            />
          </div>

          <div className="h-full w-full flex flex-col gap-4 bg-white shadow-md rounded-md p-4">
            <div>
              <p className="text-lg font-semibold">Master Customer</p>
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="w-1/3">
                <CInput
                  value={filterCustomer.search}
                  className="w-full"
                  onChange={(e) =>
                    setFilterDepartment({
                      ...filterCustomer,
                      search: e.target.value,
                    })
                  }
                  placeholder="Search"
                />
              </div>
              <div className="w-1/7">
                <ButtonSubmit
                  classname="flex w-full justify-center items-center cursor-pointer !text-xs gap-2 text-white !bg-blue-900 hover:!bg-blue-950 p-2 !rounded-md"
                  btnText="Add Customer"
                  onClick={() => {
                    setOpenModalCustomer(true);
                    resetCustomer({
                      name: "",
                      code: "",
                    });
                    setModeCustomer("create");
                  }}
                />
              </div>
            </div>
            <DataGrid
              rowData={dataGridCustomer}
              columnDefs={customerColumnDef}
              loading={loadingCustomer}
              pagination={true}
              paginationPageSize={5}
            />
          </div>

          <div className="h-full w-full flex flex-col gap-4 bg-white shadow-md rounded-md p-4">
            <div>
              <p className="text-lg font-semibold">
                Master Jenis Pekerjaan/Jasa
              </p>
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="w-1/3">
                <CInput
                  value={filterGoods.search}
                  className="w-full"
                  onChange={(e) =>
                    setFilterGoods({
                      ...filterGoods,
                      search: e.target.value,
                    })
                  }
                  placeholder="Search"
                />
              </div>
              <div className="w-1/7">
                <ButtonSubmit
                  classname="flex w-full justify-center items-center cursor-pointer !text-xs gap-2 text-white !bg-blue-900 hover:!bg-blue-950 p-2 !rounded-md"
                  btnText="Add Customer"
                  onClick={() => {
                    setOpenModalGoods(true);
                    resetGoods({
                      name: "",
                    });
                    setModeGoods("create");
                  }}
                />
              </div>
            </div>
            <DataGrid
              rowData={dataGridGoods}
              columnDefs={goodsColumnDef}
              loading={isLoadingGoods}
              pagination={true}
              paginationPageSize={5}
            />
          </div>

          <div className="h-full w-full flex flex-col gap-4 bg-white shadow-md rounded-md p-4">
            <div>
              <p className="text-lg font-semibold">Master Jenis Pekerjaan</p>
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="w-1/3">
                <CInput
                  value={filterCustomer.search}
                  className="w-full"
                  onChange={(e) =>
                    setFilterTypeOfWork({
                      ...filterTypeOfWork,
                      search: e.target.value,
                    })
                  }
                  placeholder="Search"
                />
              </div>
              <div className="w-1/7">
                <ButtonSubmit
                  classname="flex w-full justify-center items-center cursor-pointer !text-xs gap-2 text-white !bg-blue-900 hover:!bg-blue-950 p-2 !rounded-md"
                  btnText="Add Jenis Pekerjaan"
                  onClick={() => {
                    resetTypeOfWork({
                      name: "",
                      type: "",
                    });
                    setModeTypeOfWork("create");
                    setOpenModalTypeOfWork(true);
                  }}
                />
              </div>
            </div>
            <DataGrid
              rowData={dataGridTypeOfWork}
              columnDefs={typeOfWorkColumnDef}
              loading={loadingTypeOfWork}
              pagination={true}
              paginationPageSize={5}
            />
          </div>

          <div className="h-full w-full flex flex-col gap-4 bg-white shadow-md rounded-md p-4">
            <div>
              <p className="text-lg font-semibold">Master Satuan</p>
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="w-1/3">
                <CInput
                  value={filterSatuan.search}
                  className="w-full"
                  onChange={(e) =>
                    setFilterSatuan({
                      ...filterSatuan,
                      search: e.target.value,
                    })
                  }
                  placeholder="Search"
                />
              </div>
              <div className="w-1/7">
                <ButtonSubmit
                  classname="flex w-full justify-center items-center cursor-pointer !text-xs gap-2 text-white !bg-blue-900 hover:!bg-blue-950 p-2 !rounded-md"
                  btnText="Add Satuan"
                  onClick={() => {
                    resetSatuan({
                      name: "",
                    });
                    setModeSatuan("create");
                    setOpenModalSatuan(true);
                  }}
                />
              </div>
            </div>
            <DataGrid
              rowData={dataGridSatuan}
              columnDefs={satuanColumnDef}
              loading={loadingSatuan}
              pagination={true}
              paginationPageSize={5}
            />
          </div>
        </div>
      )}

      {openModalCustomer && <ModalCustomer />}
      {openModalDepartment && <ModalDepartment />}
      {openModalTypeOfWork && <ModalTypeOfWork />}
      {openModalSatuan && <ModalSatuan />}
      {openModalGoods && <ModalGoods />}
    </div>
  );
}
