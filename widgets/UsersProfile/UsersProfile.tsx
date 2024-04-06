import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebase/Config/firebase';
import styles from './UsersProfile.module.css'; // Import CSS module for styling

const db = getFirestore(app);

interface UsersProfileProps {
  uid: string;
  onClose?: () => void; // Make onClose prop optional
}

const UsersProfile: React.FC<UsersProfileProps> = ({ uid, onClose }) => {
  const [userData, setUserData] = useState<any>(null); // State to hold user data
  const [followerCount, setFollowerCount] = useState<number>(0); // State to hold follower count
  const [followingCount, setFollowingCount] = useState<number>(0); // State to hold following count

  useEffect(() => {
    // Fetch user data based on UID
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          setUserData(userDocSnapshot.data());

          // Fetch follower count
          const followerQuerySnapshot = await getDocs(collection(userDocRef, 'follower'));
          setFollowerCount(followerQuerySnapshot.size);

          // Fetch following count
          const followingQuerySnapshot = await getDocs(collection(userDocRef, 'following'));
          setFollowingCount(followingQuerySnapshot.size);
        } else {
          console.error('User data not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData(); // Call fetchUserData on component mount

    // Cleanup function
    return () => {
      // Perform any cleanup if needed
    };
  }, [uid]); // useEffect dependency on UID

  if (!userData) {
    return <div>Loading...</div>; // Display loading message while data is being fetched
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <img src={userData.image} alt="Profile" className={styles.profileImage} />
        <div className={styles.profileInfo}>
          <h2 className={styles.profileHeader}>{userData.name}</h2>
          <p>{userData.bio}</p>
          <div className={styles.followInfo}>
            <p>{followerCount} Followers</p>
            <p>{followingCount} Following</p>
          </div>
          <button className={styles.followButton}>Follow</button>
        </div>
      </div>
    </div>
  );
};

export default UsersProfile;
