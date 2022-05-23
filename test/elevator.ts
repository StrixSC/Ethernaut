import { expect } from "chai";
import { BigNumber, Contract, ContractFactory, providers, Signer } from "ethers";
import { ethers } from "hardhat";

describe("Elevator", function () {
    let signer: Signer;
    let myAddress: string;
    let challenge_instance_address = "0xb575caB87BFa94E54439C7fd0d3f850fB9010b9C";
    let challengeFactory: ContractFactory;
    let challenge: Contract;

    before(async () => {
        [signer] = await ethers.getSigners();
        myAddress = await signer.getAddress();
        console.log("Primary Signer Address:", myAddress);
        challengeFactory = await ethers.getContractFactory("Elevator");
        challenge = challengeFactory.attach(challenge_instance_address);
    });

    it("Should solve the challenge", async () => {
        const elevatorSolver = await ethers.getContractFactory("ElevatorSolver");
        const solver = await elevatorSolver.deploy(challenge.address);
        console.log("Solver address: ", solver.address);

        const gasPrice = await signer.provider?.getGasPrice();
        const solveTx = await solver.solve({
            gasLimit: 125000,
            gasPrice
        });
        const receipt = await solveTx.wait();
        const top = await challenge.top();
        expect(top).to.be.true;
    });
});
