// Videos.tsx
import React, { useEffect, useState } from 'react';
import styles from './Videos.module.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { auth, GoogleAuthProvider } from '../../firebase/firebase';

interface Video {
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  uploadedBy: string;
}

interface Category {
  name: string;
  videos: Video[];
}

const Videos: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const db = getFirestore();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const videoCategoriesRef = collection(db, 'videosCategories');
        const snapshot = await getDocs(videoCategoriesRef);

        if (snapshot.empty) {
          throw new Error('No video categories found.');
        }

        const fetchedCategories = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const videosCollectionRef = collection(db, `videos/${doc.id}/${doc.id}`);
            const videosSnapshot = await getDocs(videosCollectionRef);

            const videos: Video[] = videosSnapshot.docs.map((videoDoc) => ({
              title: videoDoc.data().title as string,
              description: videoDoc.data().description as string,
              thumbnail: videoDoc.data().thumbnail as string,
              url: videoDoc.data().videoUrl as string,
              uploadedBy: videoDoc.data().uploadedBy as string,
            }));

            return { name: doc.id, videos };
          }),
        );

        setCategories(fetchedCategories);
      } catch (err) {
        setError('Error fetching video categories: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      {selectedVideo && (
        <div className={styles.modal}>
          <video controls autoPlay className={styles.modalVideoPlayer}>
            <source src={selectedVideo.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <button className={styles.closeModal} onClick={handleCloseModal}>
            X
          </button>
        </div>
      )}
      {categories.map((category) => (
        <div key={category.name} className={styles.category}>
          <h2 className={styles.categoryTitle}>{category.name}</h2>
          <div className={styles.carousel}>
            {category.videos.map((video, index) => (
              <div key={index} className={styles.videoCard}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className={styles.thumbnail}
                  onClick={() => handleVideoSelect(video)}
                />
                <div className={styles.videoInfo}>
                  <h3 className={styles.videoTitle}>{video.title}</h3>
                  <p className={styles.videoDescription}>{video.description}</p>
                  <p className={styles.uploadedBy}>Uploaded by: {video.uploadedBy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Videos;
