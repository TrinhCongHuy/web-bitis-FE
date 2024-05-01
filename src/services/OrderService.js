import axios from "axios"


export const createOrder = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/order/create`, data);
    return res.data;
};

export const listProductOrder = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/order/listProductOrder/${id}`);
    return res.data;
};

export const orderDetail = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/order/orderDetail/${id}`);
    return res.data;
};

export const deleteOrder = async (id) => {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL}/order/deleteOrder/${id}`);
    return res.data;
};

export const getAllOrder = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/order/getAllOrder`);
    return res.data;
};