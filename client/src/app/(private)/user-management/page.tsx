"use client";
import DataGrid from "@/components/molecules/datagrid";
import useUserManagement from "./hooks";
import { CAutoComplete, CInput } from "@/components/atoms";
import ButtonSubmit from "@/components/atoms/button-submit";
import UserModal from "./components/UserModal";
import { BlockingLoader } from "@/components/atoms/loader";
import useGlobal from "@/app/(private)/hooks";
import CardHeader from "./components/CardHeader";

export default function UserManagementPage() {
  const {
    isLoadingDataUser,
    isLoadingDeleteUser,
    isLoadingUpdateUser,
    usersColumnsDef,
    setFilter,
    dataGrid,
    filter,
    openModalUser,
    reset,
    setOpenModalUser,
    setMode,
    isLoadingDepartment,
  } = useUserManagement();
  const { dataDepartment } = useGlobal();

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col">
        <p className="text-2xl font-bold">User Dashboard</p>
        <p className="text-sm text-gray-600">Kelola User Akun</p>
      </div>
      <CardHeader />
      <div className="w-full bg-white shadow-md rounded-lg">
        <div className="w-full bg-white rounded-md overflow-x-auto">
          <div className="min-w-[1000px] flex gap-3 p-4">
            <div className="flex max-w-full w-full gap-2">
              <CInput
                value={filter.search}
                className="w-full"
                onChange={(e) =>
                  setFilter({ ...filter, search: e.target.value })
                }
                placeholder="Search"
              />
            </div>
            <div className="w-full flex gap-3">
              <CAutoComplete
                options={[
                  { label: "User", value: "user" },
                  { label: "Admin", value: "admin" },
                ]}
                className="w-full"
                getOptionKey={(option) => option.value}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
                onChange={(_, value) => {
                  setFilter({ ...filter, role: value?.value });
                }}
                getOptionLabel={(option) => option.label}
                placeholder="Roles"
              />
              <CAutoComplete
                options={dataDepartment?.data || []}
                className="w-full"
                getOptionKey={(option) => option.id}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
                onChange={(_, value) => {
                  setFilter({ ...filter, department_id: value?.id ?? null });
                }}
                getOptionLabel={(option) => option.name}
                placeholder="Department"
              />

              <div className="w-[50%] flex">
                <ButtonSubmit
                  classname="flex w-full justify-center items-center cursor-pointer gap-2 text-white !bg-blue-900 hover:!bg-blue-950 !text-xs !rounded-[8px]"
                  btnText="Add User"
                  onClick={() => {
                    setMode("create");
                    reset();
                    setOpenModalUser(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-[54vh] overflow-y-scroll">
          <DataGrid
            columnDefs={usersColumnsDef}
            rowData={dataGrid || []}
            pagination={true}
            loading={
              isLoadingDeleteUser ||
              isLoadingDataUser ||
              isLoadingUpdateUser ||
              isLoadingDepartment
            }
          />
        </div>
      </div>

      {openModalUser && <UserModal />}
    </div>
  );
}
