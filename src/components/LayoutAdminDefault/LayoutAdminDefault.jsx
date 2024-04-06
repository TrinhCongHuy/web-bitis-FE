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
        await UserService.logoutUser()
        dispatch(resetUser())
        navigate('/system/admin')
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
                    items={[
                        {
                            key: '1',
                            icon: <WindowsOutlined />,
                            label: 'Tổng quan',
                        },
                        {
                            key: '2',
                            icon: <FormOutlined />,
                            label: 'Bài viết',
                        },
                        {
                            key: '3',
                            icon: <UserOutlined />,
                            label: 'Người dùng',
                        },
                        {
                            key: '4',
                            icon: <MergeOutlined />,
                            label: 'Sản phẩm',
                        },
                    ]}
                />
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