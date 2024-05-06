/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Divider, Button, Modal, Form, Input, Upload, Space, Popconfirm, Select } from "antd";
import { PlusSquareOutlined, UploadOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import TableComponent from "../../../components/TableComponent/TableComponent";
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
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [uploadImage, setUploadImage] = useState();


  const renderAction = (record) => {
    return (
      <Space>
        <EditOutlined style={{color: 'orange', cursor: 'pointer', fontSize: '18px'}} onClick={handleDetailProduct}/>
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
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: '>=500000',
          value: '>=500000',
        },
        {
          text: '<=500000',
          value: '<=500000',
        },
        {
          text: '>=1000000',
          value: '>=1000000',
        },
        {
          text: '<=1000000',
          value: '<=1000000',
        },
      ],
      onFilter: (value, record) => {
        if (value === '>=500000') { 
          return record.price >= 500000;
        }
        if (value === '<=500000') {
          return record.price <= 500000;
        }
        if (value === '>=1000000') {
          return record.price >= 1000000;
        }
        if (value === '<=1000000') {
          return record.price <= 1000000;
        }
        return true;
      },      
      filterMode: 'tree',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: '>=3',
          value: '>=',
        },
        {
          text: '<=3',
          value: '<=',
        },
      ],
      onFilter: (value, record) => {
        if (value === '>=') {
          return Number(record.rating) >= 3
        }
        return Number(record.rating) <= 3
      },
      filterMode: 'tree',
    },
    {
      title: 'Discount',
      dataIndex: 'discount'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      ...getColumnSearchProps('type')
    },
    {
      title: 'CountInStock',
      dataIndex: 'countInStock',
    },
    {
      title: 'Sold',
      dataIndex: 'sold',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => renderAction(record)
    },
  ];

  //=============== Display products ==================//

  const [ stateProduct, setStateProduct ] = useState({
    name: "",
    price: "",
    description: "",
    rating: "",
    discount: "",
    image: "",
    type: "",
    countInStock: "",
    sold: ""
  });

  const mutation = UseMutationHook((data) => {
    const { name, price, description, rating, discount, image, type, countInStock, sold } = data;
    const res = ProductService.createProduct({ name, price, description, rating, discount, image, type, countInStock, sold });
    return res
  });


  const fetchProductAll = async () => {
    const res = await ProductService.listProduct()
    return res
  }

  const { data, isLoading, isSuccess, isError } = mutation

  // Lấy ra ds sản phẩm
  const queryProducts = useQuery({
    queryKey: ['products'], 
    queryFn: fetchProductAll
  });

  const { isLoading: isLoadingProducts, data: products } = queryProducts


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
      discount: "",
      image: "",
      type: "",
      countInStock: "",
      sold: ""
    })
    form.resetFields()
  };

  //   form
  const onFinish = () => {
    mutation.mutate(stateProduct, {
      onSettled: () => {
        queryProducts.refetch()
      }
    })
  };

  const handleOnChange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setUploadImage(e.target.files[0])
    setStateProduct({
        ...stateProduct,
        image: e.target.files[0],
    });
  };

  // const handleChangeAvatar = ({ fileList }) => {
  //   if (fileList.length > 0) {
  //     const file = fileList[0];
  //     if (!file.url && !file.preview) {
  //       file.preview = URL.createObjectURL(file.originFileObj);
  //     }
  //     setStateProduct({
  //       ...stateProduct,
  //       image: file.preview,
  //     });
  //   }
  // };

  //================= EDIT PRODUCT ==================//

  const [ stateProductDetail, setStateProductDetail ] = useState({
    name: "",
    price: "",
    description: "",
    rating: "",
    discount: "",
    image: "",
    type: "",
    countInStock: "",
    sold: ""
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
      discount: "",
      image: "",
      type: "",
      countInStock: "",
      sold: ""
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
          discount: res.data.discount,
          image: res.data.image,
          type: res.data.type,
          countInStock: res.data.countInStock,
          sold: res.data.sold
        });
        form.setFieldsValue(res.data);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
    setIsLoadingUpdate(false)
  };

  useEffect(() => {
    if (rowSelected && isOpenDraw) {
      setIsLoadingUpdate(true)
      fetchGetDetailProduct(rowSelected)
    }
  }, [rowSelected, isOpenDraw])

  const handleDetailProduct = () => {
    setIsOpenDraw(true)
  }

  const handleChangeImageDetail = (e) => {
    setStateProductDetail({
      ...stateProductDetail,
      image: e.target.files[0],
    });
  };

  const handleOnChangeDetail = (e) => {
    setStateProductDetail({
      ...stateProductDetail,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnChangeDetailSelect = (value) => {
    setStateProductDetail({
      ...stateProductDetail,
      type: value,
    })
  };

  const onUpdateProduct = () => {
    mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateProductDetail}, {
      onSettled: () => {
        queryProducts.refetch()
      }
    })
  }

  // ============== DELETE ============= //

  const mutationDeleted = UseMutationHook((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct({ id, token });
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
        queryProducts.refetch()
      }
    })
  };
  

  // ============== DELETE-MANY============= //

  const mutationDeletedMany = UseMutationHook((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProduct({ access_token: token, data: ids });
    return res;
});

  const { data: dataDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
      message.success()
    }else if (isErrorDeletedMany) {
      message.error()
    }
  }, [isSuccessDeletedMany, isErrorDeletedMany])

  const handleDeletedManyProduct = (ids) => {
    mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => {
        queryProducts.refetch()
      }
    })
  };


  // fetch types product
  const fetchTypesProduct = async () => {
    const res = await ProductService.listTypes()
    return res.data
  }

  const { data: typesProduct } = useQuery({
    queryKey: ['type-product'], 
    queryFn: fetchTypesProduct, 
    config: {
      retry: 3,
      retryDelay: 1000,
      keePreviousData: true
    }
  });

  let options = [];

  if (typesProduct && Array.isArray(typesProduct)) {
    options = typesProduct.map((item) => ({
      value: item, 
      label: item, 
      name: 'type',
    }));
  }

  const handleOnChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value,
    });
  };


  

  return (
    <>
      <Divider>QUẢN LÝ SẢN PHẨM</Divider>

      <Button className="btn-add" onClick={showModal}>
        <PlusSquareOutlined className="icon-add" />
      </Button>

      <TableComponent handleDeletedMany={handleDeletedManyProduct} columns={columns} isLoading={isLoadingProducts} data={dataTable} 
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
              <Select
                placeholder="Type product"
                onChange={handleOnChangeSelect}
                allowClear
                name='type'
                options={options}
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
              label="Discount"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Please input your discount product!",
                },
              ]}
            >
              <Input
                value={stateProduct.discount}
                name="discount"
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
              <Select
                placeholder="Type product"
                onChange={handleOnChangeDetailSelect}
                allowClear
                name='type'
                options={options}
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
              label="Discount"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Please input your discount product!",
                },
              ]}
            >
              <Input
                value={stateProductDetail.discount}
                name="discount"
                onChange={handleOnChangeDetail}
              />
            </Form.Item>
            <Form.Item
              name="image"
              label="Hình ảnh"
              rules={[{ required: true, message: 'Vui lòng chọn hình ảnh!' }]}
            >
              <div className="upload-image">
                <input type="file" accept="image/*" icon={<UploadOutlined />} onChange={handleChangeImageDetail} />
                {stateProductDetail?.image && (
                  <img src={stateProductDetail?.image} alt="upload" style={{marginTop: '10px', width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px'}}/>
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
