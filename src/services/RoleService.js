import axios from "axios"
export const axiosJWT = axios.create()



export const listRole = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/role/list-role`, )
    return res.data
}

export const createRole = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/role/create-role`, data)
    return res.data
}

export const getDetailRole = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/role/detail-role/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    return res.data 
}

export const updateRole = async ({token, rests}) => {
    console.log('rests', rests)
    try {
        const res = await axiosJWT.patch(
            `${process.env.REACT_APP_API_URL}/role/update-role`,
            rests,
            {
                headers: {
                    token: `Bearer ${token}`
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

export const deleteRole = async ({id, access_token}) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/role/delete-role/${id}`, 
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        })
    return res.data
}

export const deleteManyRole = async ({access_token, data}) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/role/delete-many`, data, 
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        })
    return res.data
}