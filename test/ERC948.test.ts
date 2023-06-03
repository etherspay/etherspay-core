// Unit tests for the ERC948 contract and its interactions with the ETPToken contract
// Author: Ray Orole

import { ethers } from "hardhat";
import { assert, expect } from "chai";
import { ETPToken, RecurringPayments } from "../typechain-types";

function findEvent(response: any, eventName: string) {
  for (var i = 0; i < response.events.length; i++) {
    var log = response.events[i];

    if (log.event == eventName) {
      // We found the event!
      return log;
    }
  }
  return false;
}

describe("ERC948 contract", async function () {
  let erc20: ETPToken;
  let erc948: RecurringPayments;
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
    erc20 = await ERC20.deploy();

    // Deploy the ERC948 contract
    const ERC948 = await ethers.getContractFactory("RecurringPayments");
    erc948 = await ERC948.deploy();
  });

  it("ERC20: Should assign the total supply of tokens to the owner", async function () {
    // Deploy the ETPToken contract and assign the total supply of 1000 tokens to the owner
    const ownerBalance = await erc20.balanceOf(owner);
    expect(await erc20.totalSupply()).to.equal(ownerBalance);
  });

  it("ERC948: Should emit NewSubscription event when createSubscription is called", async function () {
    await erc20.approve(erc948.address, 100);

    // We must use a start time that is now or in the future
    const current_timestamp = Math.round(new Date().getTime() / 1000);

    const tx = await erc948.createSubscription(
      secondAccount, //address _payeeAddress,
      erc20.address, //address _tokenAddress,
      1, //uint _amountRecurring,
      3, //uint _amountInitial,
      0, //uint _periodType,
      30, //uint _periodMultiplier,
      current_timestamp + 10, //uint _startTime,
      "" //string _data
    );

    const receipt = await tx.wait();
    const event = findEvent(receipt, "NewSubscription");

    // Check that the event was emitted
    assert.notEqual(event, false);
    // Subscription ID should be 66 characters long (32 bytes)
    assert.lengthOf(event.args._subscriptionId, 66);
  });

  it("ERC948: Should pay amountInitial to secondAccount", async () => {
    let balance_before = await erc20.balanceOf(owner);

    const current_timestamp = Math.round(new Date().getTime() / 1000);
    await erc948.createSubscription(
      secondAccount, //address _payeeAddress,
      erc20.address, //address _tokenAddress,
      1, //uint _amountRecurring,
      2, //uint _amountInitial,
      0, //uint _periodType,
      30, //uint _periodMultiplier,
      current_timestamp + 10, //uint _startTime,
      "" //string _data
    );

    let balance_after = await erc20.balanceOf(owner);
    // Check that the owner's balance has decreased by 2
    assert(balance_before.add(-2).eq(balance_after));
  });

  it("ERC948: Should return false when valid subscription has no due payment", async () => {
    // subscription startTime is 10 seconds from now
    const current_timestamp = Math.round(new Date().getTime() / 1000);
    const tx = await erc948.createSubscription(
      secondAccount, //address _payeeAddress,
      erc20.address, //address _tokenAddress,
      1, //uint _amountRecurring,
      2, //uint _amountInitial,
      0, //uint _periodType,
      30, //uint _periodMultiplier,
      current_timestamp + 10, //uint _startTime,
      "" //string _data
    );

    const receipt = await tx.wait();
    const event = findEvent(receipt, "NewSubscription");

    const res = await erc948.paymentDue(event.args._subscriptionId);

    assert.equal(res, false);
  });

  it("ERC948: Should revert if a subscriptionID does not exist", async () => {
    const subscriptionId = ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 32);

    await expect(erc948.paymentDue(subscriptionId)).to.be.revertedWith(
      "Not an active subscription"
    );
  });
});
