import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "../../firebase/Config/firebase";
import styles from './Auth.module.css'; // Import the CSS file
import { collection, doc, setDoc, getFirestore, DocumentData , getDoc } from 'firebase/firestore';
import { User } from '../../firebase/Models/User';

const db = getFirestore();

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading, error] = useAuthState(auth); // Added useAuthState hook

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect or show the main content upon successful login
    } catch (error) {
      console.error('Error signing in with email/password:', (error as Error).message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Check if the user exists in the Firestore database
      const userId = result.user!.uid; // Use the authentication ID (UID) instead of email
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
          email: result.user!.email || "", // Use the retrieved email here
          follower: 0,
          following: 0,
          gender: "",
          hardQuestions: 0,
          id: userId,
          image: result.user!.photoURL || "",
          isApproved: true,
          isContentCreator: true,
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

        console.log('New User Created:', newUser); // Log the newly created user model
      } else {
        const existingUser = userSnap.data() as User;
        console.log('Existing User:', existingUser); // Log the existing user model
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
          <button className={styles.button} onClick={handleEmailLogin}>Login with Email</button>
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
