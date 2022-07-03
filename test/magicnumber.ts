import { Contract, ContractFactory, providers, Signer } from "ethers";
import { ethers } from "hardhat";

describe("MagicNumber", function () {
    let signer: Signer;
    let player: string;
   
    let challenge_instance_address = "0x09ACe17f255d46470640441988792517Cd893C5b";
    let challengeFactory: ContractFactory;
    let challenge: Contract;

    before(async () => {
        [signer] = await ethers.getSigners();
        player = await signer.getAddress();
        console.log("Primary Signer Address:", player);
        challengeFactory = await ethers.getContractFactory("MagicNumber");
        challenge = challengeFactory.attach(challenge_instance_address);
    });

    it("Should solve the challenge", async () => {
        const bytecode = [
            // init bytecode:
            `60 0A`, // PUSH1 10 (runtime code length in bytes)
            `60 0c`, // PUSH1 12 (Position of the runtime code in the data (in bytes))
            '60 00', // PUSH1 00 (Where the runtime code should be stored in memory.)
            '39',    // CODECOPY
            `60 0A`, // PUSH1 10 (runtime code length in bytes)
            `60 00`, // PUSH1 00 (Where the runtime code is stored in memory)
            'F3', // RETURN
            // Runtime Bytecode:
            `60 2A`, // PUSH1 42 
            `60 00`, // PUSH1 00 
            `52`,   // MSTORE (Store 0x2a at position 0 in memory) 
            `60 20`, // PUSH1 32
            `60 00`, // PUSH1 00
            `F3` // Return (Returns 32 bytes at position 0 of memory. (meaning returns 0x00000000...02A))
        ]

        const data = "0x" + bytecode.join('').replace(/ /g, '');
        console.log("Data:", data)
        const tx = {
            data,
            from: player
            // No "To" field, meaning that it will be identified as a contract creation transaction
        };

        const signedTx = await signer.sendTransaction(tx);
        console.log("Transaction", signedTx.hash);
        const receipt = await signedTx.wait()
        
        const setSignerTx = await challenge.setSolver(receipt.contractAddress);
        const setSignerTxReceipt = await setSignerTx.wait();
        console.log("Solver set to deployed contract:", receipt.contractAddress, "\n Check the instance to see if challenge is resolved.");
    });
});
