/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 添加静态导出配置
  // 注意：静态导出不支持某些功能，如图片优化API、动态路由等
  images: {
    unoptimized: true,  // 静态导出需要关闭图片优化
  },
}

module.exports = nextConfig 