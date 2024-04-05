import React from 'react'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Button, Col, Row } from 'antd'
import './ProductsPage.scss'
import NavBarComponent from '../../components/NavBarComponent/NavBarComponent'
import FilterProduct from '../../components/FilterProduct/FilterProduct'
import Sliders from '../../components/Sliders/Sliders'

const ProductsPage = () => {
  return (
    <>
      <Sliders />
      <div className="container page__products">
        <div className="wrapper">
          <Row>
            <Col span={5}>
              <NavBarComponent />
            </Col>
            <Col span={19}>
              <div className="filter">
                <FilterProduct />
              </div>
              <div className='products'>
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
              </div>
              <div className='btn-more'>
                <Button>Xem thêm</Button>
              </div>
            </Col>
          </Row>          
        </div>
      </div>
    </>
    
  )
}

export default ProductsPage