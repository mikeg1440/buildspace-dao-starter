import { useEffect, useMemo, useState } from 'react';

import SnorlaxImage from './images/snorlax.png';
import PikachuImage from './images/pikachu-small.png';
import SquirtleImage from './images/squirtle-small.png';

import { useWeb3 } from '@3rdweb/hooks';
import { BundleDropModule, ThirdwebSDK } from '@3rdweb/sdk';

// initiate sdk on Rinkeby
const sdk = new ThirdwebSDK('rinkeby');

const bundleDropModule = sdk.getBundleDropModule("0x2548bA8968957daA079cC8bAE50729fcBb68A7f4");

const App = () => {

  const { connectWallet, address, error, provider } = useWeb3();
  console.info('+ Address: ' + address);
  
  const signer = provider ? provider.getSigner() : undefined;
  
  // set a state variable to track the loading state while the NFT is minting.
  const [ isClaiming, setIsClaiming ] = useState(false);
  
  const [ hasClaimedNFT, setHasClaimedNFT ] = useState(false);
  
  useEffect(() => {
    // pass the signer to the sdk so we can interact with the contract
    sdk.setProviderOrSigner(signer);
  }, [signer]);
  
  useEffect(() => {
    if (!address) return;
    
    return bundleDropModule
      .balanceOf(address, 0)
      .then((balance) => {
        // if balance is greater than 0, then they have our NFT!
        if (balance > 0){
          setHasClaimedNFT(true);
          console.log('👍 This user has a membership NFT!');
        }else {
          setHasClaimedNFT(false);
          console.log('🤯	This user does not have a membership NFT yet!')
        }
      })
      .catch((err) => {
        setHasClaimedNFT(false);
        console.log('🥶 Failed to get NFT balance!');
      });
  }, [address]);
  
  if (!address){
    return (
      <div className="landing">
        <img src={SnorlaxImage} alt="Snorlax Icon" style={{ width: '60%', margin: 'auto' }} />
        <h1>Welcome to <span className="color-header">PokéDAO</span></h1>
        <button onClick={() => connectWallet('injected')} className='btn-hero'>
          Connect to wallet
        </button>
      </div>
    );  
  }
  
  const mintNft = () => {
    setIsClaiming(true);
    // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet
    bundleDropModule
    .claim("0", 1)
    .catch((err) => {
      console.log('🤮 Failed to claim NFT', err);
      setIsClaiming(false);
    })
    .finally(() => {
      setIsClaiming(false);
      setHasClaimedNFT(true);
      // Show user new NFT 
      console.log(`🥳 Successfully minted!\n Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`);
    });
  }
  
  return (
  <div className="mint-nft">
    <div className="image-container">
      <img src={PikachuImage} alt="Pikachu from Pokemon jumping" />
      <img src={SquirtleImage} alt="Squirtle form Pokemon dancing" />
    </div>
    <h1>Mint your free PokéDAO Membership NFT!</h1>
    <button
      disabled={isClaiming}
      onClick={() => mintNft()}>
    { isClaiming ? 'Minting...' : 'Mint your NFT (Free)'}
    </button>
  </div>
  )
};

export default App;
