import axios from "axios"
import { axiosJWT } from "./UserService"


export const listCategory = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/categories`)
    return res.data
}


export const createCategory = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/categories/create`, data )
    return res.data
}

export const getDetailCategory = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/categories/detail/${id}`)
    return res.data
}

export const updateCategory = async ({id, access_token, rests}) => {
    try {
        const res = await axiosJWT.patch(
            `${process.env.REACT_APP_API_URL}/categories/update/${id}`,
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

export const deleteCategory = async ({id, access_token}) => {
    console.log('id', id)
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/categories/delete/${id}`, 
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        })
    return res.data
}

export const deleteManyCategory = async ({access_token, data}) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/categories/delete-many`, data, 
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        })
    return res.data
}
