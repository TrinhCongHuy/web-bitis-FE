import { Col, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './HeaderDefault.scss'
import logo from '../../assets/images/logo-web/logo-bitis.jpg'
import { Input } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons'
import { Space } from 'antd';
import AccountComponent from '../AccountComponent/AccountComponent'
import { useSelector, useDispatch } from 'react-redux'
import { searchProduct } from '../../redux/slides/productSlide'


const { Search } = Input;

const HeaderDefault = () => {
    const user = useSelector((state) => state.user)
    const [search, setSearch] = useState('')
    const dispatch = useDispatch()
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

    const onSearch = (e) => {
        setSearch(e.target.value)
        dispatch(searchProduct(e.target.value))
    }

    return (
        <>
            <div className="header__top">
                <div className="container">
                    <Row>
                        <Col span={12} className='flexitem'>
                            <div className="header__top--contact flexcenter">
                                <ul className='flexcenter'>
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
                                <ul>
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
                                    <ul>
                                        <li>
                                            <Link to='/'>Trang chủ</Link>
                                        </li>
                                        <li>
                                            <Link to='/products'>Cửa hàng</Link>
                                        </li>
                                        <li>
                                            <Link to='/blogs'>Tin tức</Link>
                                        </li>
                                        <li>
                                            <Link to='/sales'>Giảm giá</Link>
                                        </li>
                                        <li>
                                            <Link to='/introduce'>Giới thiệu</Link>
                                        </li>
                                    </ul>
                                </div>
                            </Col>
                            <Col span={8} className='flexcenter'>
                                <div className="header__nav--action">
                                    <Space size='large'>
                                        <div className="action__item">
                                            <Search placeholder="Input search text" onChange={onSearch} enterButton style={{ width: '210px' }}/>
                                        </div>
                                        <div className="action__item">
                                            <AccountComponent user={user}/>
                                        </div>
                                        <div className="action__item action__item--card">
                                            <Link>
                                                <ShoppingCartOutlined />
                                            </Link>
                                            <span className='fly-item flexcenter'>
                                                1
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