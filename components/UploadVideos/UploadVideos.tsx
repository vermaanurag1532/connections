import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { doc, setDoc, getFirestore, getDoc, collection, getDocs } from 'firebase/firestore';
import { app, auth } from '../../firebase/Config/firebase';
import styles from './UploadVideo.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';

type Category = {
  category: string;
};

const db = getFirestore(app);

const UploadLoops: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userName, setUserName] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, "videosCategories"));
      const fetchedCategories: Category[] = snapshot.docs.map(doc => ({
        category: doc.data().category as string
      }));
      setCategories(fetchedCategories);
      if (fetchedCategories.length > 0) {
        setSelectedCategory(fetchedCategories[0].category);
      }
    };

    const fetchUserName = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserName(userSnap.data().name as string);
        }
      }
    };

    fetchCategories();
    if (!loading && user) {
      fetchUserName();
    }
  }, [user, loading]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!videoFile || title.trim() === '' || description.trim() === '' || !userName) {
      alert('Please fill in all fields and select a video to upload.');
      return;
    }

    setUploading(true);

    try {
      const apiKey = 'LJd5487BMFq2YdiDxjNWeoJBPY3eqm3M0YHiw1qj7g6';
      const createResponse = await axios.post(
        'https://sandbox.api.video/videos',
        { title, description },
        { headers: { 'Authorization': `Bearer ${apiKey}` } }
      );

      const videoId = createResponse.data.videoId;
      const formData = new FormData();
      formData.append('file', videoFile);
      await axios.post(
        `https://sandbox.api.video/videos/${videoId}/source`,
        formData,
        { headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'multipart/form-data' } }
      );

      // Store the video under videos/{category}/{categoryId}
      const videoData = {
        id: videoId,
        category: selectedCategory,
        creatorName: userName,
        title,
        description,
        videoUrl: createResponse.data.assets.mp4,
        thumbnail: createResponse.data.assets.thumbnail,
        uploadedBy: user?.uid,
        likes: [],
        views: 0
      }
      const categoryRef = collection(db, `videos/${selectedCategory}/${selectedCategory}`);
      await setDoc(doc(categoryRef, videoId), videoData);
      await setDoc(doc(db , `users/${user!.uid}/videos`, videoId), videoData);

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
      <input className={styles.inputField} type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className={styles.textArea} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <select className={styles.dropdown} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        {categories.map(category => (
          <option key={category.category} value={category.category}>{category.category}</option>
        ))}
      </select>
      <input className={styles.fileInput} type="file" accept="video/*" onChange={handleVideoChange} />
      <button className={styles.uploadButton} onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Video'}
      </button>
    </div>
  );
};

export default UploadLoops;
