// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @custom:security-contact support@etherspay.com
contract ETPToken is ERC20, Ownable {
    constructor(uint64 amountOfTokens) ERC20("Etherspay Token", "ETP") {
        _mint(msg.sender, amountOfTokens * 10 ** decimals());
    }
}