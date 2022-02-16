// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./NativeMetaTransaction.sol";

/**
 * @title LeveradeNFT
 * @dev ERC721 contract used by LEVERADE to generate NFT collections for specific competitions. These competitions are
 * organized by a given manager with a commercial relationship with LEVERADE, usually a sports federation.
 * @custom:security-contact security@leverade.com
 */
contract LeveradeNFT is ERC721, NativeMetaTransaction, Ownable {
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
     * @param name_ Token name (might be empty string)
     * @param symbol_ Token symbol (might be empty string)
     * @param baseTokenURI_ Base URI to retrieve token metadata
     */
    constructor(string memory name_, string memory symbol_, string memory baseTokenURI_) ERC721(name_, symbol_) {
        _baseTokenURI = baseTokenURI_;
        _tokenIdCounter.increment();  // collection starts at token id 1
        _initializeEIP712(name_);
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

    /**
     * @dev Return the real sender in the context of a meta-transaction
     */
    function _msgSender() internal view override returns (address sender) {
        if (msg.sender == address(this)) {
            bytes memory array = msg.data;
            uint256 index = msg.data.length;
            assembly {
                // Load the 32 bytes word from memory with the address on the lower 20 bytes, and mask those.
                sender := and(
                    mload(add(array, index)),
                    0xffffffffffffffffffffffffffffffffffffffff
                )
            }

        } else {
            sender = payable(msg.sender);

        }

        return sender;
    }
}
