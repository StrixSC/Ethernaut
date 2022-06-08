import { expect } from "chai";
import { BigNumber, Contract, ContractFactory, providers, Signer } from "ethers";
import { ethers } from "hardhat";

describe("GatekeeperTwo", function () {
    let signer: Signer;
    let myAddress: string;
    let challenge_instance_address = "0x9E06B10EDD83D14f25290Ea98aF42ab9F120E70B";
    let challengeFactory: ContractFactory;
    let challenge: Contract;

    before(async () => {
        [signer] = await ethers.getSigners();
        myAddress = await signer.getAddress();
        console.log("Primary Signer Address:", myAddress);
        challengeFactory = await ethers.getContractFactory("GatekeeperTwo");
        challenge = challengeFactory.attach(challenge_instance_address);
        // Uncomment the next two lines if running locally.
        // challenge = await challengeFactory.deploy();
        // await challenge.deployed();
    });

    it("Should solve the challenge", async () => {
        const solverContract = await ethers.getContractFactory("GatekeeperTwoSolver");
        const solver = await solverContract.deploy(challenge.address, {
            gasLimit: 10000000
        });
        await solver.deployed();
        console.log("Solver contract address: ", solver.address);
        const entrant = await challenge.entrant();
        expect(entrant).to.equal(myAddress);
    });
});
