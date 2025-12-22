'use client';

import { useState, useEffect } from 'react';
import { ProcessingStatus as Status } from '@/types';

interface ProcessingStatusProps {
  status: Status;
  error: string | null;
  onRetry?: () => void;
  serviceName?: string;
  processingImage?: string;
}

export default function ProcessingStatus({
  status,
  error,
  onRetry,
  serviceName,
  processingImage,
}: ProcessingStatusProps) {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (status === 'processing') {
      setShowOverlay(true);
      const timer = setTimeout(() => setShowOverlay(false), 800);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (status === 'idle') {
    return null;
  }

  if (status === 'uploading') {
    return (
      <div className="alert alert-info shadow-lg">
        <div>
          <svg
            className="stroke-current flex-shrink-0 h-6 w-6 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <div>
            <h3 className="font-bold">正在上传图片...</h3>
            <div className="text-xs">请稍候，正在读取您的图片</div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className="card bg-base-200 shadow-xl w-full">
        <div className="card-body items-center text-center space-y-6">
          {processingImage ? (
            <div className="relative group">
              <div 
                className="rounded-box overflow-hidden bg-base-300 max-w-md transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-2xl hover:-translate-y-2 will-change-transform"
                style={{
                  animation: 'float 3s ease-in-out infinite'
                }}
              >
                <img
                  src={processingImage}
                  alt="Processing"
                  className="max-w-full opacity-50"
                />
                
                {/* Floating overlay animation */}
                {showOverlay && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none will-change-opacity"
                    style={{
                      animation: 'scan 0.8s ease-in-out forwards',
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-base-100/90 rounded-box p-8 shadow-xl">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-warning shadow-lg">
              <div>
                <span className="loading loading-spinner loading-md"></span>
                <div>
                  <h3 className="font-bold">AI 处理中...</h3>
                  <div className="text-xs">
                    {serviceName ? `使用 ${serviceName} 处理图片` : '正在处理您的图片，这可能需要几秒钟'}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-bold mb-2">AI 正在处理您的图片</h3>
            <p className="text-base-content/60">
              {serviceName ? `${serviceName} - ` : ''}这可能需要几秒钟...
            </p>
            <progress className="progress progress-primary w-64 mt-4"></progress>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="alert alert-success shadow-lg">
        <div>
          <svg
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-bold">处理完成!</h3>
            <div className="text-xs">图片已成功处理，可以查看和下载结果</div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <svg
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-bold">处理失败</h3>
            <div className="text-xs">{error || '发生未知错误，请重试'}</div>
          </div>
        </div>
        {onRetry && (
          <div className="flex-none">
            <button onClick={onRetry} className="btn btn-sm btn-error btn-outline">
              重试
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
