/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, Row, Space } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './SingInPage.scss'
import * as UserService from '../../../services/UserService'
import * as AuthService from '../../../services/AuthService'
import { UseMutationHook } from '../../../hooks/useMutationHook';
import * as message from '../../../components/Message/Message'
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../redux/slides/userSlide';
import axios from 'axios';



const SingInPageClient = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()


  const mutation = UseMutationHook(
    data => UserService.loginUser(data)
  )
  
  const { data, isSuccess, isError } = mutation

  useEffect(() => {
    if (data?.status === 'OK') {
      if (location?.state) {
        navigate(location?.state)
      }else {
        navigate('/')
      }
      localStorage.setItem('access_token', JSON.stringify(data?.access_token))
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailUser(decoded?.id, data?.access_token)
        }
      }
    }else if (data?.status === 'ERR'){
      message.error(data.message);
    }
  }, [isSuccess, isError])

  const handleGetDetailUser = async (id, token) => {
    const res = await UserService.getDetailUser(id, token)
    dispatch(updateUser({...res?.data, access_token: token}))
  }

  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
  }
  const handleChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const onFinish = () => {
    mutation.mutate({
      email, 
      password
    })
  };

  const handleLoginGG = () => {
    window.location.href = 'http://localhost:3001/api/v1/auth/google';
  };

  // Handle the callback from Google login
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    console.log('params', params)
    const accessToken = params.get('access_token');
    console.log('accessToken', accessToken)
    const status = params.get('status');
    console.log('status', status)
    
    if (status === 'OK' && accessToken) {
      localStorage.setItem('access_token', JSON.stringify(accessToken));
      const decoded = jwtDecode(accessToken);
      if (decoded?.id) {
        handleGetDetailUser(decoded?.id, accessToken);
      }
      navigate('/');
    } else if (status === 'ERR') {
      message.error('Google login failed');
    }
  }, []);

  return (
    <div className="container">
      <Row justify="center">
        <Col span={8}>
          <div className="form-login">
            <h2>Đăng nhập</h2>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ]}
              >
                <Input placeholder="Email" prefix={<MailOutlined className="site-form-item-icon" />} value={email} onChange={handleChangeEmail}/>
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Password" prefix={<LockOutlined className="site-form-item-icon" />} value={password} onChange={handleChangePassword}/>
              </Form.Item>
              <Form.Item style={{ }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Link className="login-form-forgot" to="/password/forgot">
                  Forgot password
                </Link>
              </Form.Item>

              <Form.Item style={{textAlign: 'center'}}>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Đăng nhập
                </Button>
              </Form.Item>

              <Form.Item style={{textAlign: 'center'}}>
                <Space size='middle'>
                  {/* <Button type="primary" className="login-form-button" onClick={handleGoogleLogin}>
                    Google
                  </Button>
                  <Button type="primary" className="login-form-button">
                    FaceBook
                  </Button> */}
                  {/* <Link to='/auth/google'>Google</Link> */}
                  <Button onClick={handleLoginGG}>Google</Button>
                </Space>
              </Form.Item>

              <Form.Item >
                <span>Chưa có tài khoản?</span>
                <Link to="/sing-up">Tạo tài khoản</Link>
              </Form.Item>

            </Form>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default SingInPageClient