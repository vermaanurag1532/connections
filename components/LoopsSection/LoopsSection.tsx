import React, { useEffect, useState, useRef } from 'react';
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
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const loopsRef = collection(db, 'loops');
        const loopsSnapshot = await getDocs(loopsRef);

        if (loopsSnapshot.empty) {
          throw new Error('No videos found.');
        }

        const fetchedVideos: Video[] = loopsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            url: data.videoUrl,
            uploadedBy: data.uploadedBy,
            title: data.title,
            description: data.description,
            thumbnail: data.thumbnail,
          };
        }).filter(video => video.url);

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

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  if (loading) {
    return <div>Loading videos...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.container}>
      {videos.map((video, index) => (
        <div key={video.id} className={styles.videoWrapper}>
          <div className={styles.videoThumbnail} onClick={() => handleVideoClick(video)}>
            <img src={video.thumbnail} alt={video.title} />
            <div className={styles.playIcon}></div>
          </div>
          <div className={styles.info}>
            <h4>{video.title}</h4>
            <p>{video.uploadedBy}</p>
            <p>{video.description}</p>
          </div>
        </div>
      ))}

      {selectedVideo && (
        <div className={styles.modalBackdrop} onClick={handleCloseModal}>
          <div className={styles.modal}>
            <video
              controls
              autoPlay
              className={styles.modalVideoPlayer}
              poster={selectedVideo.thumbnail}
            >
              <source src={selectedVideo.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button className={styles.closeModal} onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoopsSections;
