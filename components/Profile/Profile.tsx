import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, app } from '../../firebase/Config/firebase';
import styles from './Profile.module.css';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const db = getFirestore(app);

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
    const fetchUserData = async () => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        try {
          // Fetch user data from Firestore
          const userDocRef = doc(db, 'users', uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userDataFromFirestore = userDocSnap.data();
            if (userDataFromFirestore) {
              // Update state with fetched user data
              setUserData({
                ...userData,
                username: userDataFromFirestore.name,
                profilePic: userDataFromFirestore.image,
                bio: userDataFromFirestore.about
              });

              // Fetch followers count
              const followersQuery  = await getDocs(collection(userDocRef , 'follower'));
              const followersCount = followersQuery.size;
              setUserData(prevState => ({ ...prevState, followers: followersCount }));

              // Fetch following count
              const followingQuery = await getDocs(collection(userDocRef , 'following'));
              const followingCount = followingQuery.size;
              setUserData(prevState => ({ ...prevState, following: followingCount }));
            }
          } else {
            console.log('User data not found in Firestore for UID:', uid);
          }
        } catch (error) {
          console.error('Error fetching user data from Firestore:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleEditProfilePic = () => {
    const fileInput = document.getElementById('profilePicInput');
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleProfilePicClick = () => {
    alert('Enlarging profile picture functionality will be implemented here.');
  };

  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
