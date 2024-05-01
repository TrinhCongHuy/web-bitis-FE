import React from 'react'
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'
import * as OrderService from '../../../services/OrderService'
import { Col, Row, Space } from 'antd';
import './MyOrderDetail.scss'




const MyOrderDetail = () => {
    const { id } = useParams();

    const fetchProductOrderDetail = async (context) => {
        const id = context?.queryKey && context?.queryKey[1];
        const res = await OrderService.orderDetail(id);
        return res.data;
    };

    const { data: orderDetail } = useQuery({
        queryKey: ['my-order-detail', id], 
        queryFn: fetchProductOrderDetail, 
        config: {
            enabled: !!id
        }
    });


    return (
        <div className="container page__order--detail">
            <Row>
                <Col span={16} offset={4}>
                    <div className="order-detail">
                        <h2 style={{textAlign: 'center'}}>CHI TIẾT ĐƠN HÀNG</h2>
                        <hr style={{ borderStyle: 'dashed', width: '50%', margin: '0 auto' }} />
                        <div className="order-card">
                            {orderDetail && (
                                <>
                                    <div>
                                        <h3>Thông tin đặt hàng</h3>
                                        <p>Phương thức thanh toán: {orderDetail.paymentMethod}</p>
                                        <p>Tình trạng thanh toán: {orderDetail.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
                                        <p>Hình thức vận chuyển: {orderDetail.deliveryMethod}</p>
                                        <p>Phí vận chuyển: {orderDetail.shippingPrice} VNĐ</p>
                                        <p>Tổng tiền thanh toán: {orderDetail.totalPay} VNĐ</p>
                                    </div>
                                    <div>
                                        <h3>Địa chỉ giao hàng</h3>
                                        <p>Tên người nhận: {orderDetail.shippingAddress.name}</p>
                                        <p>Địa chỉ: {orderDetail.shippingAddress.specificLocation}, {orderDetail.shippingAddress.address.split(', ').reverse().join(', ')}</p>
                                        <p>Số điện thoại: {orderDetail.shippingAddress.phone}</p>
                                    </div>
                                    <div>
                                        <h3>Sản phẩm đặt hàng</h3>
                                        <div className="product-list" style={{ marginTop: '10px'}}>
                                            {orderDetail.orderItems.map((item, index) => (
                                                <div className="product-item" key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                    <img src={item.image} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />
                                                    <div className="product-info" style={{ flex: '1' }}>
                                                        <Space size='large'>
                                                            <div className="product-name" style={{ fontWeight: 'bold', width: '200px' }}>{item.name}</div>
                                                            <div className="product-price" style={{width: '100px'}}>{item.price} VNĐ</div>
                                                            <div className="product-quantity" style={{width: '100px'}}>x{item.amount}</div>
                                                            <div className="product-total">{item.totalPrice} VNĐ</div>
                                                        </Space>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default MyOrderDetail