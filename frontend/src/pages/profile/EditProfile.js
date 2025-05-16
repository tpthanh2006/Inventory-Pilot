import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import './Profile.scss'
import { selectUser } from '../../redux/features/auth/authSlice';
import Loader from '../../components/loader/Loader';
import Card from '../../components/card/Card';
import authService from '../../services/authService';
import ChangePassword from '../../components/changePassword/ChangePassword';

const EditProfile = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const user = useSelector(selectUser);
  const { email } = user;

  useEffect(() => {
    if (!email) {
      navigate("/profile");
    }
  }, [email, navigate])

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
    
    setIsLoading(true);
    try {
      // Handle image upload
      let imageURL;
      if (
        profileImage &&
        (
          profileImage.type === "image/png" ||
          profileImage.type === "image/jpg" ||
          profileImage.type === "image/jpeg"
        )
      ) {
        const image = new FormData();
        image.append("file", profileImage);
        image.append("cloud_name", "dphav0gho");
        image.append("upload_preset", "inv3ntoryp1lot");

        // Save image to Cloudinary
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dphav0gho/image/upload",
          {
            method: "post",
            body: image
          }
        );
        
        const imgData = await response.json();
        imageURL = imgData.url.toString();
      }

      // Save Profile
      const formData = {
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
        photo: profileImage ? imageURL : profile.photo
      };

      const data = await authService.updateUser(formData);
      console.log(data);
      toast.success("User updated successfully");
      navigate("/profile");
      setIsLoading(false);

    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error();
    }
  };

  return (
    <div className='profile --my2'>
      {isLoading && <Loader />}

      <Card cardClass={"card --flex-dir-column"}>
            <span className='profile-photo'>
              <img
                src={user?.photo}
                alt="Avatar"
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

                <div>=
                  <button className='--btn --btn-primary'>
                    Edit Profile
                  </button>
                </div>
              </span>
            </form>
      </Card>
      <br/>
      <ChangePassword />
    </div>
  )
}

export default EditProfile