// Unit tests for the ERC20 contract
// Author: Ray Orole

import { ethers } from "hardhat";
import { assert, expect } from "chai";
import { ETPToken } from "../typechain-types";

describe("ERC20 Token contract", async function () {
  let erc20: ETPToken;
  let owner: string;
  let secondAccount: string;
  let thirdAccount: string;

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

  it("ERC20: Should transfer tokens between accounts", async function () {
    const initialBalance = await erc20.balanceOf(owner);
    const transferAmount = 100;
    await erc20.transfer(secondAccount, transferAmount);

    const ownerBalance = await erc20.balanceOf(owner);
    const secondAccountBalance = await erc20.balanceOf(secondAccount);

    assert.equal(
      ownerBalance.toNumber(),
      initialBalance.toNumber() - transferAmount,
      "Owner balance should decrease"
    );
    assert.equal(
      secondAccountBalance.toNumber(),
      transferAmount,
      "Second account balance should increase"
    );
  });

  //   it("ERC20: Should approve and transfer tokens using transferFrom", async function () {
  //     const initialOwnerBalance = await erc20.balanceOf(owner);
  //     const transferAmount = 100;

  //     // Approve secondAccount to spend transferAmount tokens from owner's account
  //     await erc20.connect(owner).approve(secondAccount, transferAmount);

  //     // Perform transferFrom from owner's account to thirdAccount
  //     await erc20
  //       .connect(secondAccount)
  //       .transferFrom(owner, thirdAccount, transferAmount);

  //     const ownerBalance = await erc20.balanceOf(owner);
  //     const thirdAccountBalance = await erc20.balanceOf(thirdAccount);

  //     assert.equal(
  //       ownerBalance.toNumber(),
  //       initialOwnerBalance.toNumber() - transferAmount,
  //       "Owner balance should decrease"
  //     );
  //     assert.equal(
  //       thirdAccountBalance.toNumber(),
  //       transferAmount,
  //       "Third account balance should increase"
  //     );
  //   });

  it("ERC20: Should check allowance for token transfer", async function () {
    const transferAmount = 100;

    // Approve secondAccount to spend transferAmount tokens from owner's account
    await erc20.approve(secondAccount, transferAmount);

    // Check the allowance for secondAccount to spend tokens from owner's account
    const allowance = await erc20.allowance(owner, secondAccount);

    assert.equal(
      allowance.toNumber(),
      transferAmount,
      "Allowance should be equal to transferAmount"
    );
  });
});
