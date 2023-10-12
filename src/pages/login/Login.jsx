import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import "./login.scss";
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: undefined,
        password: undefined
    });

    const { loading, error, dispatch } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await axios.post("auth/login", credentials);
            if(res.data.isAdmin){
              dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
              navigate("/");
            }else{
              dispatch({ type: "LOGIN_FAILURE", payload: {massage:"You are not allowed!"} })
            }
        } catch (err) {
            dispatch({ type: "LOGIN_FAILURE", payload: err.response.data })
        }
    }

    return (
        <div className='login'>
            <div className='lcontainer'>
                <input
                    type='text'
                    placeholder='email'
                    id='email'
                    onChange={handleChange}
                    className='lInput'
                />
                <input
                    type='password'
                    placeholder='Password'
                    id='password'
                    onChange={handleChange}
                    className='lInput'
                />
                <button 
                className='lButton' 
                onClick={handleClick}
                disabled={loading}
                >Login</button>
                {error && <span>{error.message}</span>}
            </div>
        </div>
    )
}

export default Login;