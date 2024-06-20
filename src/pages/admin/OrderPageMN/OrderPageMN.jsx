/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from "react";
import TableComponent from "../../../components/TableComponent/TableComponent";
import { useQuery } from '@tanstack/react-query'
import * as OrderService from '../../../services/OrderService';
import { Divider, Button, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import moment from 'moment';
import { useSelector } from "react-redux";
import * as message from "../../../components/Message/Message";


const OrderPageMN = () => {
    const [ rowSelected, setRowSelected ] = useState('')
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const account = useSelector((state) => state.account);


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

    const handleUpdate = async (id) => {
        try {
            await OrderService.updateOrder({id: id, access_token: account?.access_token})
            message.success('Cập nhật trạng thái đơn hàng thành công!')
        }catch(e) {
            message.error('Lỗi: ' + e)
        }
    }


    const columns = [
        {
            title: 'Mã',
            dataIndex: '_id'
        },
        {
            title: 'Ngày đặt hàng',
            dataIndex: 'paidAt',
            render: paidAt => moment(paidAt).format('DD-MM-YYYY HH:mm:ss')
        },
        {
            title: 'Khách hàng',
            dataIndex: 'name',
            ...getColumnSearchProps('name')
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            ...getColumnSearchProps('phone')
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethod'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status, record) => {
                return status === 'Chờ xác nhận' ? (
                    <Button onClick={() => handleUpdate(record._id)} danger>{status}</Button>
                ) : (
                    <Button type="primary">{status}</Button>
                );
            }
        },        
        {
            title: 'Giao hàng',
            dataIndex: 'isPaid',
            render: isPaid => isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPay',
        }
    ];

  //=============== Display Orders ==================//

    const fetchOrderAll = async () => {
        const res = await OrderService.getAllOrder();
        const orders = res.data;
    
        const ordersWithShippingInfo = await Promise.all(orders.map(async (order) => {
        const shippingAddress = order.shippingAddress;
    
        return {
            ...order,
            name: shippingAddress.name,
            phone: shippingAddress.phone
        };
        }));
    
        return ordersWithShippingInfo;
    };

    // Lấy ra danh sách đơn hàng
    const queryOrders = useQuery({
        queryKey: ['orders'], 
        queryFn: fetchOrderAll
    });

    const { isLoading: isLoadingProducts, data: orders } = queryOrders

    const dataTable = orders?.length && orders?.map((order) => {
        return {...order, key: order._id}
    })


    return (
        <>
        <Divider>QUẢN LÝ ĐƠN HÀNG</Divider>

        <TableComponent columns={columns} isLoading={isLoadingProducts} data={dataTable} 
            pagination={{ pageSize: 8, position: ['bottomCenter'], }}
            onRow={(record, rowIndex) => {
            return {
                onClick: event => {
                setRowSelected(record._id)
                },
            };
            }}
        />
        </>
    );
};

export default OrderPageMN;
