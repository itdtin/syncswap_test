import { Contract, providers, Signer, ethers, BigNumber } from "ethers";
import {
  isAddressesEqual,
  isZeroAddress,
  waitChangeTokenBalance,
} from "../utils/utils";
import PoolFactoryAbi from "../abis/PoolFactory.abi.json";
import RouterAbi from "../abis/SyncSwapRouter.abi.json";
import TokenAbi from "../abis/ERC20Permit.json";

import { Wallet } from "./Wallet";
import {
  classicPoolFactory,
  routerAddress,
  stablePoolFactory,
} from "./constants";
import { ITokenInput } from "../interfaces/ITokenInput";
import { IAddLiquidity } from "../interfaces/IAddLiquidity";

export class SyncSwap extends Wallet {
  constructor() {
    super();
  }
  async getPoolContractByTokens(
    token1Address: string,
    token2Address: string
  ): Promise<Contract> {
    if (isZeroAddress(token1Address)) {
      token1Address = this.networkConfig.weth;
    }
    if (isZeroAddress(token2Address)) {
      token2Address = this.networkConfig.weth;
    }
    let factory, poolAddress;
    factory = this.getStablePoolFactory();
    poolAddress = await factory.getPool(token1Address, token2Address);
    if (isZeroAddress(poolAddress)) {
      factory = this.getClassicPoolFactory();
      poolAddress = await factory.getPool(token1Address, token2Address);
    }
    if (isZeroAddress(poolAddress)) {
      throw new Error(
        `There is no pool available on the address ${poolAddress}`
      );
    }
    return this.getContract(poolAddress, TokenAbi);
  }

  getClassicPoolFactory(): Contract {
    return this.getContract(classicPoolFactory, PoolFactoryAbi);
  }

  getStablePoolFactory(): Contract {
    return this.getContract(stablePoolFactory, PoolFactoryAbi);
  }

  getRouter(): Contract {
    return this.getContract(routerAddress, RouterAbi);
  }

  getTokenContract(tokenAddress: string): Contract {
    return this.getContract(tokenAddress, TokenAbi);
  }

  getContract(address: string, abi: any): Contract {
    return new ethers.Contract(address, abi, this.defaultSigner);
  }

  async getAmountBn(
    tokenAddress: string,
    amount: number,
    isETH: boolean
  ): Promise<BigNumber> {
    if (isETH) {
      return ethers.utils.parseEther(amount.toString());
    }
    const tokenContract = this.getContract(tokenAddress, TokenAbi);
    return ethers.utils.parseUnits(
      amount.toString(),
      await tokenContract.decimals()
    );
  }

  async addLiquidity() {
    let overrides;
    const defaultSignerAddress = await this.defaultSigner.getAddress();
    const poolContract = await this.getPoolContractByTokens(
      this.commonConfig.token1Address,
      this.commonConfig.token2Address
    );
    const isT1ETH =
      isAddressesEqual(
        this.commonConfig.token1Address,
        this.networkConfig.weth
      ) || isZeroAddress(this.commonConfig.token1Address);
    const isT2ETH =
      isAddressesEqual(
        this.commonConfig.token2Address,
        this.networkConfig.weth
      ) || isZeroAddress(this.commonConfig.token2Address);
    const poolAddress = poolContract.address;

    const token1Amount = await this.getAmountBn(
      this.commonConfig.token1Address,
      this.commonConfig.amount1,
      isT1ETH
    );
    const token2Amount = await this.getAmountBn(
      this.commonConfig.token2Address,
      this.commonConfig.amount2,
      isT2ETH
    );

    const tokenInputs: ITokenInput[] = [
      [
        isT1ETH
          ? ethers.constants.AddressZero
          : this.commonConfig.token1Address,
        token1Amount,
      ],
      [
        isT2ETH
          ? ethers.constants.AddressZero
          : this.commonConfig.token2Address,
        token2Amount,
      ],
    ];
    const bytesDataTo = ethers.utils.defaultAbiCoder.encode(
      ["address"],
      [defaultSignerAddress]
    );
    const addLiquidityParams: IAddLiquidity = {
      poolAddress,
      tokenInputs,
      bytesDataTo,
      minLp: BigNumber.from("0"),
      calback: ethers.constants.AddressZero,
      callbackData: "0x",
    };
    if (isT1ETH) {
      overrides = { value: token1Amount };
    } else if (isT2ETH) {
      overrides = { value: token2Amount };
    }
    const router = this.getRouter();
    const lpBalanceBefore = await poolContract.balanceOf(defaultSignerAddress);
    await this.sendContractTx(
      this.defaultSigner,
      router,
      "addLiquidity2",
      Object.values(addLiquidityParams),
      overrides
    );
    await waitChangeTokenBalance(
      poolContract,
      defaultSignerAddress,
      lpBalanceBefore
    );
  }
}
