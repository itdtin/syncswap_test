import { ethers } from "ethers";
import { Config } from "./classes/Config";
import { SyncSwap } from "./classes/SyncSwap";
import { Wallet } from "./classes/Wallet";
import RouterAbi from "./abis/SyncSwapRouter.abi.json";

async function addAndWithdrawLiquidity() {
  const syncSwap = new SyncSwap();
  if (syncSwap.commonConfig.addLiquidity) {
    await syncSwap.addLiquidity();
  }
  // if (syncSwap.commonConfig.withdrawLiquidity) {
  //   await syncSwap.removeLiquidity(
  //     syncSwap.commonConfig.token1Address,
  //     syncSwap.commonConfig.amount1,
  //     syncSwap.commonConfig.token2Address,
  //     syncSwap.commonConfig.amount2
  //   );
  // }

  const data =
    "0x353766c6000000000000000000000000d3d91634cf4c04ad1b76ce2c06f7385a897f54d30000000000000000000000000000000000000000000000000000000f74371f4800000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000c17e5dec5a1f32a947d4456906fe53079215f76b0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000002dde210000000000000000000000000000000000000000000000000005f69b3ddb678f0000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000006538710900000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000041869612a229325136358451f61099c8e7103345a090fb824def0998ab821badfa5d09530cf578e7cc81781ae232ed1eb284d6ab27074a7c33dc385b4a60a911e71c00000000000000000000000000000000000000000000000000000000000000";
  // //address pool,
  // // TokenInput[] calldata inputs,
  // // bytes calldata data,
  // // uint minLiquidity,
  // // address callback,
  // // bytes calldata callbackData
  // // console.log(
  // //   ethers.utils.defaultAbiCoder.decode(
  // //     ["address", "(address, uint)", "bytes", "uint", "address", "bytes"],
  // //     ethers.utils.hexDataSlice(data, 4)
  // //   )
  // // );

  const iface = new ethers.utils.Interface(RouterAbi);
  console.log(iface.decodeFunctionData("burnLiquidityWithPermit", data));
}

if (require.main === module) {
  addAndWithdrawLiquidity()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
