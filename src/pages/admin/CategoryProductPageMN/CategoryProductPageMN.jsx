/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Divider, Button, Modal, Form, Input, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import TableComponent from "../../../components/TableComponent/TableComponent";
import * as CategoryService from "../../../services/CategoryService";
import { UseMutationHook } from "../../../hooks/useMutationHook";
import * as message from '../../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from "../../../components/DrawerComponent/DrawerComponent";
import { useSelector } from 'react-redux';
import Loading from "../../../components/LoadingComponent/Loading";

const CategoryProductPageMN = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const user = useSelector(state => state.user)
  const [ rowSelected, setRowSelected ] = useState('')
  const [ isOpenDraw, setIsOpenDraw ] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const renderAction = (record) => {
    return (
      <Space>
        <EditOutlined style={{color: 'orange', cursor: 'pointer', fontSize: '18px'}} onClick={handleDetailCategory}/>
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
      title: 'Mã code',
      dataIndex: 'slug'
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => renderAction(record)
    },
  ];

  //=============== Display categories ==================//

  const [ stateCategory, setStateCategory ] = useState({
    name: "",
    slug: "",
  });

  const mutation = UseMutationHook((data) => {
    const { name } = data;
    const res = CategoryService.createCategory({name});
    return res
  });


  const fetchCategories = async () => {
    const res = await CategoryService.listCategory()
    return res
  }

  const { data, isLoading, isSuccess, isError } = mutation

  // Lấy ra ds sản phẩm
  const queryCategory = useQuery({
    queryKey: ['categories'], 
    queryFn: fetchCategories
  });

  const { isLoading: isLoadingCategory, data: topics } = queryCategory


  const dataTable = topics && topics.data && topics.data.length && topics.data.map((topic) => {
    return {...topic, key: topic._id}
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
    setStateCategory({
      name: "",
      slug: "",
    })
    form.resetFields()
  };

  //   form
  const onFinish = () => {
    mutation.mutate(stateCategory, {
      onSettled: () => {
        queryCategory.refetch()
      }
    })
  };

  const handleOnChange = (e) => {
    setStateCategory({
      ...stateCategory,
      [e.target.name]: e.target.value,
    });
  };


  //================= EDIT CATEGORY ==================//

  const [ stateCategoryDetail, setStateCategoryDetail ] = useState({
    name: "",
  });

  const mutationUpdate = UseMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = CategoryService.updateCategory({ id, token, rests });
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
    setStateCategoryDetail({
      name: "",
    })
    form.resetFields()
  };


  const fetchGetDetailCategory = async (id) => {
    try {
      const res = await CategoryService.getDetailCategory(id);
      console.log('res', res)
      if (res?.data) {
        setStateCategoryDetail({
          name: res.data.name
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
      fetchGetDetailCategory(rowSelected)
    }
  }, [rowSelected, isOpenDraw])

  const handleDetailCategory = () => {
    setIsOpenDraw(true)
  }

  const handleOnChangeDetail = (e) => {
    setStateCategoryDetail({
      ...stateCategoryDetail,
      [e.target.name]: e.target.value,
    });
  };

  const onUpdateTopic = () => {
    mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateCategoryDetail}, {
      onSettled: () => {
        queryCategory.refetch(); 
      }
    })
  }
  
  

  // ============== DELETE ============= //

  const mutationDeleted = UseMutationHook((data) => {
    const { id, token } = data;
    const res = CategoryService.deleteCategory({ id, token });
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
        queryCategory.refetch()
      }
    })
  };
  

  // ============== DELETE-MANY============= //

  const mutationDeletedMany = UseMutationHook((data) => {
    const { token, ...ids } = data;
    const res = CategoryService.deleteManyCategory({ access_token: token, data: ids });
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

  const handleDeletedManyCategory = (ids) => {
    mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => {
        queryCategory.refetch()
      }
    })
  };


  return (
    <>
      <Divider>QUẢN LÝ DANH MỤC SẢN PHẨM</Divider>

      <Button className="btn-add" onClick={showModal}>
        Thêm mới danh mục <PlusOutlined className="icon-add" />
      </Button>

      <TableComponent handleDeletedMany={handleDeletedManyCategory} columns={columns} isLoading={isLoadingCategory} data={dataTable} 
        pagination={{ pageSize: 8, position: ['bottomCenter'], }}
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            },
          };
        }}
      />

      <Modal
        title="Tạo mới danh mục"
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
                value={stateCategory.name}
                name="name"
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

      <DrawerComponent title="Chi tiết danh mục" isOpen={isOpenDraw} onClose={() => setIsOpenDraw(false)} width='50%'>
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
            onFinish={onUpdateTopic}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name topic!",
                },
              ]}
            >
              <Input
                value={stateCategoryDetail['name']}
                name="name"
                onChange={handleOnChangeDetail}
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
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>

    </>
  );
};

export default CategoryProductPageMN;
