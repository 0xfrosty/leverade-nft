import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";

task("set-uri", "Set base URI to retrieve token metadata")
  .addParam("contract", "LeveradeNFT contract address")
  .addParam("uri", "New base URI")
  .setAction(async (taskArgs, hre) => {
    const contract = hre.ethers.utils.getAddress(taskArgs.contract);
    const uri = taskArgs.uri;

    const LeveradeNFTContractFactory = await hre.ethers.getContractFactory("LeveradeNFT");
    const nft = await LeveradeNFTContractFactory.attach(contract);
    const tx = await nft.setBaseTokenURI(uri);
    await tx.wait();

    console.log(`Token URI updated to ${uri}`);
  });
