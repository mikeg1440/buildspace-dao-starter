/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import sdk from './1-initialize-sdk.js';

const app = sdk.getAppModule('0xb0b36EE4110d24ed571f96524437fFEbaD61f708');

(async () => {
  try {
    // deploy a ERC-20 contract
    const tokenModule = await app.deployTokenModule({
      name: 'PokeDAO Governance Token',
      // this is going to be the symbol for the token
      symbol: 'POKE',
    });
    // eslint-disable-next-line no-console
    console.log(`✅ Successfully deployed token module at address: ${tokenModule.address}\n View Token here https://rinkeby.etherscan.io/address/${tokenModule.address}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`😣 Failed to deploy token module\n${err}`);
  }
})();
