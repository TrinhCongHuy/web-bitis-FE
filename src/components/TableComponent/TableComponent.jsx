import React from 'react';
import { Table } from 'antd';
import './TableComponent.scss'
import Loading from '../LoadingComponent/loading';


const TableComponent = (props) => {
  const selectionType = 'checkbox'
  const {data = [], columns= [], isLoading = false} = props

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };


  return (
    <div>
      <Loading isLoading={isLoading}>
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
          {...props}
        />
      </Loading>
    </div>
  );
}

export default TableComponent