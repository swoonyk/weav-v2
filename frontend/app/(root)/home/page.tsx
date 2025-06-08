"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomeRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to root path
    router.replace('/');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting...</p>
    </div>
  );
};

export default HomeRedirect;