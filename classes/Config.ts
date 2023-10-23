import { ethers, providers } from "ethers";
import { config, networkConfig } from "../config";
import { IConfig } from "../interfaces/IConfig";
import { INetworkConfig } from "../interfaces/INetworkConfig";

export class Config {
  commonConfig: IConfig = config;
  networkConfig: INetworkConfig = networkConfig;
  provider: providers.JsonRpcProvider;

  constructor() {
    this.provider = new providers.JsonRpcProvider(this.networkConfig.nodeUri, {
      chainId: this.networkConfig.chainId,
      name: this.networkConfig.name,
    });
  }
}
