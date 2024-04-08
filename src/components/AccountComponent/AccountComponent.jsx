import { UserOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Popover} from "antd";
import { Link } from "react-router-dom";
import * as UserService from '../../services/UserService'
import { useDispatch } from 'react-redux';
import { resetUser } from '../../redux/slides/userSlide';
import { useNavigate } from "react-router-dom";




const AccountComponent = (props) => {
  const {user} = props
  const dispatch = useDispatch()
  const navigate = useNavigate()

  
  const handleLogout = async () => {
    // localStorage.removeItem('access_token');
    await UserService.logoutUser()
    dispatch(resetUser())
    navigate('/')
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
    <div>
      <div>
        <Link style={{color: '#333'}} to="/profile">{user.name}</Link>
      </div>
      <div>
        <Link style={{color: '#333'}} onClick={handleLogout}>Đăng xuất</Link>
      </div>
    </div>
  );

  return (
    <>
        {(user.name !== '') ? <>
          <Popover placement="bottom" content={userMenu}>
            <UserOutlined style={{fontSize: '1.3em'}}/>
          </Popover>
        </> : <>
          <Dropdown overlay={authMenu} placement="bottom" arrow>
            <UserOutlined style={{fontSize: '1.3em'}}/>
          </Dropdown>
        </>}
    </>
  );
};

export default AccountComponent;
