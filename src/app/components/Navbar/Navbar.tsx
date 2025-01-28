import { supabase } from '@/app/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Beer } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

export const Navbar = ({
  user,
  setUser,
}: {
  user: User;
  setUser: Dispatch<SetStateAction<User | null>>;
}) => {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Sign-out error:', error.message);
    setUser(null);
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-amber-600/80 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Beer className="h-8 w-8 text-white" />
            <span className="text-white font-bold text-xl">Barcrawl</span>
          </div>

          {/* User info and sign out */}
          <div className="flex items-center space-x-4">
            <span className="text-white">Welcome, {user?.email || 'Anon'}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-lg bg-white/10 text-white font-medium
                   hover:bg-white/20 transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
