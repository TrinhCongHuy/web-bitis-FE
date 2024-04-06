import axios from "axios"


export const axiosJWT = axios.create()

export const loginUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/sing-in`, data)
    return res.data
}

export const logoutUser = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/log-out`)
    return res.data
}

export const singUpUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/sing-up`, data)
    return res.data
}

export const getDetailUser = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/detail-user/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    return res.data 
}

export const refreshToken = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/refresh-token`, {
        withCredentials: true
    })
    return res.data 
}

export const updateUser = async (id, data) => {
    const res = await axios.patch(`${process.env.REACT_APP_API_URL}/update-user/${id}`, data)
    return res.data
}
