import React from 'react';
import { Beer } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';

export const SignIn = () => {
  const handleAnonymousSignIn = async () => {
    const { data, error } = await supabase.auth.signInAnonymously({
      options: {},
    });
    if (error) console.error('Anonymous sign-in error:', error.message);
    else console.log('Anonymous user created:', data.user);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-t from-amber-600 via-yellow-400 to-amber-200">
      {/* Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8 space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <Beer className="h-12 w-12 text-amber-600" />
            <h1 className="text-3xl font-bold text-gray-900 text-center">
              Barcrawl
            </h1>
            <p className="text-gray-600 text-center">
              Join the adventure anonymously - no signup required!
            </p>
          </div>

          <button
            onClick={handleAnonymousSignIn}
            className="w-full py-3 px-4 bg-amber-600 text-white font-medium rounded-lg
                       hover:bg-amber-700 transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
                       flex items-center justify-center space-x-2"
          >
            <span>Start Your Barcrawl</span>
          </button>

          <p className="text-sm text-gray-500 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};
