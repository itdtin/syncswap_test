# syncswap_test
## Developed by [BenderRoyman](https://t.me/BenderRoyman)
This software is for adding and removing liquidity on SyncSwap dex. Currently only on ZkSync network.
To use that You need have installed NodeJs and follow the instructions below.

## Installation and preparation
1. Run `npm install`
2. Create new wallets.txt file with private key and put it into the root of the project directory.
3. Follow the instructions below to set up

## Configuration File (config.js) Overview
At the root of your project, you will find the config.js file, which plays a crucial role in customizing the behavior of the script. This configuration file allows you to fine-tune various parameters to suit your specific needs. Here's an explanation of the fields and options available:

1. Running Script Parameters
There are two important parameters that dictate the script's behavior:

 > addLiquidity: Set this parameter to true or false to specify whether the script should execute the operation of adding liquidity.

 > removeLiquidity: Similarly, you can set this parameter to true or false to determine whether the script should execute the operation of removing liquidity.

These parameters control whether the script performs these core actions.

2. Tokens and Amounts
Next, you can configure the specific tokens and the corresponding amounts for your liquidity operations:

 > token1Address and token2Address: Replace these addresses with the addresses of the tokens you intend to add liquidity for. By default, the addresses of the tokens are stored in utils/constants.ts.

 > amount1 and amount2: These fields represent the amount of tokens to be added to liquidity. The values should be provided in decimals and will be transformed into a BigNumber following the token's decimal places.

 > approveAddLiquidityMax and approveWithdrawLiquidityMax: These parameters determine whether to approve the SyncSwapRouter as a spender for the tokens with the maximum possible value. You can set them to true or false.

 > changeBalanceWaitTime: Specify the waiting time in seconds. This parameter controls how long the script will wait for LP (Liquidity Provider) tokens to mint after an "add liquidity" transaction.

These settings allow you to define the specifics of the tokens and their quantities involved in your liquidity operations.

By configuring the config.js file according to your requirements, you can tailor the behavior of script to suit your project needs.
