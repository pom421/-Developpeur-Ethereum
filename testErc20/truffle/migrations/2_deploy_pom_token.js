const PomToken = artifacts.require("PomToken");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(PomToken, 100000000, { from: accounts[0] });
};
