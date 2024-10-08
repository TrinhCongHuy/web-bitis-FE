/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import {
  Divider,
  Button,
  Form,
  Input,
  Space,
  Popconfirm,
  Select,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TableComponent from "../../../components/TableComponent/TableComponent";
import * as ProductService from "../../../services/ProductService";
import * as CategoryService from "../../../services/CategoryService";
import { UseMutationHook } from "../../../hooks/useMutationHook";
import * as message from "../../../components/Message/Message";
import { useQuery } from "@tanstack/react-query";
import "./ProductPageMN.scss";
import DrawerComponent from "../../../components/DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import Loading from "../../../components/LoadingComponent/Loading";
const { TextArea } = Input;

const ProductPageMN = () => {
  const [form] = Form.useForm();
  const account = useSelector((state) => state.account);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDraw, setIsOpenDraw] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [uploadImageDetail, setUploadImageDetail] = useState([]);

  const renderAction = (record) => {
    return (
      <Space>
        <EditOutlined
          style={{ color: "orange", cursor: "pointer", fontSize: "18px" }}
          onClick={handleDetailProduct}
        />
        {columns.length >= 1 && (
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.key)}
          >
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer", fontSize: "18px" }}
            />
          </Popconfirm>
        )}
      </Space>
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
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
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
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
          color: filtered ? "#1677ff" : undefined,
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

  const handleUpdate = async (id) => {
    try {
        await ProductService.updateStatusProduct({id: id, access_token: account?.access_token})
        message.success('Cập nhật trạng thái đơn hàng thành công!')
    }catch(e) {
        message.error('Lỗi: ' + e)
    }
}

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: ">=500000",
          value: ">=500000",
        },
        {
          text: "<=500000",
          value: "<=500000",
        },
        {
          text: ">=1000000",
          value: ">=1000000",
        },
        {
          text: "<=1000000",
          value: "<=1000000",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=500000") {
          return record.price >= 500000;
        }
        if (value === "<=500000") {
          return record.price <= 500000;
        }
        if (value === ">=1000000") {
          return record.price >= 1000000;
        }
        if (value === "<=1000000") {
          return record.price <= 1000000;
        }
        return true;
      },
      filterMode: "tree",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: ">=3",
          value: ">=",
        },
        {
          text: "<=3",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return Number(record.rating) >= 3;
        }
        return Number(record.rating) <= 3;
      },
      filterMode: "tree",
    },
    {
      title: "Discount",
      dataIndex: "discount",
    },
    {
      title: "Type",
      dataIndex: "type",
      ...getColumnSearchProps("type"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status, record) => {
        return status === true ? (
            <Button onClick={() => handleUpdate(record._id)} type="primary">Hoạt động</Button>
        ) : (
            <Button onClick={() => handleUpdate(record._id)} danger>Dừng hoạt động</Button>
        );
    }
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => renderAction(record),
    },
  ];

  //=============== Display products ==================//
  const fetchProductAll = async () => {
    const res = await ProductService.listProduct();
    return res;
  };

  // Lấy ra ds sản phẩm
  const queryProducts = useQuery({
    queryKey: ["products"],
    queryFn: fetchProductAll,
  });

  const { isLoading: isLoadingProducts, data: products } = queryProducts;

  const dataTable =
    products?.data.length &&
    products?.data.map((product) => {
      return { ...product, key: product._id };
    });

  //================= EDIT PRODUCT ==================//

  const [stateProductDetail, setStateProductDetail] = useState({
    name: "",
    price: "",
    description: "",
    rating: "",
    discount: "",
    images: [],
    type: "",
    sizes: [],
    sold: "",
  });

  const mutationUpdate = UseMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct({ id, token, rests });
    return res;
  });

  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success("Cập nhật sản phẩm thành công!");
      handleCancelUpdate();
    } else if (isErrorUpdated) {
      message.error("Cập nhật sản phẩm thất bại!");
    }
  }, [isSuccessUpdated, isErrorUpdated]);

  const handleCancelUpdate = () => {
    setIsOpenDraw(false);
    setStateProductDetail({
      name: "",
      price: "",
      description: "",
      rating: "",
      discount: "",
      images: [],
      type: "",
      sizes: [],
      sold: "",
    });
    form.resetFields();
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
          images: res.data.images,
          type: res.data.type,
          sizes: res.data.sizes,
          sold: res.data.sold,
        });
        form.setFieldsValue({
          ...res.data,
          sizes: res.data.sizes.map(size => ({
            size: size.size,
            quantity: size.quantity
          }))
        });
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (rowSelected && isOpenDraw) {
      setIsLoadingUpdate(true);
      fetchGetDetailProduct(rowSelected);
    }
  }, [rowSelected, isOpenDraw]);

  const handleDetailProduct = () => {
    setIsOpenDraw(true);
  };

  const handleChangeImageDetail = (e) => {
    const filesArray = Array.from(e.target.files);
    setUploadImageDetail(filesArray);
    setStateProductDetail({
      ...stateProductDetail,
      images: filesArray,
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
    });
  };

  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: account?.access_token, ...stateProductDetail },
      {
        onSettled: () => {
          queryProducts.refetch();
        },
      }
    );
  };

  // ============== DELETE ============= //

  const mutationDeleted = UseMutationHook((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct({ id, token });
    return res;
  });

  const {
    data: dataDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDeleted;

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDeleted, isErrorDeleted]);

  const handleDelete = (key) => {
    mutationDeleted.mutate(
      { id: key, token: account?.access_token },
      {
        onSettled: () => {
          queryProducts.refetch();
        },
      }
    );
  };

  // ============== DELETE-MANY============= //

  const mutationDeletedMany = UseMutationHook((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProduct({
      access_token: token,
      data: ids,
    });
    return res;
  });

  const {
    data: dataDeletedMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeletedMany;

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success();
    } else if (isErrorDeletedMany) {
      message.error();
    }
  }, [isSuccessDeletedMany, isErrorDeletedMany]);

  const handleDeletedManyProduct = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: account?.access_token },
      {
        onSettled: () => {
          queryProducts.refetch();
        },
      }
    );
  };

  // fetch types product
  const fetchTypesProduct = async () => {
    const res = await CategoryService.listCategory();
    return res.data;
  };

  const { data: typesProduct } = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchTypesProduct,
    config: {
      retry: 3,
      retryDelay: 1000,
      keePreviousData: true,
    },
  });

  let options = [];

  if (typesProduct && Array.isArray(typesProduct)) {
    options = typesProduct.map((item) => ({
      value: item?.slug,
      label: item?.name,
      name: "type",
    }));
  }

  //=============== SIZES ===================//
  const handleSizeChange = (index, field, value) => {
    const newSizes = [...stateProductDetail.sizes];
    newSizes[index] = {
      ...newSizes[index],
      [field]: value,
    };
    setStateProductDetail({
      ...stateProductDetail,
      sizes: newSizes,
    });
  };

  const addSizeField = () => {
    setStateProductDetail({
      ...stateProductDetail,
      sizes: [...stateProductDetail.sizes, { size: "", quantity: "" }],
    });
  };

  const removeSizeField = (index) => {
    const newSizes = [...stateProductDetail.sizes];
    newSizes.splice(index, 1);
    setStateProductDetail({
      ...stateProductDetail,
      sizes: newSizes,
    });
  };

  return (
    <div className="page_product--mn">
      <Divider>DANH SÁCH SẢN PHẨM</Divider>

      <TableComponent
        handleDeletedMany={handleDeletedManyProduct}
        columns={columns}
        isLoading={isLoadingProducts}
        dataSource={dataTable}
        pagination={{ pageSize: 8, position: ["bottomCenter"] }}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setRowSelected(record._id);
            },
          };
        }}
      />

      <DrawerComponent
        title="Chi tiết sản phẩm"
        isOpen={isOpenDraw}
        onClose={() => setIsOpenDraw(false)}
        width="50%"
      >
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 24,
            }}
            layout="vertical"
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
                value={stateProductDetail["name"]}
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
                name="type"
                options={options}
              />
            </Form.Item>
            <Form.Item name="sizes">
            {stateProductDetail.sizes.map((size, index) => (
              <Space key={index} style={{ display: 'flex', marginBottom: 8, justifyContent: "center", alignItems: 'center'}} align="baseline">
                <Form.Item
                  label='Size'
                  name={['sizes', index, 'size']}
                >
                  <Input placeholder="Size" onChange={(e) => handleSizeChange(index, 'size', e.target.value)} />
                </Form.Item>
                
                <Form.Item
                  label='Số lượng trong kho'
                  name={['sizes', index, 'quantity']}
                >
                  <Input placeholder="Quantity" type="number" onChange={(e) => handleSizeChange(index, 'quantity', e.target.value)} />
                </Form.Item>
                <Form.Item
                  label='Số lượng đã bán'
                  name={['sizes', index, 'sold']}
                >
                  <Input placeholder="Sold" defaultValue={size.sold} type="number" disabled />
                </Form.Item>
                <Button type="dashed" style={{marginTop: '7px'}} onClick={() => removeSizeField(index)} icon={<DeleteOutlined />} />
              </Space>
            ))}
            <Button type="dashed" onClick={addSizeField} icon={<UploadOutlined />}>Add Size</Button>
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
            <Form.Item label="Description" name="description">
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
              name="images"
              label="Hình ảnh"
              rules={[{ required: true, message: "Vui lòng chọn hình ảnh!" }]}
            >
              <div className="upload-image">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  icon={<UploadOutlined />}
                  onChange={handleChangeImageDetail}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {stateProductDetail?.images && (
                    <div style={{ marginTop: "10px", marginRight: "20px" }}>
                      <label style={{ display: "block", marginBottom: "5px" }}>
                        Ảnh hiện tại:
                      </label>
                      <>
                        {stateProductDetail?.images.map((file, index) => (
                          <img
                            key={index}
                            src={file}
                            alt="upload"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "10px",
                              marginRight: "5px",
                            }}
                          />
                        ))}
                      </>
                    </div>
                  )}

                  {uploadImageDetail?.length > 0 && (
                    <div style={{ marginTop: "10px" }}>
                      <label style={{ display: "block", marginBottom: "5px" }}>
                        Ảnh mới:
                      </label>
                      {uploadImageDetail.map((file, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt="upload"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            marginRight: "5px",
                          }}
                        />
                      ))}
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
    </div>
  );
};

export default ProductPageMN;
