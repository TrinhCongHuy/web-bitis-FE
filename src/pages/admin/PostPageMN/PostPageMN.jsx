/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Divider, Button, Modal, Form, Input, Space, Popconfirm, Upload } from "antd";
import { PlusSquareOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import TableComponent from "../../../components/TableComponent/TableComponent";
import * as PostService from "../../../services/PostService";
import { UseMutationHook } from "../../../hooks/useMutationHook";
import * as message from '../../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom';
import DrawerComponent from "../../../components/DrawerComponent/DrawerComponent";
import { useSelector } from 'react-redux';
import Loading from "../../../components/LoadingComponent/Loading";

const PostPageMN = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const user = useSelector(state => state.user)
  const [ rowSelected, setRowSelected ] = useState('')
  const [ isOpenDraw, setIsOpenDraw ] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const navigate = useNavigate();

  const renderAction = (record) => {
    return (
      <Space>
        <EditOutlined style={{color: 'orange', cursor: 'pointer', fontSize: '18px'}} onClick={() => handleEditPost(record.key)}/>
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
      title: 'Tên bài viết',
      dataIndex: 'title',
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.title.length - b.title.length,
      ...getColumnSearchProps('title')
    },
    {
      title: 'Chủ đề',
      dataIndex: 'topic'
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      render: (image) => (
        <img src={image} alt="Hình ảnh" style={{ width: 60, height: 60 }} />
      )
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => renderAction(record)
    },
  ];

  //=============== Display products ==================//

  const [ statePost, setStatePost ] = useState({
    title: "",
    topic: "",
    image: ""
  });

  const mutation = UseMutationHook((data) => {
    const { title, topic, image } = data;
    const res = PostService.createPost({ title, topic, image });
    return res
  });


  const fetchPostAll = async () => {
    const res = await PostService.listPost()
    return res
  }

  const { data, isLoading, isSuccess, isError } = mutation

  // Lấy ra ds sản phẩm
  const queryPosts = useQuery({
    queryKey: ['posts'], 
    queryFn: fetchPostAll
  });

  const { isLoading: isLoadingPosts, data: posts } = queryPosts


  const dataTable = posts && posts.data && posts.data.length && posts.data.map((post) => {
    return {...post, key: post._id}
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
    setStatePost({
      name: "",
      slug: "",
    })
    form.resetFields()
  };

  //   form
  const onFinish = () => {
    mutation.mutate(statePost, {
      onSettled: () => {
        queryPosts.refetch()
      }
    })
  };

  const handleOnChange = (e) => {
    setStatePost({
      ...statePost,
      [e.target.name]: e.target.value,
    });
  };


  //================= EDIT POST ==================//

  const handleEditPost = (id) => {
    navigate(`/system/admin/edit-blog/${id}`)
  }

  // ============== DELETE ============= //

  const mutationDeleted = UseMutationHook((data) => {
    const { id, token } = data;
    const res = PostService.deletePost({ id, token });
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
        queryPosts.refetch()
      }
    })
  };
  

  // ============== DELETE-MANY============= //

  const mutationDeletedMany = UseMutationHook((data) => {
    const { token, ...ids } = data;
    const res = PostService.deleteManyPost({ access_token: token, data: ids });
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

  const handleDeletedManyPost = (ids) => {
    mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => {
        queryPosts.refetch()
      }
    })
  };

  return (
    <>
      <Divider>QUẢN LÝ BÀI VIẾT</Divider>

      <TableComponent handleDeletedMany={handleDeletedManyPost} columns={columns} isLoading={isLoadingPosts} data={dataTable} 
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            },
          };
        }}
      />

      <Modal
        title="Tạo mới bài viết"
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
              name="title"
              label="Tên bài đăng"
              rules={[{ required: true, message: "Vui lòng nhập tên bài đăng!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="topic"
              label="Chủ đề"
              rules={[{ required: true, message: "Vui lòng chọn chủ đề!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả ngắn"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả ngắn!" },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="content"
              label="Nội dung"
              rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="Hình ảnh">
              {/* <Upload
                accept="image/*"
                listType="picture-card"
                onChange={handleImageChange}
              >
                {imageList.length >= 8 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload> */}
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
    </>
  )
}

export default PostPageMN