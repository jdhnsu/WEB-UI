'use client';

import { useState, useRef, MouseEvent, TouchEvent } from 'react';
import Image from 'next/image';

interface CompetitorComparisonProps {
  originalImage?: string;
}

export default function CompetitorComparison({
  originalImage = '/images/contrast/original.png',
}: CompetitorComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Competitor data
  const competitors = [
    { id: 'cleanshot', name: '智绘(CleanShot)', image: '/images/contrast/cleanshot.png' },
    { id: 'ali', name: '阿里云', image: '/images/contrast/ali.png' },
    { id: 'meituxiuxiu', name: '美图秀秀', image: '/images/contrast/meituxiuxiu.jpg' },
    { id: 'oppoai', name: 'OPPO AI', image: '/images/contrast/oppoai.png' },
    { id: 'zuotang', name: '佐糖', image: '/images/contrast/zuotang.png' },
  ];

  const [selectedCompetitorId, setSelectedCompetitorId] = useState('cleanshot');
  
  const selectedCompetitor = competitors.find(c => c.id === selectedCompetitorId) || competitors[0];

  // Mouse/Touch handlers for slider
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchStart = () => setIsDragging(true);
  const handleTouchEnd = () => setIsDragging(false);

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div className="space-y-8">
      {/* Competitor Selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {competitors.map((comp) => (
          <button
            key={comp.id}
            onClick={() => setSelectedCompetitorId(comp.id)}
            className={`btn btn-sm md:btn-md ${
              selectedCompetitorId === comp.id 
                ? 'btn-primary' 
                : 'btn-outline'
            }`}
          >
            {comp.name}
          </button>
        ))}
      </div>

      {/* Comparison Slider */}
      <div className="card bg-base-200 shadow-xl overflow-hidden max-w-4xl mx-auto">
        <div className="card-body p-0">
          <div
            ref={containerRef}
            className="relative w-full aspect-video cursor-ew-resize select-none overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Processed Image (Right/Full) */}
            <div className="absolute inset-0">
              <div className="relative w-full h-full">
                <Image
                  src={selectedCompetitor.image}
                  alt={selectedCompetitor.name}
                  fill
                  className="object-contain bg-base-300"
                  draggable={false}
                  unoptimized // Since these are local files or might vary in format
                />
              </div>
            </div>

            {/* Original Image (Left/Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={originalImage}
                  alt="原始图片"
                  fill
                  className="object-contain bg-base-300"
                  draggable={false}
                  unoptimized
                />
              </div>
            </div>

            {/* Slider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 badge badge-neutral badge-lg bg-black/50 border-none text-white backdrop-blur-sm">
              原始图片
            </div>
            <div className="absolute top-4 right-4 badge badge-primary badge-lg shadow-lg">
              {selectedCompetitor.name}
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-center text-sm text-base-content/60">
        拖动滑块对比处理效果
      </p>
    </div>
  );
}
