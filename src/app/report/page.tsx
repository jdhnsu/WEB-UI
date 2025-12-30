'use client';

import React, { useState } from 'react';

// Data types
interface SystemConfig {
  cpu: string;
  memory: string;
  python: string;
  platform: string;
  gpu: string;
}

interface SummaryStats {
  totalServices: number;
  testedServices: number;
  successCount: number;
  successRate: string;
}

interface CategoryStat {
  category: string;
  total: number;
  success: number;
  fail: number;
  successRate: string;
}

interface ServiceResult {
  id: string;
  name: string;
  status: 'success' | 'fail';
  time: number;
  resultSize: number;
  gpuMemory: number;
}

interface GpuInfo {
  serviceName: string;
  serviceId: string;
  memoryUsed: number;
  memoryTotal: number;
  memoryUtilization: string;
  gpuUtilization: string;
  vramUtilization: string;
}

// Mock Data from the user provided HTML
const systemConfig: SystemConfig = {
  cpu: "16核 (物理: 8核)",
  memory: "63.7 GB",
  python: "3.10.18",
  platform: "win32",
  gpu: "8192MB 显存"
};

const summaryStats: SummaryStats = {
  totalServices: 12,
  testedServices: 10,
  successCount: 10,
  successRate: "100.0%"
};

const categoryStats: CategoryStat[] = [
  { category: "document", total: 5, success: 5, fail: 0, successRate: "100.0%" },
  { category: "matting", total: 4, success: 3, fail: 1, successRate: "75.0%" },
  { category: "watermark", total: 3, success: 2, fail: 1, successRate: "66.7%" },
];

const detailedResults: Record<string, ServiceResult[]> = {
  DOCUMENT: [
    { id: "print_auto_hq", name: "一键变清晰", status: "success", time: 0.83, resultSize: 150000, gpuMemory: 1580 },
    { id: "print_auto_hq_no_dewarp", name: "变清晰", status: "success", time: 0.78, resultSize: 148000, gpuMemory: 1665 },
    { id: "print_deshadow", name: "去阴影", status: "success", time: 1.81, resultSize: 152000, gpuMemory: 1676 },
    { id: "print_deblack", name: "去黑底", status: "success", time: 1.36, resultSize: 149000, gpuMemory: 2349 },
    { id: "print_enhance", name: "美化增强", status: "success", time: 0.02, resultSize: 145000, gpuMemory: 2350 },
  ],
  MATTING: [
    { id: "matting_person_pet", name: "人像宠物", status: "success", time: 3.71, resultSize: 160000, gpuMemory: 2350 },
    { id: "matting_stuff", name: "商品物品", status: "success", time: 2.51, resultSize: 158000, gpuMemory: 2572 },
    { id: "matting_text_seal", name: "文字印章", status: "success", time: 3.06, resultSize: 155000, gpuMemory: 2577 },
  ],
  WATERMARK: [
    { id: "watermark_auto", name: "自动", status: "success", time: 13.07, resultSize: 200000, gpuMemory: 2589 },
    { id: "watermark_nature", name: "自然", status: "success", time: 2.19, resultSize: 195000, gpuMemory: 2853 },
  ]
};

const gpuInfos: Record<string, GpuInfo[]> = {
  DOCUMENT: [
    { serviceName: "一键变清晰", serviceId: "print_auto_hq", memoryUsed: 1580, memoryTotal: 8192, memoryUtilization: "19.3%", gpuUtilization: "45%", vramUtilization: "19%" },
    { serviceName: "变清晰", serviceId: "print_auto_hq_no_dewarp", memoryUsed: 1665, memoryTotal: 8192, memoryUtilization: "20.3%", gpuUtilization: "52%", vramUtilization: "20%" },
    { serviceName: "去阴影", serviceId: "print_deshadow", memoryUsed: 1676, memoryTotal: 8192, memoryUtilization: "20.5%", gpuUtilization: "48%", vramUtilization: "21%" },
    { serviceName: "去黑底", serviceId: "print_deblack", memoryUsed: 2349, memoryTotal: 8192, memoryUtilization: "28.7%", gpuUtilization: "65%", vramUtilization: "29%" },
    { serviceName: "美化增强", serviceId: "print_enhance", memoryUsed: 2350, memoryTotal: 8192, memoryUtilization: "28.7%", gpuUtilization: "15%", vramUtilization: "29%" },
  ],
  MATTING: [
    { serviceName: "人像宠物", serviceId: "matting_person_pet", memoryUsed: 2350, memoryTotal: 8192, memoryUtilization: "28.7%", gpuUtilization: "78%", vramUtilization: "29%" },
    { serviceName: "商品物品", serviceId: "matting_stuff", memoryUsed: 2572, memoryTotal: 8192, memoryUtilization: "31.4%", gpuUtilization: "72%", vramUtilization: "31%" },
    { serviceName: "文字印章", serviceId: "matting_text_seal", memoryUsed: 2577, memoryTotal: 8192, memoryUtilization: "31.5%", gpuUtilization: "75%", vramUtilization: "31%" },
  ],
  WATERMARK: [
    { serviceName: "自动", serviceId: "watermark_auto", memoryUsed: 2589, memoryTotal: 8192, memoryUtilization: "31.6%", gpuUtilization: "88%", vramUtilization: "32%" },
    { serviceName: "自然", serviceId: "watermark_nature", memoryUsed: 2853, memoryTotal: 8192, memoryUtilization: "34.8%", gpuUtilization: "85%", vramUtilization: "35%" },
  ]
};

// Helper component for progress bar
function ProgressBar({ percentage }: { percentage: string }) {
  const numValue = parseFloat(percentage);
  return (
    <div className="w-full bg-base-300 rounded-full h-2.5 mt-2 mb-1">
      <div
        className="bg-primary h-2.5 rounded-full transition-all duration-300"
        style={{ width: percentage }}
      ></div>
    </div>
  );
}

export default function PerformanceReportPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'time' | 'memory' | 'name'>('time');

  // Filter and sort services
  const getFilteredServices = () => {
    if (selectedCategory === 'all') {
      return Object.entries(detailedResults);
    }
    return Object.entries(detailedResults).filter(([category]) =>
      category.toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  const sortServices = (services: ServiceResult[]) => {
    return [...services].sort((a, b) => {
      switch (sortBy) {
        case 'time':
          return b.time - a.time;
        case 'memory':
          return b.gpuMemory - a.gpuMemory;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="text-center border-b-2 border-primary pb-6 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-3">
          性能测试报告
        </h1>
        <p className="text-sm opacity-70">Performance Test Report</p>
        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
          <div className="badge badge-outline">测试时间: 2025-12-29</div>
          <div className="badge badge-primary">实时监控</div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div className="stat-title">平均处理时间</div>
          <div className="stat-value text-primary">2.3s</div>
          <div className="stat-desc">所有服务平均耗时</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div className="stat-title">平均GPU显存</div>
          <div className="stat-value text-secondary">2.1GB</div>
          <div className="stat-desc">峰值显存占用</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-success">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="stat-title">成功率</div>
          <div className="stat-value text-success">{summaryStats.successRate}</div>
          <div className="stat-desc">{summaryStats.successCount}/{summaryStats.testedServices} 服务通过</div>
        </div>
      </div>

      {/* System Config */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary border-b border-base-200 pb-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
            </svg>
            系统配置
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
              <div className="badge badge-primary">CPU</div>
              <span className="text-sm">{systemConfig.cpu}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
              <div className="badge badge-secondary">内存</div>
              <span className="text-sm">{systemConfig.memory}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
              <div className="badge badge-accent">GPU</div>
              <span className="text-sm">{systemConfig.gpu}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
              <div className="badge badge-info">Python</div>
              <span className="text-sm">{systemConfig.python}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
              <div className="badge badge-warning">平台</div>
              <span className="text-sm">{systemConfig.platform}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Test Summary */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary border-b border-base-200 pb-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
            </svg>
            测试摘要
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="stat bg-base-200 rounded-box place-items-center border-l-4 border-primary">
              <div className="stat-value text-primary">{summaryStats.totalServices}</div>
              <div className="stat-title">总服务数</div>
            </div>
            <div className="stat bg-base-200 rounded-box place-items-center border-l-4 border-info">
              <div className="stat-value text-info">{summaryStats.testedServices}</div>
              <div className="stat-title">测试服务数</div>
            </div>
            <div className="stat bg-base-200 rounded-box place-items-center border-l-4 border-success">
              <div className="stat-value text-success">{summaryStats.successCount}</div>
              <div className="stat-title">成功</div>
            </div>
            <div className="stat bg-base-200 rounded-box place-items-center border-l-4 border-accent">
              <div className="stat-value text-accent">{summaryStats.successRate}</div>
              <div className="stat-title">成功率</div>
            </div>
          </div>
          <div className="alert alert-success shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold text-lg">整体状态: 良好 (GOOD)</span>
          </div>
        </div>
      </div>

      {/* Endpoint Test Status */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary border-b border-base-200 pb-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
            </svg>
            服务端点测试
          </h2>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-success text-2xl">✅</span>
            <div>
              <p className="font-bold">状态: 正常运行</p>
              <p className="text-sm opacity-70">所有服务端点响应正常</p>
            </div>
          </div>
          <div className="divider"></div>
          <p><strong>可用服务总数:</strong> <span className="badge badge-lg badge-primary">{summaryStats.testedServices}</span></p>
        </div>
      </div>

      {/* Category Stats */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary border-b border-base-200 pb-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            分类统计
          </h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200">
                  <th>分类</th>
                  <th>总数</th>
                  <th>成功</th>
                  <th>失败</th>
                  <th>成功率</th>
                  <th>进度</th>
                </tr>
              </thead>
              <tbody>
                {categoryStats.map((stat) => (
                  <tr key={stat.category} className="hover">
                    <td className="font-bold uppercase">
                      <div className="badge badge-primary badge-outline">{stat.category}</div>
                    </td>
                    <td>{stat.total}</td>
                    <td className="text-success font-bold">{stat.success}</td>
                    <td className="text-error font-bold">{stat.fail}</td>
                    <td>
                      <div className="badge badge-lg badge-success">{stat.successRate}</div>
                    </td>
                    <td className="w-32">
                      <ProgressBar percentage={stat.successRate} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="form-control w-full md:w-auto">
              <label className="label">
                <span className="label-text font-semibold">筛选分类:</span>
              </label>
              <select
                className="select select-bordered select-primary"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">全部分类</option>
                <option value="document">DOCUMENT</option>
                <option value="matting">MATTING</option>
                <option value="watermark">WATERMARK</option>
              </select>
            </div>

            <div className="form-control w-full md:w-auto">
              <label className="label">
                <span className="label-text font-semibold">排序方式:</span>
              </label>
              <select
                className="select select-bordered select-secondary"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'time' | 'memory' | 'name')}
              >
                <option value="time">按耗时排序</option>
                <option value="memory">按显存排序</option>
                <option value="name">按名称排序</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary border-b border-base-200 pb-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            详细测试结果
          </h2>
          {getFilteredServices().map(([category, results]) => (
            <div key={category} className="mb-6 last:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="badge badge-lg badge-primary p-4 font-bold">{category}</div>
                <div className="badge badge-outline">{results.length} 项服务</div>
              </div>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-base-200">
                      <th>服务ID</th>
                      <th>服务名称</th>
                      <th>状态</th>
                      <th>耗时(s)</th>
                      <th>结果大小</th>
                      <th>GPU显存(MB)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortServices(results).map((result) => (
                      <tr key={result.id} className="hover">
                        <td>
                          <code className="bg-base-200 px-2 py-1 rounded text-xs">
                            {result.id}
                          </code>
                        </td>
                        <td className="font-semibold">{result.name}</td>
                        <td>
                          <div className={`badge ${result.status === 'success' ? 'badge-success' : 'badge-error'} gap-2`}>
                            {result.status === 'success' ? '✅ 成功' : '❌ 失败'}
                          </div>
                        </td>
                        <td>
                          <span className="font-mono text-sm">{result.time.toFixed(2)}</span>
                        </td>
                        <td>
                          <span className="font-mono text-sm">{(result.resultSize / 1000).toFixed(1)}KB</span>
                        </td>
                        <td>
                          <span className="font-mono text-sm font-bold text-primary">{result.gpuMemory}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GPU Usage Details */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary border-b border-base-200 pb-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
            </svg>
            GPU使用详情
          </h2>
          {Object.entries(gpuInfos).map(([category, infos]) => (
            <div key={category} className="mb-8 last:mb-0">
              <div className="badge badge-lg badge-outline mb-4">{category}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {infos.map((info) => (
                  <div key={info.serviceId} className="card bg-base-200 border-l-4 border-primary hover:shadow-lg transition-shadow">
                    <div className="card-body p-4">
                      <h3 className="font-bold text-lg mb-2">
                        {info.serviceName}
                      </h3>
                      <p className="text-xs opacity-70 mb-3">
                        <code>{info.serviceId}</code>
                      </p>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>显存使用</span>
                            <span className="font-bold">{info.memoryUsed}MB / {info.memoryTotal}MB</span>
                          </div>
                          <ProgressBar percentage={info.memoryUtilization} />
                          <p className="text-xs opacity-70 mt-1">{info.memoryUtilization}</p>
                        </div>

                        <div className="divider my-2"></div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-base-100 p-2 rounded">
                            <p className="text-xs opacity-70">GPU利用率</p>
                            <p className="font-bold text-primary">{info.gpuUtilization}</p>
                          </div>
                          <div className="bg-base-100 p-2 rounded">
                            <p className="text-xs opacity-70">显存利用率</p>
                            <p className="font-bold text-secondary">{info.vramUtilization}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Tips */}
      <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            性能优化建议
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>WATERMARK 类服务耗时较长 (最高 13.07s)，建议优化算法或增加计算资源</li>
            <li>GPU显存使用峰值为 2853MB (34.8%)，资源利用率良好</li>
            <li>DOCUMENT 类服务性能优异，平均耗时 &lt; 1s</li>
            <li>所有服务测试通过率 100%，系统稳定性优秀</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm opacity-70 py-4">
        <p>报告生成时间: {new Date().toLocaleString('zh-CN')}</p>
        <p className="mt-2">智绘-CleanShot 性能测试系统 v1.0</p>
      </div>
    </div>
  );
}
