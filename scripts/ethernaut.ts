import { ethernaut_abi } from './ethernaut_abi';
import { ethers } from "hardhat";
import { LogDescription } from 'ethers/lib/utils';

export const solveChallenge = async (instance: string) => {
    const addr = "0xD991431D8b033ddCb84dAD257f4821E9d5b38C33";
    const iface = new ethers.utils.Interface(ethernaut_abi);
    const ethernaut = await ethers.getContractAt(ethernaut_abi, addr);
    const sendChallengeTx = await ethernaut.submitLevelInstance(instance);
    const receipt = await sendChallengeTx.wait()
    const events: LogDescription[] = receipt.logs
        .map((l: any) => {
            try {
                return iface.parseLog(l);
            } catch {
                return null;
            }
        });
    return !!events.find((e) => e.name === "LevelCompletedLog");
}