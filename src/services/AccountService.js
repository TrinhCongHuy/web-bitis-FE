import axios from "axios"
export const axiosJWT = axios.create()



export const listAccount = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/account/list-account`, )
    return res.data
}

export const getAccount = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/account/${id}`, )
    return res.data
}

export const loginAccount = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/account/sing-in`, data)
    return res.data
}

export const createAccount = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/account/create-account`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data
}


export const logoutAccount = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/account/log-out`)
    return res.data
}


export const getDetailAccount = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/account/detail-account/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    return res.data 
}

export const refreshToken = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/account/refresh-token`, {
        withCredentials: true
    })
    return res.data 
}

export const updateAccount = async ({id, access_token, rests}) => {
    try {
        const res = await axiosJWT.patch(
            `${process.env.REACT_APP_API_URL}/account/update-account/${id}`,
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

export const deleteAccount = async ({id, access_token}) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/account/delete-account/${id}`, 
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        })
    return res.data
}

export const deleteManyAccount = async ({access_token, data}) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/account/delete-many`, data, 
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        })
    return res.data
}