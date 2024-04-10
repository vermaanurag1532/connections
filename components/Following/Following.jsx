import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore, doc, getDoc } from 'firebase/firestore';
import { app, auth } from '../../firebase/Config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import styles from './Following.module.css';
import UsersProfile from '../../widgets/UsersProfile'

const db = getFirestore(app);

const Followers = () => {
  const [user] = useAuthState(auth);
  const [followers, setFollowers] = useState([]);
  const [selectedUserUid, setSelectedUserUid] = useState();

  useEffect(() => {
    const fetchFollowers = async () => {
      const userId = user?.uid;
      if (!userId) return;

      const followersRef = collection(db, 'users', userId, 'following');
      const snapshot = await getDocs(followersRef);
      const followersIdList = snapshot.docs.map(doc => doc.id); // Extract follower IDs

      // Fetch each follower's details from the 'users' collection
      const followersDetailsPromises = followersIdList.map(async (followerId) => {
        const userDocRef = doc(db, 'users', followerId);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          return { id: followerId, ...userDocSnapshot.data() }; // Return follower details
        }
        return null; // In case the user document doesn't exist
      });

      const followersDetails = await Promise.all(followersDetailsPromises);
      const filteredFollowers = followersDetails.filter(Boolean); // Remove nulls if any
      setFollowers(filteredFollowers);
      console.log({followers})
    };

    if (user) {
      fetchFollowers();
    }
  }, [user]);

  const handleProfileClick = (uid) => {
    setSelectedUserUid(uid);
  };

  const handleCloseProfile = () => {
    setSelectedUserUid(null);
  };

  if (!user) return <div>Please log in to see your followers.</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Following</h2>
      <div className={styles.followingList}>
      <div className="clickedProfile">
         {selectedUserUid && <UsersProfile ProfileUserId={selectedUserUid} onClose={handleCloseProfile} />}
      </div>
        {followers.map(follower => (
          <div key={follower.id} className={styles.following} onClick={() => handleProfileClick(follower.id)}>
            <img src={follower.image || '/defaultAvatarUrl.png'} alt={follower.name || 'Follower'} className={styles.avatar} />
            <p className={styles.name}>{follower.name || 'Anonymous'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Followers;
