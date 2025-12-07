import React, { useState, useEffect, useRef } from 'react';
import { GeneratedImage } from '../types';

interface CoverFlowProps {
  images: GeneratedImage[];
}

const CoverFlow: React.FC<CoverFlowProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartY = useRef<number | null>(null);

  // Reset index when images array is rebuilt
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  if (images.length === 0) return null;

  const handleWheel = (e: React.WheelEvent) => {
    // Debounce small movements
    if (Math.abs(e.deltaY) < 10) return;
    
    if (e.deltaY > 0) {
      setCurrentIndex((prev) => Math.min(prev + 1, images.length - 1));
    } else {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const diff = touchStartY.current - e.touches[0].clientY;
    
    // Sensitivity threshold
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setCurrentIndex((prev) => Math.min(prev + 1, images.length - 1));
      } else {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const getAmbientColor = (colorName: string) => {
    // Return tailwind gradient strings based on color
    const map: Record<string, string> = {
      'red': 'from-red-500/30',
      'orange': 'from-orange-500/30',
      'yellow': 'from-yellow-400/30',
      'green': 'from-green-500/30',
      'blue': 'from-blue-500/30',
      'purple': 'from-purple-500/30',
    };
    return map[colorName.toLowerCase()] || 'from-gray-400/30';
  };

  return (
    <div 
      className="w-full h-full relative overflow-hidden bg-[#fbfbfd] cursor-ns-resize select-none"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Dynamic Ambient Background */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b ${getAmbientColor(images[currentIndex].color)} via-transparent to-transparent opacity-50 transition-colors duration-1000 ease-in-out`} 
      />

      <div className="absolute inset-0 flex items-center justify-center perspective-1000 transform-style-3d">
        {images.map((img, index) => {
          const offset = index - currentIndex;
          const absOffset = Math.abs(offset);
          
          // Performance optimization: Don't render items far off screen
          if (absOffset > 4) return null;

          // Apple Music Vertical Flow Math
          // Items stack vertically with a 3D rotation
          
          const yBase = 90; // Spacing between items
          const zBase = -100; // Depth step
          const rotBase = 45; // Rotation angle
          
          const translateY = offset * yBase;
          // Items get pushed back in Z space as they move away from center
          const translateZ = absOffset * zBase;
          // Top items rotate back, Bottom items rotate forward
          const rotateX = -offset * rotBase * 0.8; 
          
          const scale = Math.max(0.7, 1 - (absOffset * 0.1));
          const opacity = Math.max(0, 1 - (absOffset * 0.3));
          
          // Center item is on top
          const zIndex = 100 - absOffset;

          return (
            <div
              key={img.id}
              onClick={() => setCurrentIndex(index)}
              className={`
                absolute w-[440px] h-[330px] bg-white rounded-2xl
                transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]
                cursor-pointer
                ${offset === 0 ? 'shadow-2xl shadow-black/20' : 'shadow-lg'}
              `}
              style={{
                transform: `
                  perspective(1200px)
                  translate3d(0, ${translateY}px, ${translateZ}px) 
                  rotateX(${rotateX}deg) 
                  scale(${scale})
                `,
                zIndex,
                opacity,
                border: offset === 0 ? '6px solid white' : '1px solid rgba(255,255,255,0.5)',
              }}
            >
              <div className="w-full h-full relative overflow-hidden rounded-[10px] bg-gray-100">
                <img
                  src={img.url}
                  alt={img.color}
                  className="w-full h-full object-cover"
                />
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-white/20 pointer-events-none mix-blend-overlay" />
              </div>
              
              {/* Label - Only shows for active item */}
              <div className={`
                absolute -bottom-16 left-0 w-full text-center transition-all duration-500
                ${offset === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
              `}>
                <span className="inline-block px-5 py-2 rounded-full bg-white/80 backdrop-blur-xl text-gray-900 font-bold text-sm tracking-widest uppercase shadow-lg ring-1 ring-black/5">
                  {img.color}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Scroll Indicators (Right Side) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        {images.map((_, idx) => (
          <div 
            key={idx}
            className={`
              w-1.5 rounded-full transition-all duration-500 ease-out
              ${idx === currentIndex ? 'h-10 bg-gray-800 shadow-md' : 'h-1.5 bg-gray-300 hover:bg-gray-400'}
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default CoverFlow;