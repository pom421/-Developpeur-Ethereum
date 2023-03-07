// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Spa {
	struct Animal {
		string race;
		uint256 taille;
		uint256 age;
		bool isAdopted;
	}

	Animal[] Animaux;
	mapping(address => uint256) public Adoption;
	event animalAdded(uint256 id);
	event animalAdopted(uint256 _id, address _addr);

	// CRUD = create read update delete

	function Add(
		string calldata _race,
		uint256 _taille,
		uint256 _age
	) public {
		Animaux.push(Animal(_race, _taille, _age, false));
		emit animalAdded(Animaux.length - 1);
	}

	function Get(uint256 _id) public view returns (Animal memory Rex) {
		return Rex = Animaux[_id];
	}

	function Set(
		uint256 _id,
		string calldata _race,
		uint256 _taille,
		uint256 _age
	) public {
		Animaux[_id].race = _race;
		Animaux[_id].taille = _taille;
		Animaux[_id].age = _age;
	}

	function Delete(uint256 _id) public {
		delete Animaux[_id];
	}

	// Adoption

	function AdoptOne(uint256 _id) public {
		require(Animaux[_id].isAdopted == false, "cet animal est deja adopte");
		Animaux[_id].isAdopted = true;
		Adoption[msg.sender] = _id;
		emit animalAdopted(_id, msg.sender);
	}

	function GetAdoption(address _addr) public view returns (Animal memory Rex) {
		return Rex = Animaux[Adoption[_addr]];
	}

	function AdoptIfMax(
		string calldata _race,
		uint256 _tailleMax,
		uint256 _ageMax
	) public returns (bool) {
		for (uint256 i; i < Animaux.length; i++) {
			if (keccak256(abi.encodePacked(_race)) == keccak256(abi.encodePacked(Animaux[i].race))) {
				if (Animaux[i].taille <= _tailleMax) {
					if (Animaux[i].age < _ageMax) {
						if (Animaux[i].isAdopted == false) {
							Animaux[i].isAdopted = true;
							Adoption[msg.sender] = i;
							emit animalAdopted(i, msg.sender);
							return true;
						}
					}
				}
			}
		}
		return false;
	}
}
