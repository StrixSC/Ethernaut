const dotenv = require("dotenv");
const ethers = require("ethers");

dotenv.config({ path: '../../.env'});

const { RINKEBY_URL, MNEMONIC } = process.env;

const provider = new ethers.providers.JsonRpcProvider(RINKEBY_URL);
const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
const signer = wallet.connect(provider);

const abi = [
    "function unlock(bytes32 _password) public"
]

const instanceAddress = "0x08Bd6CD6E8fC2d83030bEf8F458C65Fc7FD7A316"

const solve = async () => {
    try {
        const interface = new ethers.utils.Interface(abi);
        const contract = new ethers.Contract(instanceAddress, interface, signer);
        const tx = await contract.unlock("0x412076657279207374726f6e67207365637265742070617373776f7264203a29");
        const receipt = await tx.wait();
        console.log(receipt);
    } catch (e) {
        console.error(e);
    }
}

solve();