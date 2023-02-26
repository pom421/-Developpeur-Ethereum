// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts grgr
 */
contract Storage {
	enum StatusValue {
		Pending,
		Active,
		Inactive
	}

	// uint256 public number;
	StatusValue public status;

	event Stored_Event(StatusValue _status);

	/**
	 * @dev Store value in variable
	 * @param _status status to store
	 */
	function store(StatusValue _status) public {
		// require(num > 10, "num must be greater than 10");
		status = _status;

		emit Stored_Event(_status);
	}

	/**
	 * @dev Return value
	 * @return value of 'number'
	 */
	function retrieve() public view returns (StatusValue) {
		return status;
	}
}
