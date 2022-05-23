import { expect } from "chai";
import { BigNumber, Contract, ContractFactory, providers, Signer } from "ethers";
import { ethers } from "hardhat";

describe("CoinFlip", function () {
    let signer: Signer;
    let myAddress: string;
    let challenge_instance_address = "0x0BdCF084F099C4B54e8c7aF124b480e9E34864F7";
    let challengeFactory: ContractFactory;
    let challenge: Contract;

    before(async () => {
        [signer] = await ethers.getSigners();
        myAddress = await signer.getAddress();
        console.log("Primary Signer Address:", myAddress);
        challengeFactory = await ethers.getContractFactory("CoinFlip");
        challenge = challengeFactory.attach(challenge_instance_address);
    });

    it("Should solve the challenge", async () => {
        const coinflipSolver = await ethers.getContractFactory("CoinFlipSolver");
        const deployedSolver = await coinflipSolver.deploy(challenge.address);
        for (let i = 1; i <= 10; i++) {
            const solveTx = await deployedSolver.solve({
                gasLimit: 120000    // Pass it f*ckton of gas because on-chain calls are unreliable.
            });
            await solveTx.wait();
            const correctGuesses = await challenge.consecutiveWins();
            console.log("Current correct guesses:", correctGuesses.toNumber());
        }
        const correctGuesses = await challenge.consecutiveWins() as BigNumber;
        expect(correctGuesses.toNumber()).to.be.greaterThanOrEqual(10);
    });
});
