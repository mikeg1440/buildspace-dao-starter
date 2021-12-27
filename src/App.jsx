/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-useless-return */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/function-component-definition */
import { useWeb3 } from '@3rdweb/hooks';
import { ThirdwebSDK } from '@3rdweb/sdk';
import { useEffect, useState, useMemo } from 'react';
import { ethers } from 'ethers';
import { UnsupportedChainIdError } from '@web3-react/core';

import SnorlaxImage from './images/snorlax.png';
import PikachuImage from './images/pikachu-small.png';
import SquirtleImage from './images/squirtle-small.png';

// initiate sdk on Rinkeby
const sdk = new ThirdwebSDK('rinkeby');

const bundleDropModule = sdk.getBundleDropModule('0x2548bA8968957daA079cC8bAE50729fcBb68A7f4');
const tokenModule = sdk.getTokenModule('0xf1282343F3d5CeDdEc6B7915893ceD45BC5bBc77');
const voteModule = sdk.getVoteModule('0xeA874781fAE581728473fe6ed8dE2208E2fd0397');

export default function App() {
  const {
    connectWallet, address, error, provider,
  } = useWeb3();

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
  const shortenAddress = (str) => {
    if (str) {
      return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;
    }
    return undefined;
  };

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // get all existing proposals from the contract
  useEffect(() => {
    if (!hasClaimedNFT) return;

    voteModule.getAll()
      .then((allProposals) => {
        setProposals(allProposals);
        console.log('♾ Proposals: ', proposals);
      })
      .catch((err) => {
        console.error(`Failed to get proposals\nError: ${err}`);
      });
  }, [hasClaimedNFT]);

  useEffect(() => {
    if (!hasClaimedNFT) return;

    if (!proposals.length) return;

    // check if user has already voted on proposal
    voteModule
      .hasVoted(proposals[0].proposalId, address)
      .then((voteStatus) => {
        setHasVoted(voteStatus);
        console.log('[-] User has already voted!');
      })
      .catch((err) => {
        console.error(`Failed to check if wallet has voted\nError: ${err}`);
      });
  }, [hasClaimedNFT, proposals, address]);

  // This useEffect grabs all our the addresses of our members holding our NFT.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
    // with tokenId 0.
    bundleDropModule
      .getAllClaimerAddresses('0')
      .then((allAddresses) => {
        console.log('🚀 Members addresses', allAddresses);
        setMemberAddresses(allAddresses);
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

  if (error instanceof UnsupportedChainIdError) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks in
          your connected wallet.
        </p>
      </div>
    );
  }

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
          <img
            src={PikachuImage}
            alt="Pikachu from Pokemon jumping"
            width="100px"
          />
          DAO Member Page
          <img
            src={SquirtleImage}
            alt="Squirtle form Pokemon dancing"
            width="100px"
          />
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
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                // before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true);
                // lets get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    // abstain by default
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    // eslint-disable-next-line no-undef
                    const elem = document.getElementById(
                      `${proposal.proposalId}-${vote.type}`,
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                // first we need to make sure the user delegates their token to vote
                try {
                  // we'll check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await tokenModule.getDelegationOf(address);
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === ethers.constants.AddressZero) {
                    // if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await tokenModule.delegateTo(address);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async (vote) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await voteModule.get(vote.proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return voteModule.vote(vote.proposalId, vote.vote);
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                      }),
                    );
                    try {
                      // if any of the proposals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async (vote) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await voteModule.get(
                            vote.proposalId,
                          );

                          // if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return voteModule.execute(vote.proposalId);
                          }
                        }),
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      // and log out a success message
                      console.log('successfully voted');
                    } catch (err) {
                      console.error('failed to execute votes', err);
                    }
                  } catch (err) {
                    console.error('failed to vote', err);
                  }
                } catch (err) {
                  console.error('failed to delegate tokens');
                } finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal, index) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map((vote) => (
                      <div key={vote.type}>
                        <input
                          type="radio"
                          id={`${proposal.proposalId}-${vote.type}`}
                          name={proposal.proposalId}
                          value={vote.type}
                          // default the "abstain" vote to checked
                          defaultChecked={vote.type === 2}
                        />
                        <label htmlFor={`${proposal.proposalId}-${vote.type}`}>
                          {vote.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? 'Voting...'
                  : hasVoted
                    ? 'You Already Voted'
                    : 'Submit Votes'}
              </button>
              <small>
                This will trigger multiple transactions that you will need to
                sign.
              </small>
            </form>
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
