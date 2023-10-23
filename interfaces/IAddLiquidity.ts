import { BigNumber } from "ethers";
import { ITokenInput } from "./ITokenInput";

export interface IAddLiquidity {
  poolAddress: string;
  tokenInputs: ITokenInput[];
  bytesDataTo: string;
  minLp: BigNumber;
  calback: string;
  callbackData: string;
}
