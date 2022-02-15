import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";

task("transfer-ownership", "Transfer ownership of a LeveradeNFT contract")
  .addParam("contract", "LeveradeNFT contract address")
  .addParam("to", "New contract owner")
  .setAction(async (taskArgs, hre) => {
    const contract = hre.ethers.utils.getAddress(taskArgs.contract);
    const to = hre.ethers.utils.getAddress(taskArgs.to);

    const LeveradeNFTContractFactory = await hre.ethers.getContractFactory("LeveradeNFT");
    const nft = await LeveradeNFTContractFactory.attach(contract);
    await nft.transferOwnership(to);
  });
