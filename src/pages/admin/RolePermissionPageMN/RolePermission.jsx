import React, { useEffect, useState } from "react";
import { Divider } from "antd";
import * as RoleService from "../../../services/RoleService";
import "./RolePermission.scss";
import { useSelector } from "react-redux";

const RolePermission = () => {
  const account = useSelector((state) => state.account);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState({});

  const fetchAccountAll = async () => {
    try {
      const res = await RoleService.listRole();
      if (res?.data) {
        setRoles(res.data);
        initializePermissions(res.data);
      }
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  useEffect(() => {
    fetchAccountAll();
  }, []);

  const initializePermissions = (roles) => {
    const initialPermissions = {};
    roles.forEach((role) => {
      initialPermissions[role._id] = role.permissions || [];
    });
    setPermissions(initialPermissions);
  };

  const handlePermissionChange = (e, roleId) => {
    const dataName = e.target.closest("tr").dataset.name;

    setPermissions((prevPermissions) => {
      const updatedPermissions = { ...prevPermissions };
      if (e.target.checked) {
        updatedPermissions[roleId].push(dataName);
      } else {
        updatedPermissions[roleId] = updatedPermissions[roleId].filter(
          (item) => item !== dataName
        );
      }
      return updatedPermissions;
    });
  };

  const updatePermissions = async () => {
    try {
      const permissionsArray = Object.entries(permissions).map(
        ([roleId, permissionList]) => ({
          id: roleId,
          permissions: permissionList,
        })
      );

      await RoleService.updateRole({
        token: account?.access_token,
        rests: permissionsArray,
      });
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  };

  return (
    <div className="page__role--permission">
      <Divider>QUẢN LÝ PHÂN QUYỀN</Divider>

      {roles && (
        <div data-records={roles}>
          <div className="text-right">
            <button
              type="submit"
              className="btn btn-primary mb-3"
              onClick={updatePermissions}
              style={{
                backgroundColor: '#007bff',
                borderColor: '#007bff',
                color: '#fff',
                padding: '10px 20px',
                fontSize: '16px',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s, border-color 0.3s',
                margin: '10px 0'
              }}
            >
              Cập nhật
            </button>
          </div>

          <table
            className="table table-hover table-sm table-permissions"
            style={{ width: "100%" }}
          >
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
              <tr data-name="id" style={{ display: 'none'}}>
                <td></td>
                {roles.map((item, index) => (
                  <td key={index}>
                    <input type="text" value={item._id} readOnly />
                  </td>
                ))}
              </tr>
              {/* ================================ */}
              <tr>
                <td
                  colSpan="4"
                  className="text-left"
                  style={{ background: "#dfdede", padding: '8px' }}
                >
                  <b>Quản lý chủ đề</b>
                </td>
              </tr>
              <tr data-name="topic_view">
                <td>Xem</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("topic_view") || false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              <tr data-name="topic_create">
                <td>Thêm mới</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("topic_create") || false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              <tr data-name="topic_edit">
                <td>Chỉnh sửa</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("topic_edit") || false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              <tr data-name="topic_delete">
                <td>Xoá</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("topic_delete") || false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              {/* ================================ */}
              <tr>
                <td
                  colSpan="4"
                  className="text-left"
                  style={{ background: "#dfdede", padding: '8px' }}
                >
                  <b>Quản lý bài viết</b>
                </td>
              </tr>
              <tr data-name="blog_view">
                <td>Xem</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("blog_view") || false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              <tr data-name="blog_create">
                <td>Thêm mới</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("blog_create") || false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              <tr data-name="blog_edit">
                <td>Chỉnh sửa</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("blog_edit") || false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              <tr data-name="blog_delete">
                <td>Xoá</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("blog_delete") || false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              {/* ================================ */}
              <tr>
                <td
                  colSpan="4"
                  className="text-left"
                  style={{ background: "#dfdede", padding: '8px' }}
                >
                  <b>Quản lý sản phẩm</b>
                </td>
              </tr>
              <tr data-name="product_view">
                <td>Xem</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("product_view") || false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              <tr data-name="product_create">
                <td>Thêm mới</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("product_create") ||
                        false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              <tr data-name="product_edit">
                <td>Chỉnh sửa</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("product_edit") || false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              <tr data-name="product_delete">
                <td>Xoá</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("product_delete") ||
                        false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              {/* ================================ */}
              <tr>
                <td
                  colSpan="4"
                  className="text-left"
                  style={{ background: "#dfdede", padding: '8px' }}
                >
                  <b>Quản lý đơn hàng</b>
                </td>
              </tr>
              <tr data-name="order_view">
                <td>Xem</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("order_view") || false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              <tr data-name="order_create">
                <td>Thêm mới</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("order_create") || false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              <tr data-name="order_edit">
                <td>Chỉnh sửa</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("order_edit") || false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              <tr data-name="order_delete">
                <td>Xoá</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("order_delete") || false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              {/* ================================ */}
              <tr>
                <td
                  colSpan="4"
                  className="text-left"
                  style={{ background: "#dfdede", padding: '8px' }}
                >
                  <b>Quản lý khách hàng</b>
                </td>
              </tr>
              <tr data-name="user_view">
                <td>Xem</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("user_view") || false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              <tr data-name="user_create">
                <td>Thêm mới</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("user_create") || false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              <tr data-name="user_edit">
                <td>Chỉnh sửa</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("user_edit") || false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              <tr data-name="user_delete">
                <td>Xoá</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("user_delete") || false
                      }
                      onChange={(e) => handlePermissionChange(e, item._id)}
                    />
                  </td>
                ))}
              </tr>
              <tr>
                <td
                  colSpan="4"
                  className="text-left"
                  style={{ background: "#dfdede", padding: '8px' }}
                >
                  <b>Quản lý nhóm quyền</b>
                </td>
              </tr>
              <tr data-name="account_view">
                <td>Xem</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("account_view") || false
                      }
                      onChange={(e) => handlePermissionChange(e)}
                    />
                  </td>
                ))}
              </tr>
              <tr data-name="account_create">
                <td>Thêm mới</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("account_create") ||
                        false
                      }
                      onChange={(e) => handlePermissionChange(e)}
                    />
                  </td>
                ))}
              </tr>
              <tr data-name="account_edit">
                <td>Chỉnh sửa</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("account_edit") || false
                      }
                      onChange={(e) => handlePermissionChange(e)}
                    />
                  </td>
                ))}
              </tr>

              <tr data-name="account_delete">
                <td>Xoá</td>
                {roles.map((item, index) => (
                  <td key={index} className="td_input">
                    <input
                      type="checkbox"
                      checked={
                        permissions[item._id]?.includes("account_delete") ||
                        false
                      }
                      onChange={(e) => handlePermissionChange(e)}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RolePermission;
