'use client';

import { useState, useRef, MouseEvent, TouchEvent, useEffect } from 'react';
import { downloadImage } from '@/lib/api';

interface ImageComparisonProps {
  originalImage: string;
  processedImage: string;
  fileName: string;
  onReset: () => void;
  onReprocess: () => void;
  onScrollComplete?: () => void;
}

export default function ImageComparison({
  originalImage,
  processedImage,
  fileName,
  onReset,
  onReprocess,
  onScrollComplete,
}: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const containerRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  // Auto scroll to view on mount
  useEffect(() => {
    if (componentRef.current) {
      // Calculate position with 20px offset
      const element = componentRef.current;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 20;

      // Smooth scroll
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Trigger callback after animation (approx 500ms)
      const timer = setTimeout(() => {
        if (onScrollComplete) {
          onScrollComplete();
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [onScrollComplete]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current || e.touches.length === 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleDownload = () => {
    const timestamp = new Date().getTime();
    const name = fileName.replace(/\.[^/.]+$/, '') || 'processed';
    downloadImage(processedImage, `${name}_processed_${timestamp}.png`);
  };

  return (
    <div ref={componentRef} className="space-y-6 scroll-mt-20">
      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-base-content">处理结果</h3>
        <div className="join">
          <button
            className={`join-item btn btn-sm ${
              viewMode === 'slider' ? 'btn-active btn-primary' : ''
            }`}
            onClick={() => setViewMode('slider')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12m-12 5h12M4 7h.01M4 12h.01M4 17h.01" />
            </svg>
            滑块对比
          </button>
          <button
            className={`join-item btn btn-sm ${
              viewMode === 'side-by-side' ? 'btn-active btn-primary' : ''
            }`}
            onClick={() => setViewMode('side-by-side')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            左右对比
          </button>
        </div>
      </div>

      {/* Image Comparison */}
      {viewMode === 'slider' ? (
        <div
          ref={containerRef}
          className="relative w-full aspect-video bg-base-200 rounded-box overflow-hidden cursor-ew-resize select-none"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Processed Image (Full) */}
          <div className="absolute inset-0">
            <img
              src={processedImage}
              alt="Processed"
              className="w-full h-full object-contain alpha-background"
              draggable={false}
            />
          </div>

          {/* Original Image (Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={originalImage}
              alt="Original"
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>

          {/* Slider Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize z-10"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full shadow-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-primary-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-4 left-4 badge badge-neutral badge-lg">原图</div>
          <div className="absolute top-4 right-4 badge badge-primary badge-lg">处理后</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original Image */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body p-4">
              <h4 className="card-title text-sm mb-2">原图</h4>
              <div className="aspect-video rounded-box overflow-hidden bg-base-300">
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Processed Image */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body p-4">
              <h4 className="card-title text-sm mb-2">处理后</h4>
              <div className="aspect-video rounded-box overflow-hidden alpha-background">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button onClick={handleDownload} className="btn btn-primary btn-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          下载结果
        </button>

        <button onClick={onReprocess} className="btn btn-secondary btn-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          重新处理
        </button>

        <button onClick={onReset} className="btn btn-ghost btn-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          重新开始
        </button>
      </div>
    </div>
  );
}
