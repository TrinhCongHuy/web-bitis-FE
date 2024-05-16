import { Col, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './HeaderDefault.scss'
import logo from '../../assets/images/logo-web/logo-bitis.jpg'
// import { Input } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons'
import { Space } from 'antd';
import AccountComponent from '../AccountComponent/AccountComponent'
import { useSelector } from 'react-redux'
import * as CartService from '../../services/CartService'
import { useQuery } from '@tanstack/react-query'
import Search from '../Search/Search'


const HeaderDefault = () => {
    const user = useSelector((state) => state.user)
    const [isSticky, setIsSticky] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 0) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);



    const fetchProductsCart = async () => {
        try {
            if (user?.id) {
                const res = await CartService.listProductCart(user?.id);
                return res.data || [];
            }
        } catch (error) {
            console.error('Error fetching cart products:', error);
        }
        return [];
    };

    const { data: carts, refetch } = useQuery({
        queryKey: ['carts', user?.id], 
        queryFn: fetchProductsCart, 
        config: {
            retry: 3,
            // retryDelay: 1000,
            keePreviousData: true
        }
    });

    useEffect(() => {
        if (user?.id) {
            refetch();
        }
    }, [user?.id, refetch]);

    return (
        <>
            <div className="header__top">
                <div className="container">
                    <Row>
                        <Col span={12} className='flexitem'>
                            <div className="header__top--contact flexcenter">
                                <ul className='flexcenter' style={{display: 'flex', listStyle: 'none'}}>
                                    <li>
                                        <span>Hotline:</span>
                                        <span className='phone'>0966158666</span>
                                        <span>(8h - 21h30)</span>
                                    </li>
                                    <li>
                                        <span>Email: chamsockhachhang@bitis.com.vn</span>
                                    </li>
                                </ul> 
                            </div>
                        </Col>
                        <Col span={6} offset={6}>
                            <div className="header__top--info">
                                <ul style={{display: 'flex', listStyle: 'none'}}>
                                    <li>
                                        <Link to='#'>Tìm cửa hàng</Link>
                                    </li>
                                    <li>
                                        <Link to='#'>Kiểm tra đơn hàng</Link>
                                    </li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className={`header__nav ${isSticky ? 'sticky' : ''}`}>
                    <div className="container">
                        <Row>
                            <Col span={4}>
                                <div className="header__nav--logo">
                                    <Link>
                                        <img src={logo} alt='logo'/>
                                    </Link>
                                </div>
                            </Col>
                            <Col span={12} className='flexcenter'>
                                <div className="header__nav--menu">
                                    <ul style={{display: 'flex', listStyle: 'none'}}>
                                        <li>
                                            <NavLink to='/'>Trang chủ</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to='/products'>Cửa hàng</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to='/blogs'>Tin tức</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to='/discounts'>Giảm giá</NavLink>
                                        </li>
                                       
                                    </ul>
                                </div>
                            </Col>
                            <Col span={8} className='flexcenter'>
                                <div className="header__nav--action">
                                    <Space size='large'>
                                        <div className="action__item">
                                            <Search />
                                        </div>
                                        <div className="action__item">
                                            <AccountComponent user={user}/>
                                        </div>
                                        <div className="action__item action__item--card">
                                            <Link to='/carts'>
                                                <ShoppingCartOutlined />
                                            </Link>
                                            <span className='fly-item flexcenter'>
                                                {carts?.length || 0}
                                            </span>
                                        </div>
                                    </Space>
                                </div>
                            </Col>
                        </Row>
                    </div>
            </div>
        </>
    )
}

export default HeaderDefault