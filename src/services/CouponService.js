import axios from "axios"
export const axiosJWT = axios.create()



export const listCoupon = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/coupon`, )
    return res.data
}

export const createCoupon = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/coupon/create-coupon`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data
}

export const getDetailCoupon = async ({id, access_token}) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/coupon/detail-coupon/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    return res.data 
}

export const updateCoupon = async ({id, access_token, rests}) => {
    try {
        const res = await axiosJWT.put(
            `${process.env.REACT_APP_API_URL}/coupon/update-coupon/${id}`,
            rests,
            {
                headers: {
                    token: `Bearer ${access_token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

export const deleteCoupon = async ({id, access_token}) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/coupon/delete-coupon/${id}`, 
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        })
    return res.data
}

export const deleteManyCoupon = async ({access_token, data}) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/coupon/delete-many`, data, 
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        })
    return res.data
}