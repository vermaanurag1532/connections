// Explore.tsx

import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore, DocumentData } from 'firebase/firestore';
import { app } from '../../firebase/Config/firebase';
import styles from "./Explore.module.css";

const db = getFirestore(app);

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [peopleResults, setPeopleResults] = useState<DocumentData[]>([]);
  const [communitiesResults, setCommunitiesResults] = useState<DocumentData[]>([]);
  const [selectedTab, setSelectedTab] = useState('People');

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      handleSearch(); // Automatically trigger search on component mount and whenever searchQuery changes
    } else {
      // Clear the results if search query is empty
      setPeopleResults([]);
      setCommunitiesResults([]);
    }
  }, [searchQuery]); // useEffect dependency on searchQuery

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
      <div>
        {searchQuery.trim() !== '' && (
          <>
            <h2 className={styles.selectedTab}>{selectedTab}</h2>
            <div className={styles.searchResults}>
              {selectedTab === 'People' && peopleResults.map((result: DocumentData) => (
                <div className={styles.searchResult} key={result.id}>
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
