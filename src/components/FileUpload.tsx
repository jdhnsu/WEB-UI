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
      <div className="card bg-base-100/50 backdrop-blur-md shadow-xl border border-base-200">
        <div className="card-body items-center text-center py-12">
          <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <svg
              className="w-10 h-10 text-base-content/30"
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
          <h3 className="card-title text-xl text-base-content/70 mb-2">请先选择处理类型</h3>
          <p className="text-base-content/50 max-w-xs">
            为了提供最佳的处理效果，请先在左侧选择您需要的服务类型
          </p>
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
