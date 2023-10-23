import { ethers } from "ethers";

export function isZeroAddress(address: string): boolean {
  return ethers.constants.AddressZero === address;
}

export function getRandom(min: number, max: number) {
  const floatRandom = Math.random();
  const difference = max - min;
  const random = Math.round(difference * floatRandom);
  return random + min;
}
