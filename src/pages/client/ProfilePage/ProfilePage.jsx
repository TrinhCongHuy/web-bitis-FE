/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Image, Button, Modal, Input, Space, Upload, Col, Form, Row} from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons"
import './ProfilePage.scss'
import * as UserService from '../../../services/UserService'
import { UseMutationHook } from "../../../hooks/useMutationHook";
import { useDispatch } from "react-redux";
import * as message from '../../../components/Message/Message'
import { updateUser } from "../../../redux/slides/userSlide";
import { getBase64 } from "../../../utils";


const ProfilePage = () => {
    const initialUser = useSelector((state) => state.user);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const dispatch = useDispatch()
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: ''
    });
    
    const [filteredUser, setFilteredUser] = useState([]);

    const mutation = UseMutationHook(
        (data) => {
            const {id, token, ...rests} = data
            UserService.updateUser({id: id, token: token, rests: rests})
        }
    )

    const { isSuccess, isError } = mutation

    useEffect(() => {
        setUser(()=> ({
            name: initialUser?.name || '', 
            email: initialUser?.email || '', 
            phone: initialUser?.phone || '', 
            avatar: initialUser?.avatar || ''
        }));
    }, [initialUser])

    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleGetDetailUser(initialUser?.id, initialUser?.access_token)
        }else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const handleGetDetailUser = async (id, token) => {
        const res = await UserService.getDetailUser(id, token)
        dispatch(updateUser({...res?.data, access_token: token}))
    }

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
        console.log('filteredUser', filteredUser)
        mutation.mutate({id: initialUser?.id, token: initialUser?.access_token, ...filteredUser})

    };
    
    const handleCancel = () => {
        setOpen(false);
    };

    const handleChange = (e, key) => {
        setUser(prevUser => ({ ...prevUser, [key]: e.target.value }));
        setFilteredUser(prevUser => ({ ...prevUser, [key]: e.target.value }));
    };

    const handleChangeAvatar = async (e) => {
        const file = e.target.files[0]

        setUser(()=> ({
            avatar: file
        }));

        setFilteredUser(prevUser => ({ ...prevUser, avatar: file }))
    }


    return (
        <>
            <div className="container page__profile">
                <div className="wrapper">
                    <h3 style={{marginLeft: '140px'}}>Thông tin cá nhân</h3>
                    <Row>
                        <Col span={8} style={{textAlign: "center"}}>
                            <div className="profile__avatar">
                                <img className="profile__avatar--img" src={user.avatar} alt="avatar"/>
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
                                    <Space direction="vertical" size="middle" style={{width: '100%'}}>
                                        <Input value={initialUser.name} onChange={(e) => handleChange(e, 'name')} />
                                        <Input value={initialUser.email} onChange={(e) => handleChange(e, 'email')} />
                                        <Input value={initialUser.phone} onChange={(e) => handleChange(e, 'phone')} />
                                        <Upload onChange={handleChangeAvatar}>
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
                                        {user.avatar && (
                                            <img src={user.avatar} style={{
                                                height: '60px',
                                                width: '60px',
                                                borderRadius: '50%',
                                                objectFit: 'cover'
                                            }} alt="avatar"/>
                                        )}
                                    </Space>
                                    
                                </Modal>
                            </div>
                        </Col>
                        <Col span={15} style={{marginLeft: '20px'}}>
                            <Form form={form} style={{width:'500px'}} layout="vertical">
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
