import React from 'react'
import CardComponent from '../../components/CardComponent/CardComponent'
import './HomePage.scss'
import { Button } from 'antd'
import Sliders from '../../components/Sliders/Sliders'

const HomePage = () => {
  return (
    <>
      <Sliders />
      <div className="container page__home">
          <div className="wrapper">
            <div className='products'>
              <CardComponent />
              <CardComponent />
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
            
          </div>
      </div>
    </>
  )
}

export default HomePage