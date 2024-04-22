import axios from "axios"
import { axiosJWT } from "./UserService"


export const createProductCart = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/carts/addProduct`, data);
    return res.data;
};

export const listProductCart = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/carts/listProductCart/${id}`);
    return res.data;
};

export const updateProductQuantityInCart = async (id, newQuantity, token) => {
    try {
        const res = await axiosJWT.patch(
            `${process.env.REACT_APP_API_URL}/carts/updateProductQuantity/${id}`,
            { quantity: newQuantity },
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


export const deleteProductCart = async (id, token) => {
    try {
        const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/carts/deleteProductCart/${id}`,
        {
            headers: {
                token: `Bearer ${token}`
            }
        })
        return res.data
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
}

export const deleteManyProductCart = async (data, token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/carts/delete-many`, data,
    {
        headers: {
            token: `Bearer ${token}`
        }
    })
    return res.data
}