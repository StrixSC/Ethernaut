const dotenv = require("dotenv");
const ethers = require("ethers");

dotenv.config({path: "../../.env"});

const { RINKEBY_URL, MNEMONIC } = process.env;

const provider = new ethers.providers.JsonRpcProvider(RINKEBY_URL);
const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
const signer = wallet.connect(provider);

const abi = [
    "uint256 public consecutiveWins",
    "function flip(bool _guess) public returns (bool)",
]

const solver_abi = [
    "function solve() external payable"
]

const instanceAddress = "0xb8081a2CC07424bDb351eEf81f98D08737342aE6"
const solverContractAddress = "0x8B8e4c3dc42D05816BA442b28B62469069c1c3e6"
const factor = 57896044618658097711785492504343953926634992332820282019728792003956564819968

const solve = async () => {
    try {
        for (let i = 0; i < 10; i++) {
            const interface = new ethers.utils.Interface(solver_abi);
            const contract = new ethers.Contract(solverContractAddress, interface, signer);
            let tx = await contract.solve();
            const receipt = await tx.wait();
            console.log(receipt);
        }
    } catch (e) {
        console.error(e);
    }
}

solve();