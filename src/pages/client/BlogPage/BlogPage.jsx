import React, { useState, useEffect } from 'react';
import { Card, Divider, Space, Row, Col } from 'antd';
import * as PostService from '../../../services/PostService'; 
import * as TopicService from '../../../services/TopicService'; 
import moment from 'moment';
import './BlogPage.scss'
import { Link } from 'react-router-dom';
import { CommentOutlined } from '@ant-design/icons';


const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetchPosts();
    fetchTopics()
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await PostService.listPost(); 
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await TopicService.listTopic(); 
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <div className="container page__blog">
      <Row>
        <Col span={14}>
          {posts.map((post, index) => (
            <div key={index} className="blog-post" style={{marginBottom: '30px'}}>
              <Card
                hoverable
                style={{height: '100%'}}
                cover={<img alt="example" src={post.image} style={{ maxHeight: '300px', objectFit: 'cover', position: 'relative' }} />}
              >
                <div className="post__content">
                  <div className='create__at'>
                    <div style={{fontWeight: '500', fontSize: '1.8em'}}>{moment(post.createdAt).format('DD')}</div>
                    <div>Thg {moment(post.createdAt).format('MM')}</div> 
                  </div>
                  <h3 className="post__content--title" style={{lineHeight: '1.1em'}}>
                      <Link to={`/blog-detail/${post._id}`} style={{color: '#000', fontSize: '2.2rem', lineHeight: '25px'}}>{post.title}</Link>
                  </h3>
                  <p>{post.description}</p>
                  <Divider />
                  <Space size='middle'>
                    <CommentOutlined />
                    <span>{post?.comments?.length} bình luận</span>
                  </Space>
                    
                </div> 
              </Card>
            </div>
          ))}
        </Col>
        <Col span={10} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Card
            title="Danh mục"
            bordered={false}
            style={{
              width: 300,
            }}
          >
            {topics?.map((topic, index) => (
              <div key={index} style={{padding: '10px 0'}}>
                <Link style={{color: '#000'}} to={``}>{topic.name}</Link>
              </div>
              
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BlogPage;
