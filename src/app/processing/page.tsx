'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ServiceSelector from '@/components/ServiceSelector';
import FileUpload from '@/components/FileUpload';
import ImageComparison from '@/components/ImageComparison';
import ProcessingStatus from '@/components/ProcessingStatus';
import { ServicesResponse, ProcessingStatus as Status } from '@/types';
import { getServices, processImage, fileToBase64, checkHealth } from '@/lib/api';

export default function ProcessingPage() {
  // Services state
  const [services, setServices] = useState<ServicesResponse | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [serviceHealth, setServiceHealth] = useState<boolean | null>(null);

  // Upload state
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  // Processing state
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  // Check service health on mount
  useEffect(() => {
    const checkServiceHealth = async () => {
      try {
        const health = await checkHealth();
        setServiceHealth(health.status === 'healthy' && health.pipelines_loaded > 0);
      } catch (err) {
        setServiceHealth(false);
        setError('无法连接到 AI 服务。请确保后端服务运行在 http://localhost:5000');
      }
    };

    checkServiceHealth();
  }, []);

  // Fetch available services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await getServices();
        setServices(servicesData);
      } catch (err) {
        setError('无法加载服务列表。请检查 API 服务是否正在运行。');
      }
    };

    if (serviceHealth) {
      fetchServices();
    }
  }, [serviceHealth]);

  // Handle service selection
  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setError(null);

    // If we have an image and a service, auto-process or show prompt
    if (originalImage && serviceId && !processedImage) {
      // Optionally auto-process here, or just wait for user action
    }
  };

  // Handle file selection and auto-process
  const handleFileSelect = async (file: File) => {
    setError(null);
    setStatus('uploading');
    setFileName(file.name);

    try {
      const base64 = await fileToBase64(file);
      setOriginalImage(base64);
      setProcessedImage(null);
      setStatus('idle');

      // Auto-process if service is selected
      if (selectedService) {
        await handleProcess(base64, selectedService);
      }
    } catch (err: any) {
      setError('读取文件失败: ' + (err.message || '未知错误'));
      setStatus('error');
    }
  };

  // Handle image processing
  const handleProcess = async (imageData?: string, serviceId?: string) => {
    const imgData = imageData || originalImage;
    const svcId = serviceId || selectedService;

    if (!imgData || !svcId) {
      setError('请选择处理类型并上传图片');
      return;
    }

    setStatus('processing');
    setError(null);
    setProcessedImage(null);

    try {
      const result = await processImage(imgData, svcId);

      if (result.success && result.result) {
        setProcessedImage(result.result);
        setStatus('success');
      } else {
        throw new Error(result.error || '处理失败');
      }
    } catch (err: any) {
      const errorMessage = err.message || '图片处理失败，请重试';
      setError(errorMessage);
      setStatus('error');
    }
  };

  // Handle reprocess
  const handleReprocess = () => {
    if (originalImage && selectedService) {
      handleProcess();
    }
  };

  // Handle reset
  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setFileName('');
    setStatus('idle');
    setError(null);
  };

  // Handle retry on error
  const handleRetry = () => {
    if (originalImage && selectedService) {
      handleProcess();
    } else {
      setError(null);
      setStatus('idle');
    }
  };

  // Get selected service info
  const getSelectedServiceInfo = () => {
    if (!services || !selectedService) return null;

    for (const category of Object.values(services)) {
      for (const subcategory of Object.values(category)) {
        if (Array.isArray(subcategory)) {
          const service = subcategory.find((s) => s.id === selectedService);
          if (service) return service;
        }
      }
    }
    return null;
  };

  const selectedServiceInfo = getSelectedServiceInfo();
  const isWorkspaceActive = !!(selectedService || originalImage);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div 
        className={`relative text-center transition-all duration-500 ease-in-out ${
          isWorkspaceActive 
            ? 'py-4 space-y-2' 
            : 'py-8 space-y-4'
        }`}
      >
        <div className="absolute top-4 left-4">
          <Link href="/">
            <button className="btn btn-soft  btn-primary leading-6">返回首页</button>
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-base-content transition-all duration-500">
          智绘-CleanShot
        </h1>
        
        <div className={`transition-all duration-500 ease-in-out origin-top ${
          isWorkspaceActive ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
        }`}>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            专业的文档处理、智能抠图、去水印服务，让您的图片处理工作更高效
          </p>

          {serviceHealth === false && (
            <div className="alert alert-warning shadow-lg max-w-2xl mx-auto mt-4">
              <svg
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>无法连接到 AI 服务，请确保后端运行在 http://localhost:5000</span>
            </div>
          )}

          {serviceHealth && services && (
            <div className="flex justify-center gap-4 text-sm mt-4">
              <div className="badge badge-primary badge-lg">
                {Object.values(services.document || {}).flat().length} 文档服务
              </div>
              <div className="badge badge-secondary badge-lg">
                {Object.values(services.matting || {}).flat().length} 抠图服务
              </div>
              <div className="badge badge-accent badge-lg">
                {Object.values(services.watermark || {}).flat().length} 去水印服务
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar - Service Selection */}
        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto scrollbar-thin">
          <ServiceSelector
            services={services}
            selectedService={selectedService}
            onServiceSelect={handleServiceSelect}
            disabled={status === 'processing'}
          />

          {selectedServiceInfo && (
            <div className="card bg-primary text-primary-content shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-sm">当前选择</h3>
                <div className="space-y-2">
                  <p className="font-bold">{selectedServiceInfo.name}</p>
                  <p className="text-xs opacity-90">{selectedServiceInfo.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Content - Upload and Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Processing Status */}
          <ProcessingStatus
            status={status}
            error={error}
            onRetry={handleRetry}
            serviceName={selectedServiceInfo?.name}
            processingImage={originalImage || undefined}
          />

          {/* Show comparison if we have processed result */}
          {originalImage && processedImage && status === 'success' ? (
            <ImageComparison
              originalImage={originalImage}
              processedImage={processedImage}
              fileName={fileName}
              onReset={handleReset}
              onReprocess={handleReprocess}
            />
          ) : (
            <>
              {/* File Upload */}
              <FileUpload
                onFileSelect={handleFileSelect}
                disabled={status === 'processing'}
                selectedService={selectedService}
              />

              {/* Preview uploaded image */}
              {originalImage && !processedImage && status !== 'processing' && (
                <div className="card bg-base-200 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">已上传图片</h3>
                    <div className="rounded-box overflow-hidden bg-base-300 flex items-center justify-center min-h-[300px]">
                      <img
                        src={originalImage}
                        alt="Uploaded"
                        className="max-w-full max-h-[500px] object-contain"
                      />
                    </div>
                    <div className="card-actions justify-between items-center mt-4">
                      <div className="text-sm text-base-content/70">
                        <span className="font-semibold">{fileName}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleReset} className="btn btn-ghost btn-sm">
                          重新上传
                        </button>
                        {selectedService && (
                          <button
                            onClick={() => handleProcess()}
                            className="btn btn-primary btn-sm"
                          >
                            开始处理
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing Animation */}
              {/* Animation moved to ProcessingStatus component */}
            </>
          )}

          {/* Features Info */}
          {!originalImage && selectedService && (
            <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl border border-primary/20">
              <div className="card-body">
                <h3 className="card-title text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  使用提示
                </h3>
                <ul className="space-y-2 text-sm text-base-content/80">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>上传清晰的图片可获得更好的处理效果</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>支持拖拽上传或点击选择文件</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>处理完成后可使用滑块对比查看效果</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>一键下载处理后的高质量图片</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
