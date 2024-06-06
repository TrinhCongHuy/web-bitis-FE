/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, Rate, Form, Input, List, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import * as ProductService from "../../services/ProductService";
import * as UserService from "../../services/UserService";
import "./CommentsProduct.scss";
import moment from "moment"

const CommentsProduct = ({ currentUserId, idProduct }) => {
  const user = useSelector((state) => state.user);
  const token = user?.access_token;
  const [uploadImages, setUploadImages] = useState([]);
  // const [contentComment, setContentComment] = useState('')
  const [stateComment, setStateComment] = useState({
    content: "",
    userId: "",
    rating: 0,
    images: [],
    createdAt: ""
  });
  const [comments, setComments] = useState([]);
  const [infoProduct, setInfoProduct] = useState();
  const [form] = Form.useForm();

  useEffect(() => {
    setStateComment((prevState) => ({
      ...prevState,
      userId: currentUserId,
    }));
  }, [currentUserId]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await ProductService.getDetailProduct(idProduct);
        setInfoProduct(product?.data);

        const commentsWithUserDetails = await Promise.all(
          product?.data?.comments.map(async (comment) => {
            const user = await UserService.getDetailUser(comment.userId, token);
            return { ...comment, user: user?.data };
          })
        );

        setComments(commentsWithUserDetails);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, [idProduct, comments]);

  const onFinish = async () => {
    try {
      const res = await ProductService.addCommentProduct({
        id: idProduct,
        access_token: token,
        rests: stateComment,
      });

      const commentsWithUserDetails = await Promise.all(
        res.comments.map(async (comment) => {
          const user = await UserService.getDetailUser({
            id: comment.userId,
            access_token: token,
          });
          return { ...comment, user };
        })
      );

      setComments(commentsWithUserDetails);
    } catch (e) {
      console.log(e);
    }
    form.resetFields();
    setUploadImages([]);
  };

  const handleOnChange = (e) => {
    setStateComment({
      ...stateComment,
      [e.target.name]: e.target.value,
    });
  };

  const handleRatingChange = (value) => {
    setStateComment({
      ...stateComment,
      rating: value,
    });
  };

  const handleImageChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setUploadImages(filesArray);
    setStateComment({
      ...stateComment,
      images: filesArray,
    });
  };

  // const buttonLabels = [
  //   'Chất lượng quá',
  //   'Thông tin rõ ràng hơn',
  //   'Nhân viên nhiệt tình',
  //   'Quy trình nhanh hơn',
  //   'Đóng gói rất đẹp'
  // ];

  // const handleContentComment = (text) => {
  //   setContentComment(text);
  // };


  return (
    <div style={{ left: "auto", width: "100%" }}>
      <Row style={{ gap: "2em" }}>
        <Col span={15}>
          <h2>
            {comments?.length} đánh giá cho {infoProduct?.name}
          </h2>
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              pageSize: 5,
            }}
            dataSource={comments}
            renderItem={(comment) => (
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  padding: "10px 0",
                  borderBottom: "1px solid #eae6e6",
                }}
              >
                <img
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                  src={
                    comment.user?.avatar ||
                    "https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-cartoon-man-avatar-vector-ilustration-png-image_6111064.png"
                  }
                  alt="avatar"
                />
                <div className="content" style={{ lineHeight: "20px" }}>
                  <p style={{ color: "grey", fontSize: "12px", margin: "0" }}>
                    {comment.user?.name} / {moment(comment?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                  </p>

                  <Rate
                    disabled
                    defaultValue={comment.rating}
                    style={{ fontSize: "15px" }}
                    className="tight-rate"
                  />

                  <p style={{ margin: "5px 0" }}>{comment.content}</p>

                  {comment?.images && 
                    comment?.images.map((img, index) => (
                      <img key={index} src={img} alt="product" style={{width: '100px', height: "100px", objectFit: "cover", borderRadius: "10px", marginRight: "5px"}}/>
                    ))
                  }
                </div>
              </div>
            )}
          />
        </Col>
        <Col span={8}>
          <div className="review-form-container">
            <div className="review-form-title">Đánh giá sản phẩm</div>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="rating"
                label="Mức độ đánh giá"
              >
                <Rate onChange={handleRatingChange} />
              </Form.Item>
              <Form.Item
                name="content"
                label="Đánh giá"
              >
                <Input.TextArea
                  rows={4}
                  onChange={handleOnChange}
                  name="content"
                />
              </Form.Item>
              <Form.Item name="images" label="Hình ảnh">
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
                        margin: "5px",
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
                  Gửi đánh giá
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CommentsProduct;
