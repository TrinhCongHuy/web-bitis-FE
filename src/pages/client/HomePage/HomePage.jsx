import React, { useEffect, useRef, useState } from 'react'
import CardComponent from '../../../components/CardComponent/CardComponent'
import './HomePage.scss'
import { Button, Card, Col, Row } from 'antd'
import Sliders from '../../../components/Sliders/Sliders'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../../services/ProductService'
import * as PostService from '../../../services/PostService'
import SuggestiveComponent from '../../../components/SuggestiveComponent/SuggestiveComponent'
import { Link } from 'react-router-dom'
import moment from 'moment';
import { CommentOutlined } from '@ant-design/icons'


const HomePage = () => {
  const refSearch = useRef()
  const [limit, setLimit] = useState(10)
  const [posts, setPosts] = useState([]);
  

  const fetchProductAll = async (context) => {

    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]

    const res = await ProductService.listProduct(search, limit)
    console.log(res)
    return res

  }

  const { data: products } = useQuery({
    queryKey: ['products', limit], 
    queryFn: fetchProductAll, 
    config: {
      retry: 3,
      retryDelay: 1000,
      keePreviousData: true
    }
  });

  // call api post
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await PostService.listPost(3); 
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <>
      <Sliders isShowFeature={true}/>
      <div className="container page__home">
          <div className="wrapper">
            <SuggestiveComponent title={'GỢI Ý SẢN PHẨM'} description={'Bạn sẽ không thất vọng khi lựa chọn'}/>
            <div className='btn-more'>
              <Button type="text" onClick={() => setLimit((prev) => prev + 6)} disabled={products?.total === products?.data?.length || products.totalPage === 1}>Xem thêm {'\u00BB'}</Button>
            </div>
            <div className='products'>
              {products?.data.length > 0 ? 
                <>
                    {products?.data
                    .filter(product => product.status)
                    .map((product, index) => (
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
                    {products?.data
                    .filter(product => product.status)
                    .map((product, index) => (
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
                    {products?.data
                    .filter(product => product.status)
                    .map((product, index) => (
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
            <div className='posts' style={{display: 'flex', alignItems: 'stretch' }}>
              {posts?.length > 0 ? 
                <>
                  <Row style={{display: 'flex', justifyContent: 'space-around', width: '100%'}}>
                    {posts?.map((post, index) => (
                      <Col span={6} key={index} style={{ marginBottom: '20px' }}>
                        <Card
                          key={index}
                          hoverable
                          style={{height: '100%'}}
                          cover={<img alt="example" src={post.image} style={{ maxHeight: '180px', objectFit: 'cover' }} />}
                        >
                          <div className="post__content" style={{ display: 'flex', flexDirection: 'column', alignContent: 'space-between' }}>
                            <h3 className="post__content--title" style={{lineHeight: '1.1em'}}>
                                <Link to={`/blog-detail/${post._id}`} style={{color: '#000', fontSize: '0.9em', lineHeight: '1em'}}>{post.title}</Link>
                            </h3>
                            <div style={{display:'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                              <span>Ngày đăng: {moment(post.createdAt).format('MM/DD/YYYY')}</span>
                              <span><CommentOutlined /> {post?.comments?.length} bình luận</span>
                            </div>
                          </div> 
                        </Card>
                      </Col>
                    ))}
                    
                  </Row>
                </> 
                : 
                <> 
                    {refSearch.current && <span></span>}
                </>
              }
            </div>
          </div>
      </div>

    </>
  )
}

export default HomePage