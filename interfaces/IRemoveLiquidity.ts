import { BigNumber } from "ethers";
import { ITokenInput } from "./ITokenInput";
import { IPermit } from "./IPermit";

export interface IRemoveLiquidity {
  poolAddress: string;
  liquidity: BigNumber;
  bytesDataTo: string;
  minAmounts: BigNumber[];
  callback: string;
  callbackData: string;
  permit?: IPermit;
}
