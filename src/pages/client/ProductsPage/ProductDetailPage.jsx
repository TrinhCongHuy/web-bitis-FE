import React, { useEffect, useState } from "react";
import "./ProductDetailPage.scss";
import { Button, Col, Image, Input, InputNumber, Rate, Row } from "antd";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import * as ProductService from "../../../services/ProductService";
import * as CartService from "../../../services/CartService";
import { useQuery } from "@tanstack/react-query";
import * as message from "../../../components/Message/Message";
import {
  CheckCircleOutlined,
  SafetyOutlined,
  SplitCellsOutlined,
  SwapOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { useShoppingContext } from "../../../contexts/ShoppingContext";
import FormatNumber from "../../../components/FormatNumber/FormatNumber";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-creative";
import { EffectCreative } from "swiper/modules";
import "swiper/css";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { priceNew } from "../../../utils";
import Comments from "../../../components/Comment/CommentsProduct";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [numberProduct, setNumberProduct] = useState(1);
  const user = useSelector((state) => state.user);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { addCartItem } = useShoppingContext();
  const [sizeProduct, setSizeProduct] = useState();
  const [productState, setProductState] = useState("");
  const [quantityProduct, setQuantityProduct] = useState(0);

  const fetchGetDetailProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    const res = await ProductService.getDetailProduct(id);
    return res?.data;
  };

  const { data: productDetails } = useQuery({
    queryKey: ["product-details", id],
    queryFn: fetchGetDetailProduct,
    config: {
      enable: !!id,
    },
  });

  const ScrollToTop = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    return null;
  };

  ScrollToTop();

  const changeNumber = (value) => {
    setNumberProduct(value);
  };

  const handleClickNumber = (type) => {
    if (type === "increase") {
      setNumberProduct((prev) => (prev < quantityProduct ? prev + 1 : prev));
    } else if (type === "decrease" && numberProduct > 1) {
      setNumberProduct((prev) => prev - 1);
    }
  };

  const handleAddCartProduct = async () => {
    if (!user?.id) {
      navigate("/sing-in", { state: location?.pathname });
    } else {
      const data = {
        user_id: user.id,
        product_id: productDetails?._id,
        quantity: numberProduct,
        size: sizeProduct,
      };

      try {
        await addCartItem({
          ...productDetails,
          quantity: numberProduct,
          size: sizeProduct,
        });
        await CartService.createProductCart(data);
        message.success("Thêm mới sản phẩm thành công!");
      } catch (error) {
        console.error("Lỗi thêm sản phẩm vào giỏ hàng:", error);
      }
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentSlideIndex(index);
  };

  useEffect(() => {
    if (productDetails) {
      const swiperTop = document.querySelector(".swiper-top").swiper;
      swiperTop.slideTo(currentSlideIndex);
    }
  }, [currentSlideIndex, productDetails]);

  const handleSize = (size) => {
    setSizeProduct(size);
    const sizeItem = productDetails?.sizes.find((item) => item.size === size);
    if (sizeItem) {
      setProductState(`Còn hàng (${sizeItem?.quantity})`);
      setQuantityProduct(sizeItem?.quantity);
    } else {
      setProductState(`Hết hàng (0)`);
      setQuantityProduct(0);
    }
  };

  return (
    <div className="page__product--detail">
      <h5 className="navigation_bar">
        <div className="container">
            <span onClick={() => navigate("/")}>
            Trang chủ
            </span>{" "}
            / Chi tiết sản phẩm
        </div>
      </h5>
      <div className="container" style={{ paddingTop: '20px'}}>
        {productDetails && (
          <Row>
            <Col span={10} style={{ textAlign: "center" }}>
              <div
                className="slider-products"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <Row>
                  <div className="big-image" style={{ overflow: "hidden" }}>
                    <Swiper
                      grabCursor={true}
                      effect={"creative"}
                      creativeEffect={{
                        prev: {
                          shadow: true,
                          translate: [0, 0, -400],
                        },
                        next: {
                          translate: ["100%", 0, 0],
                        },
                      }}
                      modules={[EffectCreative]}
                      className="mySwiper swiper-top"
                      navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                      }}
                    >
                      {productDetails?.images.map((image, index) => (
                        <SwiperSlide key={index}>
                          <a data-fslightbox href={image}>
                            <Image
                              src={image}
                              preview={false}
                              alt="image small"
                            />
                          </a>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <div className="product__discount">
                      {productDetails?.discount} % OFF
                    </div>
                  </div>
                </Row>
                <Row>
                  <div
                    className="small-image"
                    style={{ width: "450px", margin: "10px auto" }}
                  >
                    <Swiper
                      watchSlidesProgress={true}
                      slidesPerView={4}
                      className="mySwiper"
                    >
                      {productDetails?.images.map((image, index) => (
                        <SwiperSlide key={index}>
                          <Image
                            src={image}
                            preview={false}
                            alt="image small"
                            width="100px"
                            height="100px"
                            onClick={() => handleThumbnailClick(index)}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </Row>
                <Row>
                  <div className="list__service">
                    <ul>
                      <li>
                        <SafetyOutlined
                          style={{
                            color: "red",
                            fontSize: "1.6em",
                            marginRight: "8px",
                          }}
                        />
                        Cam kết chính hãng Biti's100%
                      </li>
                      <li>
                        <CheckCircleOutlined
                          style={{
                            color: "red",
                            fontSize: "1.6em",
                            marginRight: "8px",
                          }}
                        />
                        Bảo hành 06 tháng
                      </li>
                      <li>
                        <SwapOutlined
                          style={{
                            color: "red",
                            fontSize: "1.6em",
                            marginRight: "8px",
                          }}
                        />
                        Đổi size trong vòng 7 ngày
                      </li>
                      <li>
                        <SplitCellsOutlined
                          style={{
                            color: "red",
                            fontSize: "1.6em",
                            marginRight: "8px",
                          }}
                        />
                        Đổi trả hàng trong vòng 7 ngày
                      </li>
                      <li>
                        <TruckOutlined
                          style={{
                            color: "red",
                            fontSize: "1.6em",
                            marginRight: "8px",
                          }}
                        />
                        Free ship đơn hàng 1.5 Triệu
                      </li>
                    </ul>
                  </div>
                </Row>
              </div>
            </Col>
            <Col span={14}>
              <div className="product__content">
                <h3 className="product__content--title">
                  <Link>{productDetails?.name}</Link>
                </h3>
                <div className="product__content--rating">
                  <Rate
                    allowHalf
                    defaultValue={productDetails?.rating}
                    disabled
                  />
                  <span className="normal"></span>
                </div>

                <div className="product__content--price">
                  <span className="current">
                    {FormatNumber(
                      priceNew(productDetails?.price, productDetails?.discount)
                    )}{" "}
                    đ
                  </span>
                  <span className="normal">
                    {FormatNumber(productDetails?.price)} đ
                  </span>
                </div>

                <div className="sizes">
                  <p>
                    Kích thướt <Link href="#">(Cách chọn size)</Link>
                  </p>
                  <div className="variant">
                    <form action="">
                      {[38, 39, 40, 41, 42, 43].map((size, index) => (
                        <p key={index}>
                          <Input
                            type="radio"
                            name="size"
                            id={`size ${size}`}
                            onClick={() => handleSize(size)}
                          />
                          <label htmlFor={`size ${size}`} className="circle">
                            <span>{size}</span>
                          </label>
                        </p>
                      ))}
                    </form>
                  </div>
                </div>

                <div className="product__content--stock">
                  <span>
                    Tình trạng:{" "}
                    <strong className="qty-stock">{productState}</strong>
                  </span>
                </div>
                <div className="product__content--qty flexitem">
                  <button
                    className="minus circle"
                    onClick={() => handleClickNumber("decrease")}
                  >
                    -
                  </button>
                  <InputNumber
                    min={1}
                    defaultValue={1}
                    value={numberProduct}
                    onChange={changeNumber}
                    className="custom-input-number"
                  />
                  <button
                    className="plus circle"
                    onClick={() => handleClickNumber("increase")}
                  >
                    +
                  </button>
                </div>
                <div className="btn-buy">
                  <Button
                    onClick={handleAddCartProduct}
                    disabled={quantityProduct === 0}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </div>

                <div className="description collapse">
                  <ul>
                    <li className="has-child expand">
                      <a href="#0" className="icon-small">
                        Information
                      </a>
                      <ul className="content">
                        <li>
                          <span>Brands</span>
                          <span>Nike</span>
                        </li>
                        <li>
                          <span>Activity</span>
                          <span>Running</span>
                        </li>
                        <li>
                          <span>Material</span>
                          <span>Fleece</span>
                        </li>
                        <li>
                          <span>Gender</span>
                          <span>Men</span>
                        </li>
                      </ul>
                    </li>
                    <li className="has-child">
                      <a href="#0" className="icon-small">
                        Detail
                      </a>
                      <div className="content">
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Qui eum quo adipisci autem. Reiciendis, commodi.
                        </p>
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Magni atque, sed explicabo doloremque minus
                          pariatur neque quia nostrum aliquid fugiat, numquam,
                          earum ut nulla molestias!
                        </p>
                      </div>
                    </li>
                    <li className="has-child">
                      <a href="#0" className="icon-small">
                        Custom
                      </a>
                      <div className="content">
                        <table>
                          <thead>
                            <tr>
                              <th>Size</th>
                              <th>
                                Bust <span className="mini-text">(cm)</span>
                              </th>
                              <th>
                                Waist <span className="mini-text">(cm)</span>
                              </th>
                              <th>
                                Hip <span className="mini-text">(cm)</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>XS</td>
                              <td>82,5</td>
                              <td>62</td>
                              <td>87,5</td>
                            </tr>
                            <tr>
                              <td>S</td>
                              <td>85</td>
                              <td>63,5</td>
                              <td>89</td>
                            </tr>
                            <tr>
                              <td>M</td>
                              <td>87,5</td>
                              <td>67,5</td>
                              <td>93</td>
                            </tr>
                            <tr>
                              <td>L</td>
                              <td>90</td>
                              <td>72,5</td>
                              <td>98</td>
                            </tr>
                            <tr>
                              <td>XL</td>
                              <td>93</td>
                              <td>77,5</td>
                              <td>103</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
            <hr
              style={{ width: "60%", height: "1px", background: "#c6c2c2" }}
            />
            <Col span={24}>
              <Comments currentUserId={user?.id} idProduct={id} />
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
