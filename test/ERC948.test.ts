// Unit tests for the ERC948 contract and its interactions with the ETPToken contract
// Author: Ray Orole

import { ethers } from "hardhat";
import { expect } from "chai";
import { ETPToken } from "../typechain-types";

describe("ERC948 contract", async function () {
  let erc20: ETPToken;
  let owner: string;
  let secondAccount: string;
  let thirdAccount;

  it("PREP: Initialize accounts", async () => {
    const [_owner, _secondAccount, _thirdAccount] = await ethers.getSigners();
    owner = _owner.address;
    secondAccount = _secondAccount.address;
    thirdAccount = _thirdAccount.address;
  });

  before(async function () {
    // Deploy the ETPToken contract and assign the total supply of 1000 tokens to the owner
    const ERC20 = await ethers.getContractFactory("ETPToken");
    erc20 = await ERC20.deploy(1000);
  });

  it("ERC20: Should assign the total supply of tokens to the owner", async function () {
    // Deploy the ETPToken contract and assign the total supply of 1000 tokens to the owner
    const ownerBalance = await erc20.balanceOf(owner);
    expect(await erc20.totalSupply()).to.equal(ownerBalance);
  });

  it("ERC948: Deployment should assign the total supply of tokens to the owner", async function () {
    // Deploy the ERC948 contract
    const ERC948 = await ethers.getContractFactory("RecurringPayments");
    const erc948 = await ERC948.deploy();

    await erc20.approve(erc948.address, 100);

    // We must use a start time that is now or in the future
    let current_timestamp = Math.round(new Date().getTime() / 1000);

    let response = await erc948.createSubscription(
      secondAccount, //address _payeeAddress,
      erc20.address, //address _tokenAddress,
      1, //uint _amountRecurring,
      2, //uint _amountInitial,
      0, //uint _periodType,
      30, //uint _periodMultiplier,
      current_timestamp + 10, //uint _startTime,
      "" //string _data
    );

    console.log(response);
  });
});
