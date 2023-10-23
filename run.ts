import { ethers } from "ethers";
import { Config } from "./classes/Config";
import { SyncSwap } from "./classes/SyncSwap";
import { Wallet } from "./classes/Wallet";

async function addAndWithdrawLiquidity() {
  const config = new Config();
  const syncSwap = new SyncSwap(
    config.provider,
    config.commonConfig.walletsFilepath
  );
  await syncSwap.addLiquidity(
    config.commonConfig.token1Address,
    config.commonConfig.token2Address
  );
}

if (require.main === module) {
  addAndWithdrawLiquidity()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
