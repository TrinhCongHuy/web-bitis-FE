import React, { useEffect, useState } from 'react';
import { Divider } from "antd";
import * as RoleService from '../../../services/RoleService';
import './RolePermission.scss'
import { useSelector } from 'react-redux';



const RolePermission = () => {
    const account = useSelector((state) => state.account)
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);

  
    const fetchAccountAll = async () => {
      try {
        const res = await RoleService.listRole();
        if (res?.data) {
          setRoles(res.data);
          initializePermissions(res.data);
        }
      } catch (error) {
        console.error('Error fetching account data:', error);
      }
    };
  
    useEffect(() => {
      fetchAccountAll();
    }, []);
  
    const initializePermissions = (roles) => {
        const initialPermissions = {};
        roles.forEach(role => {
            initialPermissions[role._id] = [];
        });
        setPermissions(initialPermissions);
    };
  
   

    const handlePermissionChange = (e) => {
        const dataName = e.target.closest('tr').dataset.name; 

        const rowIndex = e.target.closest('td').cellIndex - 1;
        const roleId = roles[rowIndex]._id;

        setPermissions(prevPermissions => {
            const updatedPermissions = { ...prevPermissions };
            if (!updatedPermissions[roleId].includes(dataName)) {
                updatedPermissions[roleId].push(dataName);
            } else {
                updatedPermissions[roleId] = updatedPermissions[roleId].filter(item => item !== dataName);
            }
            return updatedPermissions;
        });
    };
  
    const updatePermissions = async () => {
        try {
            const permissionsArray = Object.entries(permissions).map(([roleId, permissionList]) => ({
                id: roleId,
                permissions: permissionList
            }));

            console.log('permissionsArray', permissionsArray)

            await RoleService.updateRole({token: account?.access_token, rests: permissionsArray});
        } catch (error) {
            console.error('Error updating permissions:', error);
        }
    };

    console.log('roles', roles)

    return (
        <>
            <Divider>Quản lý phân quyền</Divider>

            {roles && (
                <div data-records={roles}>
                    <div className="text-right">
                        <button
                            type="submit"
                            className="btn btn-primary mb-3"
                            onClick={updatePermissions}
                        >
                            Cập nhật
                        </button>
                    </div>

                    <table className="table table-hover table-sm table-permissions" style={{width: '100%'}}>
                        <thead>
                            <tr>
                                <th>Tính năng</th>
                                {roles.map((item, index) => (
                                    <th key={index} className="text-center">
                                        {item.title}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {/* <tr data-name="id">
                                <td></td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input
                                            type="text"
                                            value={item._id}
                                        />
                                    </td>
                                ))}
                            </tr> */}
                            {/* ================================ */}
                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-left"
                                    style={{ background: '#999'}}
                                >
                                    <b>Quản lý chủ đề</b>
                                </td>
                            </tr>
                            <tr data-name="topic_view">
                                <td>Xem</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("topic_view")} 
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr data-name="topic_create">
                                <td>Thêm mới</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("topic_create")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr data-name="topic_edit">
                                <td>Chỉnh sửa</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("topic_edit")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr data-name="topic_delete">
                                <td>Xoá</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("topic_delete")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            {/* ================================ */}
                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-left"
                                    style={{ background: '#999' }}
                                >
                                    <b>Quản lý bài viết</b>
                                </td>
                            </tr>
                            <tr data-name="blog_view">
                                <td>Xem</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("blog_view")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr data-name="blog_create">
                                <td>Thêm mới</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("blog_create")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr data-name="blog_edit">
                                <td>Chỉnh sửa</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("blog_edit")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr data-name="blog_delete">
                                <td>Xoá</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("blog_delete")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            {/* ================================ */}
                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-left"
                                    style={{ background: '#999' }}
                                >
                                    <b>Quản lý sản phẩm</b>
                                </td>
                            </tr>
                            <tr data-name="product_view">
                                <td>Xem</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("product_view")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr data-name="product_create">
                                <td>Thêm mới</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("product_create")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr data-name="product_edit">
                                <td>Chỉnh sửa</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("product_edit")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr data-name="product_delete">
                                <td>Xoá</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("product_delete")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            {/* ================================ */}
                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-left"
                                    style={{ background: '#999' }}
                                >
                                    <b>Quản lý đơn hàng</b>
                                </td>
                            </tr>
                            <tr data-name="order_view">
                                <td>Xem</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("order_view")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr data-name="order_create">
                                <td>Thêm mới</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("order_create")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr data-name="order_edit">
                                <td>Chỉnh sửa</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("order_edit")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr data-name="order_delete">
                                <td>Xoá</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("order_delete")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            {/* ================================ */}
                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-left"
                                    style={{ background: '#999' }}
                                >
                                    <b>Quản lý khách hàng</b>
                                </td>
                            </tr>
                            <tr data-name="user_view">
                                <td>Xem</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("user_view")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr data-name="user_create">
                                <td>Thêm mới</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("user_create")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr data-name="user_edit">
                                <td>Chỉnh sửa</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("user_edit")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr data-name="user_delete">
                                <td>Xoá</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("user_delete")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            {/* ================================ */}
                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-left"
                                    style={{ background: '#999' }}
                                >
                                    <b>Quản lý nhóm quyền</b>
                                </td>
                            </tr>
                            <tr data-name="account_view">
                                <td>Xem</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("account_view")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr data-name="account_create">
                                <td>Thêm mới</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("account_create")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr data-name="account_edit">
                                <td>Chỉnh sửa</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("account_edit")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>

                            <tr data-name="account_delete">
                                <td>Xoá</td>
                                {roles.map((item, index) => (
                                    <td key={index}>
                                        <input type="checkbox" 
                                            checked={item.permissions?.includes("account_delete")}
                                            onChange={(e) => handlePermissionChange(e)} 
                                        />
                                    </td>
                                ))}
                            </tr>

                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default RolePermission;
