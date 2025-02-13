import { ThirdwebSDK } from '@3rdweb/sdk';
import ethers from 'ethers';

import dotenv from 'dotenv';

dotenv.config();

if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === '') {
  // eslint-disable-next-line no-console
  console.log('Private key not found!');
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === '') {
  // eslint-disable-next-line no-console
  console.log('Alchemy API URL not found!');
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === '') {
  // eslint-disable-next-line no-console
  console.log('Wallet address not found!');
}

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    process.env.PRIVATE_KEY,
    // RCP URL, using Alchemy here
    ethers.getDefaultProvider(process.env.ALCHEMY_API_URL),
  ),
);

(async () => {
  try {
    const apps = await sdk.getApps();
    // eslint-disable-next-line no-console
    console.log('Your app address is: ', apps[0].address);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to get apps from the sdk', err);
    process.exit(1);
  }
})();

export default sdk;
