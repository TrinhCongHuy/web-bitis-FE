/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from 'react'
import CardComponent from '../../../components/CardComponent/CardComponent'
import { Col, Row, Pagination } from 'antd'
import './ProductsPage.scss'
import NavBarComponent from '../../../components/NavBarComponent/NavBarComponent'
import FilterProduct from '../../../components/FilterProduct/FilterProduct'
import Sliders from '../../../components/Sliders/Sliders'
import * as ProductService from '../../../services/ProductService'
import { useQuery } from '@tanstack/react-query'



const ProductsPage = () => {
  const refSearch = useRef()
  const [limit, setLimit] = useState(8)
  const [selectedType, setSelectedType] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 10,
    total: 1,
  })

  // fetch product type
  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const type = context?.queryKey && context?.queryKey[2]
    const page = context?.queryKey && context?.queryKey[3]


    const res = await ProductService.listProductType(limit, type, page)
    if (res?.status === 'OK') {
      setPagination({...pagination, total: res?.totalPage})
    }
    return res
  }

  const { data: products } = useQuery({
    queryKey: ['products', limit, selectedType, pagination.page], 
    queryFn: fetchProductAll, 
    config: {
      retry: 3,
      retryDelay: 1000,
      keePreviousData: true
    }
  });

  const handleTypeClick = (type) => {
    setSelectedType(type);
  };

  const onChange = (current, pageSize) => {
    setPagination({...pagination, page: current - 1, limit: pageSize})
  }

  return (
    <>
      <Sliders isShowFeature={false}/>
      <div className="container page__products">
        <div className="wrapper">
          <Row>
            <Col span={5}>
              <NavBarComponent onTypeClick={handleTypeClick} />
            </Col>
            <Col span={19}>
              <div className="filter">
                <FilterProduct />
              </div>
              <div className='products'>
                {products?.data.length > 0 ? 
                  <>
                    {products?.data?.map((product, index) => (
                        <CardComponent key={index} product={product} id={product._id}/>
                    ))}
                  </> 
                  : 
                  <> 
                    {refSearch.current && <span></span>}
                  </>
                }
              </div>
            </Col>
          </Row>          
        </div>
        <div className='pagination'>
          <Pagination defaultCurrent={pagination.page + 1} total={pagination?.total * 10} onChange={onChange}/>
        </div>
        
      </div>
    </>
    
  )
}

export default ProductsPage