import { ethers } from 'ethers';
import sdk from './1-initialize-sdk.js';

// Address of the ERC-20 contract we got from output of previous script
const tokenModule = sdk.getTokenModule("0xf1282343F3d5CeDdEc6B7915893ceD45BC5bBc77");

(async () => {
  try {
    // set the max supply of tokens
    const amount = 1_000_000;
    // use ethers util function to convert amount to have 18 
    // decimals (standard for ERC20 tokens)
    const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
    // interact w/ deployed ERC20 contract and mint tokens!
    await tokenModule.mint(amountWith18Decimals);
    const totalSupply = await tokenModule.totalSupply();
    
    // output to user the amount of tokens minted
    console.log(`\u{1F386} There is now ${ethers.utils.formatUnits(totalSupply, 18)} $POKE in circulation!`);
  }catch (err){
    console.error(`\u26A0\uFE0F Failed to mint tokens`)
  }
})();