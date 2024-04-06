import axios from "axios"

export const listProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/products`, )
    return res.data
}
