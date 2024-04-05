import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/Config/firebase';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState({
    username: '',
    profilePic: '',
    followers: 0,
    following: 0,
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vestibulum facilisis nisl, nec fermentum nulla.',
  });

  useEffect(() => {
    if (user) {
      const { displayName, photoURL } = user;
      setUserData({ ...userData, username: displayName || '', profilePic: photoURL || '' });
    }
  }, [user]);

  const handleEditProfilePic = () => {
    // Trigger the file input click event
    const fileInput = document.getElementById('profilePicInput');
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleProfilePicClick = () => {
    // Implement logic to enlarge profile picture
    alert('Enlarging profile picture functionality will be implemented here.');
  };

  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Perform upload logic here
      alert('Uploading profile picture...');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileInfo}>
        <div className={styles.profilePicContainer} onClick={handleProfilePicClick}>
          <img src={userData.profilePic} alt="Profile" className={styles.profilePic} />
          <div className={styles.editProfilePic} onClick={handleEditProfilePic}>Edit</div>
          <input
            id="profilePicInput"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleProfilePicChange}
          />
        </div>
        <div className={styles.userInfo}>
          <h2>{userData.username}</h2>
          <p>Followers: {userData.followers}</p>
          <p>Following: {userData.following}</p>
          <p>Bio: {userData.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
