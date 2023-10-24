import { ethers } from "ethers";

import * as path from "path";
import { IConfig } from "./interfaces/IConfig";
import { INetworkConfig } from "./interfaces/INetworkConfig";

export const config: IConfig = {
  walletsFilepath: path.resolve("wallets.txt"),
  token1Address: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4",
  token2Address: "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C",
  percentOfBalance: 90,
  withdrawLiquidity: false,
};

export const networkConfig: INetworkConfig = {
  nodeUri: "https://mainnet.era.zksync.io",
  chainId: 324,
  name: "Zk-Era_mainnet",
};
