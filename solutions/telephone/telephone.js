const dotenv = require("dotenv");
const ethers = require("ethers");

dotenv.config({ path: '../../.env'});

const { RINKEBY_URL, MNEMONIC } = process.env;

const provider = new ethers.providers.JsonRpcProvider(RINKEBY_URL);
const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
const signer = wallet.connect(provider);

const solver_abi = [
    "function solve() external payable"
]

const instanceAddress = "0xe6cc28EC046530D14d6674C0561b14D3f37B599b"
const solverContractAddress = "0x075478fFdA61e0bB54EedAe6FFD865Ea21437570"

const solve = async () => {
    try {
        const interface = new ethers.utils.Interface(solver_abi);
        const contract = new ethers.Contract(solverContractAddress, interface, signer);
        let tx = await contract.solve();
        const receipt = await tx.wait();
        console.log(receipt);
    } catch (e) {
        console.error(e);
    }
}

solve();