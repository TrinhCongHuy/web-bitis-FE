import { Card, Rate } from "antd"
import { Link } from "react-router-dom"
import { EyeOutlined, HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import './CardComponent.scss'
import { useNavigate } from 'react-router-dom'
import { priceNew } from "../../utils";
import FormatNumber from "../FormatNumber/FormatNumber";


const CardComponent = (props) => {
    const { product, id } = props
    const navigate = useNavigate()

    const handleDetailProduct = (id) => {
        navigate(`/product-detail/${id}`)
    }

    return (
        <div className="product__item">
            <Card
                hoverable
                style={{
                width: 240,
                }}
                cover={<img alt="example" src={product.images[0]} />}
                onClick={() => handleDetailProduct(id)}
            >
                <div className="hoverable">
                    <ul>
                        <li className="active">
                            <Link href="#" className=" flexcenter">
                                <HeartOutlined />
                            </Link> 
                        </li>
                        <li>
                            <Link href="#" className=" flexcenter">
                                <EyeOutlined />
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className=" flexcenter">
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
                        <Link>{product.name}</Link>
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
                        <span>Sold: <strong className="qty-sold">{product.sold}</strong></span>
                    </div>
                </div> 
            </Card>
        </div>
    )
}

export default CardComponent