import { ethers } from "ethers";

export interface ISyncSwapConfig {
  token1Address: string;
  token2Address: string;
  amount1: number;
  amount2: number;
  approveMax: boolean;
  addLiquidity: boolean;
  changeBalanceWaitTime: number;
  removeLiquidity: boolean;
}
