/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Divider, Button, Modal, Form, Input, Upload, Space, Popconfirm } from "antd";
import { PlusSquareOutlined, UploadOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import TableComponent from "../../../components/TableComponent/TableComponent";
import { getBase64 } from "../../../utils";
import * as UserService from '../../../services/UserService'
import { UseMutationHook } from "../../../hooks/useMutationHook";
import * as message from '../../../components/Message/message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from "../../../components/DrawerComponent/DrawerComponent";
import { useSelector } from 'react-redux';
import Loading from "../../../components/LoadingComponent/loading";
import './QTVPageMN.scss'
const { TextArea } = Input;


const QTVPageMN = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const user = useSelector(state => state.user)
  const [ rowSelected, setRowSelected ] = useState('')
  const [ isOpenDraw, setIsOpenDraw ] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const renderAction = (record) => {
    return (
      <Space>
        <EditOutlined style={{color: 'orange', cursor: 'pointer', fontSize: '18px'}} onClick={handleDetailUser}/>
        {/* <DeleteOutlined style={{color: 'red', cursor: 'pointer', fontSize: '18px'}}/> */}
        {columns.length >= 1 && (
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.key)}>
            <DeleteOutlined style={{color: 'red', cursor: 'pointer', fontSize: '18px'}}/>
          </Popconfirm>
        )}
      </Space>
    )
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email - b.email,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => renderAction(record)
    },
  ];


  const [ stateUser, setStateUser ] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });

  const mutation = UseMutationHook((data) => {
    const { name, email, avatar, password } = data;
    const res = UserService.createAccount({ name, email, avatar, password });
    return res
  });



  const fetchAccountAll = async () => {
    const res = await UserService.listAccounts()
    return res
  }


  const { data, isLoading, isSuccess, isError } = mutation

  // Lấy ra ds sản phẩm
  const queryUsers = useQuery({
    queryKey: ['users'], 
    queryFn: fetchAccountAll
  });

  const { isLoading: isLoadingUsers, data: users } = queryUsers


  const dataTable = users?.data.length && users?.data.map((user) => {
    return {...user, key: user._id }
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
    setStateUser({
      name: "",
      email: "",
      password: "",
      avatar: "",
    })
    form.resetFields()
  };

  //   form
  const onFinish = () => {
    mutation.mutate(stateUser, {
      onSettled: () => {
        queryUsers.refetch()
      }
    })
  };

  const handleOnChange = (e) => {
    setStateUser({
      ...stateUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setStateUser({
      ...stateUser,
      avatar: file.preview,
    });
  };

  //===================================================


  //================= EDIT USER ==================//

  const [ stateUserDetail, setStateUserDetail ] = useState({
      name: "",
      email: "",
      avatar: "",
  });

  const mutationUpdate = UseMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser({ id, token, rests });
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
    setStateUserDetail({
      name: "",
      email: "",
      avatar: "",
    })
    form.resetFields()
  };


  const fetchGetDetailUser = async (id) => {
    try {
      const res = await UserService.getDetailUser(id);
      console.log('res', res)
      if (res?.data) {
        setStateUserDetail({
          name: res.data.name,
          email: res.data.email,
          avatar: res.data.avatar,
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

  const handleDetailUser = () => {
    setIsOpenDraw(true)
  }

  const handleChangeAvatarDetail = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setStateUserDetail({
      ...stateUserDetail,
      avatar: file.preview,
    });
  };

  const handleOnChangeDetail = (e) => {
    setStateUserDetail({
      ...stateUserDetail,
      [e.target.name]: e.target.value,
    });
  };

  const onUpdateUser = () => {
    mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateUserDetail}, {
      onSettled: () => {
        queryUsers.refetch()
      }
    })
  }

  //====================================

  // ============== DELETE ============= //

  const mutationDeleted = UseMutationHook((data) => {
    const { id, token } = data;
    const res = UserService.deleteUser({ id, token });
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
        queryUsers.refetch()
      }
    })
  };


  return (
    <>
      <Divider>Quản lý quản trị viên</Divider>

      <Button className='btn-add' onClick={showModal}>
        <PlusSquareOutlined className='icon-add'/>
      </Button>

      <TableComponent columns={columns} isLoading={isLoadingUsers} data={dataTable} 
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            },
          };
        }}
      />

      <Modal
        title="Tạo mới thành viên"
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
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name product!",
                },
              ]}
            >
              <Input
                value={stateUser.name}
                name="name"
                onChange={handleOnChange}
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email user!",
                },
              ]}
            >
              {/* <Select
                    placeholder="Select a option and change input text above"
                    onChange={handleOnChange}
                    allowClear
                    name='type'
                  >
                    <Option value="male">male</Option>
                    <Option value="female">female</Option>
                    <Option value="other">other</Option>
                  </Select> */}
              <Input
                value={stateUser.email}
                name="email"
                onChange={handleOnChange}
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password account!",
                },
              ]}
            >
              <Input
                value={stateUser.password}
                name="password"
                onChange={handleOnChange}
              />
            </Form.Item>
            <Form.Item
              label="Avatar"
              name="avatar"
              rules={[
                {
                  required: true,
                  message: "Please input your avatar user!",
                },
              ]}
            >
              <Upload onChange={handleChangeAvatar} maxCount={1}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                {stateUser?.avatar && (
                <img
                  src={stateUser?.avatar}
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  alt="avatar"
                />
              )}
              </Upload>
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

      <DrawerComponent title="Chi tiết thành viên" isOpen={isOpenDraw} onClose={() => setIsOpenDraw(false)} width='50%'>
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
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name product!",
                },
              ]}
            >
              <Input
                value={setStateUserDetail['name']}
                name="name"
                onChange={handleOnChangeDetail}
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email user!",
                },
              ]}
            >
              {/* <Select
                    placeholder="Select a option and change input text above"
                    onChange={handleOnChangeDetail}
                    allowClear
                    name='email'
                  >
                    <Option value="male">male</Option>
                    <Option value="female">female</Option>
                    <Option value="other">other</Option>
                  </Select> */}
              <Input
                value={setStateUserDetail.email}
                name="email"
                onChange={handleOnChangeDetail}
              />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
            >
              <TextArea
                rows={4}
                value={setStateUserDetail.description}
                name="description"
                onChange={handleOnChangeDetail}
              />
            </Form.Item>
            <Form.Item
              label="Avatar"
              name="avatar"
              rules={[
                {
                  required: true,
                  message: "Please input your avatar account!",
                },
              ]}
            >
              <Upload fileList={stateUser?.avatar ? [{uid: '-1', url: stateUser.avatar}] : []} onChange={handleChangeAvatarDetail} maxCount={1}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                {stateUserDetail?.avatar && (
                  <img
                    src={stateUserDetail?.avatar}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    alt="avatar"
                  />
                )}
              </Upload>
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
    </>
  )
}

export default QTVPageMN