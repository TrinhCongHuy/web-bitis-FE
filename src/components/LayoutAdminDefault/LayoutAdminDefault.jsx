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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query'
import { resetUser } from '../../redux/slides/userSlide';
import * as UserService from '../../services/UserService'
import { calc } from 'antd/es/theme/internal';
import logoAdmin from '../../assets/images/logo-web/logo-admin.png'
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

    const account = useSelector((state) => state.user)


    // fetch detail account
    // const fetchDetailAccount = async () => {
    //     const res = await UserService.loginUser()
    //     return res.data
    // }

    // const { data: detailAccount } = useQuery({
    //     queryKey: ['account'], 
    //     queryFn: fetchDetailAccount, 
    //     config: {
    //     retry: 3,
    //     retryDelay: 1000,
    //     keePreviousData: true
    //     }
    // });

    // console.log('detailAccount', detailAccount)

    return (
        <Layout>
            <Sider 
            trigger={null} collapsible collapsed={collapsed}
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 1200
                }} 
            >
                <div className="demo-logo-vertical">
                    <span>
                        {collapsed ? 'AD' : 'ADMIN'} 
                        {/* <img src={logoAdmin} alt='logo-admin'/> */}
                    </span>
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
                    <Menu.Item key="3" icon={<MergeOutlined />}>
                        <Link to="/system/admin/products">Sản phẩm</Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<UserOutlined />}>
                        <Link to="/system/admin/users">Khách hàng</Link>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<UserOutlined />}>
                        <Link to="/system/admin/accounts">Quản trị viên</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout" style={{ marginLeft: collapsed ? 80 : 200 }}>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        display: 'flex',
                        position: 'fixed',
                        top: 0,
                        width: collapsed ? `calc(100% - 80px)` : `calc(100% - 200px)`,
                        zIndex: 1000,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        paddingRight: '50px'
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
                    <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '2em'}}>
                        <span>
                            {/* <Link style={{color: '#000', padding: '5px 10px', borderRadius: '5px', border: '1px solid #666'}}>{account.name}</Link> */}
                            <Button type="primary" ghost>
                                {account.name}
                            </Button>
                        </span>
                        <span>
                            {/* <Link style={{color: '#333', padding: '5px 10px', borderRadius: '5px', border: '1px solid #666'}} onClick={handleLogout}>Đăng xuất</Link> */}
                            <Button type="primary" danger  onClick={handleLogout}>
                                Đăng xuất
                            </Button>
                        </span>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '70px 16px 0',
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