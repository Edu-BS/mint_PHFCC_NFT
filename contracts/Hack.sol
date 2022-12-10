// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "./CourseCompletedNft.sol";

abstract contract Hack is OtherContract {

    uint256 public s_variable = 0;
    uint256 public s_otherVar = 0;

    function getOwner() public view returns(address) {
      return address(this);
    }

    function doSomething() external {
        s_variable = 123;
    }

    function doSomething2() external {
        s_otherVar = 3;
    }

    function callCourseCompletedNft(address _courseCompletedNft) public {
        bytes4 selector = getSelector("doSomething2()");
        CourseCompletedNFT ccNft = CourseCompletedNFT(_courseCompletedNft);
        ccNft.mintNft(address(this), selector);
    }

    function getSelector(string memory _func) internal pure returns (bytes4) {
        return bytes4(keccak256(bytes(_func)));
    }
    
}