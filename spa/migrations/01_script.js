const SpaContract = artifacts.require("SpaContract");
const SpaCyril = artifacts.require("Spa");

module.exports = async (deployer, network, accounts) => {
  console.log("Accounts 0", accounts[0]);
  await deployer.deploy(SpaContract);
  await deployer.deploy(SpaCyril);
  const instance = await SpaContract.deployed();
  const instanceCyril = await SpaCyril.deployed();
  console.log("SpaContract deployed to      :", instance.address);
  console.log("SpaContract Cyril deployed to:", instanceCyril.address);
};
