import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { Wallet } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethernaut_abi } from "./scripts/ethernaut_abi";

dotenv.config();

const { RINKEBY_URL, RINKEBY_URL_INFURA, MNEMONIC } = process.env;

let signer: Wallet;
const eth_addr = "0xD991431D8b033ddCb84dAD257f4821E9d5b38C33";

const setupAccounts = () => {
  if (!MNEMONIC) {
    console.error("Missing mnemonic from environment variable...");
    return;
  }
  const signer = Wallet.fromMnemonic(MNEMONIC!);
  if (!signer) {
    console.error("Error while creating signer...");
    return;
  }

  return signer;
}

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("submit", "Submits a challenge Instance", async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
  const ethernaut = await hre.ethers.getContractAt(ethernaut_abi, eth_addr);
  
  try {
    const submitTx = await ethernaut.submitLevelInstance(taskArgs.address);
    const receipt = await submitTx.wait()
    console.log(receipt);
  } catch (e) {
    console.error("Could not submit")
  }
})
.addParam("address", "The address of the challenge instance")

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: "0.5.0" },
      { version: "0.6.0" },
      { version: "0.7.3" },
      { version: "0.8.0" }
    ],
  },
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    rinkeby: {
      url: RINKEBY_URL_INFURA || "",
      accounts: [setupAccounts()!.privateKey]
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 4000000
  }
};

export default config;
