import { Card, Rate } from "antd"
import { Link } from "react-router-dom"
import { EyeOutlined, HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import './CardComponent.scss'


const CardComponent = () => {

    return (
        <div className="product__item">
            <Card
                hoverable
                style={{
                width: 240,
                }}
                cover={<img alt="example" src="https://product.hstatic.net/1000230642/product/hsw004204xnh10_adc09b29c0d64fdeae4d348d88780ce1_large.jpg" />}
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
                    <span>32%</span>
                </div>

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
                </div> 
            </Card>
        </div>
    )
}

export default CardComponent