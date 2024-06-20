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

export const updateOrder = async ({id, access_token}) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL}/order/updateOrder/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        });
    return res.data;
};

export const deleteOrder = async ({id, access_token}) => {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL}/order/deleteOrder/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        });
    return res.data;
};

export const getAllOrder = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/order/getAllOrder`);
    return res.data;
};

export const getDailyRevenue = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/order/daily-revenue`);
    return response.data;
  };
  
  export const getMonthlyRevenue = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/order/monthly-revenue`);
    return response.data;
  };