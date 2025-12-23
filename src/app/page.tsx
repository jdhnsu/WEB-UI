'use client';

import Link from 'next/link';
import Image from 'next/image';
import CompetitorComparison from '@/components/CompetitorComparison';

export default function Home() {
  const latestResults = [
    // {
    //   id: 1,
    //   title: "高精度人像抠图算法更新",
    //   date: "2024-05-20",
    //   description: "实验室最新发布的Portrait Matting v3.0模型，在复杂背景下的发丝级分割精度提升了15%。"
    // },
    // {
    //   id: 2,
    //   title: "文档去阴影技术突破",
    //   date: "2024-05-15",
    //   description: "提出了一种基于深度学习的光照矫正网络，有效解决了弯曲文档的阴影去除问题。"
    // },
    // {
    //   id: 3,
    //   title: "自然场景水印去除新进展",
    //   date: "2024-05-10",
    //   description: "针对半透明水印的盲去除任务，我们的新算法在PSNR指标上达到了业界领先水平。"
    // }
  ];

  const news = [
    // {
    //   id: 1,
    //   title: "实验室团队荣获 CVPR 2024 最佳论文奖提名",
    //   date: "2024-06-01",
    //   category: "获奖信息"
    // },
    // {
    //   id: 2,
    //   title: "与麻省理工学院开展计算机视觉联合研究项目",
    //   date: "2024-05-28",
    //   category: "学术活动"
    // },
    // {
    //   id: 3,
    //   title: "2024年度夏季实习生招聘正式启动",
    //   date: "2024-05-25",
    //   category: "实验室新闻"
    // }
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="relative hero min-h-[60vh] bg-gradient-to-br from-base-200 to-base-300 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <div className="hero-content text-center relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              智绘-CleanShot
            </h1>
            <p className="text-xl mb-8 text-base-content/80">
              探索视觉技术的无限可能，提供领先的图像修复、增强与生成解决方案。
            </p>
            <Link href="/processing" className="btn btn-primary btn-lg shadow-lg hover:scale-105 transition-transform">
              立即体验
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Introduction Section */}
      <section className="py-20 px-4 bg-base-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 relative inline-block left-1/2 -translate-x-1/2">
            样例效果展示
            <span className="absolute -bottom-4 left-0 w-full h-1 bg-primary rounded-full"></span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Feature 1: Intelligent Matting */}
            <div className="card bg-base-200 shadow-xl overflow-hidden group">
              <div className="card-body">
                <h3 className="card-title text-2xl mb-4 text-primary">智能人像/宠物抠图</h3>
                <p className="mb-6 text-base-content/70">
                  采用最先进的语义分割网络，精确识别主体轮廓，实现发丝级精细抠图。支持人像、宠物、商品等多种主体。
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="badge badge-outline">处理前</span>
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-base-300">
                      <Image 
                        src="/images/demo/pet_original.png" 
                        alt="Pet Original" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="badge badge-primary">处理后</span>
                    <div className="relative aspect-square rounded-lg overflow-hidden alpha-background">
                      <Image 
                        src="/images/demo/pet_processed.png" 
                        alt="Pet Processed" 
                        fill 
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Document Optimization */}
            <div className="card bg-base-200 shadow-xl overflow-hidden group">
              <div className="card-body">
                <h3 className="card-title text-2xl mb-4 text-secondary">文档去阴影与增强</h3>
                <p className="mb-6 text-base-content/70">
                  针对拍摄文档常见的阴影干扰和光照不均问题，通过深度学习模型重建物体表面光照，还原清晰文档。
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="badge badge-outline">处理前</span>
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-base-300">
                      <Image 
                        src="/images/demo/shadow_original.jpg" 
                        alt="Shadow Original" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="badge badge-secondary">处理后</span>
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-base-300">
                      <Image 
                        src="/images/demo/shadow_processed.jpg" 
                        alt="Shadow Processed" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Display Section */}
      {/* <section className="py-20 px-4 bg-base-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 relative inline-block left-1/2 -translate-x-1/2">
            最新研究成果
            <span className="absolute -bottom-4 left-0 w-full h-1 bg-secondary rounded-full"></span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestResults.map((result) => (
              <div key={result.id} className="card bg-base-100 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="card-body">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="card-title text-lg font-bold">{result.title}</h3>
                    <span className="text-xs text-base-content/50 whitespace-nowrap ml-2">{result.date}</span>
                  </div>
                  <p className="text-sm text-base-content/70">{result.description}</p>
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-sm btn-ghost">了解更多</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Latest News Section */}
      {/* <section className="py-20 px-4 bg-base-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">实验室动态</h2>
          
          <div className="space-y-4">
            {news.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg hover:bg-base-200 transition-colors border-b border-base-200 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`badge badge-sm ${
                      item.category === '获奖信息' ? 'badge-warning' : 
                      item.category === '学术活动' ? 'badge-info' : 'badge-ghost'
                    }`}>
                      {item.category}
                    </span>
                    <h3 className="font-medium hover:text-primary cursor-pointer">{item.title}</h3>
                  </div>
                </div>
                <span className="text-sm text-base-content/50 mt-2 md:mt-0">{item.date}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button className="btn btn-outline">查看更多动态</button>
          </div>
        </div>
      </section> */}
      {/*主流抠图对比展示*/}
      <section className="py-20 px-4 bg-base-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 relative inline-block left-1/2 -translate-x-1/2">
            主流效果对比
            <span className="absolute -bottom-4 left-0 w-full h-1 bg-accent rounded-full"></span>
          </h2>
          <p className="text-center text-base-content/70 mb-12 max-w-2xl mx-auto">
            我们与业界主流产品进行了深度对比，智绘-CleanShot在细节保留和边缘处理上表现优异。
          </p>
          
          <CompetitorComparison />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">准备好体验最新的AI图像处理技术了吗？</h2>
          <p className="text-lg mb-8 opacity-90">立即上传您的图片，感受智能科技带来的便捷。</p>
          <Link href="/processing" className="btn btn-lg bg-white text-primary hover:bg-gray-100 border-none">
            开始使用
          </Link>
        </div>
      </section>
    </div>
  );
}
