import { Card, Rate } from "antd"
import { Link } from "react-router-dom"
import { EyeOutlined, HeartFilled, HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import './CardComponent.scss'
import { priceNew } from "../../utils";
import FormatNumber from "../FormatNumber/FormatNumber";
import { useState } from "react";


const CardComponent = (props) => {
    const { product, id } = props
    const [liked, setLiked] = useState(false);

    const handleLikeToggle = () => {
        setLiked(!liked);
    };

    const soldQuantity = product.sizes.reduce((total, size) => total + size.sold, 0);

    return (
        <div className="product__item">
            <Card
                hoverable
                style={{
                width: 240,
                }}
                cover={<img alt="example" src={product.images[0]} />}
            >
                <div className="hoverable">
                    <ul>
                        <li className="active">
                            <Link to="#" className=" flexcenter" onClick={handleLikeToggle}>
                                {liked ? <HeartFilled style={{ color: 'red'}}/> : <HeartOutlined />}
                            </Link> 
                        </li>
                        <li>
                            <Link to={`/product-detail/${id}`} className=" flexcenter">
                                <EyeOutlined />
                            </Link>
                        </li>
                        <li>
                            <Link to={`/product-detail/${id}`} className="flexcenter">
                                <ShoppingCartOutlined />
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="product__discount circle">
                    <span>{product.discount}%</span>
                </div>

                <div className="product__content">
                    <h3 className="product__content--title">
                        <Link to={`/product-detail/${id}`}>{product.name}</Link>
                    </h3>
                    <div className="product__content--rating">
                        <Rate allowHalf defaultValue={(product.rating)} />
                        <span className="normal">(2,548)</span>
                    </div>
                    
                    <div className="product__content--price">
                        <span className="current">{FormatNumber(priceNew(product.price, product.discount))} đ</span>
                        <span className="normal">{FormatNumber(product.price)} đ</span>
                    </div>
                    <div className="product__content--stock">
                        <span>Sold: <strong className="qty-sold">{soldQuantity}</strong></span>
                    </div>
                </div> 
            </Card>
        </div>
    )
}

export default CardComponent