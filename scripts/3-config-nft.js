import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

const bundleDrop = sdk.getBundleDropModule("0x2548bA8968957daA079cC8bAE50729fcBb68A7f4");

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "Pokédex Gen 4",
        description: "This NFT gives you access to PokéDAO!",
        image: readFileSync('src/images/pokedex.png'),
      },
    ]);
    console.log('✅ Successfully created a new NFT in the PokéDAO drop!')
  }catch(err) {
    console.error('[❌] Failed to create new NFT!', err)
  }
})()
