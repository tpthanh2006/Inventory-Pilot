import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

import "./Profile.scss"
import useRedirectLoggedOutUser from '../../customHook/useRedirectLoggedOutUser'
import authService from '../../services/authService'
import { SET_NAME, SET_USER } from '../../redux/features/auth/authSlice'
import { SpinnerImg } from '../../components/loader/Loader'
import Card from '../../components/card/Card'
import Notification from '../../components/notification/Notification';

const Profile = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  
  const { user } = useSelector(
    (state) => state.auth
  );
  const initialState = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    isVerified: user?.isVerified || false,
  }

  const [profile, setProfile] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    async function getUserData() {
      const data = await authService.getUser();
      console.log(data);

      setProfile(data);
      setIsLoading(false);

      await dispatch(SET_USER(data));
      await dispatch(SET_NAME(data.name));
    };

    getUserData();
  }, [dispatch]);

  return (
    <div className='profile --my2'>
      {isLoading && <SpinnerImg />}
      {!profile.isVerified && <Notification />}

      <>
        {!isLoading && profile === null ? (
          <p>Something went wrong, please reloaad the page</p>
        ) : (
          <Card cardClass={"card --flex-dir-column"}>
            <span className='profile-photo'>
              <img
                src={profile?.photo}
                alt="profile picture"
              />
            </span>

            <span className="profile-data">
              <p>
                <b>Name: </b> {profile.name}
              </p>

              <p>
                <b>Email: </b> {profile.email}
              </p>

              <p>
                <b>Phone: </b> {profile.phone}
              </p>

              <p>
                <b>Bio: </b> {profile.bio}
              </p>

              <p>
                <b>Status: </b> {profile.isVerified ? "Verified" : "Unverified"}
              </p>

              <div>
                <Link to="/edit-profile">
                  <button className='--btn --btn-primary'>
                    Edit Profile
                  </button>
                </Link>
              </div>
            </span>
          </Card>
        )}
      </>
    </div>
  );
}

export default Profile