'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface CameraFeedProps {
  id: string;
  name: string;
  model?: string;
  isActive?: boolean;
  placeholder?: string;
  showControls?: boolean;
}

export default function CameraFeed({
  id,
  name,
  model,
  isActive = true,
  placeholder,
  showControls = true
}: CameraFeedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [, setHasError] = useState(false);

  // For future real video integration
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Simulate loading delay for placeholder
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000 + Math.random() * 2000); // Random delay 1-3s

    return () => clearTimeout(timer);
  }, []);

  const getVideoSource = () => {
    // Use real videos for camera feeds
    const videos = ['/0823.mp4', '/0824.mp4'];
    return videos[parseInt(id) % videos.length] || videos[0];
  };

  return (
    <div className="relative rounded-2xl overflow-hidden mb-4 group">
      {/* Loading State */}
      {isLoading && (
        <div className="w-full h-48 bg-gray-700 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading feed...</div>
        </div>
      )}

      {/* Camera Feed */}
      {!isLoading && (
        <>
          {/* Real video feeds */}
          <video
            ref={videoRef}
            className={`w-full h-48 object-cover transition-opacity ${
              isActive ? 'opacity-100' : 'opacity-50'
            }`}
            autoPlay
            muted
            loop
            playsInline
            src={getVideoSource()}
            onError={() => setHasError(true)}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          {/* Feed Info */}
          <div className="absolute bottom-3 left-3 text-white">
            <h3 className="font-semibold text-sm">{name}</h3>
            {model && (
              <p className="text-xs text-gray-300 opacity-80">{model}</p>
            )}
            <div className="flex items-center space-x-2 text-xs text-gray-300 mt-1">
              {/* Radio Waves Icon */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 512 512" 
                fill="currentColor" 
                className="w-3 h-3"
              >
                <circle cx="256" cy="256" r="48"/>
                <path d="M158.6 353.4c-53.4-53.4-53.4-140.2 0-193.6l-30.2-30.2c-70 70-70 183.9 0 253.9l30.2-30.1zM353.4 353.4l30.2 30.2c70-70 70-183.9 0-253.9l-30.2 30.2c53.4 53.4 53.4 140.2 0 193.6zM107 405c-82.7-82.7-82.7-216.7 0-299.3L76.8 75.5c-99.5 99.5-99.5 260.5 0 360l30.2-30.5zM405 405c82.7-82.7 82.7-216.7 0-299.3l30.2-30.2c99.5 99.5 99.5 260.5 0 360L405 405z"/>
              </svg>
              
              {/* Status Indicator */}
              <div className="flex items-center space-x-1">
                {isActive ? (
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                ) : (
                  <Image 
                    src="/offline.png" 
                    alt="Offline" 
                    width={6} 
                    height={6} 
                    className="w-1.5 h-1.5"
                  />
                )}
                <span className={`text-xs ${isActive ? 'text-white' : 'text-gray-400'}`}>{isActive ? 'Live' : 'Offline'}</span>
              </div>

              {/* Signal Strength - simulated */}
              <div className="flex space-x-0.5">
                {[1, 2, 3].map((bar) => (
                  <div
                    key={bar}
                    className={`w-1 h-2 rounded-sm ${
                      bar <= 2 ? 'bg-green-400' : 'bg-gray-500'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          {showControls && (
            <div className="absolute bottom-3 right-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Record Button */}
              <button className="bg-black/50 rounded-full h-8 w-8 flex items-center justify-center hover:bg-black/70 transition-colors">
                <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
              </button>
              
              {/* Alert Count */}
              <button className="bg-black/50 rounded-full h-8 w-8 flex items-center justify-center font-semibold text-xs hover:bg-black/70 transition-colors">
                0
              </button>
              
              {/* More Options */}
              <button className="bg-black/50 rounded-full h-8 w-8 flex items-center justify-center hover:bg-black/70 transition-colors">
                <Image 
                  src="https://img.icons8.com/?id=120374&format=png&size=16&color=FFFFFF" 
                  alt="More options" 
                  width={16} 
                  height={16} 
                />
              </button>
            </div>
          )}

          {/* Offline Overlay */}
          {!isActive && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-red-400 text-sm font-semibold">OFFLINE</div>
                <div className="text-gray-300 text-xs mt-1">Camera unavailable</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}