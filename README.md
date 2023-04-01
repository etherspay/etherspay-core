# Etherspay Core

## Authors

| Username      | Full name     | Email               | 
| ------------- | ------------- | ------------------- |
| rayorole      | Ray Orolé     | ray.orole@gmail.com |



## Contents
Includes: 
1. ERC20 Etherpay Token
2. ERC948 Recurring payments smart contract


> This codebase uses Hardhat for testing on local blockchain

## Prerequisites

* NodeJs
* Hardhat

## Installation

```
npm install
```

Test contracts

```
npm run test
```

## Specification

### Simple summary
A standard interface for preauthorized, recurring subscription payments.

### Abstract
This standard defines a contract interface enabling subscribers to make recurring payments to a merchant, and for the contract to then make this payment on behalf of the subscriber at the predetermined interval.

This standard provides basic functionality to initiate, approve, and manage subscriptions between a subscriber and merchant. These subscriptions allow a merchant to transfer a pre-authorized amount of ERC-20 tokens within each recurring time interval.

Credits: @johngriffin

### Motivation
Recurring payments are a prevalent use case across the internet sector. This standard offers a straightforward, secure, and scalable solution for implementing recurring payments, using Web3.

### Features
* Subscriptions can be created, approved, and cancelled by either the subscriber or merchant.
* Subscriptions can be created with a specified start date, and can be cancelled at any time.
* ERC-20 Token support.


### References
* [ERC-20](https://eips.ethereum.org/EIPS/eip-20)
* [ERC-948](https://github.com/sb777/erc-948-draft/issues/1)

