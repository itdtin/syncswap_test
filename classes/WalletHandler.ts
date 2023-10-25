import * as fs from "fs";

import {
  Contract,
  Wallet,
  ContractReceipt,
  BigNumber,
  PayableOverrides,
} from "ethers";
import { ethers } from "ethers";
import { walletsFilePath } from "../config";
import { NetworkConfig } from "./Config";

export class WalletHandler extends NetworkConfig {
  private wallets: Wallet[];
  public defaultWallet: Wallet;

  constructor() {
    super();
    this.wallets = fs
      .readFileSync(walletsFilePath, { encoding: "utf8" })
      .split("\n")
      .filter((pk) => pk)
      .map((pk) => new ethers.Wallet(pk, this.provider));
    this.defaultWallet = this.wallet(0);
  }

  async sendContractTx(
    signer: Wallet,
    contract: Contract,
    methodName: string,
    args: any[],
    overrides?: PayableOverrides
  ): Promise<ContractReceipt | string | undefined> {
    try {
      if (overrides) {
        args = args.concat(overrides);
      }
      const tx = await contract
        .connect(this.provider)
        .connect(signer)
        [methodName](...args);
      console.log(
        `${methodName} method is executed on ${contract.address}, tx hash ${tx.hash}`
      );
      return await tx.wait(2);
    } catch (e) {
      console.error(e);
    }
  }

  wallet(index: number): Wallet {
    return this.wallets[index];
  }

  async balance(account: string): Promise<BigNumber> {
    return await this.provider.getBalance(account);
  }
}
