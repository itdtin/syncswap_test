import { BigNumber } from "ethers";

export interface ITokenInput extends Array<string | BigNumber> {
  0: string;
  1: BigNumber;
}
