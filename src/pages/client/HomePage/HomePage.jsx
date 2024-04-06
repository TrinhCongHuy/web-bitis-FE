import React from 'react'
import CardComponent from '../../../components/CardComponent/CardComponent'
import './HomePage.scss'
import { Button } from 'antd'
import Sliders from '../../../components/Sliders/Sliders'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../../services/ProductService'

const HomePage = () => {

  const fetchProductAll = async () => {
    const res = await ProductService.listProduct()
    return res
  }

  const { data: products } = useQuery({
    queryKey: ['products'], 
    queryFn: fetchProductAll, 
    config: {
      retry: 3,
      retryDelay: 1000
    }
  });

  return (
    <>
      <Sliders />
      <div className="container page__home">
          <div className="wrapper">
            <div className='products'>
              {products?.data?.map((product, index) => {
                return (
                  <CardComponent key={index} product={product}/>
                )
              })}
              
              {/* <CardComponent /> */}

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