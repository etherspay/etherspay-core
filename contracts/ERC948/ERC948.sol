// SPDX-License-Identifier: MIT
// Author: Ray Orolé
pragma solidity ^0.8.18;

import "../ERC20/TestToken.sol";

contract RecurringPayments {
    enum PeriodType {
        Second,
        Day,
        Week,
        Month,
        Year
    }

    struct Subscription {
        address owner;
        address payeeAddress;
        address tokenAddress;
        uint amountRecurring;
        uint amountInitial;
        uint periodType;
        uint periodMultiplier;
        uint startTime;
        string data;
        bool active;
        uint nextPaymentTime;
    }

    mapping(bytes32 => Subscription) public subscriptions;
    mapping(address => bytes32[]) public subscribers_subscriptions;

    event NewSubscription(
        bytes32 _subscriptionId,
        address _payeeAddress,
        address _tokenAddress,
        uint _amountRecurring,
        uint _amountInitial,
        uint _periodType,
        uint _periodMultiplier,
        uint _startTime
    );

    function createSubscription(
        address _payeeAddress,
        address _tokenAddress,
        uint _amountRecurring,
        uint _amountInitial,
        uint _periodType,
        uint _periodMultiplier,
        uint _startTime,
        string memory _data
    ) public returns (bytes32) {
        require(
            (_periodType == 0),
            "Only period types of second are supported"
        );

        // Check that subscription start time is now or in the future
        require(
            (_startTime >= block.timestamp),
            "Subscription must not start in the past"
        );

        // Check that owner has a balance of at least the initial and first recurring payment
        TestToken token = TestToken(_tokenAddress);
        uint amountRequired = _amountInitial + _amountRecurring;
        require(
            (token.balanceOf(msg.sender) >= amountRequired),
            "Insufficient balance for initial + 1x recurring amount"
        );

        //  Check that contact has approval for at least the initial and first recurring payment
        require(
            (token.allowance(msg.sender, address(this)) >= amountRequired),
            "Insufficient approval for initial + 1x recurring amount"
        );

        Subscription memory newSubscription = Subscription({
            owner: msg.sender,
            payeeAddress: _payeeAddress,
            tokenAddress: _tokenAddress,
            amountRecurring: _amountRecurring,
            amountInitial: _amountInitial,
            periodType: _periodType,
            periodMultiplier: _periodMultiplier,
            // TODO set start time appropriately and deal with interaction w nextPaymentTime
            startTime: block.timestamp,
            data: _data,
            active: true,
            nextPaymentTime: block.timestamp + _periodMultiplier
        });

        // Save subscription
        bytes32 subscriptionId = keccak256(
            abi.encode(msg.sender, block.timestamp)
        );
        subscriptions[subscriptionId] = newSubscription;

        // check for existing subscriptionId
        require(
            (subscriptions[subscriptionId].owner == msg.sender),
            "Subscription ID already exists"
        );

        // Add subscription to subscriber
        subscribers_subscriptions[msg.sender].push(subscriptionId);

        // Make initial payment
        token.transferFrom(msg.sender, _payeeAddress, _amountInitial);

        // Emit NewSubscription event
        emit NewSubscription(
            subscriptionId,
            _payeeAddress,
            _tokenAddress,
            _amountRecurring,
            _amountInitial,
            _periodType,
            _periodMultiplier,
            _startTime
        );

        return subscriptionId;
    }

    /**
     * @dev Get all subscriptions for a subscriber address
     * @param _subscriber The address of the subscriber
     * @return An array of bytes32 values that map to subscriptions
     */
    function getSubscribersSubscriptions(
        address _subscriber
    ) public view returns (bytes32[] memory) {
        return subscribers_subscriptions[_subscriber];
    }

    /**
     * @dev Delete a subscription
     * @param  _subscriptionId The subscription ID to delete
     * @return true if the subscription has been deleted
     */
    function cancelSubscription(bytes32 _subscriptionId) public returns (bool) {
        Subscription storage subscription = subscriptions[_subscriptionId];
        require(
            (subscription.payeeAddress == msg.sender) ||
                (subscription.owner == msg.sender),
            "Not authorized to cancel subscription"
        );

        delete subscriptions[_subscriptionId];
        return true;
    }

    /**
     * @dev Called by or on behalf of the merchant to find whether a subscription has a payment due
     * @param _subscriptionId The subscription ID to process payments for
     * @return A boolean to indicate whether a payment is due
     */
    function paymentDue(bytes32 _subscriptionId) public view returns (bool) {
        Subscription memory subscription = subscriptions[_subscriptionId];

        // Check this is an active subscription
        require((subscription.active == true), "Not an active subscription");

        // Check that subscription start time has passed
        require(
            (subscription.startTime <= block.timestamp),
            "Subscription has not started yet"
        );

        // Check whether required time interval has passed since last payment
        if (subscription.nextPaymentTime <= block.timestamp) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Called by or on behalf of the merchant, in order to initiate a payment.
     * @param _subscriptionId The subscription ID to process payments for
     * @param _amount Amount to be transferred, can be lower than total allowable amount
     * @return A boolean to indicate whether the payment was successful
     */
    function processSubscription(
        bytes32 _subscriptionId,
        uint _amount
    ) public returns (bool) {
        Subscription storage subscription = subscriptions[_subscriptionId];

        require(
            (_amount <= subscription.amountRecurring),
            "Requested amount is higher than authorized"
        );

        require(
            (paymentDue(_subscriptionId)),
            "A Payment is not due for this subscription"
        );

        TestToken token = TestToken(subscription.tokenAddress);
        token.transferFrom(
            subscription.owner,
            subscription.payeeAddress,
            _amount
        );

        // Increment subscription nextPaymentTime by one interval
        // TODO support hour, day, week, month, year
        subscription.nextPaymentTime =
            subscription.nextPaymentTime +
            subscription.periodMultiplier;
        return true;
    }
}
