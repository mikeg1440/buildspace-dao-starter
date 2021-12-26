import sdk from './1-initialize-sdk.js';

const appModule = sdk.getAppModule('0xb0b36EE4110d24ed571f96524437fFEbaD61f708');

(async () => {
  try {
    const voteModule = await appModule.deployVoteModule({
      // governance contracts need a name
      name: 'PokeDAO\'s Epic Proposals',
      // location of the governance (ERC20 contract) token
      votingTokenAddress: '0xf1282343F3d5CeDdEc6B7915893ceD45BC5bBc77',
      // set wait time for when contract is active '0' is immediately
      proposalStartWaitTimeInSeconds: 0,
      // set amount of time proposal is able to be voted on (24 hours here)
      proposalVotingTimeInSeconds: 24 * 60 * 60,
      votingQuorumFraction: 0,
      // min # of tokens required to vote on proposal (0 means everyone can vote)
      minimumNumberOfTokensNeededToPropose: '0',
    });

    // eslint-disable-next-line no-console
    console.log(`✔ Successfully deployed a vote module\nAddress: ${voteModule.address}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`😑 Failed to deploy vote module\nError: ${err}`);
  }
})();
