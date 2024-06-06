/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Select,
} from "antd";
import {
    DeleteOutlined,
    TableOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import * as ProductService from "../../../services/ProductService";
import * as CategoryService from "../../../services/CategoryService";
import { UseMutationHook } from "../../../hooks/useMutationHook";
import * as message from '../../../components/Message/Message'
import { useQuery } from "@tanstack/react-query";
import "./ProductPageMN.scss";
const { TextArea } = Input;


const AddProduct = () => {
    const [form] = Form.useForm();
    const [uploadImages, setUploadImages] = useState([]);

    const [stateProduct, setStateProduct] = useState({
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

    const mutation = UseMutationHook((data) => {
        const { name, price, description, rating, discount, images, type, sizes, sold } = data;
        const res = ProductService.createProduct({ name, price, description, rating, discount, images, type, sizes, sold });
        return res;
    });

    const { data, isSuccess, isError } = mutation

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
          message.success("Tạo mới sản phẩm thành công!")
          form.resetFields()
          setUploadImages([]);
        }else if (isError) {
          message.error("Lỗi tạo mới sản phẩm!")
        }
      }, [isSuccess, isError])

    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        const filesArray = Array.from(e.target.files);
        setUploadImages(filesArray);
        setStateProduct({
        ...stateProduct,
        images: filesArray,
        });
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

    const handleOnChangeSelect = (value) => {
        setStateProduct({
        ...stateProduct,
        type: value,
        });
    };

    // Form submit
    const onFinish = (values) => {
        setStateProduct((prev) => ({
            ...prev,
            sizes: values.sizes,
        }));
        mutation.mutate({ ...stateProduct, sizes: values.sizes });
    };

    console.log('stateProduct', stateProduct)

    return (
        <Card
            type="inner"
            title={
                <span>
                <TableOutlined /> Thêm mới sản phẩm
                </span>
            }
        >
        <Form
            form={form}
            name="basic"
            labelCol={{
            span: 6,
            }}
            wrapperCol={{
            span: 24,
            }}
            style={{
                maxWidth: 600,
            }}
            layout="vertical"
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
                name="type"
                options={options}
            />
            </Form.Item>
            <Form.List
            name="sizes"
            rules={[
                {
                validator: async (_, sizes) => {
                    if (!sizes || sizes.length < 1) {
                    return Promise.reject(
                        new Error("Please add at least one size!")
                    );
                    }
                },
                },
            ]}
            >
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <div
                            key={key}
                            style={{
                                display: "flex",
                                marginBottom: 8,
                            }}
                        >
                        <Form.Item
                            {...restField}
                            name={[name, "size"]}
                            fieldKey={[fieldKey, "size"]}
                            rules={[{ required: true, message: "Missing size" }]}
                            style={{ flex: 1, marginRight: "8px"}}
                        >
                            <Input placeholder="Size" />
                        </Form.Item>
                        <Form.Item
                            {...restField}
                            name={[name, "quantity"]}
                            fieldKey={[fieldKey, "quantity"]}
                            rules={[{ required: true, message: "Missing quantity" }]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="Quantity" />
                        </Form.Item>
                        <Button type="link" onClick={() => remove(name)}>
                            <DeleteOutlined style={{color: "red"}}/>
                        </Button>
                        </div>
                    ))}
                    <Form.Item>
                        <Button type="dashed" onClick={() => add()} block>
                        Add Size
                        </Button>
                    </Form.Item>
                </>
            )}
            </Form.List>
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
            <Form.Item label="Description" name="description">
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
                    onChange={handleImageChange}
                />
                {uploadImages.map((file, index) => (
                    <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt="upload"
                        style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            margin: "5px"
                        }}
                    />
                ))}
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
        </Card>
    );
};

export default AddProduct;
