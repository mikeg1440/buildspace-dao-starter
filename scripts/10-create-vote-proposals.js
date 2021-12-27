import { ethers } from 'ethers';

import sdk from './1-initialize-sdk.js';

// voting contract
const voteModule = sdk.getVoteModule('0xeA874781fAE581728473fe6ed8dE2208E2fd0397');

// ERC20 contract
const tokenModule = sdk.getTokenModule('0xf1282343F3d5CeDdEc6B7915893ceD45BC5bBc77');

(async () => {
  try {
    const amount = 420_000;
    // create proposal to mint 420,000 tokens to the treasury
    await voteModule.propose(`Should the DAO mint an additional ${amount} tokens to the treasury?`,
    [{
          // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
          // to send in this proposal. In this case, we're sending 0 ETH.
          // We're just minting new tokens to the treasury. So, set to 0.
      nativeTokenValue: 0,
      transactionData: tokenModule.contract.interface.encodeFunctionData(
        // we are doing the mint, and minting to the vote module
        'mint',
        [
          voteModule.address,
          ethers.utils.parseUnits(amount.toString(), 18)
        ]
      ),
      // token module that actually executes the mint
      toAddress: tokenModule.address,
    }]);
  
    console.log(`✔ Successfully created proposal to mint ${amount} tokens!`);
  } catch (err) {
    console.error(`Failed to create proposal!\nError: ${err}`);
    process.exit(1);
  }
  
  try {
    const amount = 6_900;
    // create proposal to transfer ourselves 6,900 tokens
    await voteModule.propose(
      `Should the DAO transfer ${amount} tokens from the treasury to ${process.env.WALLET_ADDRESS} for being awesome?`,
      [
        {
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            'transfer',
            [
              process.env.WALLET_ADDRESS,
              ethers.utils.parseUnits(amount.toString(), 18),
            ]
          ),
          toAddress: tokenModule.address,
        }
      ]
    );
    
    console.log(`✔ Successfully created proposal to transfer ${amount} tokens to ourselves!`);
  } catch (err) {
    console.error(`😶 Failed to create proposal to send ourselves tokens\nError: ${err}`);
  }
})();
