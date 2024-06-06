/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal, Input, Space, Col, Form, Row } from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import "./ProfilePage.scss";
import * as UserService from "../../../services/UserService";
import { UseMutationHook } from "../../../hooks/useMutationHook";
import * as message from "../../../components/Message/Message";
import { updateUser } from "../../../redux/slides/userSlide";

const ProfilePage = () => {
  const initialUser = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  const [filteredUser, setFilteredUser] = useState({});

  const mutation = UseMutationHook((data) => {
    const { id, token, ...rests } = data;
    UserService.updateUser({ id: id, token: token, rests: rests });
  });

  const { isSuccess, isError } = mutation;

  useEffect(() => {
    setUser({
      name: initialUser?.name || "",
      email: initialUser?.email || "",
      phone: initialUser?.phone || "",
      avatar: initialUser?.avatar || "",
    });
  }, [initialUser]);

  useEffect(() => {
    if (isSuccess) {
      message.success();
      handleGetDetailUser(initialUser?.id, initialUser?.access_token);
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const handleGetDetailUser = async (id, token) => {
    const res = await UserService.getDetailUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
    mutation.mutate({
      id: initialUser?.id,
      token: initialUser?.access_token,
      ...filteredUser,
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleChange = (e, key) => {
    const value = e.target.value;
    setUser((prevUser) => ({ ...prevUser, [key]: value }));
    setFilteredUser((prevUser) => ({ ...prevUser, [key]: value }));
  };

  const handleChangeAvatar = async (e) => {
    setUser((prevUser) => ({ ...prevUser, avatar: URL.createObjectURL(e.target.files[0]) }));
    setFilteredUser((prevUser) => ({ ...prevUser, avatar: e.target.files[0] }));
  };

  return (
    <>
      <div className="container page__profile">
        <div className="wrapper">
          <h3 style={{ marginLeft: "140px" }}>Thông tin cá nhân</h3>
          <Row>
            <Col span={8} style={{ textAlign: "center" }}>
              <div className="profile__avatar">
                <img className="profile__avatar--img" src={user.avatar} alt="avatar" />
              </div>
              <div className="profile__edit">
                <Button onClick={showModal}>
                  EDIT <EditOutlined />
                </Button>
                <Modal
                  title="CHỈNH SỬA THÔNG TIN"
                  open={open}
                  onOk={handleOk}
                  confirmLoading={confirmLoading}
                  onCancel={handleCancel}
                  okText="Cập nhật"
                >
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Form form={form} layout="vertical">
                      <Form.Item name="name" label="Họ và tên">
                        <Input defaultValue={initialUser.name} onChange={(e) => handleChange(e, "name")} />
                      </Form.Item>
                      <Form.Item name="email" label="Email">
                        <Input defaultValue={initialUser.email} onChange={(e) => handleChange(e, "email")} />
                      </Form.Item>
                      <Form.Item name="phone" label="Số điện thoại">
                        <Input defaultValue={initialUser.phone} onChange={(e) => handleChange(e, "phone")} />
                      </Form.Item>
                      <Form.Item name="confirmPassword" label="Mật khẩu cũ">
                        <Input placeholder="Vui lòng nhập lại mật khẩu cũ" onChange={(e) => handleChange(e, "confirmPassword")} />
                      </Form.Item>
                      <Form.Item name="password" label="Mật khẩu mới">
                        <Input placeholder="Nhập mật khẩu mới" onChange={(e) => handleChange(e, "password")} />
                      </Form.Item>
                      <Form.Item name="avatar" label="Hình đại diện">
                        <div className="upload-image">
                            <input type="file" accept="image/*" icon={<UploadOutlined />} onChange={handleChangeAvatar} />
                        
                            {user?.avatar && (
                            <div style={{ marginTop: '10px'}}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Ảnh mới:</label>
                                <img src={user?.avatar} alt="upload" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px' }} />
                            </div>
                            )}
                        </div>
                      </Form.Item>
                    </Form>
                  </Space>
                </Modal>
              </div>
            </Col>
            <Col span={15} style={{ marginLeft: "20px" }}>
              <Form form={form} style={{ width: "500px" }} layout="vertical">
                <Form.Item name="name" label="Họ và tên">
                  <Input disabled defaultValue={initialUser.name} />
                </Form.Item>
                <Form.Item name="email" label="Email">
                  <Input disabled defaultValue={initialUser.email} />
                </Form.Item>
                <Form.Item name="phone" label="Số điện thoại">
                  <Input disabled defaultValue={initialUser.phone} />
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
