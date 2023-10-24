import { BigNumber, Contract, ethers, Signature, providers } from "ethers";
import { splitSignature } from "ethers/lib/utils";

export async function getPermitSignature(
  wallet: providers.JsonRpcSigner,
  token: Contract,
  approve: {
    owner: string;
    spender: string;
    value: BigNumber;
  },
  nonce: BigNumber,
  deadline: BigNumber
): Promise<string> {
  const domain = {
    name: await token.name(),
    version: "1",
    chainId: 280,
    verifyingContract: token.address,
  };
  const types = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  };
  const values = {
    owner: approve.owner,
    spender: approve.spender,
    value: approve.value,
    nonce: nonce,
    deadline: deadline,
  };
  return await wallet._signTypedData(domain, types, values);
}

export async function getSplittedPermitSignature(
  wallet: providers.JsonRpcSigner,
  token: Contract,
  approve: {
    owner: string;
    spender: string;
    value: BigNumber;
  },
  nonce: BigNumber,
  deadline: BigNumber
): Promise<Signature> {
  return splitSignature(
    await getPermitSignature(wallet, token, approve, nonce, deadline)
  );
}
