/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import * as UserService from '../../services/UserService'
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';



const AuthSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleGetDetailUser = async (id, token) => {
        const res = await UserService.getDetailUser(id, token)
        dispatch(updateUser({...res?.data, access_token: token}))
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const access_token = urlParams.get('access_token');

        if (access_token) {
            localStorage.setItem('access_token', access_token);
            const decoded = jwtDecode(access_token);

            if (decoded?.id) {
                handleGetDetailUser(decoded.id, access_token);
            }
            navigate('/');
        } else {
            navigate('/sing-in');
        }
    }, [navigate]);

    return <div>Loading...</div>;
};

export default AuthSuccess;
