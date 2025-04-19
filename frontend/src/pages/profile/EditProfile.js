import React, { useState } from 'react'

import './Profile.scss'
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/features/auth/authSlice';
import Loader from '../../components/loader/Loader';
import Card from '../../components/card/Card';
import { Link } from 'react-router-dom';

const EditProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const user = useSelector(selectUser);

  const initialState = {
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
    bio: user?.bio,
    photo: user?.photo,
  };

  const [profile, setProfile] = useState(initialState);
  
  const handleInputChange = async (e) => {
    const {name, value} = e.target;
    setProfile({...profile, [name]: value});
  };

  const handleImageChange = async (e) => {
    setProfileImage(e.target.files[0]);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
  };

  return (
    <div className='profile --my2'>
      {isLoading && <Loader />}

      <Card cardClass={"card --flex-dir-column"}>
            <span className='profile-photo'>
              <img
                src={user?.photo}
                alt="profile picture"
              />
            </span>

            <form className='--form-control --m' onSubmit={saveProfile}>
              <span className="profile-data">
                <p>
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={profile?.name}
                    onChange={handleInputChange}
                  />
                </p>

                <p>
                  <label>Email:</label>
                  <input
                    type="text"
                    name="email"
                    value={profile?.email}
                    disabled
                  />
                  <br/>
                  <code>Email can't be changed</code>
                </p>

                <p>
                  <label>Phone:</label>
                  <input
                    type="text"
                    name="phone"
                    value={profile?.phone}
                    onChange={handleInputChange}
                  />
                </p>

                <p>
                  <label>Bio:</label>
                  <textarea
                    name="bio"
                    value={profile?.bio}
                    onChange={handleInputChange}
                    cols="30"
                    rows="10"
                  />
                </p>

                <p>
                  <label>Photo:</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                  />
                </p>

                <div>
                  <Link to="/edit-profile">
                    <button className='--btn --btn-primary'>
                      Edit Profile
                    </button>
                  </Link>
                </div>
              </span>
            </form>
          </Card>
    </div>
  )
}

export default EditProfile