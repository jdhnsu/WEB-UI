import React from 'react';

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

export default function PerformanceReportPage() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="text-center border-b-2 border-primary pb-4 mb-8">
        <h1 className="text-3xl font-bold text-base-content">性能测试报告</h1>
        {/* <div className="text-gray-500 mt-2">测试时间: 2025-12-29T19:30:00.000000</div> */}
      </div>

      {/* System Config */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary border-b border-base-200 pb-2">系统配置</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <li><strong>CPU:</strong> {systemConfig.cpu}</li>
            <li><strong>内存:</strong> {systemConfig.memory}</li>
            <li><strong>Python:</strong> {systemConfig.python}</li>
            <li><strong>平台:</strong> {systemConfig.platform}</li>
            <li><strong>GPU0:</strong> {systemConfig.gpu}</li>
          </ul>
        </div>
      </div>

      {/* Test Summary */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary border-b border-base-200 pb-2">测试摘要</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="stat bg-base-200 rounded-box place-items-center border-l-4 border-primary">
              <div className="stat-value text-primary">{summaryStats.totalServices}</div>
              <div className="stat-title">总服务数</div>
            </div>
            <div className="stat bg-base-200 rounded-box place-items-center border-l-4 border-primary">
              <div className="stat-value text-primary">{summaryStats.testedServices}</div>
              <div className="stat-title">测试服务数</div>
            </div>
            <div className="stat bg-base-200 rounded-box place-items-center border-l-4 border-primary">
              <div className="stat-value text-success">{summaryStats.successCount}</div>
              <div className="stat-title">成功</div>
            </div>
            <div className="stat bg-base-200 rounded-box place-items-center border-l-4 border-primary">
              <div className="stat-value text-primary">{summaryStats.successRate}</div>
              <div className="stat-title">成功率</div>
            </div>
          </div>
          <div className="alert alert-success shadow-lg">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="font-bold text-xl">OVERALL STATUS: GOOD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Endpoint Test Status */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary border-b border-base-200 pb-2">服务端点测试</h2>
          <div className="flex items-center gap-2">
            <span className="text-success text-xl">✅</span>
            <strong>状态:</strong> 正常
          </div>
          <p><strong>可用服务总数:</strong> {summaryStats.testedServices}</p>
        </div>
      </div>

      {/* Category Stats */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary border-b border-base-200 pb-2">分类统计</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200">
                  <th>分类</th>
                  <th>总数</th>
                  <th>成功</th>
                  <th>失败</th>
                  <th>成功率</th>
                </tr>
              </thead>
              <tbody>
                {categoryStats.map((stat) => (
                  <tr key={stat.category} className="hover">
                    <td className="font-bold uppercase">{stat.category}</td>
                    <td>{stat.total}</td>
                    <td className="text-success">{stat.success}</td>
                    <td className="text-error">{stat.fail}</td>
                    <td>{stat.successRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary border-b border-base-200 pb-2">详细测试结果</h2>
          {Object.entries(detailedResults).map(([category, results]) => (
            <div key={category} className="mb-6 last:mb-0">
              <div className="badge badge-lg badge-primary mb-4 p-4 font-bold">{category}</div>
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
                    {results.map((result) => (
                      <tr key={result.id} className="hover">
                        <td><code className="bg-base-200 px-1 py-0.5 rounded">{result.id}</code></td>
                        <td>{result.name}</td>
                        <td className={result.status === 'success' ? 'text-success font-bold' : 'text-error font-bold'}>
                          {result.status === 'success' ? '✅' : '❌'}
                        </td>
                        <td>{result.time}</td>
                        <td>{result.resultSize}</td>
                        <td>{result.gpuMemory}</td>
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
          <h2 className="card-title text-primary border-b border-base-200 pb-2">GPU使用详情</h2>
          {Object.entries(gpuInfos).map(([category, infos]) => (
            <div key={category} className="mb-6 last:mb-0">
              <div className="badge badge-lg badge-outline mb-4">{category}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {infos.map((info) => (
                  <div key={info.serviceId} className="card bg-base-200 border-l-4 border-primary">
                    <div className="card-body p-4">
                      <h3 className="font-bold text-lg mb-2">{info.serviceName} <span className="text-xs font-normal opacity-70">({info.serviceId})</span></h3>
                      <p><strong>GPU0:</strong> {info.memoryUsed}MB / {info.memoryTotal}MB ({info.memoryUtilization})</p>
                      <div className="w-full bg-base-300 rounded-full h-2.5 mt-2 mb-1">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: info.memoryUtilization }}></div>
                      </div>
                      <p className="text-sm">GPU利用率: {info.gpuUtilization}</p>
                      <p className="text-sm">显存利用率: {info.vramUtilization}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
