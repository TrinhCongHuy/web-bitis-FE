/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { MailOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import './SingInPage.scss'
import * as UserService from '../../../services/UserService'
import { UseMutationHook } from '../../../hooks/useMutationHook';
import * as message from '../../../components/Message/Message'



const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const navigate = useNavigate()
  

  const mutation = UseMutationHook(
    data => UserService.forgotPasswordPost(data)
  )
  
  const { data, isSuccess, isError } = mutation

  useEffect(() => {
    if (data?.status === 'OK') {
        navigate(`/password/otp/${email}`)
    }else if (data?.status === 'ERR'){
      message.error(data.message);
    }
  }, [isSuccess, isError])


  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  const onFinish = () => {
    mutation.mutate({
      email
    })
  };



  return (
    <div className="container">
      <Row justify="center">
        <Col span={8}>
          <div className="form-login">
            <h2>Lấy lại mật khẩu</h2>
            <Form
              name="normal_login"
              className="forgot-password-form"
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
            

              <Form.Item style={{textAlign: 'center'}}>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Gửi mã 
                </Button>
              </Form.Item>

            </Form>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default ForgotPassword