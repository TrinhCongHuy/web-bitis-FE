/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Divider, Button, Modal, Form, Input, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import TableComponent from "../../../components/TableComponent/TableComponent";
import * as CouponService from '../../../services/CouponService';
import { UseMutationHook } from "../../../hooks/useMutationHook";
import * as message from '../../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from "../../../components/DrawerComponent/DrawerComponent";
import { useSelector } from 'react-redux';
import Loading from "../../../components/LoadingComponent/Loading";
import moment from 'moment';



const CouponPage = () => {
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
  const [uploadImageDetail, setUploadImageDetail] = useState();


 


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
      title: 'Hình ảnh ',
      dataIndex: 'image',
      render: (image) => <img src={image} alt="coupon" style={{width: '50px', height: '50px', objectFit: 'cover'}}/>
    },
    {
      title: 'Mã code',
      dataIndex: 'code',
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.code.length - b.code.length,
      ...getColumnSearchProps('code')
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      sorter: (a, b) => a.discount - b.discount,
    },
    {
      title: 'Số lượng',
      dataIndex: 'count',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expireAt',
      render: (expireAt) => moment(expireAt).format('DD-MM-YYYY HH:mm:ss')
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => renderAction(record)
    },
  ];


  const [ stateCoupon, setStateCoupon ] = useState({
    code: "",
    discount: "",
    count: "",
    image: "",
    description: "",
    expireAt: "",
  });

  // Call API Coupon
  const mutation = UseMutationHook((data) => {
    const { code, discount, count, image, description, expireAt } = data;
    const res = CouponService.createCoupon({ code, discount, count, image, description, expireAt });
    return res;
  });
  

  const fetchCouponAll = async () => {
    const res = await CouponService.listCoupon()
    return res
  }

  const { data, isLoading, isSuccess, isError } = mutation

  // Lấy ra ds sản phẩm
  const queryCoupons = useQuery({
    queryKey: ['coupons'], 
    queryFn: fetchCouponAll
  });

  const { isLoading: isLoadingAccount, data: coupons } = queryCoupons

  const dataTable = coupons?.data.length && coupons?.data.map((coupon) => {
    return {...coupon, key: coupon._id }
  })

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      message.success('Thêm mới mã giảm giá thành công!')
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
    setStateCoupon({
        code: "",
        discount: "",
        count: "",
        image: "",
        description: "",
        expireAt: "",
    })
    form.resetFields()
  };

  const handleOnChange = (e) => {
    setStateCoupon({
      ...stateCoupon,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setUploadImage(e.target.files[0])
    setStateCoupon({
      ...stateCoupon,
      image: e.target.files[0],
    });
  };
  

  //   form
  const onFinish = () => {
    mutation.mutate(stateCoupon, {
      onSettled: () => {
        queryCoupons.refetch()
      }
    })
  };

  //================= EDIT COUPON ==================//

  const [ stateCouponDetail, setStateCouponDetail ] = useState({
    code: "",
    discount: "",
    count: "",
    image: "",
    description: "",
    expireAt: "",
  });



  const mutationUpdate = UseMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = CouponService.updateCoupon({ id, token, rests });
    return res
  });

  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success('Cập nhật mã giảm giá thành công!')
      handleCancelUpdate()
    }else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated, isErrorUpdated])

  const handleCancelUpdate = () => {
    setIsOpenDraw(false);
    setStateCouponDetail({
        code: "",
        discount: "",
        count: "",
        image: "",
        description: "",
        expireAt: "",
    })
    form.resetFields()
  };


  const fetchGetDetailCoupon = async (id) => {
    try {
      const res = await CouponService.getDetailCoupon(id);
      if (res?.data) {
        setStateCouponDetail({
            code: res.data.code,
            discount: res.data.discount,
            count: res.data.count,
            image: res.data.image,
            description: res.data.description,
            expireAt: res.data.expireAt,
        });
        form.setFieldsValue(res.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
    setIsLoadingUpdate(false)
  };

  console.log('stateCouponDetail',stateCouponDetail)

  useEffect(() => {
    if (rowSelected && isOpenDraw) {
      setIsLoadingUpdate(true)
      fetchGetDetailCoupon(rowSelected)
    }
  }, [rowSelected, isOpenDraw])

  const handleDetailUser = () => {
    setIsOpenDraw(true)
  }


  const handleOnChangeDetail = (e) => {
    setStateCouponDetail({
      ...stateCouponDetail,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChangeDetail = (e) => {
    const file = e.target.files[0]
    setUploadImageDetail(e.target.files[0])
    setStateCouponDetail({
      ...stateCouponDetail,
      image: file,
    });
  }


  const onUpdateCoupon = () => {
    mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateCouponDetail}, {
      onSettled: () => {
        queryCoupons.refetch()
      }
    })
  }

  // ============== DELETE ============= //

  const mutationDeleted = UseMutationHook((data) => {
    const { id, token } = data;
    const res = CouponService.deleteCoupon({ id, token });
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
        queryCoupons.refetch()
      }
    })
  };


  return (
    <>
      <Divider>QUẢN LÝ MÃ GIẢM GIÁ</Divider>

      <Button className="btn-add" onClick={showModal}>
        Thêm mới mã giảm giá <PlusOutlined className="icon-add" />
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
        title="Tạo mới mã giảm giá"
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
              label="Mã code"
              name="code"
              rules={[
                {
                  required: true,
                  message: "Please input your code coupon!",
                },
              ]}
            >
              <Input
                value={stateCoupon.code}
                name="code"
                onChange={handleOnChange}
              />
            </Form.Item>
            <Form.Item
              label="Giảm giá"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Please input your discount coupon!",
                },
              ]}
            >
              <Input
                value={stateCoupon.discount}
                name="discount"
                onChange={handleOnChange}
              />
            </Form.Item>
            <Form.Item
              label="Số lượng"
              name="count"
              rules={[
                {
                  required: true,
                  message: "Please input your count coupon!",
                },
              ]}
            >
              <Input
                value={stateCoupon.count}
                name="count"
                onChange={handleOnChange}
              />
            </Form.Item>
            <Form.Item
            name="image"
            label="Hình ảnh"
            rules={[{ required: true, message: 'Vui lòng chọn hình ảnh!' }]}
          >
            <div className="upload-image">
              <input type="file" accept="image/*" icon={<UploadOutlined />} onChange={handleImageChange} />
              {uploadImage && (
                <img src={URL.createObjectURL(uploadImage)} alt="upload" style={{marginTop: '10px', width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px'}}/>
              )}
            </div>
          </Form.Item>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your description coupon!",
                },
              ]}
            >
              <Input
                value={stateCoupon.description}
                name="description"
                onChange={handleOnChange}
              />
            </Form.Item>
            <Form.Item
              label="Ngày hết hạn"
              name="expireAt"
              rules={[
                {
                  required: true,
                  message: "Please input your expireAt coupon!",
                },
              ]}
            >
              <Input
                type="date"
                value={stateCoupon.expireAt}
                name="expireAt"
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

      <DrawerComponent title="Chi tiết mã giảm giá" isOpen={isOpenDraw} onClose={() => setIsOpenDraw(false)} width='50%'>
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
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
            onFinish={onUpdateCoupon}
            autoComplete="off"
          >
            <Form.Item
              label="Mã code"
              name="code"
              rules={[
                {
                  required: true,
                  message: "Please input your code coupon!",
                },
              ]}
            >
              <Input
                value={stateCouponDetail.code}
                name="code"
                onChange={handleOnChangeDetail}
              />
            </Form.Item>
            <Form.Item
              label="Giảm giá"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Please input your discount coupon!",
                },
              ]}
            >
              <Input
                value={stateCouponDetail.discount}
                name="discount"
                onChange={handleOnChangeDetail}
              />
            </Form.Item>
            <Form.Item
              label="Số lượng"
              name="count"
              rules={[
                {
                  required: true,
                  message: "Please input your count coupon!",
                },
              ]}
            >
              <Input
                value={stateCouponDetail.count}
                name="count"
                onChange={handleOnChangeDetail}
              />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your description coupon!",
                },
              ]}
            >
              <Input
                value={stateCouponDetail.description}
                name="description"
                onChange={handleOnChangeDetail}
              />
            </Form.Item>
            <Form.Item
              label="Ngày hết hạn"
              name="expireAt"
              rules={[
                {
                  required: true,
                  message: "Please input your expireAt coupon!",
                },
              ]}
            >
              <Input
                // value={stateCouponDetail.expireAt}moment(res.data.expireAt).format('DD-MM-YYYY HH:mm:ss')
                value={moment(stateCouponDetail.expireAt).format('DD-MM-YYYY HH:mm:ss')}
                name="expireAt"
                onChange={handleOnChangeDetail}
              />
            </Form.Item>
            <Form.Item
            name="image"
            label="Hình ảnh"
          >
            <div className="upload-image">
              <input type="file" accept="image/*" icon={<UploadOutlined />} onChange={handleImageChangeDetail} />
              <div style={{display: 'flex'}}>
                {stateCouponDetail?.image && (
                  <div style={{ marginTop: '10px', marginRight: '20px'}}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Ảnh hiện tại:</label>
                    <img src={stateCouponDetail?.image} alt="upload" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px' }} />
                  </div>
                )}
                
                {uploadImageDetail && (
                  <div style={{ marginTop: '10px'}}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Ảnh mới:</label>
                    <img src={URL.createObjectURL(uploadImageDetail)} alt="upload" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px' }} />
                  </div>
                )}
              </div>
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
                Cập nhật
              </Button>
            </Form.Item>
            </Form>
        </Loading>
      </DrawerComponent>
    </>
  )
}

export default CouponPage