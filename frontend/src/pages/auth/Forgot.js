import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { AiOutlineMail } from 'react-icons/ai'

import styles from './auth.module.scss'
import Card from '../../components/card/Card'
import authService from '../../services/authService'

const Forgot = () => {
  const [email, setEmail] = useState("");

  const forgot = async (e) => {
    e.preventDefault();

    // Validation
    if (!email) {
      return toast.error("All fields are required");
    }

    if (!authService.validateEmail(email)) {
      return toast.error("Please enter a valid email")
    }

    const userData = {
      email
    };

    await authService.forgotPassword(userData);
    setEmail("");
  };

  return (
    <div className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <AiOutlineMail size={35} color="#999" />
          </div>
          <h2>Forgot Password</h2>
          <form onSubmit={forgot}>
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="--btn --btn-primary --btn-block">
              Get Reset Email
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

export default Forgot