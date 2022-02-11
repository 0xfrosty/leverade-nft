import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { LeveradeNFT } from "../typechain/LeveradeNFT";

/**
 * Test LEVERADE NFT
 */
describe("LeveradeNFT", function () {
  let nft: LeveradeNFT;
  let owner: SignerWithAddress, bob: SignerWithAddress;

  const name = "LEVERADE Collection";
  const symbol = "LEV";
  const baseURI = "https://test.com/";
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  /**
   * Deploy contract before each test
   */
  beforeEach(async function () {
    const LeveradeNFTContractFactory = await ethers.getContractFactory("LeveradeNFT");
    nft = (await LeveradeNFTContractFactory.deploy(name, symbol, baseURI)) as LeveradeNFT;
    await nft.deployed();

    [owner, bob] = await ethers.getSigners();
  });

  /**
   * Check contract tracks the proper values (name, symbol, uri)
   */
  it(`should have the ${name} name`, async function () {
    expect(await nft.name()).to.equal(name);
  });

  it(`should have the ${symbol} symbol`, async function () {
    expect(await nft.symbol()).to.equal(symbol);
  });

  /**
   * Check tokens can be properly minted
   */
  describe("Mints", function () {
    it("owner should mint new token", async function () {
      const expectedTokenId = 1;
      expect(await nft.safeMint(bob.address))
        .to.emit(nft, "Transfer")
        .withArgs(ZERO_ADDRESS, bob.address, expectedTokenId);
      expect(await nft.totalSupply())
        .to.equal(1);
    });

    it("non-owner shouldn't mint new token", async function () {
      // not awaiting here to work around
      // https://github.com/EthWorks/Waffle/issues/95
      expect(nft.connect(bob).safeMint(bob.address))
        .to.be.revertedWith("Ownable: caller is not the owner");
      expect(await nft.totalSupply())
        .to.equal(0);
    });

    it("should get right token URI", async function () {
      const tokenId = 1;
      await nft.safeMint(bob.address);
      expect(await nft.tokenURI(tokenId)).to.equal(`${baseURI}${tokenId}`);
    });
  });

  /**
   * Check owner can manage the contract
   */
  describe("Managements", function () {
    it("owner should set new base URI", async function () {
      const oldURI = baseURI;
      const newURI = "ipfs://hash/";

      expect(await nft.setBaseTokenURI(newURI))
        .to.emit(nft, "BaseTokenURIUpdated")
        .withArgs(oldURI, newURI);
    });

    it("non-owner shouldn't set new base URI", async function () {
      const newURI = "ipfs://hash/";

      // not awaiting here to work around
      // https://github.com/EthWorks/Waffle/issues/95
      expect(nft.connect(bob).setBaseTokenURI(newURI))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
