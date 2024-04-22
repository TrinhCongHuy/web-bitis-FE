import React, { useState } from 'react'
import './ProductDetailPage.scss'
import { Button, Col, Image, InputNumber, Rate, Row } from 'antd'
import { Swiper, SwiperSlide } from 'swiper/react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import * as ProductService from "../../../services/ProductService";
import * as CartService from "../../../services/CartService";
import { useQuery } from '@tanstack/react-query'


// Import Swiper styles
import 'swiper/css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { priceNew } from '../../../utils';

const ProductDetailPage = () => {
    const {id} = useParams()
    const [numberProduct, setNumberProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const navigate = useNavigate()
    const location = useLocation()

    const fetchGetDetailProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        const res = await ProductService.getDetailProduct(id);
        return res?.data
    };

    const { data: productDetails } = useQuery({
        queryKey: ['product-details', id], 
        queryFn: fetchGetDetailProduct, 
        config: {
          enable: !!id
        }
    });

    const changeNumber = (value) => {
        setNumberProduct(value);
    };
    
    const handleClickNumber = (type) => {
        if (type === 'increase') {
            setNumberProduct((prev) => prev + 1);
        } else if (type === 'decrease' && numberProduct > 1) {
            setNumberProduct((prev) => prev - 1);
        }
    };

    const handleAddCartProduct = async () => {
        if (!user?.id) {
            navigate('/sing-in', {state: location?.pathname})
        }else {
            const data = {
                user_id: user.id,
                product_id: productDetails?._id,
                quantity: numberProduct
            };

            try {
                await CartService.createProductCart(data);
            } catch (error) {
                console.error('Error create product in cart:', error);
            }
        }
    }

    return (
        <div className="container page__product--detail">
            <h5><span style={{ cursor: 'pointer'}} onClick={() => navigate('/')}>Trang chủ</span> / Chi tiết sản phẩm</h5>
            {productDetails && 
                <Row>
                    <Col span={10} style={{textAlign: 'center'}}>
                        <Image src={productDetails?.image} preview={false}  alt="image product" />
                        <div className='slider-products'>
                            <Row>
                                <Swiper
                                    spaceBetween={20}
                                    slidesPerView={4}
                                    loop={true}
                                >
                                    <SwiperSlide>
                                        <Image src='https://product.hstatic.net/1000230642/product/hsw004204xnh2_3cf73c6df7974b3791d6c6bfa852f9b8_large.jpg' preview={false}  alt="image small" />
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <Image src='https://product.hstatic.net/1000230642/product/hsw004204xnh2_3cf73c6df7974b3791d6c6bfa852f9b8_large.jpg' preview={false}  alt="image small" />
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <Image src='https://product.hstatic.net/1000230642/product/hsw004204xnh2_3cf73c6df7974b3791d6c6bfa852f9b8_large.jpg' preview={false}  alt="image small" />
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <Image src='https://product.hstatic.net/1000230642/product/hsw004204xnh2_3cf73c6df7974b3791d6c6bfa852f9b8_large.jpg' preview={false}  alt="image small" />
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <Image src='https://product.hstatic.net/1000230642/product/hsw004204xnh2_3cf73c6df7974b3791d6c6bfa852f9b8_large.jpg' preview={false}  alt="image small" />
                                    </SwiperSlide>
                                </Swiper>
                            </Row>
                        </div>
                    </Col>
                    <Col span={14}>
                        <div className="product__content">
                            <h3 className="product__content--title">
                                <Link>{productDetails?.name}</Link>
                            </h3>
                            <div className="product__content--rating">
                                <Rate allowHalf defaultValue={(productDetails?.rating)} />
                                <span className="normal">(2,548)</span>
                            </div>
                            
                            <div className="product__content--price">
                                <span className="current">{priceNew(productDetails?.price, productDetails?.discount)} đ</span>
                                <span className="normal">{productDetails?.price} đ</span>
                            </div>
                            <div className="product__content--stock">
                                <span>Sold: <strong className="qty-sold">3,459</strong></span>
                            </div>
                            <div className="product__content--qty flexitem">
                                <button className="minus circle" onClick={() => handleClickNumber('decrease')}>-</button>
                                    <InputNumber min={1} defaultValue={1} value={numberProduct} onChange={changeNumber} className="custom-input-number"/>
                                <button className="plus circle" onClick={() => handleClickNumber('increase')}>+</button>
                            </div>
                            <div className="btn-buy">
                                <Button onClick={handleAddCartProduct}>Thêm vào giỏ hàng</Button>
                            </div>

                            {/* ////////// */}
                            {/* <div class="colors">
                                <p>Color</p>
                                <div class="variant">
                                    <form action="">
                                        <p>
                                            <Input type="radio" name="color" id="cogrey" />
                                            <label for="cogrey" class="circle"></label>
                                        </p>
                                        <p>
                                            <Input type="radio" name="color" id="coblue" />
                                            <label for="coblue" class="circle"></label>
                                        </p>
                                        <p>
                                            <Input type="radio" name="color" id="cogreen" />
                                            <label for="cogreen" class="circle"></label>
                                        </p>
                                    </form>
                                </div>
                            </div> */}
                            {/* <div class="sizes">
                                <p>Size</p>
                                <div class="variant">
                                    <form action="">
                                        <p>
                                            <input type="radio" name="size" id="size-40">
                                            <label for="size-40" class="circle"><span>40</span></label>
                                        </p>
                                        <p>
                                            <input type="radio" name="size" id="size-41">
                                            <label for="size-41" class="circle"><span>41</span></label>
                                        </p>
                                        <p>
                                            <input type="radio" name="size" id="size-42">
                                            <label for="size-42" class="circle"><span>42</span></label>
                                        </p>
                                        <p>
                                            <input type="radio" name="size" id="size-43">
                                            <label for="size-43" class="circle"><span>43</span></label>
                                        </p>
                                    </form>
                                </div>
                            </div>
                            <div class="actions">
                                <div class="qty-control flexitem">
                                    <button class="minus circle">-</button>
                                    <input type="text" value="1">
                                    <button class="plus circle">+</button>
                                </div>
                                <div class="button-cart">
                                    <button class="primary-button">Add to cart</button>
                                </div>
                                <div class="wish-share">
                                    <ul class="flexitem second-links">
                                        <li><a href="#">
                                            <span class="icon-large">
                                                <i class="fa-regular fa-heart"></i>
                                            </span>
                                            <span>Wishlist</span>
                                        </a></li>
                                        <li><a href="#">
                                            <span class="icon-large">
                                                <i class="fa-solid fa-share-nodes"></i>
                                            </span>
                                            <span>Share</span>
                                        </a></li>
                                    </ul>
                                </div>
                            </div> */}
                        </div> 
                    </Col>
                </Row>
            }   
        </div>
    )
}

export default ProductDetailPage