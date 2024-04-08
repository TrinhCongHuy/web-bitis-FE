import axios from "axios"
import { axiosJWT } from "./UserService"

export const listProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/products`, )
    return res.data
}

export const createProduct = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/products/create`,data )
    return res.data
}

export const getDetailProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/products/detail/${id}`)
    return res.data
}

export const updateProduct = async ({id, access_token, rests}) => {
    console.log('rests', rests)
    try {
        const res = await axiosJWT.patch(
            `${process.env.REACT_APP_API_URL}/products/update/${id}`,
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
