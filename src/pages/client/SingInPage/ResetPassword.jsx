/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import './SingInPage.scss'
import * as UserService from '../../../services/UserService'
import { UseMutationHook } from '../../../hooks/useMutationHook';
import * as message from '../../../components/Message/Message'



const ResetPassword = () => {
  const {email} = useParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const navigate = useNavigate()
  
  const mutation = UseMutationHook(
    data => UserService.resetPasswordPost(data)
  )
  
  const { data, isSuccess, isError } = mutation

  useEffect(() => {
    if (data?.status === 'OK') {
        message.success('Cập nhât mật khẩu thành công!')
        navigate('/Sing-in')
    }else if (data?.status === 'ERR'){
      message.error(data.message);
    }
  }, [isSuccess, isError])


  const handleChangeConfirmPassword = (e) => {
    setPassword(e.target.value)
  }

  const handleChangePassword = (e) => {
    setConfirmPassword(e.target.value)
  }

  const onFinish = () => {
    mutation.mutate({
      email,
      password,
      confirmPassword
    })
  };


  return (
    <div className="container">
      <Row justify="center">
        <Col span={8}>
          <div className="form-login">
            <h2>Cập nhật mật khẩu mới</h2>
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
                name="password"
                rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                ]}
              >
                <Input placeholder="Nhập mới khẩu mới" type='text' prefix={<LockOutlined className="site-form-item-icon" />} value={password} onChange={handleChangePassword}/>
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                rules={[
                    {
                      required: true,
                      message: "Please input your confirmPassword!",
                    },
                ]}
              >
                <Input placeholder="Nhập lại mật khẩu mới" type='text' prefix={<LockOutlined className="site-form-item-icon" />} value={confirmPassword} onChange={handleChangeConfirmPassword}/>
              </Form.Item>

                <Form.Item style={{textAlign: 'center'}}>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Cập nhật
                    </Button>
                </Form.Item>

            </Form>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default ResetPassword