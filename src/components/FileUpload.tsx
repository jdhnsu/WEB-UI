'use client';

import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { validateImageFile } from '@/lib/api';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  selectedService: string | null;
}

export default function FileUpload({
  onFileSelect,
  disabled = false,
  selectedService,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    const validation = validateImageFile(file);

    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    onFileSelect(file);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick();
    }
  };

  if (!selectedService) {
    return (
      <div className="card bg-base-100/50 backdrop-blur-md shadow-xl border border-base-200 transition-all duration-500 ease-out hover:shadow-2xl hover:border-primary/30 group">
        <div className="card-body items-center text-center py-16">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center animate-float z-10 relative group-hover:bg-primary/10 transition-colors duration-300">
              <svg
                className="w-12 h-12 text-base-content/30 group-hover:text-primary transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping opacity-20 group-hover:opacity-40"></div>
            <div className="absolute -inset-4 rounded-full border border-base-content/5 animate-[spin_8s_linear_infinite] opacity-30 group-hover:border-primary/20"></div>
          </div>
          
          <h3 className="card-title text-2xl font-bold text-base-content/80 mb-3 group-hover:text-primary transition-colors duration-300">
            请先选择处理类型
          </h3>
          <p className="text-base-content/50 max-w-sm leading-relaxed mb-8">
            为了提供最佳的处理效果，请在<span className="hidden lg:inline font-bold text-primary px-1">左侧列表</span><span className="lg:hidden font-bold text-primary px-1">上方列表</span>选择您需要的服务类型
          </p>

          <div className="flex gap-2 text-sm text-base-content/40 font-mono bg-base-200/50 px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            等待选择服务...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="点击上传图片或拖拽图片到此处"
        onKeyDown={handleKeyDown}
        className={`dropzone group relative overflow-hidden transition-all duration-300 ease-out
          ${isDragging 
            ? 'active border-primary bg-primary/5 scale-[1.02] shadow-xl' 
            : 'border-base-300 hover:border-primary/50 hover:bg-base-200/50 hover:shadow-md'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center gap-6 py-8 relative z-10">
          <div className={`
            w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300
            ${isDragging ? 'bg-primary/20 scale-110' : 'bg-base-200 group-hover:bg-primary/10 group-hover:scale-105'}
          `}>
            <svg
              className={`w-10 h-10 transition-colors duration-300 ${isDragging ? 'text-primary' : 'text-base-content/40 group-hover:text-primary'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <div className="text-center space-y-2">
            <p className={`text-xl font-bold transition-colors duration-300 ${isDragging ? 'text-primary' : 'text-base-content'}`}>
              {isDragging ? '松开鼠标立即上传' : '点击或拖拽上传图片'}
            </p>
            <p className="text-sm text-base-content/60">
              支持 JPG、PNG、WEBP 格式 (最大 10MB)
            </p>
          </div>

          {!disabled && (
            <div 
              className="btn btn-primary btn-md px-8 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300 group-hover:-translate-y-1"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              选择文件
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <svg
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
