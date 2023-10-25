import * as path from "path";
import { ISyncSwapConfig } from "./interfaces/ISyncSwapConfig";
import { INetworkConfig } from "./interfaces/INetworkConfig";
import { zkSyncTokens } from "./utils/constants";

export const walletsFilePath = path.resolve("wallets.txt");

export const syncSwapConfig: ISyncSwapConfig = {
  token1Address: zkSyncTokens.USDC,
  amount1: 1,
  token2Address: zkSyncTokens.WETH,
  amount2: 0.0005,
  addLiquidity: true,
  approveMax: false,
  changeBalanceWaitTime: 1000, // seconds
  removeLiquidity: true,
};

export const network: INetworkConfig = {
  nodeUri: "https://mainnet.era.zksync.io",
  chainId: 324,
  name: "Zk-Era_mainnet",
};
