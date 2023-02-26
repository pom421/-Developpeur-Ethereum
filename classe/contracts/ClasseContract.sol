// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;

/**
 * @title ClasseContract
 */
contract ClasseContract {
	struct Etudiant {
		string nom;
		uint256 note;
	}

	enum Classe {
		Sixieme,
		Cinquieme,
		Quatrieme,
		Troisieme
	}

	Classe public classe;

	Etudiant[] public etudiants;

	mapping(address => Etudiant) public etudiantsMap;

	event Add_Etudiant(string _nom, uint256 _note);
	event Delete_Etudiant(string _nom);

	function _addEtudiant(Etudiant storage _etudiant) private {
		etudiants.push(_etudiant);
	}

	function addEtudiant(
		address _address,
		string calldata _nom,
		uint256 _note
	) public {
		etudiantsMap[_address] = Etudiant(_nom, _note);
		_addEtudiant(etudiantsMap[_address]);

		emit Add_Etudiant(_nom, _note);
	}

	function getEtudiant(address _address) public view returns (Etudiant memory) {
		return etudiantsMap[_address];
	}

	function getEtudiantByName(string calldata _name) public view returns (Etudiant memory) {
		for (uint256 i = 0; i < etudiants.length; i++) {
			if (
				keccak256(abi.encodePacked(_name)) ==
				keccak256(abi.encodePacked(etudiants[i].nom))
			) {
				return etudiants[i];
			}
		}
	}

	function getArray(string calldata _name) public view returns (Etudiant memory) {
		for (uint256 i; i < etudiants.length; i++) {
			if (
				keccak256(abi.encodePacked(_name)) ==
				keccak256(abi.encodePacked(etudiants[i].nom))
			) {
				return etudiants[i];
			}
		}
	}

	function deleteEtudiant(address _address) public {
		emit Delete_Etudiant(etudiantsMap[_address].nom);

		delete etudiantsMap[_address];
	}

	function setClasse(Classe _classe) public {
		classe = _classe;
	}
}
