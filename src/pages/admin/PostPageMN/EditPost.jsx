/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Select } from "antd";
import { TableOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import * as PostService from "../../../services/PostService";
import * as TopicService from "../../../services/TopicService";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import MDEditor from "@uiw/react-md-editor";
import { decode } from 'html-entities';
import { htmlToText } from 'html-to-text';
const { Option } = Select;

const EditPost = () => {
  const user = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const [topics, setTopics] = useState([]);
  const [blogDetail, setBlogDetail] = useState({});
  const [content, setContent] = useState();
  const [uploadImage, setUploadImage] = useState();
  const { id } = useParams();

  useEffect(() => {
    fetchTopics();
    fetchBlogDetail(id);
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await TopicService.listTopic();
      setTopics(response.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const fetchBlogDetail = async (id) => {
    try {
      const response = await PostService.getDetailPost(id);
      const data = response.data
      setBlogDetail(data);

      // Giải mã các entities HTML và chuyển đổi HTML thành văn bản thuần
      const decodedContent = decode(data.content);
      const plainTextContent = htmlToText(decodedContent);

      form.setFieldsValue({
        title: response.data.title,
        topic: response.data.topic,
        image: response.data.image,
        content: plainTextContent,
        description: response.data.description,
      });

      setContent(plainTextContent);
    } catch (error) {
      console.error("Error fetching blog detail:", error);
    }
  };

  const handleImageChange = (e) => {
    setUploadImage(e.target.files[0]);
  };

  const handleEditorChange = (content) => {
    setContent(content);
  };

  const onFinish = async () => {
    const formData = new FormData();
    const fields = form.getFieldsValue();

    if (fields.title !== blogDetail.title) {
      formData.append("title", fields.title);
    }
    if (fields.topic !== blogDetail.topic) {
      formData.append("topic", fields.topic);
    }
    if (fields.description !== blogDetail.description) {
      formData.append("description", fields.description);
    }
    if (content !== blogDetail.content) {
      formData.append("content", content);
    }
    if (uploadImage !== blogDetail.image) {
      formData.append("image", uploadImage);
    }

    try {
      await PostService.updatePost({
        id: id,
        token: user?.access_token,
        rests: formData,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Card
        type="inner"
        title={
          <span>
            <TableOutlined /> Chỉnh sửa bài viết
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
            span: 20,
          }}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={11}>
              <Form.Item name="title" label="Tên bài đăng">
                <Input value={blogDetail.title} />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                name="topic"
                label="Chủ đề"
                initialValue={blogDetail.topic}
              >
                <Select placeholder="Chọn chủ đề">
                  {topics.map((topic, index) => (
                    <Option key={index} value={topic.name}>
                      {topic.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="image" label="Hình ảnh">
            <div className="upload-image">
              <input
                type="file"
                accept="image/*"
                icon={<UploadOutlined />}
                onChange={handleImageChange}
              />

              {blogDetail.image && (
                <div style={{ marginTop: "10px", marginRight: "20px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Ảnh hiện tại:
                  </label>
                  <img
                    src={blogDetail.image}
                    alt="upload"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              )}

              {uploadImage && (
                <div style={{ marginTop: "10px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Ảnh mới:
                  </label>
                  <img
                    src={URL.createObjectURL(uploadImage)}
                    alt="upload"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              )}
            </div>
          </Form.Item>

          <Form.Item name="description" label="Mô tả ngắn">
            <Input.TextArea value={blogDetail.description} rows={3} />
          </Form.Item>

          <Form.Item label="Nội dung">
            <MDEditor value={content} onChange={handleEditorChange} />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 6,
              span: 16,
            }}
            style={{ display: "flex", marginTop: "20px" }}
          >
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditPost;
