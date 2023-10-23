import { Contract, providers, Signer, ethers, BigNumber } from "ethers";
import { isZeroAddress } from "../utils/utils";
import { Config } from "./Config";
import PoolFactoryAbi from "../abis/PoolFactory.abi.json";
import RouterAbi from "../abis/SyncSwapRouter.abi.json";
import TokenAbi from "../abis/Token.abi.json";

import { Wallet } from "./Wallet";
import {
  classicPoolFactory,
  routerAddress,
  stablePoolFactory,
} from "./constants";
import { ITokenInput } from "../interfaces/ITokenInput";
import { IAddLiquidity } from "../interfaces/IAddLiquidity";

export class SyncSwap extends Wallet {
  constructor(provider: providers.JsonRpcProvider, walletsPath: string) {
    super(provider, walletsPath);
  }
  async getPoolContractByTokens(
    token1Address: string,
    token2Address: string
  ): Promise<Contract> {
    const factory = await this.getPoolFactory(token1Address, token2Address);
    const poolAddress = (await this.sendContractTx(
      this.defaultSigner,
      factory,
      "getPool",
      [token1Address, token2Address]
    )) as string;

    return new ethers.Contract(poolAddress, PoolFactoryAbi, this.defaultSigner);
  }

  async getPoolFactory(
    token1Address: string,
    token2Address: string
  ): Promise<Contract> {
    const factoryAddress =
      isZeroAddress(token1Address) || isZeroAddress(token2Address)
        ? classicPoolFactory
        : stablePoolFactory;
    return new ethers.Contract(
      factoryAddress,
      PoolFactoryAbi,
      this.defaultSigner
    );
  }

  async getRouter(): Promise<Contract> {
    return new ethers.Contract(routerAddress, RouterAbi, this.defaultSigner);
  }

  async addLiquidity(token1Address: string, token2Address: string) {
    const poolContract = await this.getPoolContractByTokens(
      token1Address,
      token2Address
    );
    const token1Contract = new ethers.Contract(
      token1Address,
      TokenAbi,
      this.defaultSigner
    );
    const token2Contract = new ethers.Contract(
      token2Address,
      TokenAbi,
      this.defaultSigner
    );
    const poolAddress = poolContract.address;
    ethers.constants.AddressZero;
    const tokenInputs: ITokenInput[] = [
      [
        token1Address,
        ethers.utils.parseUnits("1", await token1Contract.decimals()),
      ],
      [
        token2Address,
        ethers.utils.parseUnits("1", await token2Contract.decimals()),
      ],
    ];
    const bytesDataTo = ethers.utils.defaultAbiCoder.encode(
      ["address"],
      [this.defaultSigner.getAddress()]
    );
    const addLiquidityParams: IAddLiquidity = {
      poolAddress,
      tokenInputs,
      bytesDataTo,
      minLp: BigNumber.from("0"), // TODO: calculate this
      calback: ethers.constants.AddressZero,
      callbackData: "0x",
    };
    await this.sendContractTx(
      this.defaultSigner,
      await this.getRouter(),
      "addLiquidity2",
      Object.values(addLiquidityParams)
    );
  }
}
