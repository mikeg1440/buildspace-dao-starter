import sdk from './1-initialize-sdk.js';

const bundleDrop = sdk.getBundleDropModule("0x2548bA8968957daA079cC8bAE50729fcBb68A7f4");

(async () => {
  try {
    const claimConditionFactory = bundleDrop.getClaimConditionFactory();
  // Specify conditions
  claimConditionFactory.newClaimPhase({
    startTime: new Date(),
    maxQuantity: 50_000,
    maxQuantityPerTransaction: 1,
  });
  
  await bundleDrop.setClaimCondition(0, claimConditionFactory);
  console.log("✅ Sucessfully set claim condition!");
  } catch(err) {
    console.error("❌ Failed to set claim condition!", err);
  }
})()
