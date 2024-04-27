import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { doc, setDoc, getFirestore, getDoc } from 'firebase/firestore';
import { app, auth } from '../../firebase/Config/firebase';
import styles from './UploadLoops.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';

// Initialize Firestore
const db = getFirestore(app);

const UploadLoops = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userName, setUserName] = useState('');

  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  // Fetch the user's name from Firestore when the user state is available
  useEffect(() => {
    if (user && !loading) {
      const userRef = doc(db, 'users', user.uid);
      getDoc(userRef).then((userSnap) => {
        if (userSnap.exists()) {
          setUserName(userSnap.data().name);
        }
      });
    }
  }, [user, loading]);

  const handleVideoChange = (e) => setVideoFile(e.target.files[0]);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleUpload = async () => {
    if (!videoFile || title.trim() === '' || description.trim() === '' || !userName) {
      alert('Please fill in all fields and select a video to upload.');
      return;
    }

    setUploading(true);

    try {
      const apiKey = '6Rdwzgfec9nfQmGXn523qoQiuKHhuDCO0o31bcis2Da';
      const createResponse = await axios.post('https://ws.api.video/videos', { title, description }, { headers: { 'Authorization': `Bearer ${apiKey}` } });
      const videoId = createResponse.data.videoId;

      const formData = new FormData();
      formData.append('file', videoFile);
      await axios.post(`https://ws.api.video/videos/${videoId}/source`, formData, { headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'multipart/form-data' } });

      const videoData = {
        id: videoId,
        category: 'your-category',
        creatorName: userName,
        title,
        description,
        videoUrl: createResponse.data.assets.mp4,
        thumbnail: createResponse.data.assets.thumbnail,
        uploadedBy: user!.uid,
        likes: [],
        views: 0,
      };

      // Store in general loops collection
      await setDoc(doc(db, 'loops', videoId), videoData);

      // Store in user-specific loops collection
      await setDoc(doc(db, `users/${user!.uid}/loops`, videoId), videoData);

      alert('Video uploaded successfully!');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.uploadStack}>
      <h2 className={styles.uploadText}>Upload your content</h2>
      <input className={styles.inputField} type="text" placeholder="Title" value={title} onChange={handleTitleChange} />
      <textarea className={styles.textArea} placeholder="Description" value={description} onChange={handleDescriptionChange} />
      <input className={styles.fileInput} type="file" accept="video/*" onChange={handleVideoChange} />
      <button className={styles.uploadButton} onClick={handleUpload} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload Video'}</button>
    </div>
  );
};

export default UploadLoops;
