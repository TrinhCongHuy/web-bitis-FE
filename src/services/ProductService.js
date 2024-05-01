import axios from "axios"
import { axiosJWT } from "./UserService"

export const listProduct = async (search, limit) => {
    let res = {}
    if (search?.length > 0) {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/products?filter=name&filter=${search}&limit=${limit}`)
    }else {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/products?limit=${limit}`)
    }
    return res.data
}

export const listProductType = async ( search, limit, type, page ) => {
    let res = {}
    if (type) {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/products?filter=type&filter=${type}&page=${page}`)
    }else if (search?.length > 0) {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/products?filter=name&filter=${search}&limit=${limit}&page=${page}`)
    }else {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/products?limit=${limit}&page=${page}`)
    }
    return res.data
    
}

// export const createProduct = async (data) => {
//     const res = await axios.post(`${process.env.REACT_APP_API_URL}/products/create`,data )
//     return res.data
// }

export const createProduct = async (formData) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/products/create`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const getDetailProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/products/detail/${id}`)
    return res.data
}

export const updateProduct = async ({id, access_token, rests}) => {
    try {
        const res = await axiosJWT.patch(
            `${process.env.REACT_APP_API_URL}/products/update/${id}`,
            rests,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
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

export const deleteProduct = async ({id, access_token}) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/products/delete/${id}`, 
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        })
    return res.data
}

export const deleteManyProduct = async ({access_token, data}) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/products/delete-many`, data, 
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        })
    return res.data
}

export const listTypes = async () => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/products/type-product`)
    return res.data
}