import React, { useEffect, useState, useRef } from 'react';
import styles from './LoopsSections.module.css';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBt1eGpktblIAOrI68tgPxCq9Fsa1xdSXI",
  authDomain: "while-2.firebaseapp.com",
  databaseURL: "https://while-2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "while-2",
  storageBucket: "while-2.appspot.com",
  messagingSenderId: "759556546667",
  appId: "1:759556546667:web:9cd21fba85ac5d29e3912e"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
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
  const videoRefs = useRef<(HTMLVideoElement | null)[]>(new Array(videos.length));

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const videoElement = videoRefs.current[Number(entry.target.getAttribute('data-index'))];
          if (videoElement) {
            if (entry.isIntersecting) {
              videoElement.play();
            } else {
              videoElement.pause();
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      videoRefs.current.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, [videos]);

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
          <video
            ref={el => (videoRefs.current[index] = el)}
            controls
            className={styles.videoPlayer}
            poster={video.thumbnail}
            data-index={index} // To reference in the observer
            muted // Important for auto-play to work on most browsers
            loop // Optional: if you want the videos to loop
          >
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
