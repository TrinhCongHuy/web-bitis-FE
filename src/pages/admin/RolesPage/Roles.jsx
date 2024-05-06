import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Space, Popconfirm, Card } from "antd";
import { PlusSquareOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import TableComponent from "../../../components/TableComponent/TableComponent";
import * as RoleService from '../../../services/RoleService';
import { UseMutationHook } from "../../../hooks/useMutationHook";
import * as message from '../../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux';
import Loading from "../../../components/LoadingComponent/Loading";
import DrawerComponent from "../../../components/DrawerComponent/DrawerComponent";

const Roles = () => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const user = useSelector(state => state.user)
    const [ rowSelected, setRowSelected ] = useState('')
    const [ isOpenDraw, setIsOpenDraw ] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)


    const renderAction = (record) => {
        return (
        <Space>
            <EditOutlined style={{color: 'orange', cursor: 'pointer', fontSize: '18px'}} onClick={handleDetailRole}/>
            {columns.length >= 1 && (
            <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.key)}>
                <DeleteOutlined style={{color: 'red', cursor: 'pointer', fontSize: '18px'}}/>
            </Popconfirm>
            )}
        </Space>
        )
    }



    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => renderAction(record)
        },
    ];


    const [ stateRole, setStateRole ] = useState({
        title: "",
        description: "",
    });

    const mutation = UseMutationHook((data) => {
        const { title, description } = data;
        const res = RoleService.createRole({ title, description });
        return res
    });

    const fetchRoleAll = async () => {
        const res = await RoleService.listRole()
        return res
    }


    const { data, isLoading, isSuccess, isError } = mutation

    // Lấy ra ds sản phẩm
    const queryRoles = useQuery({
        queryKey: ['roles'], 
        queryFn: fetchRoleAll
    });

    const { isLoading: isLoadingAccount, data: roles } = queryRoles

    const dataTable = roles?.data.length && roles?.data.map((role) => {
        return {...role, key: role._id }
    })

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success()
            handleCancel()
        }else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    // modal
    const showModal = () => {
        setOpen(true);
    };
    
    const handleCancel = () => {
        setOpen(false);
        setStateRole({
            title: "",
            description: "",
        })
        form.resetFields()
    };

    const handleOnChange = (e) => {
        setStateRole({
        ...stateRole,
        [e.target.name]: e.target.value,
        });
    };

    //   form
    const onFinish = () => {
        mutation.mutate(stateRole, {
        onSettled: () => {
            queryRoles.refetch()
        }
        })
    };

    //================= EDIT ROLE ==================//

    const [ stateRoleDetail, setStateRoleDetail ] = useState({
        title: "",
        description: "",
    });

    const mutationUpdate = UseMutationHook((data) => {
        const { id, token, ...rests } = data;
        const res = RoleService.updateRole({ id, token, rests });
        return res
    });

    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success()
            handleCancelUpdate()
        }else if (isErrorUpdated) {
            message.error()
        }
    }, [isSuccessUpdated, isErrorUpdated])

    const handleCancelUpdate = () => {
        setIsOpenDraw(false);
        setStateRoleDetail({
            title: "",
            description: "",
        })
        form.resetFields()
    };


    const fetchGetDetailUser = async (id) => {
        try {
        const res = await RoleService.getDetailRole(id);
        console.log('res', res)
        if (res?.data) {
            setStateRoleDetail({
                title: res.data.title,
                description: res.data.description,
            });
            form.setFieldsValue(res.data);
        }
        } catch (error) {
        console.error("Error fetching user details:", error);
        }
        setIsLoadingUpdate(false)
    };

    useEffect(() => {
        if (rowSelected && isOpenDraw) {
            setIsLoadingUpdate(true)
            fetchGetDetailUser(rowSelected)
        }
    }, [rowSelected, isOpenDraw])

    const handleDetailRole = () => {
        setIsOpenDraw(true)
    }

    const handleOnChangeDetail = (e) => {
        setStateRoleDetail({
        ...stateRoleDetail,
        [e.target.name]: e.target.value,
        });
    };

    const onUpdateUser = () => {
        mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateRoleDetail}, {
        onSettled: () => {
            queryRoles.refetch()
        }
        })
    }

    // ============== DELETE ============= //

    const mutationDeleted = UseMutationHook((data) => {
        const { id, token } = data;
        const res = RoleService.deleteRole({ id, token });
        return res
    });

    const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success()
        }else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccessDeleted, isErrorDeleted])



    const handleDelete = (key) => {
        mutationDeleted.mutate({ id: key, token: user?.access_token }, {
        onSettled: () => {
            queryRoles.refetch()
        }
        })
    };

    return (
        <>
            <Card type="inner" title='Danh sách các quyền'>
                <Button className='btn-add' onClick={showModal}>
                    <PlusSquareOutlined className='icon-add'/>
                </Button>

                <TableComponent columns={columns} isLoading={isLoadingAccount} data={dataTable} 
                    onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                        setRowSelected(record._id)
                        },
                    };
                    }}
                />

                <Modal
                    title="Tạo mới quyền"
                    forceRender
                    open={open}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Loading isLoading={isLoading}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{
                        span: 6,
                        }}
                        wrapperCol={{
                        span: 18,
                        }}
                        style={{
                        maxWidth: 600,
                        }}
                        initialValues={{
                        remember: true,
                        }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[
                            {
                            required: true,
                            message: "Please input your name product!",
                            },
                        ]}
                        >
                        <Input
                            value={stateRole.title}
                            name="title"
                            onChange={handleOnChange}
                        />
                        </Form.Item>
                        <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[
                            {
                            required: true,
                            message: "Please input your email user!",
                            },
                        ]}
                        >
                        <Input
                            value={stateRole.description}
                            name="description"
                            onChange={handleOnChange}
                        />
                        </Form.Item>
                        <Form.Item
                        wrapperCol={{
                            offset: 6,
                            span: 16,
                        }}
                        style={{ display: "flex", justifyContent: "center" }}
                        >
                        <Button type="primary" htmlType="submit">
                            Tạo mới
                        </Button>
                        </Form.Item>
                    </Form>
                    </Loading>
                </Modal>

                <DrawerComponent title="Chi tiết quyền" isOpen={isOpenDraw} onClose={() => setIsOpenDraw(false)} width='50%'>
                    <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        name="basic"
                        labelCol={{
                        span: 6,
                        }}
                        wrapperCol={{
                        span: 18,
                        }}
                        style={{
                        maxWidth: 600,
                        }}
                        onFinish={onUpdateUser}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                        label="Title"
                        name="title"
                        rules={[
                            {
                            required: true,
                            message: "Please input your title role!",
                            },
                        ]}
                        >
                        <Input
                            value={setStateRoleDetail['title']}
                            name="name"
                            onChange={handleOnChangeDetail}
                        />
                        </Form.Item>
                        <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[
                            {
                            required: true,
                            message: "Please input your description role!",
                            },
                        ]}
                        >
                        <Input
                            value={setStateRoleDetail.description}
                            name="email"
                            onChange={handleOnChangeDetail}
                        />
                        </Form.Item>

                        <Form.Item
                        wrapperCol={{
                            offset: 6,
                            span: 16,
                        }}
                        style={{ display: "flex", justifyContent: "center" }}
                        >
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                        </Form.Item>
                    </Form>
                    </Loading>
                </DrawerComponent>
            </Card>
        </>
    )
}

export default Roles