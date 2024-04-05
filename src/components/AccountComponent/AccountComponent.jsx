import { UserOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import { Link } from "react-router-dom";
import * as UserService from '../../services/UserService'
import { useDispatch } from 'react-redux';
import { resetUser } from '../../redux/slides/userSlide';



const AccountComponent = (props) => {
  const {user} = props
  const dispatch = useDispatch()

  
  const handleLogout = async () => {
    await UserService.logoutUser()
    dispatch(resetUser())
  }

  const authMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/sing-in">Đăng nhập</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/sing-up">Đăng ký</Link>
      </Menu.Item>
    </Menu>
  );

  const userMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/">{user.name}</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link onClick={handleLogout}>Đăng xuất</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
        {(user.name !== '') ? <>
          <Dropdown overlay={userMenu} placement="bottom" column>
            <UserOutlined style={{fontSize: '1.3em'}}/>
          </Dropdown>
        </> : <>
          <Dropdown overlay={authMenu} placement="bottom" arrow>
            <UserOutlined style={{fontSize: '1.3em'}}/>
          </Dropdown>
        </>}
    </>
  );
};

export default AccountComponent;
