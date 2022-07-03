import { expect } from "chai";
import { BigNumber, Contract, ContractFactory, providers, Signer } from "ethers";
import { Interface, keccak256, toUtf8Bytes } from "ethers/lib/utils";
import { ethers } from "hardhat";
import Web3 from "web3";

describe("MagicNumber", function () {
    let signer: Signer;
    let player: string;
    let web3: Web3;
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
        // Get the four first bytes of the function signature hash
        // of the whatIsTheMeaningOfLife function:
        const funcSignature = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("whatIsTheMeaningOfLife()"))
        // See: https://monokh.com/posts/ethereum-contract-creation-bytecode
        const bytecode = [
            // init bytecode:
            `60 0A`, // PUSH1 10 (The length of our runtime code)
            `60 0c`, // PUSH1 12 (The position of the runtime code in the transaction data)
            '60 00', // PUSH1 00 (The destination in memory)
            '39',    // CODECOPY
            `60 0A`, // PUSH1 10 (The length of our runtime code)
            `60 00`, // PUSH1 00 (The memory location holding our runtime code)
            'F3', // RETURN
            // Runtime Bytecode:
            `60 2A`, // PUSH1 42 
            `60 00`, // PUSH1 00 
            `52`, // MSTORE 
            `60 20`, // PUSH1 32
            `60 00`, // PUSH1 00
            `F3` // Return
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
