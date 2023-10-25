import { Contract, ethers, BigNumber, PayableOverrides, Wallet } from "ethers";
import {
  isAddressesEqual,
  isZeroAddress,
  waitChangeTokenBalance,
} from "../utils/utils";
import PoolFactoryAbi from "../abis/PoolFactory.abi.json";
import RouterAbi from "../abis/SyncSwapRouter.abi.json";
import TokenAbi from "../abis/ERC20Permit.json";
import PoolAbi from "../abis/Pool.abi.json";

import { WalletHandler } from "./WalletHandler";
import {
  syncSwapClassicPoolFactory,
  syncSwapRouterAddress,
  stablePoolFactoryStablePoolFactory,
  zkSyncTokens,
} from "../utils/constants";
import { ITokenInput } from "../interfaces/ITokenInput";
import { IAddLiquidity } from "../interfaces/IAddLiquidity";
import { ISyncSwapConfig } from "../interfaces/ISyncSwapConfig";
import { syncSwapConfig } from "../config";
import { IRemoveLiquidity } from "../interfaces/IRemoveLiquidity";
import { getPermitSignature } from "../utils/permit";

export class SyncSwap extends WalletHandler {
  config: ISyncSwapConfig = syncSwapConfig;
  constructor() {
    super();
  }
  async getPoolContractByTokens(
    token1Address: string,
    token2Address: string
  ): Promise<Contract> {
    if (isZeroAddress(token1Address)) {
      token1Address = zkSyncTokens.WETH;
    }
    if (isZeroAddress(token2Address)) {
      token2Address = zkSyncTokens.WETH;
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
    return this.getContract(poolAddress, PoolAbi);
  }

  getClassicPoolFactory(): Contract {
    return this.getContract(syncSwapClassicPoolFactory, PoolFactoryAbi);
  }

  getStablePoolFactory(): Contract {
    return this.getContract(stablePoolFactoryStablePoolFactory, PoolFactoryAbi);
  }

  getRouter(): Contract {
    return this.getContract(syncSwapRouterAddress, RouterAbi);
  }

  getTokenContract(tokenAddress: string): Contract {
    return this.getContract(tokenAddress, TokenAbi);
  }

  getContract(address: string, abi: any): Contract {
    return new ethers.Contract(address, abi, this.defaultWallet);
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
    console.log("Start add liquidity ....");
    try {
      let overrides: PayableOverrides | undefined;
      const defaultSignerAddress = await this.defaultWallet.getAddress();
      const poolContract = await this.getPoolContractByTokens(
        this.config.token1Address,
        this.config.token2Address
      );
      const isT1ETH =
        isAddressesEqual(this.config.token1Address, zkSyncTokens.WETH) ||
        isZeroAddress(this.config.token1Address);
      const isT2ETH =
        isAddressesEqual(this.config.token2Address, zkSyncTokens.WETH) ||
        isZeroAddress(this.config.token2Address);
      const poolAddress = poolContract.address;
      console.log("poolAddress: " + poolAddress);
      const token1Amount = await this.getAmountBn(
        this.config.token1Address,
        this.config.amount1,
        isT1ETH
      );
      const token2Amount = await this.getAmountBn(
        this.config.token2Address,
        this.config.amount2,
        isT2ETH
      );

      const tokenInputs: ITokenInput[] = [
        [
          isT1ETH ? ethers.constants.AddressZero : this.config.token1Address,
          token1Amount,
        ],
        [
          isT2ETH ? ethers.constants.AddressZero : this.config.token2Address,
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
        callback: ethers.constants.AddressZero,
        callbackData: "0x",
      };
      if (isT1ETH) {
        overrides = { value: token1Amount };
      } else {
        await this.approve(
          this.config.token1Address,
          defaultSignerAddress,
          syncSwapRouterAddress,
          token1Amount
        );
      }
      if (isT2ETH) {
        overrides = { value: token2Amount };
      } else {
        await this.approve(
          this.config.token2Address,
          defaultSignerAddress,
          syncSwapRouterAddress,
          token1Amount
        );
      }
      const router = this.getRouter();
      const lpBalanceBefore = await poolContract.balanceOf(
        defaultSignerAddress
      );
      const tx = await this.sendContractTx(
        this.defaultWallet,
        router,
        "addLiquidity2",
        Object.values(addLiquidityParams),
        overrides
      );

      if (tx) {
        const balanceAfter = await waitChangeTokenBalance(
          poolContract,
          defaultSignerAddress,
          lpBalanceBefore
        );
        console.log(`Your LP token balance ${balanceAfter.toString()}`);
      }
      return true;
    } catch (err) {
      console.log(err);
    }
  }

  async removeLiquidity() {
    console.log("Start remove liquidity ...");
    try {
      const defaultSignerAddress = await this.defaultWallet.getAddress();
      const poolContract = await this.getPoolContractByTokens(
        this.config.token1Address,
        this.config.token2Address
      );
      const router = this.getRouter();
      const lpBalance = await poolContract.balanceOf(
        await this.defaultWallet.getAddress()
      );
      console.log(`Your LP token balance ${lpBalance}`);

      const bytesDataTo = ethers.utils.defaultAbiCoder.encode(
        ["address", "uint8"],
        [defaultSignerAddress, 1]
      );
      const removeLiquidityParams: IRemoveLiquidity = {
        poolAddress: poolContract.address,
        liquidity: lpBalance,
        bytesDataTo,
        minAmounts: [BigNumber.from(0), BigNumber.from(0)],
        callback: ethers.constants.AddressZero,
        callbackData: "0x",
      };
      let method = "burnLiquidity";
      await this.approve(
        poolContract.address,
        defaultSignerAddress,
        syncSwapRouterAddress,
        lpBalance
      );
      // if (allowance < lpBalance) {
      // TODO: future improvement
      // const deadline = ethers.constants.MaxUint256;
      // const signature = await this.permit(
      //   poolContract,
      //   routerAddress,
      //   permitAmount,
      //   this.defaultWallet,
      //   deadline
      // );
      // removeLiquidityParams.permit = [permitAmount, deadline, signature];
      // method = "burnLiquidityWithPermit";
      // }
      await this.sendContractTx(
        this.defaultWallet,
        router,
        method,
        Object.values(removeLiquidityParams)
      );
    } catch (err) {
      console.log(err);
    }
  }

  async permit(
    tokenContract: Contract,
    spender: string,
    value: BigNumber,
    signer: Wallet = this.defaultWallet,
    deadline: BigNumber
  ) {
    const signerAddress = await signer.getAddress();
    const nonce = await tokenContract.nonces(signerAddress);
    const signature = await getPermitSignature(
      signer,
      tokenContract,
      {
        owner: signerAddress,
        spender,
        value,
      },
      nonce,
      deadline || ethers.constants.MaxUint256
    );
    return signature;
  }

  async approve(
    tokenAddress: string,
    ownerAddress: string,
    spenderAddress: string,
    amount: BigNumber
  ) {
    amount = this.config.approveMax ? ethers.constants.MaxUint256 : amount;
    const tokenContract = this.getTokenContract(tokenAddress);
    const allowance = await tokenContract.allowance(
      ownerAddress,
      spenderAddress
    );
    if (allowance < amount) {
      await this.sendContractTx(this.defaultWallet, tokenContract, "approve", [
        spenderAddress,
        amount,
      ]);
    }
  }
}
