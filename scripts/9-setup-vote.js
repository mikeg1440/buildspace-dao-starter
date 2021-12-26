/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
import { ethers } from 'ethers';

import sdk from './1-initialize-sdk.js';

const voteModule = sdk.getVoteModule('0xeA874781fAE581728473fe6ed8dE2208E2fd0397');

// the ERC20 contract
const tokenModule = sdk.getTokenModule('0xf1282343F3d5CeDdEc6B7915893ceD45BC5bBc77');

(async () => {
  try {
    // give treasury the power to mint tokens if needed
    await tokenModule.grantRole('minter', voteModule.address);

    // eslint-disable-next-line no-console
    console.log('✔ Successfully granted vote module permission to act on token module (mint tokens)!');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Failed to grant vote module permission to act on token module\nError: ${err}`);
    process.exit(1);
  }

  try {
    // grab wallets token balance
    const ownedTokenBalance = await tokenModule.balanceOf(process.env.WALLET_ADDRESS);

    // grab 70% of the token supply
    const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
    const percent70 = ownedAmount.div(100).mul(70);

    // transfer the 70% of the supply to the voting contract
    await tokenModule.transfer(voteModule.address, percent70);

    // eslint-disable-next-line no-console
    console.log('✔ Successfully transferred 70% of tokens to the vote module');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`😶 Failed to transfer 70% of tokens to vote module!\n${err}`);
  }
})();
