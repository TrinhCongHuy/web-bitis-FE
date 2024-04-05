import React from 'react'
import './ProductDetailPage.scss'
import { Button, Col, Image, InputNumber, Rate, Row } from 'antd'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import { Link } from 'react-router-dom';

const ProductDetailPage = () => {
  return (
    <div className="container page__product--detail">
        <Row>
            <Col span={10} style={{textAlign: 'center'}}>
                <Image src='https://product.hstatic.net/1000230642/product/hsw004204xnh2_3cf73c6df7974b3791d6c6bfa852f9b8_large.jpg' preview={false}  alt="image product" />
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
                        <Link>Happy Sailed Womens Sum Boho Floral</Link>
                    </h3>
                    <div className="product__content--rating">
                        <Rate allowHalf defaultValue={2.5} />
                        <span className="normal">(2,548)</span>
                    </div>
                    
                    <div className="product__content--price">
                        <span className="current">$129.99</span>
                        <span className="normal">$189.98</span>
                    </div>
                    <div className="product__content--stock">
                        <span>Sold: <strong className="qty-sold">3,459</strong></span>
                    </div>
                    <div className="product__content--qty flexitem">
                        <button className="minus circle">-</button>
                            <InputNumber min={1} defaultValue={1} className="custom-input-number"/>
                        <button className="plus circle">+</button>
                    </div>
                    <div className="btn-buy">
                        <Button>Chọn mua</Button>
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
    </div>
  )
}

export default ProductDetailPage