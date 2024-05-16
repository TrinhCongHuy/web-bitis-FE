import axios from "axios"
import { axiosJWT } from "./UserService"


export const listPost = async (limit) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts?limit=${limit}`)
    return res.data
}


export const createPost = async (formData) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/posts/create`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};


export const getDetailPost = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts/detail/${id}`)
    return res.data
}

export const updatePost = async ({id, token, rests}) => {
    try {
        const res = await axiosJWT.patch(
            `${process.env.REACT_APP_API_URL}/posts/update/${id}`,
            rests,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
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

export const updateCommentPost = async ({id, token, rests}) => {
    try {
        const res = await axiosJWT.patch(
            `${process.env.REACT_APP_API_URL}/posts/update-comment/${id}`,
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

export const deletePost = async ({id, access_token}) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/posts/delete/${id}`, 
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        })
    return res.data
}

export const deleteManyPost = async ({access_token, data}) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/posts/delete-many`, data, 
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        })
    return res.data
}
