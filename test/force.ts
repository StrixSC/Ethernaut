import { expect } from "chai";
import { BigNumber, Contract, ContractFactory, providers, Signer } from "ethers";
import { ethers } from "hardhat";

describe("Force", function () {
    let signer: Signer;
    let myAddress: string;
    let challenge_instance_address = "0xE766bE0E45D9f1248B33c99C5B5443Dc9BEcC340";
    let challengeFactory: ContractFactory;
    let challenge: Contract;

    before(async () => {
        [signer] = await ethers.getSigners();
        myAddress = await signer.getAddress();
        console.log("Primary Signer Address:", myAddress);
        challengeFactory = await ethers.getContractFactory("Force");
        challenge = challengeFactory.attach(challenge_instance_address);
    });

    it("Should solve the challenge", async () => {
        const forceSolver = await ethers.getContractFactory("ForceSolver");
        const deployedSolver = await forceSolver.deploy();
        const solveTx = await deployedSolver.solve(challenge.address, {
            value: ethers.utils.parseUnits("0.0001", "ether"),
            from: myAddress
        });
        await solveTx.wait();
        const balance = await signer.provider?.getBalance(challenge.address);
        expect(balance?.toNumber()).not.to.equal(0);
    });


});
