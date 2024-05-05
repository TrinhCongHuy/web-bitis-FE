import axios from "axios"


export const axiosJWT = axios.create()

export const listUser = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/list-user`, )
    return res.data
}

export const getUser = async (id) => {
    let res
    if (id) {
        res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/${id}`, )
        return res.data
    }
    
}

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

export const updateUser = async ({id, access_token, rests}) => {
    try {
        const res = await axiosJWT.patch(
            `${process.env.REACT_APP_API_URL}/update-user/${id}`,
            rests,
            {
                headers: {
                    token: `Bearer ${access_token}`
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

export const deleteUser = async ({id, access_token}) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/delete-user/${id}`, 
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        })
    return res.data
}

export const deleteManyUser = async ({access_token, data}) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/delete-many`, data, 
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        })
    return res.data
}