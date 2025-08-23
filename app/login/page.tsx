'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showInviteMessage, setShowInviteMessage] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate coming from an invite link
    const timer = setTimeout(() => {
      setShowInviteMessage(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);


  const handleQuickLogin = async () => {
    setIsLoading(true);
    
    // Quick login with saved credentials
    await new Promise(resolve => setTimeout(resolve, 800));
    
    localStorage.setItem('vigilance-auth', 'true');
    localStorage.setItem('vigilance-user', 'Adam');
    router.push('/dashboard');
  };

  if (showInviteMessage) {
    return (
      <div className="bg-[#101828] text-white min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4">
          <Image 
            src="/logoi.png" 
            alt="VIGILANCE" 
            width={160} 
            height={32} 
            className="mx-auto mb-6" 
          />
          <div className="bg-[#1D2939] rounded-2xl p-6 max-w-sm">
            <h2 className="text-lg font-semibold mb-2">You&apos;re Invited!</h2>
            <p className="text-gray-300 text-sm mb-4">
              Carl has invited you to access the Wander001 home security system.
            </p>
            <div className="flex items-center space-x-3 bg-gray-700/30 rounded-lg p-3">
              <Image 
                src="/user.png" 
                alt="Adam" 
                width={32} 
                height={32} 
              />
              <div className="text-left">
                <div className="font-medium">Adam</div>
                <div className="text-xs text-gray-400">Invited User</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#101828] text-white min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-grow px-4 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full space-y-8">
          
          {/* Logo positioned between top and content */}
          <div className="text-center">
            <Image 
              src="/logoi.png" 
              alt="VIGILANCE" 
              width={180} 
              height={36} 
              className="mx-auto mb-2" 
            />
            <p className="text-sm text-gray-400">Security System</p>
          </div>
          
          {/* Saved Account */}
          <div className="bg-[#1D2939] rounded-2xl p-4">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-white mb-1">Sign In</h2>
              <p className="text-gray-400 text-sm">Choose your account</p>
            </div>
            
            <div className="flex items-center space-x-3 bg-gray-700/30 rounded-lg p-3 mb-4">
              <Image 
                src="/user.png" 
                alt="Adam" 
                width={40} 
                height={40} 
              />
              <div className="flex-1 text-left">
                <div className="font-medium text-white">Adam</div>
                <div className="text-xs text-gray-400">Invited by Carl</div>
              </div>
              <div className="text-xs text-green-400">✓ Saved</div>
            </div>
            
            <button
              onClick={handleQuickLogin}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Continue as Adam'
              )}
            </button>
          </div>

          {/* Alternative Login */}
          <div className="text-center">
            <button 
              onClick={() => {/* Show manual login form */}}
              className="text-gray-400 text-sm hover:text-gray-300 transition-colors"
            >
              Sign in with different account
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-4 text-center">
        <p className="text-xs text-gray-500">Vigilance Security © 2025</p>
      </footer>
    </div>
  );
}