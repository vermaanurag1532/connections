import React, { useEffect, useState } from 'react';
import styles from './LoopsSections.module.css';
import { app } from '../../firebase/Config/firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const db = getFirestore(app);

interface Video {
  id: string;
  url: string;
  uploadedBy: string;
  title: string;
  description: string;
  thumbnail: string;
}

const LoopsSections: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const loopsRef = collection(db, 'loops');
        const loopsSnapshot = await getDocs(loopsRef);

        if (loopsSnapshot.empty) {
          throw new Error('No videos found.');
        }

        const fetchedVideos: Video[] = loopsSnapshot.docs.map(doc => ({
          id: doc.id,
          url: doc.data().videoUrl,
          uploadedBy: doc.data().uploadedBy,
          title: doc.data().title,
          description: doc.data().description,
          thumbnail: doc.data().thumbnail,
        }));

        setVideos(fetchedVideos);
      } catch (err) {
        setError('Failed to fetch videos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <div>Loading videos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      {videos.map((video) => (
        <div key={video.id} className={styles.videoWrapper}>
          <video className={styles.videoPlayer} controls>
            <source src={video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className={styles.info}>
            <h4>{video.title}</h4>
            <p>{video.uploadedBy}</p>
            <p>{video.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoopsSections;
