import axios from "axios"


export const loginGG = async () => {
    const res = await axios.get(`http://localhost:3001/api/v1/auth/google`, )
    return res.data
}