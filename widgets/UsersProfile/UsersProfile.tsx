import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, collection, getDocs, setDoc } from 'firebase/firestore';
import { app, auth } from '../../firebase/Config/firebase';
import styles from './UsersProfile.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';

const db = getFirestore(app);

interface UsersProfileProps {
  ProfileUserId: string;
  onClose?: () => void;
}

const UsersProfile: React.FC<UsersProfileProps> = ({ ProfileUserId, onClose }) => {
  const [user] = useAuthState(auth);
  const UserId = user?.uid;
  const [userData, setUserData] = useState<any>(null);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false); // State to track follow status

  useEffect(() => {
    const fetchUserData = async () => {
      if (!ProfileUserId) return;
      try {
        const userDocRef = doc(db, 'users', ProfileUserId);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          setUserData(userDocSnapshot.data());
          const followerQuerySnapshot = await getDocs(collection(userDocRef, 'followers'));
          setFollowerCount(followerQuerySnapshot.size);
          const followingQuerySnapshot = await getDocs(collection(userDocRef, 'following'));
          setFollowingCount(followingQuerySnapshot.size);
          
          // Check if the current user is following the profile user
          if (UserId) {
            const isFollowingRef = doc(db, 'users', ProfileUserId, 'followers', UserId);
            const isFollowingSnap = await getDoc(isFollowingRef);
            setIsFollowing(isFollowingSnap.exists());
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [ProfileUserId, UserId]);

  const handleFollow = async () => {
    if (!UserId || !ProfileUserId || UserId === ProfileUserId) return;

    try {
      if (isFollowing) {
        // Logic to unfollow the user if already following
        // Note: This part of the code depends on your Firestore setup
        console.log("Unfollow logic here");
      } else {
        // Follow the user
        await setDoc(doc(db, 'users', UserId, 'following', ProfileUserId), {
          timeStamp: new Date(),
        });
        await setDoc(doc(db, 'users', ProfileUserId, 'followers', UserId), {
          timeStamp: new Date(),
        });
        setFollowerCount(prev => prev + 1);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error('Failed to update follow status:', err);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <img src={userData.image} alt="Profile" className={styles.profileImage} />
        <div className={styles.profileInfo}>
          <h2>{userData.name}</h2>
          <p>{userData.bio}</p>
          <div className={styles.followInfo}>
            <p>{followerCount} Followers</p>
            <p>{followingCount} Following</p>
          </div>
          <button className={styles.followButton} onClick={handleFollow}>
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersProfile;
