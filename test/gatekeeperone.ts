import { expect } from "chai";
import { BigNumber, Contract, ContractFactory, providers, Signer } from "ethers";
import { ethers } from "hardhat";

describe("GatekeeperOne", function () {
    let signer: Signer;
    let myAddress: string;
    let challenge_instance_address = "0xcAD4Beb0aDbeAab7f07653d33f0Fdc833ec66Bc0";
    let challengeFactory: ContractFactory;
    let challenge: Contract;

    before(async () => {
        [signer] = await ethers.getSigners();
        myAddress = await signer.getAddress();
        console.log("Primary Signer Address:", myAddress);
        challengeFactory = await ethers.getContractFactory("GatekeeperOne");
        challenge = challengeFactory.attach(challenge_instance_address);
        // challenge = await challengeFactory.deploy();
        // await challenge.deployed();
    });

    it("Should solve the challenge", async () => {
        /*
            Keep in mind: 
                - When casting higher uint to lower uint, we discard higher order bits
                - When casting lower uints to higher uints, we left-pad zeroes as the additional bits
                - When casting lower bytes to higher bytes, we right-pad zeroes as the additional bytes
                - When casting higher bytes to lower bytes, we discard lower order bytes.

                - We cannot directly cast bytes to uints or vice versa:
                    In order to cast bytes to uints or vice versa, we must first cast
                    the value to the appropriate sized uint to then cast to the appropriate sized bytes, or vice versa if we want to cast uints to bytes or bytes to uints.
            
            The key:
                Gate three, part 1:
                key:    0000 0000 0000 0000
                mask:   0000 0000 0000 ffff

                Gate three, part 2:
                key:    0000 0000 0000 0000
                mask:   ffff ffff 0000 0000

                Gate three, part 3: 
                key:    0000 0000 0000 0000
                mask:   0000 0000 0000 ffff


                Combined masks: (bytes8(bytes15(uint120(tx.origin))) & 0xffffffff0000ffff)
        */


        const solverContract = await ethers.getContractFactory("GatekeeperOneSolver");
        const solver = await solverContract.deploy(challenge.address);
        await solver.deployed();
        console.log("Solver contract address: ", solver.address);
        const gas = 100000;
        const tx = await solver.solve(gas + 6737, { gasLimit: 200000 });
        await tx.wait();

        // Another way to find the gate_two solution gas amount is to find the amount of gas that is used
        // up until the GAS opcode. We can compute it using remix, we find 254.
        // Therefore: 
        // (x - 254) mod 8191 = 1 
        // We're looking for x.

        
        // This is the code that was used to find the 6737: 

        // for (let i = 0; i < 8191; i++) {
        //     try {
        //         const tx = await solver.solve(gas + i, {
        //             gasLimit: 200000
        //         });
        //         await tx.wait();
        //         // console.log("Found how much gas to add: ", i);
        //         break;
        //     } catch (e) { }
        // }
        
        const entrant = await challenge.entrant();
        expect(entrant).to.equal(myAddress);
    });
});
