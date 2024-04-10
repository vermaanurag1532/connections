import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "../../firebase/Config/firebase";
import styles from './Auth.module.css'; // Import the CSS file
import { collection, doc, setDoc, getFirestore, DocumentData , getDoc } from 'firebase/firestore';
import { User } from '../../firebase/Models/User';
import { Request } from '@/firebase/Models/requests';

const db = getFirestore();

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading, error] = useAuthState(auth); 

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Check if the user exists in the Firestore database
      const userId = result.user!.uid;
      const userDoc = doc(db, 'users', userId);
      const userSnap = await getDoc(userDoc);

      if (!userSnap.exists()) {
        // Create a new document for the user if not exist
        const newUser: User = {
          about: "Hey I am " + (result.user!.displayName || ""),
          created_at: Date.now().toString(),
          dateOfBirth: "",
          designation: "Member",
          easyQuestions: 0,
          email: result.user!.email || "",
          follower: 0,
          following: 0,
          gender: "",
          hardQuestions: 0,
          id: userId,
          image: result.user!.photoURL || "",
          isApproved: false,
          isContentCreator: false,
          is_online: false,
          last_active: Date.now().toString(),
          lives: 0,
          mediumQuestions: 0,
          name: result.user!.displayName || "",
          phoneNumber: "",
          place: "",
          profession: "",
          push_token: ""

        };

        await setDoc(userDoc, newUser);

      } else {
        const existingUser = userSnap.data() as User;
        console.log(userId);
        
      }

      const requestDoc = doc(db , 'requests', userId)
      const requestSnap = await getDoc(requestDoc);

      if(!requestSnap.exists()) {
        const newRequest: Request = {
          instagramLink: "",
          isApproved: false,
          isContentCreator: false,
          timeStamp: new Date(),
          userId: userId,
          youtubeLink: "",
        }

        await setDoc(requestDoc , newRequest);
        console.log("request Created");
      }
      else {
        const existingRequest = requestSnap.data() as Request;
        console.log(userId);
        
      }

      // Redirect or show the main content upon successful login
    } catch (error) {
      console.error('Error signing in with Google:', (error as Error).message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        <div className={styles.logoContainer}>
          <img src="assets/logo.png" alt="Logo" className={styles.logo} />
        </div>
        <div className={styles.formContainer}>
          <h1>Login</h1>
          <div className={styles.inputGroup}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className={styles.button} >Login with Email</button>
          <button className={styles.button} onClick={handleGoogleLogin}>Login with Google</button>
          <div className={styles.bottomLinks}>
            <span className={styles.forgotPassword}>Forgot Password?</span>
            <span className={styles.register}>Register</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
