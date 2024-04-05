// Index.tsx
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import SplashScreen from '@/components/SplashScreen';
import { Videos } from '@/components';

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay (you can replace this with your actual data loading logic)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust loading duration as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>While</title>
      </Head>
      {loading ? (
        <SplashScreen /> // Show splash screen while loading
      ) : (
        null // No need to render anything else if not fetching data
      )}
      <Videos />
    </>
  );
};

export default Index;
