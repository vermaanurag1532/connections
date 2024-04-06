// Explore.tsx

import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore, DocumentData } from 'firebase/firestore';
import { app } from '../../firebase/Config/firebase';
import styles from "./Explore.module.css";
import UsersProfile from '../../widgets/UsersProfile'; // Import UsersProfile component
import { useRouter } from 'next/router'; // Import useRouter from next/router

const db = getFirestore(app);

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [peopleResults, setPeopleResults] = useState<DocumentData[]>([]);
  const [communitiesResults, setCommunitiesResults] = useState<DocumentData[]>([]);
  const [selectedTab, setSelectedTab] = useState('People');
  const [selectedUserUid, setSelectedUserUid] = useState<string | null>(null); // State to store the selected user's UID
  const router = useRouter(); // Initialize useRouter hook

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      handleSearch();
    } else {
      setPeopleResults([]);
      setCommunitiesResults([]);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      const usersQuery = collection(db, 'users');
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs
        .filter(doc => {
          const userData = doc.data();
          return userData.name && userData.name.toLowerCase().includes(searchQuery.toLowerCase());
        })
        .map(doc => doc.data());
      setPeopleResults(usersData);
      console.log({usersData});
  
      const communitiesQuery = collection(db, 'communities');
      const communitiesSnapshot = await getDocs(communitiesQuery);
      const communitiesData = communitiesSnapshot.docs
        .filter(doc => {
          const communityData = doc.data();
          return communityData.name && communityData.name.toLowerCase().includes(searchQuery.toLowerCase());
        })
        .map(doc => doc.data());
      setCommunitiesResults(communitiesData);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleProfileClick = (uid: string) => {
    setSelectedUserUid(uid);
  };

  const handleCloseProfile = () => {
    setSelectedUserUid(null);
  };

  return (
    <div className={styles.exploreContainer}>
      <div className={styles.searchContainer}>
        <input 
          type="text" 
          className={styles.searchInput}
          placeholder="Search" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>
      <div className={styles.categoryButtons}>
        <button 
          className={`${styles.categoryButton} ${selectedTab === 'People' ? styles.activeTab : ''}`} 
          onClick={() => handleTabChange('People')}
        >
          People
        </button>
        <button 
          className={`${styles.categoryButton} ${selectedTab === 'Communities' ? styles.activeTab : ''}`} 
          onClick={() => handleTabChange('Communities')}
        >
          Communities
        </button>
      </div>
      <div className={styles.clickedProfile}>
      {selectedUserUid && <UsersProfile uid={selectedUserUid} onClose={handleCloseProfile} />}
      </div>
      <div>
        {searchQuery.trim() !== '' && (
          <>
            <h2 className={styles.selectedTab}>{selectedTab}</h2>
            <div className={styles.searchResults}>
              {selectedTab === 'People' && peopleResults.map((result: DocumentData) => (
                <div 
                  className={styles.searchResult} 
                  key={result.id} 
                  onClick={() => handleProfileClick(result.id)}
                >
                  <img src={result.image} alt="Profile" className={styles.profileImage} />
                  <p className={styles.name}>{result.name}</p>
                </div>
              ))}
              {selectedTab === 'Communities' && communitiesResults.map((result: DocumentData) => (
                <div className={styles.searchResult} key={result.id}>
                  <img src={result.image} alt="Profile" className={styles.profileImage} />
                  <p className={styles.name}>{result.name}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;
