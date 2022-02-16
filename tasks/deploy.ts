import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";

task("deploy", "Deploy LeveradeNFT contract for a new collection")
  .addParam("name", "Token name")
  .addParam("symbol", "Token symbol")
  .addParam("uri", "Base metadata URI")
  .setAction(async (taskArgs, hre) => {
    const name = taskArgs.name;
    const symbol = taskArgs.symbol;
    const uri = taskArgs.uri;

    const LeveradeNFTContractFactory = await hre.ethers.getContractFactory("LeveradeNFT");
    const nft = await LeveradeNFTContractFactory.deploy(name, symbol, uri);
    await nft.deployed();
    console.log("NFT contract deployed to:", nft.address);
  });
