'use client'
import React from 'react'
import Image from 'next/image'
import { AgGridReact } from '@ag-grid-community/react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { GridOptions } from '@ag-grid-community/core'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { ModuleRegistry } from '@ag-grid-community/core'
import IconNoData from '@/assets/svg/icon-no-data.svg'
import { Loader } from '@/components/atoms/loader'
ModuleRegistry.registerModules([ClientSideRowModelModule])
class DataGrid extends React.Component<GridOptions> {
  constructor(props: GridOptions) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      info: null,
    }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    return { hasError: true, error, info }
  }
  render() {
    const { rowData, columnDefs, domLayout, ...props } = this.props
    const layout = domLayout || 'autoHeight'
    return (Array.isArray(rowData) &&
      rowData.length > 0 &&
      Array.isArray(columnDefs) &&
      columnDefs.length > 0) ||
      props.loading ? (
      <div className={'ag-theme-alpine w-[100%] !h-full'}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          pagination={true}
          gridOptions={{
            columnMenu: 'new',
          }}
          domLayout={layout}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 30]}
          {...props}
          loadingOverlayComponent={() => <Loader size="small" />}
        />
      </div>
    ) : (
      <div className="flex justify-center items-center w-full h-[300px]">
        <Image src={IconNoData} alt="no-data" />
      </div>
    )
  }
}
export default DataGrid
