import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, app } from '../../firebase/Config/firebase';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from './Create.module.css';

const db = getFirestore(app);

const Create = () => {
  const [instagramLink, setInstagramLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (user) {
        const { uid } = user;
        const userRef = doc(db, 'users', uid);
        const requestRef = doc(db, 'requests', uid);
        
        const userSnap = await getDoc(userRef);
        const requestSnap = await getDoc(requestRef);

        if (userSnap.exists() && requestSnap.exists()) {
          const userData = userSnap.data();
          const requestData = requestSnap.data();
          if (!userData.isApproved && !requestData.isContentCreator) {
            setStatusMessage('');
          } else if (userData.isApproved && !userData.isContentCreator) {
            setStatusMessage('Your application is under review by WHILE.');
          } else if (userData.isApproved && userData.isContentCreator) {
            setStatusMessage('You are a content creator now.');
          }
        }
      }
    };

    if (!loading) {
      checkUserStatus();
    }
  }, [user, loading]);

  const handleSubmit = async (e) => {
    console.log("handleSubmit triggered");
    e.preventDefault();
    if (user) {
      const { uid } = user;
      const userRef = doc(db, 'users', uid);
      const requestRef = doc(db, 'requests', uid);

      await updateDoc(userRef, {
        isApproved: true,
      });

      await updateDoc(requestRef, {
        instagramLink: instagramLink,
        youtubeLink: youtubeLink,
        isApproved: true,
      });

      const userSnap = await getDoc(userRef);
      const requestSnap = await getDoc(requestRef);

      console.log('User data:', userSnap.exists() ? userSnap.data() : 'User document not found');
      console.log('Request data:', requestSnap.exists() ? requestSnap.data() : 'Request document not found');

      setStatusMessage('Your application is under review by WHILE.');
    }
  };

  return (
    <div className={styles.mainContainer}>
      {statusMessage === "" && (
        <form onSubmit={handleSubmit}>
          <div className={styles.container}>
            <h1>Become Creator</h1>
            <div className={styles.form}>
              <input
                className={styles.inputField}
                type="text"
                id="instagram"
                name="instagram"
                placeholder="Instagram Link"
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
              />
              <input
                className={styles.inputField}
                type="url"
                id="youtube"
                name="youtube"
                placeholder="YouTube Link"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
              />
              <button
                type="submit"
                className={styles.button}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      )}
      {statusMessage && (
        <p>{statusMessage}</p>
      )}
    </div>
  );
};

export default Create;
