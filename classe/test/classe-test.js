const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const constants = require("@openzeppelin/test-helpers/src/constants");

const Storage = artifacts.require("../Storage.sol");

contract("Storage", (accounts) => {
  let storageInstance;

  before(async () => {
    // runs once before the first test in this block
    console.log("accounts", accounts);
    // storageInstance = await Storage.deployed();
  });

  beforeEach(async () => {
    // runs before each test in this block
    storageInstance = await Storage.new();
  });

  it.only("should store the value 89.", async () => {
    // const storageInstance = await Storage.deployed();
    // const storageInstance = await Storage.new(); => crée une nouvelle instance avec un state reset

    // Set value of Pending
    await storageInstance.store(1, { from: accounts[0] });

    // Get stored value
    const storedData = await storageInstance.retrieve.call();

    console.log("storedData", storedData);

    expect(storedData).to.be.bignumber.equal(new BN(1));
    // expect(storedData).to.be.bignumber.equal(storageInstance.StatusValue.Pending);

    // expect(storedData).to.be.bignumber.equal("89");
    // expect(storedData).to.be.bignumber.equal(new BN(89));
  });

  it("should store the value 13.", async () => {
    // Set value of 13
    const result = await storageInstance.store(13, { from: accounts[0] });

    await expectEvent(result, "Stored_Event", {
      _data: new BN(13),
    });

    // Get stored value
    const storedData = await storageInstance.retrieve.call();

    expect(storedData).to.be.bignumber.equal("13");
  });

  it("should revert if the value is not 13.", async () => {
    // Expect an error because the value is not > 10.
    await expectRevert(
      storageInstance.store(8, { from: accounts[0] }),
      "num must be greater than 10"
    );
  });
});
