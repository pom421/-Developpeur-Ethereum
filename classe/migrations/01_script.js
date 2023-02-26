const ClasseContract = artifacts.require("ClasseContract");

module.exports = async (deployer, network, accounts) => {
    console.log("Accounts 0", accounts[0]);
    // await deployer.deploy(ClasseContract, 5, { from: accounts[0], value: 100000000 });
    await deployer.deploy(ClasseContract);
    const instance = await ClasseContract.deployed();
    console.log("ClasseContract deployed to:", instance.address);
};
