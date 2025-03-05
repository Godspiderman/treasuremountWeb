"use client";
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess ,loginFailure } from '../../redux/slices/authSlice';
import Link from "next/link";
import './Login.scss';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { startLoading, stopLoading } from '@/app/redux/slices/loadingSlice';
import axios from 'axios';

const Login = () => {
  const router = useRouter();

  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");


  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phoneNumber);
  };

  const validateForm = () => {
    let isValid = true;
    setIdentifierError("");
    setPasswordError("");

    if (identifier.trim() === "") {
      setIdentifierError("Email or phone number is required.");
      isValid = false;
    } else if (validateEmail(identifier)) {
      // Valid email, no action needed
    } else if (validatePhoneNumber(identifier)) {
      // Valid phone number, no action needed
    } else {
      setIdentifierError("Please enter a valid email or 10-digit phone number.");
      isValid = false;
    }

    if (password.trim() === "") {
      setPasswordError("Password is required.");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; 
    }
    console.log(identifier,password);

    try {
      console.log("dw");
      
      const response = await axios.post(
        'http://localhost:8080/api/login-api/login',
        {
          mobileNumber: identifier, 
          password:password
        }
      );

      if (response.status === 200) {
        console.log(response.data);

        const userData = response.data;
        dispatch(loginSuccess(userData));
        router.push('/');
      } else {
        handleLoginError(response.data);
      }
  
    } catch (error) {
      dispatch(loginFailure());
      handleLoginError(error.response ? error.response.data : {});
      console.error("Error during login:", error);
    }
  };


  const handleLoginError = (errorData) => {
    if (errorData.error) {
      if (errorData.error.includes("password") && !errorData.error.includes("username")) {
        setPasswordError("Enter correct password.");
      } else if (errorData.error.includes("username")) {
        setIdentifierError("Invalid email or phone number.");
      }
      if (errorData.error.includes("password")) {
        setPasswordError("Invalid password.");
      }
    } else {
      setIdentifierError("Invalid email or phone number.");
      setPasswordError("Invalid password.");
    }
  };

  return (
    <div className='login'>
      <div className='login-container'>

        <div className='login-img'>
          <div className='login-img-box'>
            {/* <img src={require('../../assets/img/Laptop-service.jpg')} alt='login-page' /> */}
            <img src="/image/login.png" alt='login-page' /> 
           
          </div>
        </div>

        <div className='login-form'>
          <div className='login-form-content'>
            <div className='login-form-head'>
           
            <h2> Welcome Back !</h2>
            <h2>Treasuremount</h2>
            </div>
            <form onSubmit={handleLogin} className='login-form-forms'>
              <div className='login-form1'>
                <label > Email <span className='red-mark'>*</span></label>
                <input
                  type="text"
                  value={identifier}
                  className={identifierError ? "input-error" : ""}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setIdentifierError(""); 
                  }}
                />
                {identifierError && <p className="error-message">{identifierError}</p>}
            
              </div>
              <div className='login-form1'>
                <label htmlFor='password'> Password <span className='red-mark'>*</span></label>
                <div className="password-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    className={passwordError ? "input-error" : ""}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                  />
                  <span onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                {passwordError && <p className="error-message">{passwordError}</p>}

                <Link href='/forget-password' className ='forget'>Forget Password ?</Link>
                
              </div>
              <div className='login-form-btns'>
             
                <button type='submit' className='btn'>
                  Sign in
                </button>
        
                <p className='link'>
                  Don't have account? <Link href='/pages/Signup'>Sign up </Link>{' '}
                </p>
              </div>
            </form>
          </div>
          
        </div>
        
      </div>
    </div>
   
  );
};

export default Login;
