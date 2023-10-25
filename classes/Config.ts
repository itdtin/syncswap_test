import { providers } from "ethers";
import { network } from "../config";
import { INetworkConfig } from "../interfaces/INetworkConfig";

export class NetworkConfig {
  networkConfig: INetworkConfig = network;
  provider: providers.JsonRpcProvider;

  constructor() {
    this.provider = new providers.JsonRpcProvider(this.networkConfig.nodeUri, {
      chainId: this.networkConfig.chainId,
      name: this.networkConfig.name,
    });
  }
}
