import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MergeOutlined,
  UserOutlined,
  WindowsOutlined,
  FormOutlined,
  ShoppingCartOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { Layout, Button, theme, Menu } from 'antd';
import './LayoutAdminDefault.scss'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { resetAccount } from '../../redux/slides/accountSlide';
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
        dispatch(resetAccount())
        navigate('/admin')
    }

    const account = useSelector((state) => state.account)

    function getItem(label, key, icon, children, path) {
        return {
          key,
          icon,
          children,
          label,
          path,
        };
    }

    const items = [
        getItem('Tổng quan', '1', <WindowsOutlined />, null, '/system/admin'),
        getItem('Quản lý chủ đề', '2', <FormOutlined />, null, '/system/admin/topics'),
        getItem('Quản lý bài viết', 'sub1', <UserOutlined />, [
            getItem('Danh sách bài viết', '3', null, null, '/system/admin/posts'),
            getItem('Thêm mới bài viết', '4', null, null, '/system/admin/addPost'),
        ], null),
        getItem('Quản lý sản phẩm', 'sub2', <MergeOutlined />, null, '/system/admin/products'),
        getItem('Quản lý đơn hàng', '9', <ShoppingCartOutlined />, null, '/system/admin/orders'),
        getItem('Khách hàng', '10', <UsergroupAddOutlined />, null, '/system/admin/users'),
        getItem('Admin', '11', <UserOutlined />, null, '/system/admin/accounts'),
        getItem('Nhóm quyền', '12', <UserOutlined />, null, '/system/admin/roles'),
        getItem('Phân quyền', '13', <UserOutlined />, null, '/system/admin/roles/permission')
    ];

    return (
        <Layout>
            <Sider collapsible collapsed={collapsed} className={collapsed ? 'collapsed-sider' : 'expanded-sider'} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical">
                    <span>
                        {collapsed ? 'AD' : 'ADMIN'} 
                    </span>
                </div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    {items.map(item => {
                        if (item.children) {
                            return (
                                <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                                    {item.children.map(child => (
                                        <Menu.Item key={child.key}>
                                            <Link to={child.path}>{child.label}</Link>
                                        </Menu.Item>
                                    ))}
                                </Menu.SubMenu>
                            );
                        } else {
                            return (
                                <Menu.Item key={item.key} icon={item.icon}>
                                    <Link to={item.path}>{item.label}</Link>
                                </Menu.Item>
                            );
                        }
                    })}
                </Menu>
            </Sider>

            <Layout className="site-layout" >
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
                            <Button type="primary" ghost>
                                {account.name}
                            </Button>
                        </span>
                        <span>
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

export default LayoutAdminDefault;
