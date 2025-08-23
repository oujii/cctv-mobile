'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CameraFeed from '@/components/CameraFeed';

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState('');
  const [activeTab, setActiveTab] = useState('Security');
  const router = useRouter();

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

  if (!currentUser) {
    return <div className="bg-gray-800 min-h-screen flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  // Mock camera data - in real app this would come from API
  const cameras = [
    { id: '1', name: 'Garage side S3 Pro 2', model: 'S3 Pro 2', isActive: true, placeholder: 'Garage+Feed' },
    { id: '2', name: 'Back yard S3 Pro 1', model: 'S3 Pro 1', isActive: true, placeholder: 'Backyard+Feed' },
  ];

  // Total camera stats to match reference design
  const totalCameras = 14;
  const activeCameras = 8;

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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
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
                <h2 className="text-sm font-semibold">Wander001 home</h2>
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
              {/* Active User "Adam" */}
              <div className="flex items-center justify-between bg-gray-700/50 p-2 rounded-lg">
                <div className="flex items-center">
                  <Image 
                    src="/user.png" 
                    alt="Adam's avatar" 
                    width={32} 
                    height={32} 
                    className="mr-3" 
                  />
                  <div>
                    <span className="font-medium">Adam</span>
                    <span className="text-xs text-gray-400 ml-1">(You)</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-xs text-green-400">Online</span>
                </div>
              </div>
              {/* Offline User "Carl" */}
              <div className="flex items-center justify-between bg-gray-700/50 p-2 rounded-lg">
                <div className="flex items-center">
                  <Image 
                    src="/user.png" 
                    alt="Carl's avatar" 
                    width={32} 
                    height={32} 
                    className="mr-3 opacity-50" 
                  />
                  <div>
                    <span className="font-medium text-gray-400">Carl</span>
                    <span className="text-xs text-gray-500 ml-1">(Admin)</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                  <span className="text-xs text-red-400">Offline</span>
                </div>
              </div>
            </div>
          </div>

          {/* Camera Feeds */}
          {cameras.map((camera) => (
            <CameraFeed
              key={camera.id}
              id={camera.id}
              name={camera.name}
              model={camera.model}
              isActive={camera.isActive}
              placeholder={camera.placeholder}
              showControls={true}
            />
          ))}
        </main>

        {/* Bottom Navigation Bar */}
        <footer className="bg-[#1D2939] px-4 py-2 pb-6 sticky bottom-0">
          <div className="flex justify-around items-center text-gray-400">
            {bottomNavItems.map((item) => (
              <a
                key={item.name}
                href="#"
                className={`flex items-center justify-center py-1 ${item.active ? 'text-blue-500' : ''}`}
              >
                <Image 
                  src={item.icon} 
                  alt={item.name}
                  width={28} 
                  height={28} 
                  className={`mx-auto ${item.active ? 'brightness-0 invert sepia saturate-200 hue-rotate-180' : 'opacity-60 brightness-0 invert'}`}
                />
              </a>
            ))}
          </div>
        </footer>
    </div>
  );
}