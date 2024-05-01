import axios from "axios"
import { axiosJWT } from "./UserService"


export const listTopic = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/topics`)
    return res.data
}


export const createTopic = async (data) => {
    console.log('data', data)
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/topics/create`, data )
    return res.data
}

export const getDetailTopic = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/topics/detail/${id}`)
    return res.data
}

export const updateTopic = async ({id, access_token, rests}) => {
    try {
        const res = await axiosJWT.patch(
            `${process.env.REACT_APP_API_URL}/topics/update/${id}`,
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

export const deleteTopic = async ({id, access_token}) => {
    console.log('id', id)
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/topics/delete/${id}`, 
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        })
    return res.data
}

export const deleteManyTopic = async ({access_token, data}) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/topics/delete-many`, data, 
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        })
    return res.data
}
