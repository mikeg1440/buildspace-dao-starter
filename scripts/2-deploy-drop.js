/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import sdk from './1-initialize-sdk';

const app = sdk.getAppModule('0xb0b36EE4110d24ed571f96524437fFEbaD61f708');

(async () => {
  try {
    const bundleDropModule = await app.deployBundleDropModule({
    // collection's name
      name: 'PokeDAO Membership',
      description: 'A DAO for fans of the game Pokemon',
      image: readFileSync('src/images/pokeball-nft.png'),
      // Pass in the address who will be receiving the proceeds from sales of nfts in the module.
      // We're planning on not charging people for the drop, so we'll pass in the 0x0 address
      // Any wallet address here will receive the funds for the drops cost
      primarySaleRecipientAddress: ethers.constants.AddressZero,
    });

    // eslint-disable-next-line no-console
    console.log('✅ Successfully deployed bundleDrop module, address: ', bundleDropModule.address);

    // eslint-disable-next-line no-console
    console.log(' ✅ bundleDrop metadata: ', await bundleDropModule.getMetadata());
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Failed to deploy bundleDrop module', err);
  }
})();
