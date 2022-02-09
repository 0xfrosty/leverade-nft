// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const name = "Copa Reina Waterpolo España 2022";
  const symbol = "CRWE22";
  const baseURI = "https://metadata.leverade.network/rfen/copa-reina-22/";

  const LeveradeNFTContractFactory = await ethers.getContractFactory("LeveradeNFT");
  const nft = await LeveradeNFTContractFactory.deploy(name, symbol, baseURI);
  await nft.deployed();
  console.log("NFT contract deployed to:", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
