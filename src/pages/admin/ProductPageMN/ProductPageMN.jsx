/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Divider, Button, Modal, Form, Input, Upload, Space } from "antd";
import { PlusSquareOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import TableComponent from "../../../components/TableComponent/TableComponent";
import { getBase64 } from "../../../utils";
import * as ProductService from "../../../services/ProductService";
import { UseMutationHook } from "../../../hooks/useMutationHook";
import * as message from '../../../components/Message/message'
import { useQuery } from '@tanstack/react-query'
import "./ProductPageMN.scss";
import DrawerComponent from "../../../components/DrawerComponent/DrawerComponent";
import { useSelector } from 'react-redux';
import Loading from "../../../components/LoadingComponent/loading";
const { TextArea } = Input;

const ProductPageMN = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const user = useSelector(state => state.user)
  const [ rowSelected, setRowSelected ] = useState('')
  const [ isOpenDraw, setIsOpenDraw ] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)

  const renderAction = () => {
    return (
      <Space>
        <EditOutlined style={{color: 'orange', cursor: 'pointer', fontSize: '18px'}} onClick={handleDetailProduct}/>
        <DeleteOutlined style={{color: 'red', cursor: 'pointer', fontSize: '18px'}}/>
      </Space>
    )
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'CountInStock',
      dataIndex: 'countInStock',
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      render: renderAction
    },
  ];


  //=============== Display products ==================//

  const [ stateProduct, setStateProduct ] = useState({
    name: "",
    price: "",
    description: "",
    rating: "",
    image: "",
    type: "",
    countInStock: "",
  });

  const mutation = UseMutationHook((data) => {
    const { name, price, description, rating, image, type, countInStock } = data;
    const res = ProductService.createProduct({ name, price, description, rating, image, type, countInStock });
    return res
  });


  const fetchProductAll = async () => {
    const res = await ProductService.listProduct()
    return res
  }


  const { data, isLoading, isSuccess, isError } = mutation

  // Lấy ra ds sản phẩm
  const { isLoading: isLoadingProducts, data: products } = useQuery({
    queryKey: ['products'], 
    queryFn: fetchProductAll
  });


  const dataTable = products?.data.length && products?.data.map((product) => {
    return {...product, key: product._id}
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
    setStateProduct({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      type: "",
      countInStock: "",
    })
    form.resetFields()
  };

  //   form
  const onFinish = () => {
    mutation.mutate(stateProduct)
  };

  const handleOnChange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setStateProduct({
      ...stateProduct,
      image: file.preview,
    });
  };

  //===================================================


  //================= EDIT PRODUCT ==================//

  const [ stateProductDetail, setStateProductDetail ] = useState({
    name: "",
    price: "",
    description: "",
    rating: "",
    image: "",
    type: "",
    countInStock: "",
  });

  const mutationUpdate = UseMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct({ id, token, rests });
    return res
  });

  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success()
      handleCancelUpdate()
      // window.location.reload();
    }else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated, isErrorUpdated])

  const handleCancelUpdate = () => {
    setIsOpenDraw(false);
    setStateProductDetail({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      type: "",
      countInStock: "",
    })
    form.resetFields()
  };


  const fetchGetDetailProduct = async (id) => {
    try {
      const res = await ProductService.getDetailProduct(id);
      if (res?.data) {
        setStateProductDetail({
          name: res.data.name,
          price: res.data.price,
          description: res.data.description,
          rating: res.data.rating,
          image: res.data.image,
          type: res.data.type,
          countInStock: res.data.countInStock,
        });
        form.setFieldsValue(res.data);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
    setIsLoadingUpdate(false)
  };

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailProduct(rowSelected)
    }
  }, [rowSelected])

  const handleDetailProduct = () => {
    if (rowSelected) {
      setIsLoadingUpdate(true)
      setIsOpenDraw(true)
      fetchGetDetailProduct(rowSelected)
    }
  }

  const handleChangeAvatarDetail = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setStateProductDetail({
      ...stateProductDetail,
      image: file.preview,
    });
  };

  const handleOnChangeDetail = (e) => {
    setStateProductDetail({
      ...stateProductDetail,
      [e.target.name]: e.target.value,
    });
  };

  const onUpdateProduct = () => {
    mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateProductDetail})
  }

  //====================================

  return (
    <>
      <Divider>Quản lý sản phẩm</Divider>

      <Button className="btn-add" onClick={showModal}>
        <PlusSquareOutlined className="icon-add" />
      </Button>

      <TableComponent columns={columns} isLoading={isLoadingProducts} data={dataTable} 
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            },
          };
        }}
      />

      <Modal
        title="Tạo mới sản phẩm"
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
                value={stateProduct.name}
                name="name"
                onChange={handleOnChange}
              />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Please input your type product!",
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
                value={stateProduct.type}
                name="type"
                onChange={handleOnChange}
              />
            </Form.Item>
            <Form.Item
              label="CountInStock"
              name="countInStock"
              rules={[
                {
                  required: true,
                  message: "Please input your countInStock!",
                },
              ]}
            >
              <Input
                value={stateProduct.countInStock}
                name="countInStock"
                onChange={handleOnChange}
              />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Please input your price product!",
                },
              ]}
            >
              <Input
                value={stateProduct.price}
                name="price"
                onChange={handleOnChange}
              />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
            >
              <TextArea
                rows={4}
                value={stateProduct.description}
                name="description"
                onChange={handleOnChange}
              />
            </Form.Item>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[
                {
                  required: true,
                  message: "Please input your rating product!",
                },
              ]}
            >
              <Input
                value={stateProduct.rating}
                name="rating"
                onChange={handleOnChange}
              />
            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              rules={[
                {
                  required: true,
                  message: "Please input your image product!",
                },
              ]}
            >
              <Upload onChange={handleChangeAvatar} maxCount={1}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                {stateProduct?.image && (
                <img
                  src={stateProduct?.image}
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

      <DrawerComponent title="Chi tiết sản phẩm" isOpen={isOpenDraw} onClose={() => setIsOpenDraw(false)} width='50%'>
        <Loading isLoading={isLoadingUpdate}>
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
            onFinish={onUpdateProduct}
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
                value={stateProductDetail['name']}
                name="name"
                onChange={handleOnChangeDetail}
              />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Please input your type product!",
                },
              ]}
            >
              {/* <Select
                    placeholder="Select a option and change input text above"
                    onChange={handleOnChangeDetail}
                    allowClear
                    name='type'
                  >
                    <Option value="male">male</Option>
                    <Option value="female">female</Option>
                    <Option value="other">other</Option>
                  </Select> */}
              <Input
                value={stateProductDetail.type}
                name="type"
                onChange={handleOnChangeDetail}
              />
            </Form.Item>
            <Form.Item
              label="CountInStock"
              name="countInStock"
              rules={[
                {
                  required: true,
                  message: "Please input your countInStock!",
                },
              ]}
            >
              <Input
                value={stateProductDetail.countInStock}
                name="countInStock"
                onChange={handleOnChangeDetail}
              />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Please input your price product!",
                },
              ]}
            >
              <Input
                value={stateProductDetail.price}
                name="price"
                onChange={handleOnChangeDetail}
              />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
            >
              <TextArea
                rows={4}
                value={stateProductDetail.description}
                name="description"
                onChange={handleOnChangeDetail}
              />
            </Form.Item>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[
                {
                  required: true,
                  message: "Please input your rating product!",
                },
              ]}
            >
              <Input
                value={stateProductDetail.rating}
                name="rating"
                onChange={handleOnChangeDetail}
              />
            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              rules={[
                {
                  required: true,
                  message: "Please input your image product!",
                },
              ]}
            >
              <Upload fileList={stateProduct?.image ? [{uid: '-1', url: stateProduct.image}] : []} onChange={handleChangeAvatarDetail} maxCount={1}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                {stateProductDetail?.image && (
                  <img
                    src={stateProductDetail?.image}
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
  );
};

export default ProductPageMN;
