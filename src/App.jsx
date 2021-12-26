/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/function-component-definition */
import { useWeb3 } from '@3rdweb/hooks';
import { ThirdwebSDK } from '@3rdweb/sdk';
import { useEffect, useState, useMemo } from 'react';
import { ethers } from 'ethers';

import SnorlaxImage from './images/snorlax.png';
import PikachuImage from './images/pikachu-small.png';
import SquirtleImage from './images/squirtle-small.png';

// initiate sdk on Rinkeby
const sdk = new ThirdwebSDK('rinkeby');

const bundleDropModule = sdk.getBundleDropModule('0x2548bA8968957daA079cC8bAE50729fcBb68A7f4');
const tokenModule = sdk.getTokenModule('0xf1282343F3d5CeDdEc6B7915893ceD45BC5bBc77');

export default function App() {
  const { connectWallet, address, provider } = useWeb3();

  console.info(`👽 Address: ${address}`);

  const signer = provider ? provider.getSigner() : undefined;

  // set a state variable to track the loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState(false);

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // Holds the amount of token each member has in state.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  // The array holding all of our members addresses.
  const [memberAddresses, setMemberAddresses] = useState([]);

  // A fancy function to shorten someones wallet address, no need to show the whole thing.
  const shortenAddress = (str) => `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;

  // This useEffect grabs all our the addresses of our members holding our NFT.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
    // with tokenId 0.
    bundleDropModule
      .getAllClaimerAddresses('0')
      .then((addresses) => {
        console.log('🚀 Members addresses', addresses);
        setMemberAddresses(addresses);
      })
      .catch((err) => {
        console.error('failed to get member list', err);
      });
  }, [hasClaimedNFT]);

  // This useEffect grabs the # of token each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Grab all the balances.
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log('👜 Amounts', amounts);
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.error('failed to get token amounts', err);
      });
  }, [hasClaimedNFT]);

  // Now, we combine the memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => memberAddresses.map((memberAddress) => ({
    memberAddress,
    tokenAmount: ethers.utils.formatUnits(
      // If the address isn't in memberTokenAmounts, it means they don't
      // hold any of our token.
      memberTokenAmounts[memberAddress] || 0,
      18,
    ),
  })), [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    if (address !== null) return;
    // pass the signer to the sdk so we can interact with the contract
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    if (!address) return;

    // eslint-disable-next-line consistent-return
    return bundleDropModule
      .balanceOf(address, 0)
      .then((balance) => {
        // if balance is greater than 0, then they have our NFT!
        if (balance > 0) {
          setHasClaimedNFT(true);
          console.log('👍 This user has a membership NFT!');
        } else {
          setHasClaimedNFT(false);
          console.log('😵 This user does not have a membership NFT yet!');
        }
      })
      .catch(() => {
        setHasClaimedNFT(false);
        console.log('🥶 Failed to get NFT balance!\n');
      });
  }, [address]);

  const mintNft = () => {
    setIsClaiming(true);
    // Call bundleDropModule.claim("0", 1) to mint a single nft (id === 0) to user's wallet
    bundleDropModule
      .claim('0', 1)
      .catch((err) => {
        console.log('🤮 Failed to claim NFT', err);
        setIsClaiming(false);
      })
      .finally(() => {
        setIsClaiming(false);
        setHasClaimedNFT(true);
        // Show user new NFT
        console.log(
          `🥳 Successfully minted!\n Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`,
        );
      });
  };

  if (!address) {
    return (
      <div>
        <img
          src={SnorlaxImage}
          alt="Snorlax Icon"
          style={{ width: '60%', margin: 'auto' }}
        />
        <h1>
          Welcome to
          <span className="color-header poketext-logo">PokéDAO</span>
        </h1>
        <button
          type="button"
          onClick={() => connectWallet('injected')}
          className="btn-hero"
        >
          Connect to wallet
        </button>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1 className="poketext">
          <img src={PikachuImage} alt="Pikachu from Pokemon jumping" width="100px" />
          DAO Member Page
          <img src={SquirtleImage} alt="Squirtle form Pokemon dancing" width="100px" />
        </h1>
        <p>Congratulations on being a member!</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => (
                  <tr key={member.memberAddress}>
                    <td>{shortenAddress(member.memberAddress)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mint-nft">
      <div className="image-container">
        <img src={PikachuImage} alt="Pikachu from Pokemon jumping" />
        <img src={SquirtleImage} alt="Squirtle form Pokemon dancing" />
      </div>
      <h1>Mint your free PokéDAO Membership NFT!</h1>
      <button type="button" disabled={isClaiming} onClick={() => mintNft()}>
        {isClaiming ? 'Minting...' : 'Mint your NFT (Free)'}
      </button>
    </div>
  );
}
