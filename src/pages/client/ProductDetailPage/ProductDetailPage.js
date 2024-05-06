import React, { useEffect, useState } from "react";
import "./ProductDetailPage.scss";
import { Button, Col, Image, Input, InputNumber, Rate, Row } from "antd";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import * as ProductService from "../../../services/ProductService";
import * as CartService from "../../../services/CartService";
import { useQuery } from "@tanstack/react-query";
import { CheckCircleOutlined, SafetyOutlined, SplitCellsOutlined, SwapOutlined, TruckOutlined } from '@ant-design/icons'

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/effect-creative';
import { EffectCreative } from 'swiper/modules';
import "swiper/css";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { initFacebookSDK, priceNew } from "../../../utils";
import LikeBtnComponent from "../../../components/LikeBtnComponent/LikeBtnComponent";
import CommentComponent from "../../../components/CommentComponent/CommentComponent";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [numberProduct, setNumberProduct] = useState(1);
  const user = useSelector((state) => state.user);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchGetDetailProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    const res = await ProductService.getDetailProduct(id);
    return res?.data;
  };

  useEffect(() => {
    initFacebookSDK();
  }, []);

  const { data: productDetails } = useQuery({
    queryKey: ["product-details", id],
    queryFn: fetchGetDetailProduct,
    config: {
      enable: !!id,
    },
  });

  const changeNumber = (value) => {
    setNumberProduct(value);
  };


  const handleClickNumber = (type) => {
    if (type === "increase") {
      setNumberProduct((prev) =>
        prev < productDetails?.countInStock ? prev + 1 : prev
      );
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
      };

      try {
        await CartService.createProductCart(data);
      } catch (error) {
        console.error("Error create product in cart:", error);
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


  return (
    <div className="container page__product--detail">
      <h5>
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          Trang chủ
        </span>{" "}
        / Chi tiết sản phẩm
      </h5>
      {productDetails && (
        <Row>
          <Col span={10} style={{ textAlign: "center" }}>
            <div className="slider-products" style={{display: 'flex', flexDirection: 'column'}}>
                <Row>
                    <div className="big-image" style={{overflow: 'hidden'}}>
                        <Swiper
                            grabCursor={true}
                            effect={'creative'}
                            creativeEffect={{
                            prev: {
                                shadow: true,
                                translate: [0, 0, -400],
                            },
                            next: {
                                translate: ['100%', 0, 0],
                            },
                            
                            }}
                            modules={[EffectCreative]}
                            className="mySwiper swiper-top"
                            navigation={{
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                              }}
                        >
                            <SwiperSlide>
                                <a
                                data-fslightbox
                                href="https://product.hstatic.net/1000230642/product/hsw004204xnh2_3cf73c6df7974b3791d6c6bfa852f9b8_large.jpg"
                                >
                                <Image
                                    src="https://product.hstatic.net/1000230642/product/hsw004204xnh2_3cf73c6df7974b3791d6c6bfa852f9b8_large.jpg"
                                    preview={false}
                                    alt="image small"
                                    
                                />
                                </a>
                            </SwiperSlide>
                            <SwiperSlide>
                                <a
                                data-fslightbox
                                href="https://product.hstatic.net/1000230642/product/hsw004204xnh5_85589380a11c459dac693c4d70b920d8_large.jpg"
                                >
                                <Image
                                    src="https://product.hstatic.net/1000230642/product/hsw004204xnh5_85589380a11c459dac693c4d70b920d8_large.jpg"
                                    preview={false}
                                    alt="image small"
                                    
                                ></Image>
                                </a>
                            </SwiperSlide>
                            <SwiperSlide>
                                <a
                                data-fslightbox
                                href="https://product.hstatic.net/1000230642/product/hsw004204xnh4_1118aae9b8ce49aea9f171d589ef0436_large.jpg"
                                >
                                <Image
                                    src="https://product.hstatic.net/1000230642/product/hsw004204xnh4_1118aae9b8ce49aea9f171d589ef0436_large.jpg"
                                    preview={false}
                                    alt="image small"
                                    
                                />
                                </a>
                            </SwiperSlide>
                            <SwiperSlide>
                                <a
                                data-fslightbox
                                href="https://product.hstatic.net/1000230642/product/hsw004204xnh6_f60c51c655c64755b3e5e27c94e2e047_large.jpg"
                                >
                                <Image
                                    src="https://product.hstatic.net/1000230642/product/hsw004204xnh6_f60c51c655c64755b3e5e27c94e2e047_large.jpg"
                                    preview={false}
                                    alt="image small"
                                    
                                />
                                </a>
                            </SwiperSlide>
                            
                        </Swiper>
                        <div className="product__discount">{productDetails?.discount} % OFF</div>
                    </div>
                </Row>
                <Row>
                    <div className="small-image" style={{width: '450px', margin: '10px auto'}}>
                        <Swiper
                            watchSlidesProgress={true} slidesPerView={4} className="mySwiper"
                        >
                            <SwiperSlide>
                                <Image
                                src="https://product.hstatic.net/1000230642/product/hsw004204xnh2_3cf73c6df7974b3791d6c6bfa852f9b8_large.jpg"
                                preview={false}
                                alt="image small"
                                width='100px'
                                height='100px'
                                onClick={() => handleThumbnailClick(0)}
                                />
                            </SwiperSlide>
                            <SwiperSlide>
                                <Image
                                src="https://product.hstatic.net/1000230642/product/hsw004204xnh5_85589380a11c459dac693c4d70b920d8_large.jpg"
                                preview={false}
                                alt="image small"
                                width='100px'
                                height='100px'
                                onClick={() => handleThumbnailClick(1)}
                                />
                            </SwiperSlide>
                            <SwiperSlide>
                                <Image
                                src="https://product.hstatic.net/1000230642/product/hsw004204xnh4_1118aae9b8ce49aea9f171d589ef0436_large.jpg"
                                preview={false}
                                alt="image small"
                                width='100px'
                                height='100px'
                                onClick={() => handleThumbnailClick(2)}
                                />
                            </SwiperSlide>
                            <SwiperSlide>
                                <Image
                                src="https://product.hstatic.net/1000230642/product/hsw004204xnh6_f60c51c655c64755b3e5e27c94e2e047_large.jpg"
                                preview={false}
                                alt="image small"
                                width='100px'
                                height='100px'
                                onClick={() => handleThumbnailClick(3)}
                                />
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </Row>
                <Row>
                    <div className="list__service">
                        <ul>
                            <li><SafetyOutlined style={{color: 'red', fontSize: '1.6em', marginRight: '8px'}}/>Cam kết chính hãng Biti's100%</li>
                            <li><CheckCircleOutlined style={{color: 'red', fontSize: '1.6em', marginRight: '8px'}}/>Bảo hành 06 tháng</li>
                            <li><SwapOutlined style={{color: 'red', fontSize: '1.6em', marginRight: '8px'}} />Đổi size trong vòng 7 ngày</li>
                            <li><SplitCellsOutlined style={{color: 'red', fontSize: '1.6em', marginRight: '8px'}} />Đổi trả hàng trong vòng 7 ngày</li>
                            <li><TruckOutlined style={{color: 'red', fontSize: '1.6em', marginRight: '8px'}} />Free ship đơn hàng 1.5 Triệu</li>
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
                    <Rate allowHalf defaultValue={productDetails?.rating} disabled/>
                    <span className="normal"></span>
                </div>

                <div className="product__content--price">
                    <span className="current">
                        {priceNew(productDetails?.price, productDetails?.discount)} đ
                    </span>
                    <span className="normal">{productDetails?.price} đ</span>
                </div>

                <div className="sizes">
                    <p>Size</p>
                    <div className="variant">
                        <form action="">
                            <p>
                                <Input type="radio" name="size" id="size-40"/>
                                <label htmlFor="size-40" className="circle"><span>40</span></label>
                            </p>
                            <p>
                                <Input type="radio" name="size" id="size-41" />
                                <label htmlFor="size-41" className="circle"><span>41</span></label>
                            </p>
                            <p>
                                <Input type="radio" name="size" id="size-42" />
                                <label htmlFor="size-42" className="circle"><span>42</span></label>
                            </p>
                            <p>
                                <Input type="radio" name="size" id="size-43" />
                                <label htmlFor="size-43" className="circle"><span>43</span></label>
                            </p>
                        </form>
                    </div>
                </div>

                <LikeBtnComponent
                    dataHref={"https://developers.facebook.com/docs/plugins/"}
                />
                <div className="product__content--stock">
                    <span>
                    InStock:{" "}
                    <strong className="qty-stock">
                        {productDetails?.countInStock}
                    </strong>
                    </span>
                </div>
                <div className="product__content--sold">
                    <span>
                    Sold:{" "}
                    <strong className="qty-sold">{productDetails?.sold}</strong>
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
                    disabled={productDetails?.countInStock === 0}
                    >
                    Thêm vào giỏ hàng
                    </Button>
                </div>

                <div class="description collapse">
                    <ul>
                        <li class="has-child expand">
                            <a href="#0" class="icon-small">Information</a>
                            <ul class="content">
                                <li><span>Brands</span><span>Nike</span></li>
                                <li><span>Activity</span><span>Running</span></li>
                                <li><span>Material</span><span>Fleece</span></li>
                                <li><span>Gender</span><span>Men</span></li>
                            </ul>
                        </li>
                         <li class="has-child">
                            <a href="#0" class="icon-small">Detail</a>
                            <div class="content">
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui eum quo adipisci autem. Reiciendis, commodi.</p>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni atque, sed explicabo doloremque minus pariatur neque quia nostrum aliquid fugiat, numquam, earum ut nulla molestias!</p>
                            </div>
                        </li>
                        <li class="has-child">
                            <a href="#0" class="icon-small">Custom</a>
                            <div class="content">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Size</th>
                                            <th>Bust <span class="mini-text">(cm)</span></th>
                                            <th>Waist <span class="mini-text">(cm)</span></th>
                                            <th>Hip <span class="mini-text">(cm)</span></th>
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
          <CommentComponent
            dataHref={
              "https://developers.facebook.com/docs/plugins/comments#configurator"
            }
            width="1100"
          />
        </Row>
      )}
    </div>
  );
};

export default ProductDetailPage;
