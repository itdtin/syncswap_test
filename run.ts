import { SyncSwap } from "./classes/SyncSwap";

async function addAndWithdrawLiquidity() {
  const syncSwap = new SyncSwap();
  if (syncSwap.config.addLiquidity) {
    await syncSwap.addLiquidity();
  }
  if (syncSwap.config.removeLiquidity) {
    await syncSwap.removeLiquidity();
  }
}

if (require.main === module) {
  addAndWithdrawLiquidity()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
