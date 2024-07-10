/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Divider, Button, Modal, Form, Input, Upload, Space, Popconfirm, Select } from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import TableComponent from "../../../components/TableComponent/TableComponent";
import { getBase64 } from "../../../utils";
import * as AccountService from '../../../services/AccountService';
import * as RoleService from '../../../services/RoleService';
import { UseMutationHook } from "../../../hooks/useMutationHook";
import * as message from '../../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from "../../../components/DrawerComponent/DrawerComponent";
import { useSelector } from 'react-redux';
import Loading from "../../../components/LoadingComponent/Loading";
import './QTVPageMN.scss'


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
  const [uploadImage, setUploadImage] = useState();
  const [roles, setRoles] = useState([]);


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
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role_id',
      render: (roleId) => getRoleTitleById(roleId),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => renderAction(record)
    },
  ];


  const [ stateAccount, setStateAccount ] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role_id: "",
  });

  // Call API Role
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await RoleService.listRole(); 
        if (res?.data) {
          setRoles(res.data);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  const getRoleTitleById = (roleId) => {
    const role = roles.find(role => role._id === roleId);
    return role ? role.title : '';
  };

  // Call API Account
  const mutation = UseMutationHook((data) => {
    const { name, email, avatar, password, phone, role_id } = data;
    const res = AccountService.createAccount({ name, email, avatar, password, phone, role_id });
    return res
  });

  const fetchAccountAll = async () => {
    const res = await AccountService.listAccount()
    return res
  }

  const { data, isLoading, isSuccess, isError } = mutation

  // Lấy ra ds sản phẩm
  const queryAccounts = useQuery({
    queryKey: ['accounts'], 
    queryFn: fetchAccountAll
  });

  const { isLoading: isLoadingAccount, data: accounts } = queryAccounts

  const dataTable = accounts?.data.length && accounts?.data.map((account) => {
    return {...account, key: account._id }
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
    setStateAccount({
      name: "",
      email: "",
      password: "",
      avatar: "",
      phone: "",
      role_id: ""
    })
    form.resetFields()
  };

  const handleOnChange = (e) => {
    setStateAccount({
      ...stateAccount,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value) => {
    setStateAccount({
      ...stateAccount,
      role_id: value,
    });
  }

  const handleChangeAvatar = async (e) => {
    setUploadImage(e.target.files[0]);

    setStateAccount({
      ...stateAccount,
      avatar: e.target.files[0],
    });
  };

  //   form
  const onFinish = () => {
    mutation.mutate(stateAccount, {
      onSettled: () => {
        queryAccounts.refetch()
      }
    })
  };

  //================= EDIT USER ==================//

  const [ stateAccountDetail, setStateAccountDetail ] = useState({
      name: "",
      email: "",
      avatar: "",
      phone: "",
      role_id: ""
  });

  const mutationUpdate = UseMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = AccountService.updateAccount({ id, token, rests });
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
    setStateAccountDetail({
      name: "",
      email: "",
      avatar: "",
      phone: "",
      role_id: ""
    })
    form.resetFields()
  };


  const fetchGetDetailUser = async (id) => {
    try {
      const res = await AccountService.getDetailAccount(id);
      if (res?.data) {
        setStateAccountDetail({
          name: res.data.name,
          email: res.data.email,
          avatar: res.data.avatar,
          phone: res.data.phone,
          role_id: res.data.role_id,
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

    setStateAccountDetail({
      ...stateAccountDetail,
      avatar: file.preview,
    });
  };

  const handleOnChangeDetail = (e) => {
    setStateAccountDetail({
      ...stateAccountDetail,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChangeDetail = (value) => {
    setStateAccountDetail({
      ...stateAccountDetail,
      role_id: value,
    });
  }

  const onUpdateUser = () => {
    mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateAccountDetail}, {
      onSettled: () => {
        queryAccounts.refetch()
      }
    })
  }

  // ============== DELETE ============= //

  const mutationDeleted = UseMutationHook((data) => {
    const { id, token } = data;
    const res = AccountService.deleteAccount({ id, token });
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
        queryAccounts.refetch()
      }
    })
  };


  return (
    <>
      <Divider>QUẢN LÝ QUẢN TRỊ VIÊN</Divider>

      <Button className="btn-add" onClick={showModal}>
        Thêm mới tài khoản <PlusOutlined className="icon-add" />
      </Button>

      <TableComponent columns={columns} isLoading={isLoadingAccount} data={dataTable} 
        pagination={{ pageSize: 5, position: ['bottomCenter'], }}
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
                value={stateAccount.name}
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
              <Input
                value={stateAccount.email}
                name="email"
                onChange={handleOnChange}
              />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please input your phone user!",
                },
              ]}
            >
              <Input
                value={stateAccount.phone}
                name="phone"
                onChange={handleOnChange}
              />
            </Form.Item>
            <Form.Item
              label="Vai trò"
              name="role_id"
              rules={[
                {
                  required: true,
                  message: "Please select a role for the user!",
                },
              ]}
            >
              <Select
                value={stateAccount.role_id}
                onChange={handleSelectChange}
              >
                {roles.map((role, index) => (
                  <Select.Option key={index} value={role._id}>
                    {role.title}
                  </Select.Option>
                ))}
              </Select>
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
                value={stateAccount.password}
                name="password"
                onChange={handleOnChange}
              />
            </Form.Item>

            <Form.Item
            name="avatar"
            label="Hình ảnh"
            >
              <div className="upload-image">
                <input type="file" accept="image/*" icon={<UploadOutlined />} onChange={handleChangeAvatar} />
              
                {uploadImage && (
                  <div style={{ marginTop: '10px'}}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Ảnh mới:</label>
                    <img src={URL.createObjectURL(uploadImage)} alt="upload" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px' }} />
                  </div>
                )}
              </div>

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
                value={setStateAccountDetail['name']}
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
              <Input
                value={setStateAccountDetail.email}
                name="email"
                onChange={handleOnChangeDetail}
              />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please input your phone user!",
                },
              ]}
            >
              <Input
                value={setStateAccountDetail.phone}
                name="phone"
                onChange={handleOnChangeDetail}
              />
            </Form.Item>
            <Form.Item
              label="Vai trò"
              name="role_id"
              rules={[
                {
                  required: true,
                  message: "Please select a role for the user!",
                },
              ]}
            >
              <Select
                value={stateAccount.role_id}
                onChange={handleSelectChangeDetail}
              >
                {roles.map((role, index) => (
                  <Select.Option key={index} value={role._id}>
                    {role.title}
                  </Select.Option>
                ))}
              </Select>
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
              <Upload fileList={stateAccount?.avatar ? [{uid: '-1', url: stateAccount.avatar}] : []} onChange={handleChangeAvatarDetail} maxCount={1}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                {stateAccountDetail?.avatar && (
                  <img
                    src={stateAccountDetail?.avatar}
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