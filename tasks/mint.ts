import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";

task("mint", "Mint tokens from a LeveradeNFT contract")
  .addParam("contract", "LeveradeNFT contract address")
  .addParam("to", "Recipient address of minted tokens")
  .addParam("supply", "Number of tokens to mint")
  .setAction(async (taskArgs, hre) => {
    const contract = hre.ethers.utils.getAddress(taskArgs.contract);
    const to = hre.ethers.utils.getAddress(taskArgs.to);
    const supply = taskArgs.supply;

    const LeveradeNFTContractFactory = await hre.ethers.getContractFactory("LeveradeNFT");
    const nft = await LeveradeNFTContractFactory.attach(contract);
    for (let i = 0; i < supply; i++) {
      await nft.safeMint(to);
    }
  });
