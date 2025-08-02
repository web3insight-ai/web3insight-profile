import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { monadTestnet } from './contracts/config';

export const config = getDefaultConfig({
  appName: 'Web3Insight Profile',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains: [monadTestnet],
  ssr: true,
});