import { toast } from 'react-toastify'
import React, { useState } from 'react'
import { MdPassword } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'

import styles from './auth.module.scss'
import Card from '../../components/card/Card'
import authService from '../../services/authService'
import PasswordInput from '../../components/passwordInput/PasswordInput'

const initialState = {
  password: "",
  password2: "",
}

const Reset = () => {
  const [formData, setFormData] = useState(initialState);
  const { password, password2 } = formData;
  const { resetToken } = useParams()

  const handleInputChange = async (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const reset = async (e) => {
    e.preventDefault();
    
    //Validation
    if (!password || !password2) {
      return toast.error("All fields are required");
    }
    if (password.length < 6) {
      return toast.error("Passwords must be at least 6 characters long");
    }
    if (password !== password2) {
      return toast.error("Passwords do not match");
    }
    
    const userData = {
      password,
      password2,
    };
    
    try {
      const data = await authService.resetPassword(userData, resetToken);
      toast.success(data.message);
    } catch (error) {
      console.log(error.message);
    }

    //console.log(formData);
  };

  return (
    <div className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <MdPassword size={35} color="#999" />
          </div>
          <h2>Reset Password</h2>
          <form onSubmit={reset}>
            <PasswordInput 
              type="password"
              placeholder="New Password"
              required
              name="password"
              value={password}
              onChange={handleInputChange}
            />

            <PasswordInput 
              type="password"
              placeholder="Confirm New Password"
              required
              name="password2"
              value={password2}
              onChange={handleInputChange}
              onPaste={(e) => {
                e.preventDefault();
                toast.error("Cannot paste into this field");
                return false;
              }}
            />
            
            <button type="submit" className="--btn --btn-primary --btn-block">
              Reset Password
            </button>

            <div className={styles.links}>
              <p>
                <Link to='/'>- Home</Link>
              </p>

              <p>
                <Link to='/login'>- Login</Link>
              </p>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default Reset