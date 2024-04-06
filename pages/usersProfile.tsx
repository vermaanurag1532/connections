import React from 'react';
import { UsersProfile } from '@/widgets';
import { useRouter } from 'next/router';

const index = () => {
  const router = useRouter();
  const uid = router.query.uid?.toString() || ''; // Ensure uid is of type 'string'

  return (
    <div>
      <UsersProfile uid={uid} />
    </div>
  );
};

export default index;
