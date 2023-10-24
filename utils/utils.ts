import { BigNumber, Contract, ethers } from "ethers";

export function isZeroAddress(address: string): boolean {
  return ethers.constants.AddressZero === address;
}

export function isAddressesEqual(address1: string, address2: string): boolean {
  return (
    ethers.utils.getAddress(address1) === ethers.utils.getAddress(address2)
  );
}

export function getRandom(min: number, max: number) {
  const floatRandom = Math.random();
  const difference = max - min;
  const random = Math.round(difference * floatRandom);
  return random + min;
}
export async function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export async function waitChangeTokenBalance(
  tokenContract: Contract,
  address: string,
  balanceBefore: BigNumber,
  waitTime: number = 1000
) {
  let waited = 0;
  let balanceAfter = balanceBefore;
  while (balanceAfter <= balanceBefore) {
    const waitNow = Math.random() * (20 - 5) + 5;
    console.log(waitNow);
    sleep(waitNow);
    balanceAfter = await tokenContract.balanceOf(address);
    waited += waitNow;
    if (waited > waitTime) {
      return false;
    }
  }
  return balanceAfter;
}
