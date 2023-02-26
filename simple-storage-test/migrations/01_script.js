const Storage = artifacts.require("Storage");

module.exports = async (deployer, network, accounts) => {
    console.log("Accounts 0", accounts[0]);
    // await deployer.deploy(Storage, 5, { from: accounts[0], value: 100000000 });
    await deployer.deploy(Storage);
    const instance = await Storage.deployed();
    console.log("Storage deployed to:", instance.address);
    await console.log("valeur du retrieve", await instance.retrieve());
};
