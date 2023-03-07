const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const constants = require("@openzeppelin/test-helpers/src/constants");

const SpaContract = artifacts.require("../SpaContract.sol");

/**
 * Tests
 *
 * event
 * require
 * revert
 */
contract("SpaContract", (accounts) => {
  let spaInstance;
  const owner = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];

  describe("test getter/setter", () => {
    beforeEach(async () => {
      // runs before each test in this block
      spaInstance = await SpaContract.new({ from: owner });
    });

    it("should add an animal.", async () => {
      await spaInstance.addAnimal("chien", "80", "2", { from: accounts[0] });
      await spaInstance.addAnimal("chat", "40", "4", { from: accounts[0] });

      const animalsCount = await spaInstance.getAnimalsCount.call();

      expect(animalsCount).to.be.bignumber.equal(new BN(2));
    });

    it("should support removing an animal & the last replace the removed one.", async () => {
      await spaInstance.addAnimal("chien", "80", "2", { from: accounts[0] });
      await spaInstance.addAnimal("chat", "40", "4", { from: accounts[0] });
      await spaInstance.addAnimal("tortue", "40", "4", { from: accounts[0] });
      await spaInstance.addAnimal("poisson", "10", "1", { from: accounts[0] });

      expect(await spaInstance.getAnimalsCount.call()).to.be.bignumber.equal(
        new BN(4)
      );

      await spaInstance.removeAnimal(1, { from: accounts[0] });

      expect(await spaInstance.getAnimalsCount.call()).to.be.bignumber.equal(
        new BN(3)
      );

      // const animal = await spaInstance.animals(new BN(1));
      const animal = await spaInstance.animals.call(new BN(1));

      expect(animal.race).to.be.equal("poisson");
    });

    it("should remove the last animal and not swap with another.", async () => {
      await spaInstance.addAnimal("chien", "80", "2", { from: accounts[0] });
      await spaInstance.addAnimal("chat", "40", "4", { from: accounts[0] });
      await spaInstance.addAnimal("tortue", "40", "4", { from: accounts[0] });
      await spaInstance.addAnimal("poisson", "10", "1", { from: accounts[0] });

      await spaInstance.removeAnimal(3, { from: accounts[0] });

      expect(await spaInstance.getAnimalsCount.call()).to.be.bignumber.equal(
        new BN(3)
      );

      const animal0 = await spaInstance.animals.call(new BN(0));
      const animal1 = await spaInstance.animals.call(new BN(1));
      const animal2 = await spaInstance.animals.call(new BN(2));

      expect(animal0.race).to.be.equal("chien");
      expect(animal1.race).to.be.equal("chat");
      expect(animal2.race).to.be.equal("tortue");
      expectRevert.unspecified(spaInstance.animals.call(new BN(3)));
    });
  });
});
