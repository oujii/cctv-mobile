'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CameraFeed from '@/components/CameraFeed';

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState('');
  const [activeTab, setActiveTab] = useState('Security');
  const [activeUser, setActiveUser] = useState<'adam' | 'carl'>('adam'); // Who is "(You)"
  const [otherUserOnline, setOtherUserOnline] = useState(false); // Other user's online status
  const [expandedCameras, setExpandedCameras] = useState<Set<string>>(new Set());
  const [focusedCamera, setFocusedCamera] = useState<string | null>(null);
  const [videoState, setVideoState] = useState(1); // 1=day videos, 2=day videos + green, 3=night videos, 4=night videos + green
  const router = useRouter();

  // Register service worker and request notification permission on component mount
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => {
          console.log('Service Worker registered');
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch((error) => {
        console.error('Notification permission request failed:', error);
      });
    }
  }, []);

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('vigilance-auth');
    const username = localStorage.getItem('vigilance-user');
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setCurrentUser(username || 'User');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('vigilance-auth');
    localStorage.removeItem('vigilance-user');
    router.push('/login');
  };

  const handleUserTap = () => {
    setActiveUser((prevUser) => prevUser === 'adam' ? 'carl' : 'adam');
  };

  const handlePlusIconTap = () => {
    setOtherUserOnline((prevStatus) => !prevStatus);
  };

  const handleVideoStateToggle = () => {
    setVideoState((prevState) => (prevState % 4) + 1);
  };

  const handleNotificationTrigger = () => {
    // Stealth notification trigger - 5 second delay
    setTimeout(async () => {
      if ('Notification' in window && Notification.permission === 'granted') {
        // Use Service Worker API for Android compatibility
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          registration.showNotification('Vigilance', {
            body: 'Carl (owner) started watching',
            icon: '/icon-192x192.png',
            badge: '/icon-72x72.png',
            tag: 'vigilance-watching',
            requireInteraction: false,
            silent: false
          });
        } else {
          // Fallback for browsers without service worker support
          new Notification('Vigilance', {
            body: 'Carl (owner) started watching'
          });
        }
      }
    }, 5000);
  };

  const handleCameraTap = (cameraId: string, heightVariant: 'short' | 'full') => {
    const isExpanded = expandedCameras.has(cameraId);
    const isFocused = focusedCamera === cameraId;
    
    // For cards that start as 'short'
    if (heightVariant === 'short' && !isExpanded && !isFocused) {
      // State 1 → State 2: Short → Full height
      setExpandedCameras(prev => new Set(prev).add(cameraId));
      setFocusedCamera(null);
    } else if (heightVariant === 'short' && isExpanded && !isFocused) {
      // State 2 → State 3: Full → Focused
      setFocusedCamera(cameraId);
    } else if (heightVariant === 'short' && isFocused) {
      // State 3 → State 1: Focused → Short (reset)
      setFocusedCamera(null);
      setExpandedCameras(prev => {
        const newSet = new Set(prev);
        newSet.delete(cameraId);
        return newSet;
      });
    }
    
    // For cards that start as 'full' 
    else if (heightVariant === 'full' && !isExpanded && !isFocused) {
      // State 1 → State 2: Full → Focused
      setFocusedCamera(cameraId);
    } else if (heightVariant === 'full' && isFocused) {
      // State 2 → State 3: Focused → Short
      setFocusedCamera(null);
      setExpandedCameras(prev => new Set(prev).add(cameraId));
    } else if (heightVariant === 'full' && isExpanded && !isFocused) {
      // State 3 → State 1: Short → Full (reset)
      setExpandedCameras(prev => {
        const newSet = new Set(prev);
        newSet.delete(cameraId);
        return newSet;
      });
    }
  };

  const getUsersConfig = () => {
    if (activeUser === 'adam') {
      return [
        { name: 'Adam', role: '(You)', isOnline: true, avatar: '/user.png' },
        { name: 'Carl', role: '(Admin)', isOnline: otherUserOnline, avatar: '/carl-icon.png' }
      ];
    } else {
      return [
        { name: 'Carl', role: '(You)', isOnline: true, avatar: '/carl-icon.png' },
        { name: 'Adam', role: '(Guest)', isOnline: otherUserOnline, avatar: '/user.png' }
      ];
    }
  };

  if (!currentUser) {
    return <div className="bg-gray-800 min-h-screen flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  // Mock camera data - in real app this would come from API
  const cameras = [
    { id: '1', name: 'ADC6-10-M022', model: 'PAN 2500 HD', isActive: true, placeholder: 'Garage+Feed', heightVariant: 'full' as const },
    { id: '2', name: 'BDH4-15-S081', model: 'PAN 2500 HD', isActive: true, placeholder: 'Backyard+Feed', heightVariant: 'full' as const, showGray: videoState === 2 },
    { id: '3', name: 'CDK2-08-X104', model: 'PAN 2500 HD', isActive: true, placeholder: 'Office+Feed', heightVariant: 'short' as const, showGray: videoState === 2 },
    { id: '4', name: 'DFL7-22-Y045', model: 'PAN 2500 HD', isActive: true, placeholder: 'Workshop+Feed', heightVariant: 'short' as const },
    { id: '5', name: 'EGM9-31-Z067', model: 'PAN 2500 HD', isActive: true, placeholder: 'Front+Feed', heightVariant: 'full' as const, showGray: videoState === 4 },
    { id: '6', name: 'FHN3-17-A129', model: 'PAN 2500 HD', isActive: true, placeholder: 'Outside2+Feed', heightVariant: 'short' as const },
    { id: '7', name: 'GJP5-26-B088', model: 'PAN 2500 HD', isActive: true, placeholder: 'Entrance+Feed', heightVariant: 'short' as const },
    { id: '8', name: 'HKQ8-13-C156', model: 'PAN 2500 HD', isActive: true, placeholder: 'Driveway+Feed', heightVariant: 'full' as const },
    { id: '9', name: 'ILR1-29-D093', model: 'PAN 2500 HD', isActive: true, placeholder: 'Side+Feed', heightVariant: 'short' as const },
  ];

  // Total camera stats to match reference design
  const totalCameras = 14;
  const activeCameras = 14;

  const tabs = ['Favorites', 'Security', 'Care', 'Lights'];
  const bottomNavItems = [
    { name: 'Home', icon: '/ic_baseline-home.png', active: true },
    { name: 'Events', icon: '/mage_dashboard-fill.png' },
    { name: 'Services', icon: '/bxs_user.png' },
    { name: 'Settings', icon: '/mdi_cog.png' }
  ];

  return (
    <div className="bg-[#101828] text-white min-h-screen flex flex-col">

        {/* App Header */}
        <header className="px-4 pt-4 pb-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <button 
              onClick={handleLogout}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <Image 
                src="/logoi.png" 
                alt="VIGILANCE" 
                width={120} 
                height={24} 
              />
            </button>

            <div className="flex items-center space-x-4">
              {/* Bell Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a1 1 0 00-2 0v.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Plus Icon */}
              <button onClick={handlePlusIconTap} className="hover:opacity-80 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow overflow-y-auto no-scrollbar px-4">
          {/* Navigation Tabs */}
          <nav className="flex space-x-6 border-b border-gray-700 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-blue-500 font-semibold'
                    : 'text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Signed In User Bar */}
          <div className="flex justify-between items-center bg-[#1D2939] rounded-lg p-2 mb-4">
            <div className="flex items-center space-x-3">
              <Image 
                src="/homename.png" 
                alt="Home" 
                width={32} 
                height={32} 
                className="rounded-full" 
              />
              <div className="flex items-center space-x-1">
                <h2 className="text-sm font-semibold">CW001 home</h2>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* System Status Dashboard */}
          <div className="bg-[#1D2939] rounded-2xl p-4 mb-4">
            <div className="flex justify-around text-center mb-4 border-b border-gray-700 pb-4">
              <div>
                <p className="text-lg font-semibold text-white">
                  {activeCameras} <span className="text-sm text-gray-400">/ {totalCameras}</span>
                </p>
                <p className="text-xs text-gray-400">Active Cameras</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-white">99.8%</p>
                <p className="text-xs text-gray-400">System Health</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-white">85%</p>
                <p className="text-xs text-gray-400">Storage</p>
              </div>
            </div>
            
            {/* User Status Section */}
            <div className="space-y-2">
              {getUsersConfig().map((user, index) => (
                <div 
                  key={`${user.name}-${index}`}
                  onClick={handleUserTap}
                  className="flex items-center justify-between bg-gray-700/50 p-2 rounded-lg cursor-pointer hover:bg-gray-700/70 transition-colors active:bg-gray-700/80"
                >
                  <div className="flex items-center">
                    <Image 
                      src={user.avatar} 
                      alt={`${user.name}'s avatar`} 
                      width={32} 
                      height={32} 
                      className={`mr-3 ${!user.isOnline ? 'opacity-50' : ''}`}
                    />
                    <div>
                      <span className={`font-medium ${!user.isOnline ? 'text-gray-400' : ''}`}>
                        {user.name}
                      </span>
                      <span className={`text-xs ml-1 ${!user.isOnline ? 'text-gray-500' : 'text-gray-400'}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {user.isOnline ? (
                      <>
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-xs text-green-400">Online</span>
                      </>
                    ) : (
                      <>
                        <Image 
                          src="/offline.png" 
                          alt="Offline" 
                          width={8} 
                          height={8} 
                          className="w-2.5 h-2.5 mr-2"
                        />
                        <span className="text-xs text-red-500">Offline</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Camera Feeds */}
          <div className="relative">
            {/* Background Overlay for Focus Mode */}
            {focusedCamera && (
              <div className="fixed inset-0 bg-black/70 z-40 pointer-events-none" />
            )}
            
            {cameras.map((camera) => (
              <CameraFeed
                key={camera.id}
                id={camera.id}
                name={camera.name}
                model={camera.model}
                isActive={camera.isActive}
                placeholder={camera.placeholder}
                showControls={true}
                heightVariant={camera.heightVariant}
                isExpanded={expandedCameras.has(camera.id)}
                isFocused={focusedCamera === camera.id}
                showGray={camera.showGray}
                videoState={videoState}
                onTap={() => handleCameraTap(camera.id, camera.heightVariant)}
              />
            ))}
          </div>
        </main>

        {/* Bottom Navigation Bar */}
        <footer className="bg-[#1D2939] px-4 py-2 pb-8 sticky bottom-0">
          <div className="flex justify-around items-center text-gray-400">
            {bottomNavItems.map((item, index) => (
              <button
                key={item.name}
                onClick={index === 1 ? handleNotificationTrigger : index === 3 ? handleVideoStateToggle : undefined} // Events icon (index 1) triggers notification, Settings icon (last item) is clickable
                className={`flex items-center justify-center py-1 ${item.active ? 'text-blue-500' : ''} ${(index === 1 || index === 3) ? 'cursor-pointer' : ''}`}
              >
                <Image 
                  src={item.icon} 
                  alt={item.name}
                  width={28} 
                  height={28} 
                  className={`mx-auto ${item.active ? 'brightness-0 invert sepia saturate-200 hue-rotate-180' : 'opacity-60 brightness-0 invert'}`}
                />
              </button>
            ))}
          </div>
        </footer>
    </div>
  );
}