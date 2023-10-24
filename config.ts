import { ethers } from "ethers";

import * as path from "path";
import { IConfig } from "./interfaces/IConfig";
import { INetworkConfig } from "./interfaces/INetworkConfig";

export const config: IConfig = {
  walletsFilepath: path.resolve("wallets.txt"),
  token1Address: "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C",
  amount1: 1,
  token2Address: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4",
  amount2: 1,
  addLiquidity: false,
  waitChangeLpBalance: true,
  changeBalanceWaitTime: 1000, // seconds
  withdrawLiquidity: false,
};

export const networkConfig: INetworkConfig = {
  nodeUri: "https://mainnet.era.zksync.io",
  chainId: 324,
  name: "Zk-Era_mainnet",
  weth: "0x5aea5775959fbc2557cc8789bc1bf90a239d9a91",
};
