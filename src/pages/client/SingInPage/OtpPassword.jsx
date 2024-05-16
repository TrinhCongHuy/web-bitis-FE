/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { MailOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import './SingInPage.scss'
import * as UserService from '../../../services/UserService'
import { UseMutationHook } from '../../../hooks/useMutationHook';
import * as message from '../../../components/Message/Message'



const OtpPassword = () => {
  const {email} = useParams()
  console.log('email', email)
  const [otp, setOtp] = useState("")
  const navigate = useNavigate()
  

  const mutation = UseMutationHook(
    data => UserService.otpPasswordPost(data)
  )
  
  const { data, isSuccess, isError } = mutation

  useEffect(() => {
    if (data?.status === 'OK') {
        navigate(`/password/reset/${email}`)
    }else if (data?.status === 'ERR'){
      message.error(data.message);
    }
  }, [isSuccess, isError])


  const handleChangeOtp = (e) => {
    setOtp(e.target.value)
  }

  const onFinish = () => {
    mutation.mutate({
      email,
      otp
    })
  };



  return (
    <div className="container">
      <Row justify="center">
        <Col span={8}>
          <div className="form-login">
            <h2>Nhập mã OTP</h2>
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
                >
                    <Input disabled placeholder="Email" prefix={<MailOutlined className="site-form-item-icon" />} defaultValue={email} />
                </Form.Item>

                <Form.Item
                name="otp"
                rules={[
                    {
                      required: true,
                      message: "Please input your OTP!",
                    },
                ]}
              >
                <Input placeholder="OTP" type='text' prefix={<ThunderboltOutlined className="site-form-item-icon" />} value={otp} onChange={handleChangeOtp}/>
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

export default OtpPassword