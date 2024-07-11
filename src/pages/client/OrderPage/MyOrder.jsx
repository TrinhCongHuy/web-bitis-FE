/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Row, Space } from 'antd'
import React from 'react'
import * as OrderService from '../../../services/OrderService'
import { useSelector } from 'react-redux'
import './MyOrder.scss'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import * as message from '../../../components/Message/Message'
import FormatNumber from '../../../components/FormatNumber/FormatNumber';



const MyOrder = () => {
    const user = useSelector((state) => state.user)
    const navigate = useNavigate()

    const fetchProductsOrder = async () => {
        if (!user?.id) {
            return [];
        }
        try {
            const res = await OrderService.listProductOrder(user?.id);
            return res.data;
        } catch (error) {
            console.error('Error fetching cart products:', error);
            throw error;
        }
    };

    const { data: orders } = useQuery({
        queryKey: ['orders', user?.id], 
        queryFn: fetchProductsOrder, 
        config: {
          retry: 3,
          retryDelay: 1000,
          keePreviousData: true
        }
    });

    const handleOrderDetail = (id) => {
        navigate(`/my-order-detail/${id}`)
    };

    const handleDeleteOrder = async (id) => {
        try {
            await OrderService.deleteOrder({id: id, access_token: user?.access_token});
            message.success('Xóa đơn hàng thành công');
        } catch (error) {
            console.error('Lỗi khi xóa đơn hàng:', error);
            message.error('Đã xảy ra lỗi khi xóa đơn hàng. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className="container page__my--order">
            <Row>
                <Col span={16} offset={4}>
                    <h2 style={{textAlign: 'center' }}>THÔNG TIN CÁC ĐƠN HÀNG CỦA BẠN</h2>
                    <hr style={{ borderStyle: 'dashed', width: '50%', margin: '0 auto' }} />
                    {orders && (
                        orders.map((order, index) => {
                            return (
                                <div className="order_card" key={index}>
                                    <div className='order_card--head'>
                                        <h2>Đơn hàng #{index + 1}</h2>
                                        <Button type="primary" danger>{order.status}</Button>
                                    </div>
                                    <div className="order_card--body">
                                        <div style={{display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #D3D3D3', paddingBottom: '10px'}}>
                                            <Space size='middle'>
                                                <Button disabled={order.status === 'Đã xác nhận' ? true : false} type="dashed" danger onClick={() => handleDeleteOrder(order?._id)}>Huỷ đơn hàng</Button>
                                                <Button type="primary" ghost onClick={() => handleOrderDetail(order?._id)}>Xem chi tiết</Button>
                                            </Space>
                                            
                                        </div>
                                        
                                        <div className="product-list" style={{ padding: '10px 0', borderBottom: '1px solid #D3D3D3' }}>
                                        {order.orderItems.map((item, index) => (
                                            <div className="product-item" key={index} style={{ display: 'flex', alignItems: 'center', padding: '10px', marginBottom: '10px'}}>
                                                <img src={item.image} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />
                                                <div className="product-info" style={{ flex: '1'}}>
                                                    <Space style={{gap: '50px'}}>
                                                        <div className="product-name" style={{ fontWeight: 'bold', width: '200px' }}>{item.name}</div>
                                                        <div className="product-price" style={{width: '100px'}}>{item.price} đ</div>
                                                        <div className="product-quantity" style={{width: '100px'}}>x{item.amount}</div>
                                                        <div className="product-total">{FormatNumber(item.totalPrice)} đ</div>
                                                    </Space>
                                                </div>
                                            </div>
                                        ))}
                                        </div>
                                        <p className="total-price" style={{display: 'flex', gap: '10px', marginTop: '20px', fontSize: '1.2em', justifyContent: 'flex-end'}}>
                                            <span>Tổng tiền:</span>
                                            <span>{FormatNumber(order.totalPay)} VNĐ</span>
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </Col>
            </Row>
        </div>
    )
}

export default MyOrder