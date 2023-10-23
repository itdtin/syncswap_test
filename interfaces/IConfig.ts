import { ethers } from "ethers";

export interface IConfig {
  walletsFilepath: string;
  contractAddress: string;
  token1Address: string;
  token2Address: string;
  calculateViaToken: number; // calculate amount of tokens to add liquidity by token1 or token2
  percentOfBalance: number;
  withdrawLiquidity: boolean;
}
