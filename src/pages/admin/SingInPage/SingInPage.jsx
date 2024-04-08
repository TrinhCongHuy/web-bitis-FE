/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import './SingInPage.scss'
import * as UserService from '../../../services/UserService'
import { UseMutationHook } from '../../../hooks/useMutationHook';
import * as message from '../../../components/Message/message'
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../redux/slides/userSlide';



const SingInPageAdmin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const mutation = UseMutationHook(
    data => UserService.loginUser(data)
  )
  
  const { data, isSuccess, isError } = mutation


  useEffect(() => {
    if (data?.status === 'OK') {
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        if (decoded.isAdmin) {
          navigate('/system/admin')
          localStorage.setItem('access_token', JSON.stringify(data?.access_token))

          if (decoded?.id) {
            handleGetDetailUser(decoded?.id, data?.access_token)
          }
        }else {
          message.error("Đây không phải là tài khoản Admin!")
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
  return (
    <div className="container page__admin--login">
      <Row justify="center">
        <Col span={8}>
          <div className="form-login">
            <h2>Wellcome to Admin</h2>
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

              <Form.Item style={{textAlign: 'center'}}>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default SingInPageAdmin