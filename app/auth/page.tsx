'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isSessionValid } from '@/lib/auth/session';
import LoginForm from '@/components/auth/LoginForm';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    if (isSessionValid()) {
      router.push('/editor');
    }
  }, [router]);

  return <LoginForm />;
}
