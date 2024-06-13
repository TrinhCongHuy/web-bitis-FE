/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import AllRoute from "./components/AllRoute";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import * as UserService from './services/UserService'
import * as AccountService from './services/AccountService'
import { useDispatch } from "react-redux";
import { updateUser } from "./redux/slides/userSlide";
import { updateAccount } from "./redux/slides/accountSlide";




function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const {decoded, storageData} = handleDecoded()
    if (decoded?.id) {
      handleGetDetailUser(decoded?.id, storageData)
      handleGetDetailAccount(decoded?.id, storageData)
    }
  }, [])

  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData }
  }

  // Add a request interceptor
  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date()
    const { decoded } = handleDecoded()

    if (decoded?.exp < currentTime.getTime() / 1000) {
      const data = await UserService.refreshToken()
      config.headers['token'] = `Bearer ${data?.access_token}`
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  const handleGetDetailUser = async (id, token) => {
    const res = await UserService.getDetailUser(id, token)
    dispatch(updateUser({...res?.data, access_token: token}))
  }

  const handleGetDetailAccount = async (id, token) => {
    const res = await AccountService.getDetailAccount(id, token)
    dispatch(updateAccount({...res?.data, access_token: token}))
  }
  
  return (
    <AllRoute />
  );
}

export default App;
