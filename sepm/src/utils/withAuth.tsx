import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/firebase/clientApp';
import { onAuthStateChanged } from "firebase/auth";

export default function withAuth(Component: React.FC) {
  return function ProtectedRoute() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setIsLoading(false);
        if (!user) {
          router.replace('/not-found');
        }
      });

      // Clean up the listener on unmount
      return () => unsubscribe();
    }, [router]);

    if (isLoading) {
      return <div>Loading...</div>; // Replace this with your loading component
    }

    return user ? <Component /> : null;
  };
}