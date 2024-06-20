import React, { useEffect, useState } from 'react';
import * as ProductService from "../../../services/ProductService";
import * as PostService from "../../../services/PostService";
import * as UserService from "../../../services/UserService";
import * as OrderService from "../../../services/OrderService";
import { Col, Row, Card, Spin } from 'antd';
import { Area } from '@ant-design/plots';
import { FileTextOutlined, ShoppingCartOutlined, UserOutlined, RubyOutlined } from '@ant-design/icons';
import './DashBoardPage.scss';

const DashBoardPage = () => {
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalPost, setTotalPost] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([fetchProduct(), fetchPost(), fetchUser(), fetchOrder(), fetchDailyRevenue()]);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProduct = async () => {
    const res = await ProductService.totalProduct();
    setTotalProduct(res.data);
  };

  const fetchPost = async () => {
    const res = await PostService.totalPost();
    setTotalPost(res.data);
  };

  const fetchUser = async () => {
    const res = await UserService.totalUser();
    setTotalUser(res.data);
  };

  const fetchOrder = async () => {
    const res = await OrderService.getAllOrder();
    setTotalOrder(res.data.length);
  };

  const fetchDailyRevenue = async () => {
    const res = await OrderService.getDailyRevenue();
    const formattedData = res.map(item => ({
      date: `${item._id.year}-${item._id.month}-${item._id.day}`,
      revenue: item.totalRevenue
    }));
    setDailyRevenue(formattedData);
  };

  console.log('dailyRevenue', dailyRevenue)

  const config = {
    data: dailyRevenue,
    xField: 'date',
    yField: 'revenue',
    autoFit: true,
    height: 300,
    slider: {
      start: 0,
      end: 1,
    },
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className='page_dashBoard'>
      <Row gutter={[16, 16]} justify="space-around">
        <Col className='widget' span={5}>
            <div className="widget-content">
              <RubyOutlined className="widget-icon" />
              <div className="widget-details">
                <div className="widget-title">Sản phẩm</div>
                <div className="widget-value">{totalProduct}</div>
              </div>
            </div>
        </Col>
        <Col className='widget' span={5}>
            <div className="widget-content">
              <FileTextOutlined className="widget-icon" />
              <div className="widget-details">
                <div className="widget-title">Bài viết</div>
                <div className="widget-value">{totalPost}</div>
              </div>
            </div>
        </Col>
        <Col className='widget' span={5}>
            <div className="widget-content">
              <UserOutlined className="widget-icon" />
              <div className="widget-details">
                <div className="widget-title">Thành viên</div>
                <div className="widget-value">{totalUser}</div>
              </div>
            </div>
        </Col>
        <Col className='widget' span={5}>
            <div className="widget-content">
              <ShoppingCartOutlined className="widget-icon" />
              <div className="widget-details">
                <div className="widget-title">Tổng số đơn hàng</div>
                <div className="widget-value">{totalOrder}</div>
              </div>
            </div>
        </Col>
      </Row>
      <Row style={{marginTop: '30px'}} justify="center">
        <Col span={24}>
          <Card>
            {totalProduct.length > 0 ? <Area {...config} /> : <div>No product data available</div>}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashBoardPage;
