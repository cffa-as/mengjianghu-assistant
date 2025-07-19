import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mengjianghu.assistant',
  appName: '梦江湖助手',
  webDir: 'out',  // Next.js 静态导出目录
  server: {
    androidScheme: 'https'
  }
};

export default config; 