// components/UploadSection.jsx
import React from 'react';
import styles from './UploadSection.module.css'; // Import your CSS module here

const UploadSection = () => {
  const handleVideoUpload = (file) => {
    console.log('Video file to upload:', file);
  };

  const handleLoopUpload = (file) => {
    console.log('Loop file to upload:', file);
  };

  return (
    <div className={styles.uploadStack}>
      <h2 className={styles.uploadText}>Upload your content</h2>
      
      <hr className={styles.uploadDivider} />
      <button onClick={() => console.log("Upload Video")} className={styles.uploadButton}>
        Upload Video
      </button>

      <hr className={styles.uploadDivider} />
      <a href="/uploadLoops">
      <button onClick={() => console.log("Upload Loop")} className={styles.uploadButton}>
        Upload Loop
      </button>
      </a>
    </div>
  );
};

export default UploadSection;
