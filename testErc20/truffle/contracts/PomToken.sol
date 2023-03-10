// ERC20Token.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PomToken is ERC20 {
	constructor(uint256 initialSupply) ERC20("Pierro", "POM") {
		_mint(msg.sender, initialSupply);
	}
}
