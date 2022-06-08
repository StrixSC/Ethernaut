pragma solidity ^0.8.0;

interface IGatekeeperTwo {
    function enter(bytes8 _gateKey) external returns (bool);
}

contract GatekeeperTwoSolver {
    IGatekeeperTwo challenge;

    constructor(address addr) {
        challenge = IGatekeeperTwo(addr);
        challenge.enter(bytes8(uint64(bytes8(keccak256(abi.encodePacked(address(this))))) ^ 0xFFFFFFFFFFFFFFFF));
    }

    receive() external payable {}
}
