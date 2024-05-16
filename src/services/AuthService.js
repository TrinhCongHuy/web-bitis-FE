import axios from "axios"


export const loginGG = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/google`, )
    console.log('res',res)
    return res.data
}