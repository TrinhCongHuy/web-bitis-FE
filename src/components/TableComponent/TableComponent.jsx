import React, { useState } from 'react';
import { Table, Button } from 'antd';
import './TableComponent.scss'
import Loading from '../LoadingComponent/loading';
import { Excel } from "antd-table-saveas-excel";


const TableComponent = (props) => {
  const selectionType = 'checkbox'
  const [rowSelectKeys, setRowSelectKey] = useState([])
  const {data = [], columns= [], isLoading = false, handleDeletedMany} = props
  const newColumn = columns?.filter((col) => col.dataIndex !== 'action')

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`);
      setRowSelectKey(selectedRowKeys)
    },
  
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const handleDeleteAll = () => {
    handleDeletedMany(rowSelectKeys)
  }

  const handleClick = () => {
    const excel = new Excel();
    excel
      .addSheet("test")
      .addColumns(newColumn)
      .addDataSource(data, {
        str2Percent: true
      })
      .saveAs("Excel.xlsx");
  };

  return (
    <div>
      <Loading isLoading={isLoading}>
        {rowSelectKeys.length > 0 && (
          <div style={{float: 'right', marginBottom: '10px'}}>
            <Button onClick={handleDeleteAll} danger>Xoá tất cả</Button>
          </div>
        )}
        <Button onClick={handleClick}>Export excel</Button>
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