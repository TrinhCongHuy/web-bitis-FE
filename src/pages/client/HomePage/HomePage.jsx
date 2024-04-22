import React, { useEffect, useRef, useState } from 'react'
import CardComponent from '../../../components/CardComponent/CardComponent'
import './HomePage.scss'
import { Button } from 'antd'
import Sliders from '../../../components/Sliders/Sliders'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../../services/ProductService'
import { useSelector } from 'react-redux'
import Loading from '../../../components/LoadingComponent/loading'
import { useDebounce } from '../../../hooks/useDebounce'
import SuggestiveComponent from '../../../components/SuggestiveComponent/SuggestiveComponent'

const HomePage = () => {
  const searchProduct = useSelector((state) => state.product.search)
  const refSearch = useRef()
  const [isLoading, setIsLoading] = useState(false)
  const [limit, setLimit] = useState(12)
  const searchDebounce = useDebounce(searchProduct)

  const fetchProductAll = async (context) => {

    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]

    const res = await ProductService.listProduct(search, limit)
    return res

  }

  const { data: products } = useQuery({
    queryKey: ['products', limit, searchDebounce], 
    queryFn: fetchProductAll, 
    config: {
      retry: 3,
      retryDelay: 1000,
      keePreviousData: true
    }
  });

  useEffect(() => {
    const fetchData = async () => {
        if (refSearch.current) {
          await fetchProductAll(searchProduct); 
        }
    };
    fetchData();
    refSearch.current = true;
  }, [searchProduct]);

  return (
    <>
      <Sliders isShowFeature={true}/>
      <Loading isLoading={isLoading}>
        <div className="container page__home">
            <div className="wrapper">
              <SuggestiveComponent title={'GỢI Ý SẢN PHẨM'} description={'Bạn sẽ không thất vọng khi lựa chọn'}/>
              <div className='btn-more'>
                <Button type="text" onClick={() => setLimit((prev) => prev + 6)} disabled={products?.total === products?.data?.length || products.totalPage === 1}>Xem thêm {'\u00BB'}</Button>
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
            </div>
            <div className="wrapper" style={{marginTop: '50px'}}>
              <SuggestiveComponent title={'SẢN PHẨM ĐẶC TRƯNG'} description={'Bạn sẽ không thất vọng khi lựa chọn'}/>
              <div className='btn-more'>
                <Button type="text" onClick={() => setLimit((prev) => prev + 6)} disabled={products?.total === products?.data?.length || products.totalPage === 1}>Xem thêm {'\u00BB'}</Button>
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
            </div>
            <div className="wrapper" style={{marginTop: '50px'}}>
              <SuggestiveComponent title={'SẢN PHẨM MỚI'} description={'Những sản phẩm vừa ra mắt mới lạ cuốn hút người xem'}/>
              <div className='btn-more'>
                <Button type="text" onClick={() => setLimit((prev) => prev + 6)} disabled={products?.total === products?.data?.length || products.totalPage === 1}>Xem thêm {'\u00BB'}</Button>
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
            </div>
            <div className="wrapper" style={{marginTop: '50px'}}>
              <SuggestiveComponent title={'BLOG MỚI ĐĂNG'} description={'Những bài blog về thời trang mới nhất'}/>
              <div className='btn-more'>
                <Button type="text" onClick={() => setLimit((prev) => prev + 6)} disabled={products?.total === products?.data?.length || products.totalPage === 1}>Xem thêm {'\u00BB'}</Button>
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
            </div>
        </div>
      </Loading>
    </>
  )
}

export default HomePage