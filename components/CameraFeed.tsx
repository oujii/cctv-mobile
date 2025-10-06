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
  heightVariant?: 'short' | 'full';
  isExpanded?: boolean;
  isFocused?: boolean;
  showGray?: boolean;
  videoState?: number; // 1=day videos, 2=night videos, 3=night videos + green
  blackVideoTriggered?: boolean;
  onTap?: () => void;
}

export default function CameraFeed({
  id,
  name,
  model,
  isActive = true,
  placeholder,
  showControls = true,
  heightVariant = 'full',
  isExpanded = false,
  isFocused = false,
  showGray = false,
  videoState = 1,
  blackVideoTriggered = false,
  onTap
}: CameraFeedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [, setHasError] = useState(false);

  // For future real video integration
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Simulate loading delay for placeholder
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000 + Math.random() * 2000); // Random delay 1-3s

    return () => clearTimeout(timer);
  }, []);

  // Handle black.mp4 manual trigger
  useEffect(() => {
    const video = videoRef.current;
    const videoSource = getVideoSource();

    if (video && blackVideoTriggered && videoSource === '/black.mp4') {
      video.currentTime = 0;
      video.play().catch(err => console.error('Failed to play black.mp4:', err));
    }
  }, [blackVideoTriggered]);

  useEffect(() => {
    // Set canvas dimensions to match video
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (canvas && video && !isLoading && !showGray) {
      const updateCanvasSize = () => {
        const rect = video.getBoundingClientRect();
        canvas.width = rect.width || 300;
        canvas.height = rect.height || 200;
      };

      // Set initial size
      updateCanvasSize();

      // Update on video load and resize
      video.addEventListener('loadedmetadata', updateCanvasSize);
      window.addEventListener('resize', updateCanvasSize);

      return () => {
        video.removeEventListener('loadedmetadata', updateCanvasSize);
        window.removeEventListener('resize', updateCanvasSize);
      };
    }
  }, [isLoading, showGray]);

  useEffect(() => {
    // Optimized CCTV Grain Effect using tile-based approach
    const canvas = canvasRef.current;
    if (!canvas || isLoading || showGray) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const GRAIN_INTENSITY = 0.10; // Intensity (0..1)
    const TILE_WIDTH = 320;
    const TILE_HEIGHT = 180;
    
    // Create off-screen canvas for grain tile
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return;
    
    offCanvas.width = TILE_WIDTH;
    offCanvas.height = TILE_HEIGHT;
    
    let animationId: number;
    let lastTime = 0;

    const generateGrain = (timestamp: number) => {
      // Limit to ~30fps
      if (timestamp - lastTime < 33) {
        animationId = requestAnimationFrame(generateGrain);
        return;
      }
      lastTime = timestamp;
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      if (canvasWidth === 0 || canvasHeight === 0) {
        animationId = requestAnimationFrame(generateGrain);
        return;
      }
      
      // Generate grain tile
      const imageData = offCtx.createImageData(TILE_WIDTH, TILE_HEIGHT);
      const data = imageData.data;
      
      for (let i = 0; i < TILE_WIDTH * TILE_HEIGHT; i++) {
        const noise = (Math.random() * 255) | 0;
        const offset = i << 2;
        data[offset] = noise;     // Red
        data[offset + 1] = noise; // Green  
        data[offset + 2] = noise; // Blue
        data[offset + 3] = 255;   // Alpha (opaque)
      }
      
      offCtx.putImageData(imageData, 0, 0);
      
      // Draw scaled grain to main canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.globalAlpha = GRAIN_INTENSITY;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(offCanvas, 0, 0, TILE_WIDTH, TILE_HEIGHT, 0, 0, canvasWidth, canvasHeight);
      ctx.globalAlpha = 1;
      
      animationId = requestAnimationFrame(generateGrain);
    };

    // Start grain animation
    animationId = requestAnimationFrame(generateGrain);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isLoading, showGray]);

  const getVideoSource = () => {
    // Use different video sets based on videoState
    const dayVideos = ['/d-hall.mp4', '/d-hiss.mp4', '/d-kok.mp4', '/d-matsal.mp4', '/d-pool.mp4', '/d-sovrum.mp4', '/d-spa.mp4', '/d-ute.mp4', '/d-vardagsrum.mp4'];
    const nightVideos = ['/n5.mp4', '/n4.mp4', '/n7.mp4', '/n3.mp4', '/n1.mp4', '/black.mp4', '/n6.mp4', '/n2.mp4', '/n8.mp4'];

    const videos = (videoState === 1 || videoState === 2) ? nightVideos : dayVideos;

    return videos[parseInt(id) % videos.length] || videos[0];
  };

  const getHeightClass = () => {
    if (isFocused) return 'h-64'; // Larger when focused
    if (isExpanded && heightVariant === 'full') return 'h-32'; // Full cards in short state
    if (heightVariant === 'short' && !isExpanded) return 'h-32'; // Short cards in default state
    return 'h-48'; // Full height (default full cards or expanded short cards)
  };

  return (
    <div 
      className={`relative rounded-2xl overflow-hidden mb-4 group cursor-pointer transition-all duration-300 ${
        isFocused ? 'transform scale-105 z-50' : ''
      }`}
      onClick={onTap}
    >
      {/* Loading State */}
      {isLoading && (
        <div className={`w-full ${getHeightClass()} bg-gray-700 animate-pulse flex items-center justify-center`}>
          <div className="text-gray-400 text-sm">Loading feed...</div>
        </div>
      )}

      {/* Camera Feed */}
      {!isLoading && (
        <>
          {showGray ? (
            /* Green placeholder for first camera (greenscreen for post-production) */
            <div 
              className={`w-full ${getHeightClass()} bg-[#093] transition-all duration-300`}
            />
          ) : (
            /* Real video feeds with grain overlay */
            <div className="relative">
              <video
                ref={videoRef}
                className={`w-full ${getHeightClass()} object-cover transition-all duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-50'
                }`}
                autoPlay={getVideoSource() !== '/black.mp4'}
                muted
                loop
                playsInline
                src={getVideoSource()}
                onError={() => setHasError(true)}
              />
              {/* CCTV Grain Overlay */}
              <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full ${getHeightClass()} pointer-events-none`}
                style={{ mixBlendMode: 'overlay' }}
              />
            </div>
          )}

          {/* Gradient Overlay - skip for gray cameras */}
          {!showGray && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          )}

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
                <span className={`text-xs ${isActive ? 'text-white' : 'text-red-500'}`}>{isActive ? 'Live' : 'Offline'}</span>
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