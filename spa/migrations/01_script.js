const SpaContract = artifacts.require("SpaContract");

module.exports = async (deployer, network, accounts) => {
  console.log("Accounts 0", accounts[0]);
  await deployer.deploy(SpaContract);
  const instance = await SpaContract.deployed();
  console.log("SpaContract deployed to:", instance.address);
};
