import * as fs from "fs";

import {
  Contract,
  Overrides,
  providers,
  Signer,
  ContractReceipt,
  BigNumber,
  PayableOverrides,
} from "ethers";
import { ethers } from "ethers";
import { Config } from "./Config";

export class Wallet extends Config {
  private signers: Signer[];
  public defaultSigner: Signer;

  constructor() {
    super();
    this.signers = fs
      .readFileSync(this.commonConfig.walletsFilepath, { encoding: "utf8" })
      .split("\n")
      .filter((pk) => pk)
      .map((pk) => new ethers.Wallet(pk, this.provider));
    this.defaultSigner = this.signer(0);
  }

  async sendContractTx(
    signer: Signer,
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
      console.log(`${methodName} method is executed on ${contract.address}`);
      console.log(`Transaction hash ${tx.hash}`);
      try {
        return await tx.wait(2);
      } catch (e) {
        return tx;
      }
    } catch (e) {
      console.error(e);
    }
  }

  signer(index: number): Signer {
    return this.signers[index];
  }

  async balance(account: string): Promise<BigNumber> {
    return await this.provider.getBalance(account);
  }
}
