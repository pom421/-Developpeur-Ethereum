// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;

/**
 * @title SpaContract
 *
 * fonctionnalités ok
 * event ok
 * visibilité ok
 * require ok
 * optimisation ok
 * test
 */
contract SpaContract {
	struct Animal {
		string race;
		uint256 size;
		uint256 age;
		bool isAdopted;
	}

	Animal[] public animals;
	mapping(uint256 => address) public animalToOwner;

	event AnimalAdded(uint256 id, string race, uint256 age);
	event AnimalAdopted(uint256 id, address owner);
	event AnimalUnadopted(uint256 id);
	event AnimalRemoved(uint256 id);

	function getAnimalsCount() external view returns (uint256) {
		return animals.length;
	}

	function getAnimal(uint256 _id) external view returns (Animal memory) {
		require(_id < animals.length, "Animal does not exist");

		return animals[_id];
	}

	function addAnimal(
		string calldata _race,
		uint256 _size,
		uint256 _age
	) external {
		animals.push(Animal(_race, _size, _age, false));

		emit AnimalAdded(animals.length - 1, _race, _age);
	}

	modifier existsAnimal(uint256 id) {
		require(id < animals.length, "Animal does not exist");
		_;
	}

	function animalsForOwner() external view returns (Animal[] memory) {
		Animal[] memory result = new Animal[](animals.length); // Vérifier que c'est une bonne pratique. Je comprends ici qu'on prend une taille maximum pour le tableau.
		uint256 counter = 0;
		for (uint256 i = 0; i < animals.length; i++) {
			if (animalToOwner[i] == msg.sender) {
				result[counter] = animals[i];
				counter++;
			}
		}
		return result;
	}

	function removeAnimal(uint256 id) external existsAnimal(id) {
		// replace the animal to remove with the last animal
		if (id != animals.length - 1) {
			animals[id] = animals[animals.length - 1];
		}
		// remove the last animal
		animals.pop();

		emit AnimalRemoved(id);
	}

	function adoptAnimal(uint256 id) public existsAnimal(id) {
		require(animals[id].isAdopted == false, "Animal is already adopted");

		animals[id].isAdopted = true;
		animalToOwner[id] = msg.sender;

		emit AnimalAdopted(id, msg.sender);
	}

	function unadoptAnimal(uint256 id) external existsAnimal(id) {
		require(animals[id].isAdopted == true, "Animal is not adopted");

		animals[id].isAdopted = false;
		animalToOwner[id] = address(0);

		emit AnimalUnadopted(id);
	}

	// Adopt the first animal that matchs the criteria
	function adoptWithCriteria(
		string calldata _race,
		uint256 _sizeMax,
		uint256 _ageMax
	) external returns (bool) {
		for (uint256 i = 0; i < animals.length; i++) {
			if (keccak256(abi.encodePacked(animals[i].race)) == keccak256(abi.encodePacked(_race))) {
				if (animals[i].size < _sizeMax) {
					if (animals[i].age < _ageMax) {
						if (animals[i].isAdopted == false) {
							adoptAnimal(i);
							return true;
						}
					}
				}
			}
		}
		return false;
	}
}
