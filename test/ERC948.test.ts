// Unit tests for the ERC948 contract and its interactions with the ETPToken contract
// Author: Ray Orole

import { ethers } from "hardhat";
import { expect } from "chai";

// Create a mock ERC20 token contract
describe("ERC20 Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const ERC20 = await ethers.getContractFactory("ETPToken");

    const erc20 = await ERC20.deploy(1000);

    const ownerBalance = await erc20.balanceOf(owner.address);
    expect(await erc20.totalSupply()).to.equal(ownerBalance);
  });
});

// contract("ERC948", accounts => {

//   // Helper function to set up a valid subscription
//   async function createValidSubscription(TokenInstance, ERC948Instance) {
//     // Approve the ERC948 contract to make transfers for accounts[0]
//     await TokenInstance.approve(ERC948Instance.address, 1000);

//     // We must use a start time that is now or in the future
//     let current_timestamp = Math.round((new Date()).getTime() / 1000);

//     let response = await ERC948Instance.createSubscription(
//       accounts[1],            //address _payeeAddress,
//       TokenInstance.address,  //address _tokenAddress,
//       1,                      //uint _amountRecurring,
//       2,                      //uint _amountInitial,
//       0,                      //uint _periodType,
//       30,                     //uint _periodMultiplier,
//       current_timestamp+10,   //uint _startTime,
//       "",                     //string _data
//       {from: accounts[0],
//         gas: "4712388"});

//     return response;
//   }

//   // Helper function: Return the first matching event in a tx response
//   function findEvent(response, eventName) {
//     for (var i = 0; i < response.logs.length; i++) {
//       var log = response.logs[i];

//       if (log.event == eventName) {
//         // We found the event!
//         return log;
//       }
//     }
//     return false;
//   }

//   // Helper function: Introduce a time delay
//   function timeOut(ms) {
//     return new Promise((fulfill) => {
//       setTimeout(fulfill, ms);
//     });
//   }

//   it("CreateSubscription: Should allow you to create a subscription with valid params", async () => {
//     let TokenInstance = await TestToken.deployed();
//     let ERC948Instance = await ERC948.deployed();

//     let response = await createValidSubscription(TokenInstance, ERC948Instance);
//     assert.property(response, 'tx');
//   });

//   it("CreateSubscription: Should emit a NewSubscription event", async () => {
//     let TokenInstance = await TestToken.deployed();
//     let ERC948Instance = await ERC948.deployed();

//     let response = await createValidSubscription(TokenInstance, ERC948Instance);
//     let event = findEvent(response, "NewSubscription");
//     assert.notEqual(event, false);
//   });

//   it("CreateSubscription: Should emit a NewSubscription event with a bytes32 subscription ID", async () => {
//     let TokenInstance = await TestToken.deployed();
//     let ERC948Instance = await ERC948.deployed();

//     let response = await createValidSubscription(TokenInstance, ERC948Instance);
//     let event = findEvent(response, "NewSubscription")
//     assert.lengthOf(event.args._subscriptionId, 66)
//   });

//   it("CreateSubscription: Should pay amountInitial to accounts[1]", async () => {
//     let TokenInstance = await TestToken.deployed();
//     let ERC948Instance = await ERC948.deployed();

//     let r1 = await TokenInstance.balanceOf.call(accounts[1]);
//     let balance_before = r1.c[0];
//     await createValidSubscription(TokenInstance, ERC948Instance);
//     let r2 = await TokenInstance.balanceOf.call(accounts[1]);
//     let balance_after = r2.c[0];

//     assert.equal(balance_before+2, balance_after)
//   });

//   it("paymentDue: Should return false when valid subscription has no due payment", async () => {
//     let TokenInstance = await TestToken.deployed();
//     let ERC948Instance = await ERC948.deployed();

//     // subscription startTime is 10 seconds from now
//     let r1 = await createValidSubscription(TokenInstance, ERC948Instance);
//     let event = findEvent(r1, "NewSubscription")
//     let r2 = await ERC948Instance.paymentDue.call(event.args._subscriptionId)

//     assert.equal(r2, false)
//   });

//   it("paymentDue: Should revert if a subscriptionID does not exist", async () => {
//     let ERC948Instance = await ERC948.deployed();
//     await assertRevert(ERC948Instance.paymentDue.call('0x0'));
//   });

//   /*
//   it("paymentDue: Should return true when valid subscription has a due payment", async () => {
//     let TokenInstance = await TestToken.deployed();
//     let ERC948Instance = await ERC948.deployed();

//     // subscription startTime is 10 seconds from now
//     let r1 = await createValidSubscription(TokenInstance, ERC948Instance);
//     let event = findEvent(r1, "NewSubscription")
//     await timeOut(11000);
//     let r2 = await ERC948Instance.paymentDue.call(event.args._subscriptionId)

//     assert.equal(r2, true)
//   });
//   */

//   // createSubscription should revert if startTime is in the past
//   // createSubscription should revert if insufficient approval
//   // createSubscription should revert if insufficient balance
//   // createSubscription should revert if invalid PeriodType

//   // processSubscription should revert if amount is higher than authorized
//   // processSubscription should revert if payment is not paymentDue
//   // processSubscription should make a transfer
//   // processSubscription should set nextPaymentTime correctly

// });
