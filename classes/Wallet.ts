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

export class Wallet {
  private provider: providers.JsonRpcProvider;
  private signers: Signer[];
  public defaultSigner: Signer;

  constructor(provider: providers.JsonRpcProvider, filepath: string) {
    this.provider = provider;
    this.signers = fs
      .readFileSync(filepath, { encoding: "utf8" })
      .split("\n")
      .filter((pk) => pk)
      .map((pk) => new ethers.Wallet(pk, provider));
    this.defaultSigner = this.signer(0);
  }

  async sendContractTx(
    signer: Signer,
    contract: Contract,
    methodName: string,
    args: any[],
    overrides?: PayableOverrides
  ): Promise<ContractReceipt | string | undefined> {
    // TODO: console tx hash
    try {
      if (overrides) {
        args = args.concat(overrides);
      }
      const tx = await contract
        .connect(this.provider)
        .connect(signer)
        [methodName](...args);
      console.log("tx", tx);
      console.log(`${methodName} method is executed on ${contract.address}`);
      try {
        return await tx.wait(1);
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
