import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, app } from '../../firebase/Config/firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import styles from './Posts.module.css';

const db = getFirestore(app);

const Posts = () => {
    const [user] = useAuthState(auth);
    const [activeTab, setActiveTab] = useState('loops');
    const [loops, setLoops] = useState([]);
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        if (user) {
            fetchContent('loops');
            fetchContent('videos');
        }
    }, [user]);

    const fetchContent = async (type) => {
        const ref = collection(db, 'users', user.uid, type);
        const snap = await getDocs(ref);
        const data = snap.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title,
            description: doc.data().description,
            thumbnail: doc.data().thumbnail  // Assuming 'thumbnail' is a field in your document
        }));

        if (type === 'loops') {
            setLoops(data);
        } else if (type === 'videos') {
            setVideos(data);
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                <div className={`${styles.tab} ${activeTab === 'loops' ? styles.active : ''}`} onClick={() => handleTabClick('loops')}>Loops</div>
                <div className={`${styles.tab} ${activeTab === 'videos' ? styles.active : ''}`} onClick={() => handleTabClick('videos')}>Video</div>
                <div className={styles.tab}>Quiz</div>
            </div>
            <div className={styles.content}>
                {(activeTab === 'loops' ? loops : videos).map(item => (
                    <div key={item.id} className={styles.item}>
                        <div>
                            <img src={item.thumbnail} alt="Thumbnail" className={styles.thumbnail} />
                        </div>
                        <div className={styles.text}>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Posts;
