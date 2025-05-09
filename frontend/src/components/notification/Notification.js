import React from 'react'

import "./Notification.scss"
import { useDispatch } from 'react-redux';
import { sendVerificationEmail, RESET } from '../../redux/features/auth/authSlice';

const Notification = () => {
  const dispatch = useDispatch();

  const sendVerEmail = async () => {
    await dispatch(sendVerificationEmail());
    await dispatch(RESET());
  };

  return (
    <div className='container'>
      <div className='alert'>
        <p>
          <b>Message: &nbsp;</b> 
        </p>

        <p>
          To verify your account, check your email for a verification link. &nbsp;
        </p>

        <p className='v-link' onClick={sendVerEmail}>
          Resend Link
        </p>
      </div>
    </div>
  )
}

export default Notification