import { expect } from "chai";
import { BigNumber, Contract, ContractFactory, providers, Signer } from "ethers";
import { ethers } from "hardhat";

describe("King", function () {
    let signer: Signer;
    let myAddress: string;
    let challenge_instance_address = "0x31C892248b3b33270d11641477E13dd811f1a31f";
    let challengeFactory: ContractFactory;
    let challenge: Contract;

    before(async () => {
        [signer] = await ethers.getSigners();
        myAddress = await signer.getAddress();
        console.log("Primary Signer Address:", myAddress);
        challengeFactory = await ethers.getContractFactory("King");
        challenge = challengeFactory.attach(challenge_instance_address);
    });

    it("Should solve the challenge", async () => {
        const prize = await challenge.prize();
        const kingSolver = await ethers.getContractFactory("KingSolver");
        const solver = await kingSolver.deploy(challenge.address);
        console.log("Solver address: ", solver.address);
        const gasPrice = await signer.provider?.getGasPrice();
        const solveTx = await solver.solve({
            gasLimit: 75000,
            gasPrice,
            value: prize
        });
        const receipt = await solveTx.wait();
        const king = await challenge._king();
        expect(king).to.equal(solver.address);
    });
});
