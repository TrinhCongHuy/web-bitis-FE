/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as PostService from '../../../services/PostService';
import { Typography, Divider, Row, Col, Space, Card } from 'antd';
import './BlogDetailPage.scss'
import moment from 'moment';
import { CommentOutlined } from '@ant-design/icons';


const { Title, Paragraph } = Typography;

const BlogDetailPage = () => {
    const [detailBlog, setDetailBlog] = useState(null);
    const [blogList, setBlogList] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        fetchPostDetail();
        fetchPostList();
    }, []);

    const fetchPostDetail = async () => {
        try {
            const response = await PostService.getDetailPost(id); 
            setDetailBlog(response.data);
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    const fetchPostList = async () => {
        try {
            const response = await PostService.listPost(); 
            setBlogList(response.data);
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    if (!detailBlog) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container page__blog--detail">
            <Row>
                <Col span={16}>
                    <img src={detailBlog.image} alt={detailBlog.title} style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
                    <Title style={{fontSize: '1.6em'}}>{detailBlog.title}</Title>

                    <Space size='large' style={{marginTop: '10px'}}>
                        <span>Ngày đăng: {moment(detailBlog.createdAt).format('DD/MM//YYYY')}</span>
                        <span><CommentOutlined /> {detailBlog?.comment?.length || 0} bình luận</span>
                    </Space>

                    <div style={{padding: '20px', backgroundColor: '#EEEEEE', marginTop: '20px'}}>
                        <Paragraph style={{padding: '20px', backgroundColor: '#ffffff', marginBottom: '0', borderLeft: '1px solid #33CC66'}}>{detailBlog.description}</Paragraph>
                    </div>
                    
                   
                    <Divider />
                    <div dangerouslySetInnerHTML={{ __html: detailBlog.content }}></div>
                </Col>
                <Col span={8} style={{paddingLeft: '20px'}}>
                    <Card
                        title="Bài viết nổi bật"
                        bordered={false}
                        style={{
                        width: 300,
                        }}
                    >
                        {blogList?.map((blog, index) => (
                             <div key={index} style={{display: 'flex', padding: '10px'}}>
                                <img src={blog.image} alt="blog" style={{width: '60px', height: '60px', objectFit: 'cover', cursor: 'pointer', borderRadius: '5px'}}/>
                                <div className='blog__content' style={{marginLeft: '10px', display: 'flex', flexDirection:'column', justifyContent: 'space-between'}}>
                                    <div className='blog__content--title' style={{lineHeight: '16px'}}>
                                        <Link to={`/blog-detail/${blog._id}`} style={{fontSize: '0.9em', color: '#000', fontWeight: '500', cursor: 'pointer'}}>{blog.title}</Link>
                                    </div>
                                    <div className='blog__content--info'>
                                        <span style={{fontSize: '0.9em'}}>{moment(blog.createdAt).format('MM/DD/YYYY HH:MM')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default BlogDetailPage;
