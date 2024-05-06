/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Input, Popconfirm, Row } from 'antd'
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { DeleteOutlined } from "@ant-design/icons";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import './CartPage.scss'
import * as message from '../../../components/Message/Message'
import * as CartService from '../../../services/CartService'
import ModalAddressComponent from '../../../components/ModalAddressComponent/ModalAddressComponent';



const CartPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const user = useSelector((state) => state?.user)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataCart, setDataCart] = useState([])
  const navigate = useNavigate()

  const token = user?.access_token

  const fetchProductsCart = async () => {
    const userId = user?.id;

    if (!userId) {
      return [];
    }

    try {
      const res = await CartService.listProductCart(userId);
      setDataCart(res.data)
    } catch (error) {
      console.error("Error fetching products cart:", error);
    }
  };

  // const { data: productsList } = useQuery({
  //   queryKey: ['products-cart', user?.id], 
  //   queryFn: fetchProductsCart, 
  //   config: {
  //     retry: 3,
  //     retryDelay: 1000,
  //     keePreviousData: true
  //   }
  // });

  useEffect(() => {
    fetchProductsCart()
  }, [user?.id]);

  // Xoá nhiều sản phẩm trong giỏ hàng
  const handleDeleteAll = async () => {
    if (selectedRowKeys.length > 0) {
      try {
        await CartService.deleteManyProductCart(selectedRowKeys, token);
        fetchProductsCart();
      } catch (error) {
        console.error('Error updating product quantity in cart:', error);
      }
    }
  }


  // TABLE
  const columns = [
    {
      title: `Tất cả (${dataCart?.length} sản phẩm)`,
      dataIndex: 'image',
      key: 'image',
      render: (image) => <img src={image} alt="Product" style={{ width: '80px' }} />, 
    },
    {
      title: 'Sản phẩm',
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
      render: (_, record) => (
        <Input
          type="number"
          style={{ width: 80 }}
          min={1}
          defaultValue={record.amount}
          onChange={(e) => handleAmountChange(record.key, e.target.value, token)}
        />
      ),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
    {
      title: <DeleteOutlined onClick={handleDeleteAll}/>,
      key: 'action',
      render: (_, record) => (
        <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.key, token)}>
          <DeleteOutlined style={{color: 'red', cursor: 'pointer', fontSize: '18px'}}/>
        </Popconfirm>
      ),
    },
  ];

  const data = dataCart?.map((product) => ({
    key: product?._id,
    product: product?._id,
    image: product?.image,
    name: product?.name,
    price: product?.price - (product?.price * (product?.discount / 100)),
    amount: product?.quantity,
    totalPrice: (product?.price - (product?.price * (product?.discount / 100))) * product?.quantity
  }));


  const totalOrder = data
    ?.filter((product) => selectedRowKeys.includes(product.key))
    ?.reduce((total, product) => total + product.totalPrice, 0);
  
  const totalPay = totalOrder


  const handleAmountChange = async (key, value, token) => {
    try {
      await CartService.updateProductQuantityInCart(key, value, token);
      // setDataCart(res?.data?.products)
      fetchProductsCart()
    } catch (error) {
      console.error('Error updating product quantity in cart:', error);
    }
  };

  // Xoá sản phẩm trong giỏ hàng
  const handleDelete = async (key, token) => {
    try {
      await CartService.deleteProductCart(key, token);
      fetchProductsCart()
    } catch (error) {
      console.error('Error updating product quantity in cart:', error);
    }
  };

  // ===========

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Mua sản phẩm
  const handlePurchase = async () => {
    if (selectedRowKeys?.length === 0) {
      message.error('Vui lòng chọn sản phẩm cần mua!')
    }else if (user?.address?.length === 0) {
      setIsModalOpen(true);
    }else {

      const selectedProducts = dataCart.filter(product => selectedRowKeys.includes(product._id));
      navigate('/checkout', { state: { selectedProducts } })
    }
  }

  const handleCancelModal = () => {
    setIsModalOpen(false);
    const selectedProducts = dataCart.filter(product => selectedRowKeys.includes(product._id));
    navigate('/checkout', { state: { selectedProducts } })
  };

  return (
    <div className="container page__product--order">
      <Row>
        <Col span={16}>
          <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={false} />
        </Col>
        <Col span={8}>
          <div className='order__result'>
              <div className='price__total'>
                <div className='price__total--title'>Mức giá tạm tính</div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                  <span className='price__total--label'>Tổng thanh toán:</span>
                  <span className='price__total--detail'>{totalPay} VNĐ</span>
                </div>
                
              </div>
              <div className='btn-buy'>
                <Button type="primary" danger onClick={handlePurchase}>Mua hàng</Button>
              </div>
          </div>
        </Col>
      </Row>

      <ModalAddressComponent isShow={isModalOpen} onCancel={handleCancelModal}/>

    </div>
  )
}

export default CartPage