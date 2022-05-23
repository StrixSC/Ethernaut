import { expect } from "chai";
import { BigNumber, Contract, ContractFactory, providers, Signer } from "ethers";
import { ethers } from "hardhat";

describe("Telephone", function () {
    let signer: Signer;
    let myAddress: string;
    let challenge_instance_address = "0x2fB4fE29F1B8bFDae92A68825B45e041CA1E0Ba7";
    let challengeFactory: ContractFactory;
    let challenge: Contract;

    before(async () => {
        [signer] = await ethers.getSigners();
        myAddress = await signer.getAddress();
        console.log("Primary Signer Address:", myAddress);
        challengeFactory = await ethers.getContractFactory("Telephone");
        challenge = challengeFactory.attach(challenge_instance_address);
    });

    it("Should solve the challenge", async () => {
        const telephoneSolver = await ethers.getContractFactory("TelephoneSolver");
        const deployedSolver = await telephoneSolver.deploy(challenge.address);
        const solveTx = await deployedSolver.solve();
        await solveTx.wait();
        const owner = await challenge.owner();
        expect(owner).to.equal(myAddress);
    });


});
