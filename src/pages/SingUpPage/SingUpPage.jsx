import React, { useEffect, useRef, useState } from 'react'
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UseMutationHook } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService'
import Loading from '../../components/LoadingComponent/loading';
import * as message from '../../components/Message/message'


const SingUpPage = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [ isLoading, setIsLoading] = useState(false)
  const inputRef = useRef()
  const navigate = useNavigate()

  const mutation = UseMutationHook(
    data => UserService.singUpUser(data)
  )

  const { isSuccess, isError } = mutation
  // console.log(mutation)

  useEffect(() => {
    if (isSuccess) {
      message.success()
      navigate('/sing-in')
    }else if (isError) {
      message.error()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError])


  const handleChangeName = (e) => {
    setName(e.target.value)
  }
  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
  }
  const handleChangePassword = (e) => {
    setPassword(e.target.value)
  }
  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value)
  }

  const onFinish = () => {
    mutation.mutate({
      name,
      email, 
      password,
      confirmPassword
    })
    setIsLoading(true)
    console.log('singUp', name, email, password, confirmPassword)
    
  };

  return (
    <div className="container">
      <Row justify="center">
        <Col span={8}>
          <div className="form-login">
            <h2>Đăng Ký</h2>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Username!',
                  },
                ]}
              >
                <Input ref={inputRef} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" value={name} onChange={handleChangeName}/>
              </Form.Item>
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
                <Input ref={inputRef} placeholder="Email" prefix={<MailOutlined className="site-form-item-icon" />} value={email} onChange={handleChangeEmail}/>
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
                <Input.Password ref={inputRef} placeholder="Password" prefix={<LockOutlined className="site-form-item-icon" />} value={password} onChange={handleChangePassword}/>
              </Form.Item>
              <Form.Item
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The new password that you entered do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password ref={inputRef} placeholder="Confirm Password" prefix={<LockOutlined className="site-form-item-icon" />} value={confirmPassword}  onChange={handleChangeConfirmPassword}/>
              </Form.Item>

              <Form.Item style={{textAlign: 'center'}}>
                <Loading isLoading={isLoading}>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    Đăng ký
                  </Button>
                </Loading>
              </Form.Item>
              <Form.Item >
                <span>Đã có tài khoản?</span>
                <Link to="/sing-in">Đăng nhập tài khoản</Link>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default SingUpPage