/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { useSelector } from "react-redux";
import { Image, Button, Modal, Input, Space } from "antd";
import { EditOutlined } from "@ant-design/icons"
import './ProfilePage.scss'
import * as UserService from '../../services/UserService'
import { UseMutationHook } from "../../hooks/useMutationHook";
import { useDispatch } from "react-redux";
import * as message from '../../components/Message/message'
import { updateUser } from "../../redux/slides/userSlide";


const ProfilePage = () => {
    const initialUser = useSelector((state) => state.user);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const dispatch = useDispatch()
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        avatar: ''
    });
    const [filteredUser, setFilteredUser] = useState({});

    const mutation = UseMutationHook(
        (data) => {
            const {id, ...rests} = data
            UserService.updateUser(id, rests)
        }
    )

    const { isSuccess, isError } = mutation

    useEffect(() => {
        setUser(()=> ({
            name: initialUser?.name || '', 
            email: initialUser?.email || '', 
            phone: initialUser?.phone || '', 
            address: initialUser?.address || '',
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
        mutation.mutate({id: initialUser?.id, ...filteredUser})
    };
    
    const handleCancel = () => {
        setOpen(false);
    };

    const handleChange = (e, key) => {
        if (key === 'avatar') {
            setUser({ ...user, [key]: e.target.files[0].name });
            setFilteredUser({ ...filteredUser, [key]: e.target.files[0].name });
        } else {
            setUser(prevUser => ({ ...prevUser, [key]: e.target.value }));
            setFilteredUser(prevUser => ({ ...prevUser, [key]: e.target.value }));
        }
    };

    return (
        <>
        <div className="container page__profile">
            <div className="wrapper">
            <Row>
                <Col span={8} style={{textAlign: "center"}}>
                    <div className="profile__avatar">
                        <Image src={user.avatar}/>
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
                                <Input value={initialUser.address} onChange={(e) => handleChange(e, 'address')} />
                                <Input type="file" onChange={(e) => handleChange(e, 'avatar')} />
                            </Space>
                            
                        </Modal>
                    </div>
                </Col>
                <Col span={15} style={{marginLeft: '20px'}}>
                    <div className="profile__info">
                        <div className="profile__info--item">
                            <span className="profile__info--title">Họ tên:</span>
                            <span className="profile__info--content">{initialUser.name}</span>
                        </div>
                        <div className="profile__info--item">
                            <span className="profile__info--title">Email:</span>
                            <span className="profile__info--content">{initialUser.email}</span>
                        </div>
                        <div className="profile__info--item">
                            <span className="profile__info--title">Số điện thoại:</span>
                            <span className="profile__info--content">{initialUser.phone}</span>
                        </div>
                        <div className="profile__info--item">
                            <span className="profile__info--title">Địa chỉ:</span>
                            <span className="profile__info--content">{initialUser.address}</span>
                        </div>
                    </div>
                </Col>
            </Row>
            </div>
        </div>
        </>
    );
    };

    export default ProfilePage;
