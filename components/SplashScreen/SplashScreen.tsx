import React from 'react';
import styles from './SplashScreen.module.css';

const SplashScreen: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Add your GIF element */}
      <img src="/assets/gif_final.gif" alt="Loading" className={styles.gif} />
    </div>
  );
};

export default SplashScreen;