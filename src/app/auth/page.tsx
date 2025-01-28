'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { type User } from '@supabase/supabase-js';
import { SignIn } from '@/app/components/signin/Signin';
import { Background } from '@/app/components/Background/Background';
import { Navbar } from '@/app/components/Navbar/Navbar';
export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getSession();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getSession();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  console.log(user);

  if (user) {
    return (
      <div className="relative w-full">
        <Navbar user={user} setUser={setUser} />
        <Background>{true ? <p>SHOW PROMPT</p> : <p>show map</p>}</Background>
      </div>
    );
  }

  return <SignIn />;
}
