import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MergeOutlined,
  UserOutlined,
  WindowsOutlined,
  FormOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import './LayoutAdminDefault.scss'
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { resetUser } from '../../redux/slides/userSlide';
import * as UserService from '../../services/UserService'
const { Header, Sider, Content } = Layout;

const LayoutAdminDefault = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();

    const handleLogout = async () => {
        localStorage.removeItem('access_token');
        await UserService.logoutUser()
        dispatch(resetUser())
        navigate('/admin')
    }

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical">
                    <span>Admin</span>
                </div>
                <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
                >
                    <Menu.Item key="1" icon={<WindowsOutlined />}>
                        <Link to="/system/admin">Tổng quan</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<FormOutlined />}>
                        <Link to="/system/admin/posts">Bài viết</Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<MergeOutlined />}>
                        <Link to="/system/admin/products">Sản phẩm</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UserOutlined />}>
                        <Link to="/system/admin/users">Khách hàng</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                        }}
                    />
                    <span>
                        <Link style={{color: '#333'}} onClick={handleLogout}>Đăng xuất</Link>
                    </span>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}

export default LayoutAdminDefault