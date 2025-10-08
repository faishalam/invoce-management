"use client";

import DataGrid from "@/components/molecules/datagrid";
import useBeritaAcara from "./hooks";

export default function BeritaAcaraPage() {
  const { beritaAcaraColumnDef, dataBeritaAcaraList } = useBeritaAcara();
  return (
    <>
      <div>
        <DataGrid
          columnDef={beritaAcaraColumnDef}
          dataGrid={dataBeritaAcaraList}
        />
      </div>
    </>
  );
}
