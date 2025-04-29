import { toast } from 'react-toastify'
import React, { useState } from 'react'
import { BiLogIn } from 'react-icons/bi'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import styles from './auth.module.scss'
import Card from '../../components/card/Card'
import Loader from '../../components/loader/Loader'
import { loginUser, validateEmail } from '../../services/authService'
import { SET_LOGIN, SET_NAME } from '../../redux/features/auth/authSlice'
import PasswordInput from '../../components/passwordInput/PasswordInput'

const initialState = {
  email: "",
  password: "",
}

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const { email, password } = formData;

  const handleInputChange = async (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const login = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      return toast.error("All fields are required");
    }
        
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }
    
    if (password.length < 6) {
      return toast.error("Passwords must be at least 6 characters long");
    }
    
    const userData = {
      email,
      password
    };
    
    setIsLoading(true);
    try {
      const data = await loginUser(userData);

      await dispatch(SET_LOGIN(true));
      await dispatch(SET_NAME(data.name));
      navigate("/dashboard");
      
      setIsLoading(false);
      console.log(data);
    } catch (error) {
      setIsLoading(false);
      console.log(error.message)
    }

    //console.log(formData);
  };

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader/>}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <BiLogIn size={35} color="#999" />
          </div>
          <h2>Login</h2>
          <form onSubmit={login}>
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={handleInputChange}
            />

            <PasswordInput 
              type="password"
              placeholder="Password"
              required
              name="password"
              value={password}
              onChange={handleInputChange}
            />

            <button type="submit" className="--btn --btn-primary --btn-block">
              Login
            </button>
          </form>

          <Link to="/forgot">Forgot Password</Link>
          <span className={styles.register}>
            <Link to='/'>Home</Link>
            <p> &nbsp; Don't have an account? &nbsp;</p>
            <Link to='/register'>Register</Link>
          </span>
        </div>
      </Card>
    </div>
  );
}

export default Login