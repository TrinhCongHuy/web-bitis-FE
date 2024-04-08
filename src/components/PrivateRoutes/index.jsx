/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, Outlet } from 'react-router-dom';
import * as message from '../Message/message'
import { jwtDecode } from 'jwt-decode';

const PrivateRoutes = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                const decoded = await jwtDecode(token);
                setIsLogin(decoded.isAdmin);
            } else {
                setIsLogin(false);
                message.error("Vui lòng đăng nhập!");
                navigate('/admin');
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {isLogin ? (
                <Outlet />
            ) : (
                <Navigate to="/admin" />
            )}
        </>
    );
}

export default PrivateRoutes;
