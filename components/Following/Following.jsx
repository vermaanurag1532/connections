import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore, doc, getDoc } from 'firebase/firestore';
import { app, auth } from '../../firebase/Config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import styles from './Following.module.css'; // Adjust the path as necessary

const db = getFirestore(app);

const Following = () => {
  const [user] = useAuthState(auth);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      const userId = user?.uid;
      if (!userId) return;

      const followingRef = collection(db, 'users', userId, 'following');
      const snapshot = await getDocs(followingRef);
      const followingIdList = snapshot.docs.map(doc => doc.id); // Extract following IDs

      // Fetch each following user's details from the 'users' collection
      const followingDetailsPromises = followingIdList.map(async (followingId) => {
        const userDocRef = doc(db, 'users', followingId);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          return { id: followingId, ...userDocSnapshot.data() }; // Return following user details
        }
        return null; // In case the user document doesn't exist
      });

      const followingDetails = await Promise.all(followingDetailsPromises);
      const filteredFollowing = followingDetails.filter(Boolean); // Remove nulls if any
      setFollowing(filteredFollowing);
    };

    if (user) {
      fetchFollowing();
    }
  }, [user]);

  if (!user) return <div>Please log in to see who you're following.</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Following</h2>
      <div className={styles.followingList}>
        {following.map(user => (
          <div key={user.id} className={styles.following}>
            <img src={user.image || '/defaultAvatarUrl.png'} alt={user.name || 'User'} className={styles.avatar} />
            <p className={styles.name}>{user.name || 'Anonymous'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Following;
