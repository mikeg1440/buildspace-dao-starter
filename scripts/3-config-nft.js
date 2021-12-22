/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import { readFileSync } from 'fs';

import sdk from './1-initialize-sdk';

const bundleDrop = sdk.getBundleDropModule('0x2548bA8968957daA079cC8bAE50729fcBb68A7f4');

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: 'Pokédex Gen 4',
        description: 'This NFT gives you access to PokéDAO!',
        image: readFileSync('src/images/pokedex.png'),
      },
    ]);
    // eslint-disable-next-line no-console
    console.log('✅ Successfully created a new NFT in the PokéDAO drop!');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[❌] Failed to create new NFT!', err);
  }
})();
