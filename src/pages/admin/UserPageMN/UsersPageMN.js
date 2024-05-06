/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Divider, Button, Input, Space, Popconfirm } from "antd";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import TableComponent from "../../../components/TableComponent/TableComponent";
import * as UserService from '../../../services/UserService'
import { UseMutationHook } from "../../../hooks/useMutationHook";
import * as message from '../../../components/Message/message'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux';


const UsersPageMN = () => {
  const user = useSelector(state => state.user)
  const [ rowSelected, setRowSelected ] = useState('')
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const renderAction = (record) => {
    return (
      <Space>
        {columns.length >= 1 && (
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.key)}>
            <DeleteOutlined style={{color: 'red', cursor: 'pointer', fontSize: '18px'}}/>
          </Popconfirm>
        )}
      </Space>
    )
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email - b.email,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone - b.phone,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      render: (addresses) => {
        if (!addresses || addresses.length === 0) return null;
        return addresses.map((address, index) => (
          <div key={index}>
            <span>{address.specificLocation}, </span>
            {address.overallAddress && (
              <span>{address.overallAddress.split(', ').reverse().join(', ')}</span>
            )}
          </div>
        ));
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => renderAction(record)
    },
  ];


  const fetchUserAll = async () => {
    const res = await UserService.listUser()
    return res
  }

  // Lấy ra ds sản phẩm
  const queryUsers = useQuery({
    queryKey: ['users'], 
    queryFn: fetchUserAll
  });

  const { isLoading: isLoadingUsers, data: users } = queryUsers


  const dataTable = users?.data.length && users?.data.map((user) => {
    return {...user, key: user._id }
  })

  // ============== DELETE ============= //

  const mutationDeleted = UseMutationHook((data) => {
    const { id, token } = data;
    const res = UserService.deleteUser({ id, token });
    return res
  });

  const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === 'OK') {
      message.success()
    }else if (isErrorDeleted) {
      message.error()
    }
  }, [isSuccessDeleted, isErrorDeleted])



  const handleDelete = (key) => {
    mutationDeleted.mutate({ id: key, token: user?.access_token }, {
      onSettled: () => {
        queryUsers.refetch()
      }
    })
  };

  // ============== DELETE-MANY============= //

  const mutationDeletedMany = UseMutationHook((data) => {
    const { token, ...ids } = data;
    console.log('data', data);
    const res = UserService.deleteManyUser({ access_token: token, data: ids });
    return res;
});

  const { data: dataDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
      message.success()
    }else if (isErrorDeletedMany) {
      message.error()
    }
  }, [isSuccessDeletedMany, isErrorDeletedMany])



  const handleDeletedManyProduct = (ids) => {
    mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => {
        queryUsers.refetch()
      }
    })
  };


  return (
    <>
      <Divider>Quản lý khách hàng</Divider>

      <TableComponent handleDeletedMany={handleDeletedManyProduct} columns={columns} isLoading={isLoadingUsers} data={dataTable} 
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            },
          };
        }}
      />
    </>
  )
}

export default UsersPageMN