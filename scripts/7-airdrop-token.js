/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
import { ethers } from 'ethers';
import sdk from './1-initialize-sdk.js';

// this is the address from the ERC-1155 membership NFT contract
const bundleDropModule = sdk.getBundleDropModule('0x2548bA8968957daA079cC8bAE50729fcBb68A7f4');

// this is the address from the ERC-20 contract
const tokenModule = sdk.getTokenModule('0xf1282343F3d5CeDdEc6B7915893ceD45BC5bBc77');

(async () => {
  try {
    // get all address of users who own membership NFT (token ID of 0)
    const walletAddresses = await bundleDropModule.getAllClaimerAddresses('0');

    if (walletAddresses.length === 0) {
      console.log('😦 No NFT\'s have been claimed yet, maybe get some friends to claim your free NFT');
      process.exit(0);
    }

    // loop through the array of addresses
    const airdropTargets = walletAddresses.map((address) => {
      // generate a random number between 1000 and 10000
      const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
      console.log(`✔ Going to airdrop ${randomAmount} tokens to ${address}`);

      // set up the target
      const airdropTarget = {
        address,
        // we need 18 decimal places here
        amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
      };

      return airdropTarget;
    });

    // call transferBatch on all our airdrop targets
    console.log('✈ Stating airdrop...');
    await tokenModule.transferBatch(airdropTargets);
    console.log('✔ Successfully airdropped tokens to all the holders of the PokeDOA Membership NFT!');
  } catch (err) {
    console.error(`⚠ Failed to airdrop tokens\n ${err}`);
  }
})();
