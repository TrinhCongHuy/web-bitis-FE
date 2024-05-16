import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Row, Select } from 'antd';
import { TableOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input } from "antd";
import './AddPost.scss';
import { Editor } from '@tinymce/tinymce-react';
import * as PostService from "../../../services/PostService";
import * as TopicService from '../../../services/TopicService'; 
const { Option } = Select;

const AddPost = () => {
  const [form] = Form.useForm();
  const editorRef = useRef(null);
  const [content, setContent] = useState('')
  const [uploadImage, setUploadImage] = useState();
  const [topics, setTopics] = useState([]);


  const handleImageChange = (e) => {
    setUploadImage(e.target.files[0])
  };

  const handleEditorChange = (content) => {
    setContent(content);
  };

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    try {
      const response = await TopicService.listTopic(); 
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };


  const onFinish = async () => {
    const formData = new FormData();
    formData.append('title', form.getFieldValue('title'));
    formData.append('topic', form.getFieldValue('topic'));
    formData.append('description', form.getFieldValue('description'));
    formData.append('content', content);
    formData.append('image', uploadImage);

    try {
      await PostService.createPost(formData)
    } catch (e) {
      console.log(e)
    }
  };

  return (
    <div>
      <Card type="inner" title={<span><TableOutlined /> Thêm mới bài viết</span>}>
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
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={16}> 
            <Col span={11}>
              <Form.Item
                name="title"
                label="Tên bài đăng"
                rules={[{ required: true, message: "Vui lòng nhập tên bài đăng!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                name="topic"
                label="Chủ đề"
                rules={[{ required: true, message: "Vui lòng chọn chủ đề!" }]}
                initialValue={topics.length > 0 ? topics[0].id : undefined}
              >
                <Select placeholder="Chọn chủ đề">
                  {topics.map((topic, index) => (
                    <Option key={index} value={topic.name}>{topic.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

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
            name="description"
            label="Mô tả ngắn"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả ngắn!" },
            ]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          
          <Row>
            <Col span={20}>
              <Editor
                apiKey='h5xj5gn2twzb133op2lqbuu290r3zjje2wl1ellqshxkkny5'
                onInit={(_evt, editor) => editorRef.current = editor}
                init={{
                  plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
                  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                  tinycomments_mode: 'embedded',
                  tinycomments_author: 'Author name',
                  ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
                  branding: false
                }}
                onEditorChange={handleEditorChange}
                initialValue=""
              />
            </Col>
          </Row>
          
          <Form.Item
            wrapperCol={{
              offset: 6,
              span: 16,
            }}
            style={{ display: "flex", marginTop: '20px' }}
          >
            <Button type="primary" htmlType="submit">
              Tạo mới
            </Button>
          </Form.Item>

        </Form>

      </Card>
    </div>
  )
}

export default AddPost;
