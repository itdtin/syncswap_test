import { BigNumber } from "ethers";

export interface IPermit extends Array<string | BigNumber> {
  0: BigNumber;
  1: BigNumber;
  2: string;
}
