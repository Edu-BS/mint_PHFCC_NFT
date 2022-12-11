// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./CourseCompletedNft.sol";
import "hardhat/console.sol";

error Hack__NotOwner();

contract Hack is OtherContract, IERC721Receiver {
    uint256 public s_variable = 0;
    uint256 public s_otherVar = 0;
    uint256 public s_tokenId = 0;

    address public immutable owner;

    constructor() {
        owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        return address(this);
    }

    function doSomething() external {
        s_variable = 123;
    }

    function doSomething2() external {
        s_otherVar = 3;
    }

    function callCourseCompletedNft(address _courseCompletedNft) public returns (uint256 tokenId) {
        bytes4 selector = getSelector("doSomething2()");
        CourseCompletedNft ccNft = CourseCompletedNft(_courseCompletedNft);
        uint256 id = ccNft.mintNft(address(this), selector);
        console.log("Mint NFT tokenId: %s", id);
        s_tokenId = id - 1;
        return s_tokenId;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        bytes4 selector = IERC721Receiver.onERC721Received.selector;
        return selector;
    }

    function getSelector(string memory _func) internal pure returns (bytes4) {
        return bytes4(keccak256(bytes(_func)));
    }

    function withdrawNft(address _courseCompletedNft, uint256 _tokenId) public {
        if (msg.sender != owner) {
            revert Hack__NotOwner();
        }
        CourseCompletedNft ccNft = CourseCompletedNft(_courseCompletedNft);
        ccNft.safeTransferFrom(address(this), msg.sender, _tokenId);
    }
}
