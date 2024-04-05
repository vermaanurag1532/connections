// Layout.tsx
import React, { ReactElement, useState, useEffect } from 'react';
import SplashScreen from '../SplashScreen';
import { auth } from '../../firebase/firebase';
import Auth from '../Auth';
import { User } from 'firebase/auth';
import Header from '../Header';

interface LayoutProps {
  children: ReactElement[] | ReactElement | string;
}

const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true); // State variable to track splash screen

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("User state changed:", user);
      setUser(user);
      setLoading(false);
      setShowSplash(false); // Hide splash screen after loading and user detection
    }, (error) => {
      console.error('Error occurred:', error);
      setLoading(false);
      setShowSplash(false); // Hide splash screen on error
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {showSplash ? (
        <SplashScreen /> // Show splash screen only if showSplash is true
      ) : user ? (
        <>
          <Header />
          <main>{children}</main>
          {/* <Footer /> */}
        </>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default Layout;
