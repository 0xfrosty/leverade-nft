// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title LeveradeNFT
 * @dev ERC721 contract used by LEVERADE to generate NFT collections for specific competitions. These competitions are
 * organized by a given manager with a commercial relationship with LEVERADE, usually a sports federation.
 * @custom:security-contact security@leverade.com
 */
contract LeveradeNFT is ERC721, Ownable {
    using Counters for Counters.Counter;

    /**
     * @dev Emitted when contract owner changes the base metadata URI
     * @param oldURI Previous base URI
     * @param newURI New base URI
     */
    event BaseTokenURIUpdated(string oldURI, string newURI);

    /**
     * State vars
     */
    string private _baseTokenURI;
    Counters.Counter private _tokenIdCounter;

    /**
     * @dev Initialize contract
     * @param name Token name (might be empty string)
     * @param symbol Token symbol (might be empty string)
     * @param baseTokenURI Base URI to retrieve token metadata
     */
    constructor(string memory name, string memory symbol, string memory baseTokenURI) ERC721(name, symbol) {
        _baseTokenURI = baseTokenURI;
        _tokenIdCounter.increment();  // collection starts at token id 1
    }

    /**
     * @dev Token supply
     * @return Number of minted tokens
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current() - 1;
    }

    /**
     * @dev Safely mint a new token and transfer it to `to`.
     *
     * If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon
     * a safe transfer.
     *
     * Emit a {Transfer} event.
     */
    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    /**
     * @dev Update the base URI to retrieve token metadata
     * @param baseTokenURI New base URI
     */
    function setBaseTokenURI(string memory baseTokenURI) public onlyOwner {
        emit BaseTokenURIUpdated(_baseTokenURI, baseTokenURI);
        _baseTokenURI = baseTokenURI;
    }

    /**
     * @dev Returns if the `operator` is allowed to manage all of the assets of `owner`.
     *
     * OpenSea's proxy contract at Polygon is approved by default in order to allow NFT owners to trade their tokens
     * at OpenSea without having to explicitly call {setApprovalForAll}, thus avoiding gas costs.
     */
    function isApprovedForAll(address tokenOwner, address operator) public view override returns (bool) {
        address openSeaProxy = 0x58807baD0B376efc12F5AD86aAc70E78ed67deaE;
        if (operator == openSeaProxy) {
            return true;
        }

        return ERC721.isApprovedForAll(tokenOwner, operator);
    }

    /**
     * @dev Base URI to retrieve metadata for a token id.
     * @return Metadata URI for this collection
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
