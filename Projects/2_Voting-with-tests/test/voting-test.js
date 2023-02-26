const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const constants = require("@openzeppelin/test-helpers/src/constants");

const Voting = artifacts.require("../Voting.sol");

contract("Voting", (accounts) => {
  let votingInstance;

  before(async () => {
    // runs once before the first test in this block
    console.log("accounts", accounts);
    // votingInstance = await Voting.deployed();
  });

  beforeEach(async () => {
    // runs before each test in this block
    votingInstance = await Voting.new();
  });

  it("should be in default status.", async () => {
    // const votingInstance = await Voting.deployed();
    // const votingInstance = await Voting.new(); => crée une nouvelle instance avec un state reset

    console.log("status1", Voting.WorkflowStatus.RegisteringVoters);
    console.log("status2", Voting.WorkflowStatus.ProposalsRegistrationStarted);

    console.log(
      "votingInstance.workflowStatus",
      await votingInstance.workflowStatus.call()
    );

    // expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(Voting.WorkflowStatus.RegisteringVoters);

    await votingInstance.startProposalsRegistering({ from: accounts[0] });

    console.log(
      "votingInstance.workflowStatus",
      await votingInstance.workflowStatus.call()
    );

    expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(
      Voting.WorkflowStatus.ProposalsRegistrationStarted
    );

    // const addVoter = await votingInstance.addVoter(accounts[1]);

    // // Set value of 89
    // await votingInstance.store(89, { from: accounts[0] });

    // // Get stored value
    // const storedData = await votingInstance.retrieve.call();

    // assert.equal(storedData, 89, "The value 89 was not stored.");

    // expect(storedData).to.be.bignumber.equal("89");
    // expect(storedData).to.be.bignumber.equal(new BN(89));
  });

  // it("should store the value 13.", async () => {
  //   // Set value of 13
  //   const result = await votingInstance.store(13, { from: accounts[0] });

  //   await expectEvent(result, "Stored_Event", {
  //     _data: new BN(13),
  //   });

  //   // Get stored value
  //   const storedData = await votingInstance.retrieve.call();

  //   expect(storedData).to.be.bignumber.equal("13");
  // });

  // it("should revert if the value is not 13.", async () => {
  //   // Expect an error because the value is not > 10.
  //   await expectRevert(
  //     votingInstance.store(8, { from: accounts[0] }),
  //     "num must be greater than 10"
  //   );
  // });
});
