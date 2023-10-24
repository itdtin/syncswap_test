import { ethers } from "ethers";

export interface IConfig {
  walletsFilepath: string;
  token1Address: string;
  token2Address: string;
  percentOfBalance: number;
  withdrawLiquidity: boolean;
}
