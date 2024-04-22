import { Button, Col, Modal, Radio, Row, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import './CheckOutPage.scss'
import ModalAddressComponent from '../../../components/ModalAddressComponent/ModalAddressComponent'
import { EnvironmentOutlined, OneToOneOutlined, PlusOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom';
import * as message from '../../../components/Message/message'
import { useSelector } from 'react-redux';
import * as OrderService from '../../../services/OrderService'




const CheckOutPage = () => {
  const [isModalAddAddressOpen, setIsModalAddAddressOpen] = useState(false);
  const [isModalVoucherOpen, setIsModalVoucherOpen] = useState(false);
  const [isModalAddressOpen, setIsModalAddressOpen] = useState(false);
  const user = useSelector((state) => state?.user)
  const location = useLocation();
  const selectedProducts = location.state?.selectedProducts || [];
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Thanh toán khi nhận hàng')
  const [deliveryMethod, setDeliveryMethod] = useState(0);
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (user?.address) {
      const defaultAddress = user?.address?.find(address => address.isDefault);
      if (defaultAddress) {
        setValue(defaultAddress);
      }
    }
  }, [user]);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // modal add address
  const showModalAddAddress = () => {
    setIsModalAddAddressOpen(true);
  }
  const handleCancelAddAddress = () => {
    setIsModalAddAddressOpen(false);
  };

  // modal voucher
  const handleOkVoucher = () => {
    setIsModalVoucherOpen(false);
  };

  const handleCancelVoucher = () => {
    setIsModalVoucherOpen(false);
  };

  // modal address of me
  const showModalAddressOfMe = () => {
    setIsModalAddressOpen(true)
  }

  const handleCancelAddress = () => {
    setIsModalAddressOpen(false)
  }

  const handleOkAddress = () => {
    setIsModalAddressOpen(false)
  }
  

  // TABLE
  const columns = [
    {
      title: `Tất cả (${selectedProducts?.length} sản phẩm)`,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
  ];

  const data = selectedProducts?.map((product) => ({
    key: product?._id,
    name: product?.name,
    price: product?.price - (product?.price * (product?.discount / 100)),
    amount: product?.quantity,
    discount: product?.discount,
    totalPrice: (product?.price - (product?.price * (product?.discount / 100))) * product?.quantity
  }));

  const totalOrder = data?.reduce((total, product) => total + product.totalPrice, 0);
  
  const totalPay = totalOrder + Number(deliveryMethod)

  const handleDeliveryChange = (e) => {
    setDeliveryMethod(e.target.value)
  }

  const togglePaymentMethods = () => {
    setShowPaymentMethods(!showPaymentMethods);
  };

  const handleModalVoucher = () => {
    setIsModalVoucherOpen(true);
  }

  const handleOrder = async () => {
    if (!deliveryMethod) {
      message.error('Vui lòng chọn phương thức giao hàng!')
      return;
    }

    const orderData = {
      orderItems: data,
      shippingAddress: {
        name: value?.recipientName,
        address: value?.overallAddress,
        specificLocation: value?.specificLocation,
        phone: value?.phoneNumber
      },
      paymentMethod: paymentMethod, 
      shippingPrice: deliveryMethod, 
      totalPay: totalPay,
      user: user?.id 
    };

    try {
      await OrderService.createOrder(orderData);
      message.success('Đặt hàng thành công!');
    } catch (error) {
      console.error('Error creating order:', error);
      message.error('Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.');
    }
  }


  return (
    <div className="container page__product--checkout">
      <Row>
        <Col span={24}>
          <div className='shipping__address'>
            <div className="shipping__address--line"></div>
            <div className='shipping__address--label'> <EnvironmentOutlined /> Địa chỉ nhận hàng</div>
            <div className='shipping__address--detail'>
              <Space size='large'>
                <span className='name'>{value?.recipientName} - {value?.phoneNumber}</span>
                <span className='address'>{value?.specificLocation}, {value?.overallAddress}</span>
                {value?.isDefault && 
                  <span className='type'>Mặc định</span>
                }
                <Button type="link" onClick={showModalAddressOfMe}>Thay đổi</Button>
              </Space>
            </div>
          </div>
        </Col>
        <Col span={24}>
          <Table columns={columns} dataSource={data} pagination={false} />
        </Col>
      </Row>
      <Row style={{marginTop: '50px'}}>
        <Col span={24}>
          <div className="payment__methods">
            <span className='payment__methods--label'><OneToOneOutlined style={{color: 'red'}}/> Biti's Voucher</span>
            <span className='payment__methods--detail'>
              <Button type="link" onClick={handleModalVoucher}>Chọn voucher</Button>
            </span>
          </div>
          <Modal title="Chọn Biti's Voucher" open={isModalVoucherOpen} onOk={handleOkVoucher} onCancel={handleCancelVoucher}>
            <div>Voucher 1</div>
            <div>Voucher 2</div>
            <div>Voucher 3</div>
          </Modal>
        </Col>
      </Row>
      <Row style={{marginTop: '50px'}}>
        <Col span={24}>
          <div className="payment__methods">
            <span className='payment__methods--label'>Phương thức thanh toán</span>
            <span className='payment__methods--detail'>
              <span>{paymentMethod}</span>
              <Button type="link" onClick={togglePaymentMethods}>Thay đổi</Button>
            </span>
          </div>
          <div className={`payment__methods--list ${showPaymentMethods ? 'show' : ''}`}>
            <span className='payment__methods--item' onClick={() => setPaymentMethod('Thanh toán khi nhận hàng')}>Thanh toán khi nhận hàng</span>
            <span className='payment__methods--item' onClick={() => setPaymentMethod('Thanh toán qua VN PAY')}>Thanh toán qua VN PAY</span>
          </div>

        </Col>
        <Col span={24} style={{ backgroundColor: '#fafafa'}}>
          <div className='order__result'>
              <div className='order__result--item'>
                <span>Tạm tính</span>
                <span>{totalOrder} đ</span>
              </div>
              <div className='order__result--item'>
                <span>Giảm giá</span>
                <span>0 %</span>
              </div>
              <div className='order__delivery'>
                <div>Tuỳ chọn dịch vụ giao hàng</div>
                <Radio.Group onChange={handleDeliveryChange} style={{ marginLeft: '50px'}}>
                  <Space direction="vertical">
                    <Radio value={50000}>Hoả tốc - 50.000đ</Radio>
                    <Radio value={30000}>Giao hàng nhanh - 30.000đ</Radio>
                    <Radio value={10000}>Giao hàng tiết kiệm - 10.000đ</Radio>
                  </Space>
                </Radio.Group>
              </div>
              <div className='price__total'>
                <span className='price__total--label'>Tổng thanh toán</span>
                <span className='price__total--detail'>{totalPay} đ</span>
              </div>
              <div className='btn-buy'>
                <Button type="primary" danger onClick={handleOrder}>Đặt hàng</Button>
              </div>
          </div>
        </Col>
      </Row>
      <Modal title="Thêm mới địa chỉ" open={isModalAddressOpen} onOk={handleOkAddress} onCancel={handleCancelAddress}>
          {Array.isArray(user?.address) ? (
            <>
              <Radio.Group onChange={onChange} value={value}>
                {user?.address?.map((address, index) => (
                  <Radio key={index} value={address}>
                    <Space direction="vertical">
                      <div style={{ padding: '20px 0', borderTop: '1px solid #999', lineHeight: '0.8em'}}>
                        <span style={{fontWeight: '500'}}>{address?.recipientName} - {address?.phoneNumber}</span>
                        <p style={{padding: '0'}}>{address?.specificLocation}</p>
                        <p style={{padding: '0'}}>{address?.overallAddress}</p>
                        {address?.isDefault && 
                          <span style={{padding: '1px 5px', border: '1px solid red', color: 'red', fontSize: '0.9em'}}>Mặc định</span>
                        }
                      </div>
                    </Space>
                  </Radio>
                ))}
              </Radio.Group>

            </>
          ) : (
            <p>Không có địa chỉ nào được tìm thấy.</p>
          )}
        <Button danger onClick={showModalAddAddress}> <PlusOutlined /> Thêm địa chỉ mới</Button>
      </Modal>
      <ModalAddressComponent isShow={isModalAddAddressOpen} onCancel={handleCancelAddAddress}/>
    </div>
  )
}

export default CheckOutPage