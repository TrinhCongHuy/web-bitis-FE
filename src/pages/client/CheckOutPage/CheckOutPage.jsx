/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Modal, Radio, Row, Space, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import "./CheckOutPage.scss";
import ModalAddressComponent from "../../../components/ModalAddressComponent/ModalAddressComponent";
import {
  EnvironmentOutlined,
  OneToOneOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import * as message from "../../../components/Message/Message";
import { useSelector } from "react-redux";
import * as OrderService from "../../../services/OrderService";
import * as ProductService from "../../../services/ProductService";
import * as PaymentService from "../../../services/PaymentService";
import * as CouponService from "../../../services/CouponService";
import { PayPalButton } from "react-paypal-button-v2";
import moment from "moment";
import FormatNumber from '../../../components/FormatNumber/FormatNumber';



const CheckOutPage = () => {
  const [isModalAddAddressOpen, setIsModalAddAddressOpen] = useState(false);
  const [isModalVoucherOpen, setIsModalVoucherOpen] = useState(false);
  const [isModalAddressOpen, setIsModalAddressOpen] = useState(false);
  const user = useSelector((state) => state?.user);
  const location = useLocation();
  const selectedProducts = location.state?.selectedProducts || [];
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(
    "Thanh toán khi nhận hàng"
  );
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [discountCode, setDiscountCode] = useState(0);
  const [value, setValue] = useState(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const inputRef = useRef(null)


  // Gọi API lấy địa chỉ người nhận
  useEffect(() => {
    if (user?.address) {
      const defaultAddress = user?.address?.find(
        (address) => address.isDefault
      );
      if (defaultAddress) {
        setValue(defaultAddress);
      }
    }
  }, [user]);

  // Gọi API lấy danh sách coupon
  useEffect(() => {
    fetchCoupon();
  }, []);

  // Gọi API lấy detail coupon
  useEffect(() => {
    fetchCouponCode(couponCode)
  }, [couponCode])

  // ================================
  
  const fetchCoupon = async () => {
    const res = await CouponService.listCoupon();
    setCoupons(res.data);
  };

  const fetchCouponCode = async (couponCode) => {
    if (couponCode) {
      try {
        const res = await CouponService.getDetailCoupon({id: couponCode, access_token: user?.access_token})
        if (res?.status === 'OK') {
          setDiscountCode(res?.data?.discount);
          message.success('Áp dụng mã giảm giá thành công!')
        }else {
          message.error('Lỗi áp dụng mã ko phù hợp!')
        }
      }catch (e) {
        console.log(e)
        message.error('Lỗi áp dụng mã ko phù hợp!')
      }
    }
  }

  // ================================

  // select địa chỉ nhận
  const onChange = (e) => {
    setValue(e.target.value);
  };

  // modal add address
  const showModalAddAddress = () => {
    setIsModalAddAddressOpen(true);
  };
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
    setIsModalAddressOpen(true);
  };

  const handleCancelAddress = () => {
    setIsModalAddressOpen(false);
  };

  const handleOkAddress = () => {
    setIsModalAddressOpen(false);
  };

  // TABLE
  const columns = [
    {
      title: `Tất cả (${selectedProducts?.length} sản phẩm)`,
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <img src={images[0]} alt="Product" style={{ width: "60px" }} />
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
  ];

  const data = selectedProducts?.map((product) => ({
    key: product?._id,
    product: product?._id,
    name: product?.name,
    images: product?.images,
    price: FormatNumber(product?.price - product?.price * (product?.discount / 100)),
    amount: product?.quantity,
    discount: product?.discount,
    totalPrice: FormatNumber((product?.price - product?.price * (product?.discount / 100)) *product?.quantity,)
  }));   

  const totalOrder = data?.reduce(
    (total, product) => total + parseInt(product.totalPrice.replace(/\./g, ''), 10),
    0
  );
  const totalPay = FormatNumber(totalOrder - (totalOrder * discountCode) / 100 + Number(deliveryPrice));

  // Lựa chọn loại hình vận chuyển
  const handleDeliveryChange = (e) => {
    const price = e.target.value;
    const type = e.target.data?.type;
    setDeliveryPrice(price);
    setDeliveryMethod(type);
  };

  // Toggle hiển thị để lựa chọn loại hình thanh toán
  const togglePaymentMethods = () => {
    setShowPaymentMethods(!showPaymentMethods);
  };

  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
    setShowPaymentMethods(!showPaymentMethods);
  };

  const handleModalVoucher = () => {
    setIsModalVoucherOpen(true);
  };

  // Cập nhật lại sản phẩm sau khi mua hàng
  const placeOrderAndUpdateProduct = async (orderData) => {
    try {
      await OrderService.createOrder(orderData);
      message.success("Đặt hàng thành công!");

      // Cập nhật số lượng đã bán của từng sản phẩm
      for (const item of orderData.orderItems) {
        const product = await ProductService.getDetailProduct(item.key);
        const newSold = product?.data?.sold + item.amount;
        const newCountInStock = product?.data?.countInStock - item.amount;

        await ProductService.updateProduct({
          id: item.key,
          access_token: user?.access_token,
          rests: { sold: newSold, countInStock: newCountInStock },
        });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      message.error("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.");
    }
  };

  // Thanh toán thường
  const handleOrder = async () => {
    if (!deliveryPrice) {
      message.error("Vui lòng chọn phương thức giao hàng!");
      return;
    }

    const orderData = {
      orderItems: data,
      shippingAddress: {
        name: value?.recipientName,
        address: value?.overallAddress,
        specificLocation: value?.specificLocation,
        phone: value?.phoneNumber,
      },
      paymentMethod: paymentMethod,
      shippingPrice: deliveryPrice,
      totalPay: totalPay,
      user: user?.id,
      deliveryMethod: deliveryMethod,
      email: user?.email,
    };

    await placeOrderAndUpdateProduct(orderData);
  };

  // Thanh toán qua Paypal
  const addPaypalScript = async () => {
    const { data } = await PaymentService.getConfig();

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };

    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!window.paypal) {
      addPaypalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  const onSuccessPaypal = async (details) => {
    const orderData = {
      orderItems: data,
      shippingAddress: {
        name: value?.recipientName,
        address: value?.overallAddress,
        specificLocation: value?.specificLocation,
        phone: value?.phoneNumber,
      },
      paymentMethod: paymentMethod,
      shippingPrice: deliveryPrice,
      totalPay: totalPay,
      user: user?.id,
      deliveryMethod: deliveryMethod,
      isPaid: true,
      paidAt: details.update_time,
      email: user?.email,
    };

    await placeOrderAndUpdateProduct(orderData);
  };

  const handleAddCoupon = (discount) => {
    setDiscountCode(discount);
    setIsModalVoucherOpen(false);
    message.success("Áp dụng mã giảm giá thành công!");
  };

  const handleCouponCodeChange = () => {
    const inputElement = document.querySelector('input[name="couponCode"]');
    setCouponCode(inputElement.value);
    inputRef.current.value = '';
  };

  return (
    <div className="container page__product--checkout">
      <Row>
        <Col span={24}>
          <div className="shipping__address">
            <div className="shipping__address--line"></div>
            <div className="shipping__address--label">
              {" "}
              <EnvironmentOutlined /> Địa chỉ nhận hàng
            </div>
            <div className="shipping__address--detail">
              <Space size="large">
                <span className="name">
                  {value?.recipientName} - {value?.phoneNumber}
                </span>
                <span className="address">
                  {value?.specificLocation},{" "}
                  {value?.overallAddress.split(", ").reverse().join(", ")}
                </span>
                {value?.isDefault && <span className="type">Mặc định</span>}
                <Button type="link" onClick={showModalAddressOfMe}>
                  Thay đổi
                </Button>
              </Space>
            </div>
          </div>
        </Col>
        <Col span={24}>
          <Table columns={columns} dataSource={data} pagination={false} />
        </Col>
      </Row>
      <Row style={{ marginTop: "50px" }}>
        <Col span={24}>
          <div className="payment__methods">
            <span className="payment__methods--label">
              <OneToOneOutlined style={{ color: "red" }} /> Biti's Voucher
            </span>
            <span className="payment__methods--detail">
              <Button type="link" onClick={handleModalVoucher}>
                Chọn voucher
              </Button>
            </span>
          </div>
          <Modal
            title="Chọn Biti's Voucher"
            open={isModalVoucherOpen}
            onOk={handleOkVoucher}
            onCancel={handleCancelVoucher}
            footer={false}
          >
            {coupons?.length > 0 &&
              coupons?.map((coupon, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "8px 0",
                    padding: "10px",
                    background: "#d9f1fd",
                    borderRadius: "10px",
                  }}
                >
                  <Space size="large">
                    <img
                      src={coupon?.image}
                      alt="coupon"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        lineHeight: "0.8em",
                        color: "#000",
                        marginTop: "10px",
                      }}
                    >
                      <div style={{ fontSize: "1.2em" }}>
                        Giảm giá {coupon?.discount}%
                      </div>
                      <p>Mã: {coupon?._id}</p>
                      <p>
                        HSD:{" "}
                        {moment(coupon?.expireAt).format("DD-MM-YYYY HH:mm:ss")}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleAddCoupon(coupon?.discount)}
                      type="primary"
                      danger
                      size="small"
                      style={{ fontSize: "0.9em" }}
                    >
                      Áp dụng
                    </Button>
                  </Space>
                </div>
              ))}
          </Modal>
        </Col>
      </Row>
      <Row style={{ marginTop: "50px" }}>
        <Col span={24}>
          <div className="payment__methods">
            <span className="payment__methods--label">
              Phương thức thanh toán
            </span>
            <span className="payment__methods--detail">
              <span>{paymentMethod}</span>
              <Button type="link" onClick={togglePaymentMethods}>
                Thay đổi
              </Button>
            </span>
          </div>
          <div
            className={`payment__methods--list ${
              showPaymentMethods ? "show" : ""
            }`}
          >
            <span
              className="payment__methods--item"
              onClick={() => handlePaymentMethod("Thanh toán khi nhận hàng")}
            >
              Thanh toán khi nhận hàng
            </span>
            <span
              className="payment__methods--item"
              onClick={() => handlePaymentMethod("Thanh toán qua VN PAY")}
            >
              Thanh toán qua VN PAY
            </span>
          </div>
        </Col>
        <Col span={24} style={{ backgroundColor: "#fafafa" }}>
          <div className="order__result">
            <div className="order__result--item">
              <span>Tạm tính</span>
              <span>{FormatNumber(totalOrder)} đ</span>
            </div>
            <div className="order__result--code">
              <Space size='small'>
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá..."
                  name="couponCode"
                  ref={inputRef}
                />
                <Button onClick={handleCouponCodeChange} type="primary" danger>Sử dụng</Button>
              </Space>
            </div>
            <div className="order__result--item">
              <span>Giảm giá</span>
              <span>{discountCode} %</span>
            </div>
            <div className="order__delivery">
              <div>Tuỳ chọn dịch vụ giao hàng</div>
              <Radio.Group
                onChange={handleDeliveryChange}
                style={{ marginLeft: "50px" }}
              >
                <Space direction="vertical">
                  <Radio value={50000} data={{ type: "Hoả tốc" }}>
                    Hoả tốc - 50.000đ
                  </Radio>
                  <Radio value={30000} data={{ type: "Giao hàng nhanh" }}>
                    Giao hàng nhanh - 30.000đ
                  </Radio>
                  <Radio value={10000} data={{ type: "Giao hàng tiết kiệm" }}>
                    Giao hàng tiết kiệm - 10.000đ
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
            <div className="price__total">
              <span className="price__total--label">Tổng thanh toán: </span>
              <span className="price__total--detail">{totalPay} VNĐ</span>
            </div>
            <div style={{ marginTop: "20px" }}>
              {paymentMethod === "Thanh toán qua VN PAY" && sdkReady ? (
                <>
                  <PayPalButton
                    amount={Math.round(totalPay / 30000)}
                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                    onSuccess={onSuccessPaypal}
                    onError={() => {
                      alert("error");
                    }}
                  />
                </>
              ) : (
                <>
                  <div className="btn-buy">
                    <Button
                      style={{ width: "100%" }}
                      type="primary"
                      danger
                      onClick={handleOrder}
                    >
                      Đặt hàng
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <Modal
        title="Thêm mới địa chỉ"
        open={isModalAddressOpen}
        onOk={handleOkAddress}
        onCancel={handleCancelAddress}
      >
        {Array.isArray(user?.address) ? (
          <>
            <Radio.Group onChange={onChange} value={value}>
              {user?.address?.map((address, index) => (
                <Radio key={index} value={address}>
                  <Space direction="vertical">
                    <div
                      style={{
                        padding: "20px 0",
                        borderTop: "1px solid #999",
                        lineHeight: "0.8em",
                      }}
                    >
                      <span style={{ fontWeight: "500" }}>
                        {address?.recipientName} - {address?.phoneNumber}
                      </span>
                      <p style={{ padding: "0" }}>
                        {address?.specificLocation}
                      </p>
                      <p style={{ padding: "0" }}>
                        {address?.overallAddress
                          .split(", ")
                          .reverse()
                          .join(", ")}
                      </p>
                      {address?.isDefault && (
                        <span
                          style={{
                            padding: "1px 5px",
                            border: "1px solid red",
                            color: "red",
                            fontSize: "0.9em",
                          }}
                        >
                          Mặc định
                        </span>
                      )}
                    </div>
                  </Space>
                </Radio>
              ))}
            </Radio.Group>
          </>
        ) : (
          <p>Không có địa chỉ nào được tìm thấy.</p>
        )}
        <Button danger onClick={showModalAddAddress}>
          {" "}
          <PlusOutlined /> Thêm địa chỉ mới
        </Button>
      </Modal>
      <ModalAddressComponent
        isShow={isModalAddAddressOpen}
        onCancel={handleCancelAddAddress}
      />
    </div>
  );
};

export default CheckOutPage;
