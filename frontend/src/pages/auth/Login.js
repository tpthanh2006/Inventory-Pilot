import { toast } from 'react-toastify'
import React, { useState } from 'react'
import { BiLogIn } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import styles from './auth.module.scss'
import Card from '../../components/card/Card'
import Loader from '../../components/loader/Loader'
import authService from '../../services/authService'
import { loginUser, RESET, sendCode2FA } from '../../redux/features/auth/authSlice'
import PasswordInput from '../../components/passwordInput/PasswordInput'

const initialState = {
  email: "",
  password: "",
}

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const { email, password } = formData;

  const { isLoading, isLoggedIn, isSuccess, isError, twoFactor } = useSelector(
    (state) => state.auth
  );

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
        
    if (!authService.validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }
    
    if (password.length < 6) {
      return toast.error("Passwords must be at least 6 characters long");
    }
    
    const userData = {
      email,
      password
    };
    
    try {
      //const data = await authService.loginUser(userData);

      await dispatch(loginUser(userData));
      if (isSuccess && isLoggedIn) {
        navigate("/dashboard");
      };
      
      //console.log(data);
    } catch (error) {
      console.log(error.message);
      
      if (isError && twoFactor) {
        await dispatch(sendCode2FA(email));
        navigate(`/loginWithCode/${email}`);

        await dispatch(RESET());
      };

    };
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