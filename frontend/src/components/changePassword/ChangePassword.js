import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom"

import './ChangePassword.scss'
import Card from '../card/Card'
import authService from '../../services/authService'

const initialState = {
  oldPassword: "",
  password: "",
  password2: ""
};

const ChangePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const { oldPassword, password, password2 } = formData;
  
  const handleInputChange = async (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const changePass = async(e) => {
    e.preventDefault();

    if (password !== password2) {
      return toast.error("New passwords do not match");
    }

    const formData = {
      oldPassword,
      password
    };

    const data = await authService.changePassword(formData);
    toast.success(data);
    navigate("/profile");
  };
  
  return (
    <div className='change-password'>
      <Card cardClass={'password-card'}>
        <h3>Change Password</h3>
        <form onSubmit={changePass} className='--form-control'>
          <input
            type='password'
            placeholder='Old Password'
            required
            name='oldPassword'
            value={oldPassword}
            onChange={handleInputChange}
          />

          <input
            type='password'
            placeholder='New Password'
            required
            name='password'
            value={password}
            onChange={handleInputChange}
          />

          <input
            type='password'
            placeholder='Confirm New Password'
            required
            name='password2'
            value={password2}
            onChange={handleInputChange}
          />

          <button type='submit' className='--btn --btn-primary'>
            Change Password
          </button>
        </form>
      </Card>
    </div>
  )
}

export default ChangePassword