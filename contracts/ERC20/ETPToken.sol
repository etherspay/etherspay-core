// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ETPToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Etherspay", "ETP") {
        _mint(msg.sender, initialSupply);
    }
}
