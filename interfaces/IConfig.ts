import { ethers } from "ethers";

export interface IConfig {
  walletsFilepath: string;
  token1Address: string;
  token2Address: string;
  amount1: number;
  amount2: number;
  addLiquidity: boolean;
  waitChangeLpBalance: boolean;
  changeBalanceWaitTime: number;
  withdrawLiquidity: boolean;
}
