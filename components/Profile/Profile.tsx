import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, app } from '../../firebase/Config/firebase';
import styles from './Profile.module.css';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Posts from '../Posts';

const db = getFirestore(app);

const Profile: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState({
    username: '',
    profilePic: '',
    posts: 0,
    followers: 0,
    following: 0,
    bio: 'We are welcoming you in WHILE',
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

              const videosQuery = await getDocs(collection(userDocRef , 'videos'));
              const videosCount = videosQuery.size;

              const loopsQuery = await getDocs(collection(userDocRef , 'loops'));
              const loopsCount = loopsQuery.size;
              setUserData(prevState => ({...prevState, posts: videosCount+loopsCount}));
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <img src={userData.profilePic} alt="Profile avatar" className={styles.avatar}/>
        <div className={styles.profileDetails}>
          <h1 className={styles.username}>{userData.username}</h1>
          <p className={styles.bio}>{userData.bio}</p>
        </div>
        <div className={styles.profileStats}>
          <div className={styles.statItem}>
            <strong>{userData.posts}</strong>
             posts
          </div>
          <div className={styles.statItem} onClick={() => window.location.href='/followers'}>
            <strong>{userData.followers}</strong>
            followers
          </div>
          <div className={styles.statItem} onClick={() => window.location.href='/following'}>
            <strong>{userData.following}</strong>
            following
          </div>
        </div>
      </div>
      <Posts />
    </div>
  );
};

export default Profile;
