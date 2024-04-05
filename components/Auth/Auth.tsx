// Auth.tsx
import React, { useState } from 'react';
import { auth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "../../firebase/firebase";
import styles from './Auth.module.css'; // Import the CSS file

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      await signInWithPopup(auth, new GoogleAuthProvider()); // Instantiate GoogleAuthProvider object here
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
        </div>
      </div>
    </div>
  );
};

export default Auth;

