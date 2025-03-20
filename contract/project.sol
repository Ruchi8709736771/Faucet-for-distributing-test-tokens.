// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TestTokenFaucet {
    IERC20 public token;
    address public owner;
    uint256 public claimAmount;
    mapping(address => uint256) public lastClaim;
    uint256 public cooldownTime;

    event TokensClaimed(address indexed recipient, uint256 amount);
    event FaucetFunded(address indexed funder, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    constructor(IERC20 _token, uint256 _claimAmount, uint256 _cooldownTime) {
        token = _token;
        claimAmount = _claimAmount;
        cooldownTime = _cooldownTime;
        owner = msg.sender;
    }

    function claimTokens() external {
        require(block.timestamp >= lastClaim[msg.sender] + cooldownTime, "Wait before claiming again");
        require(token.balanceOf(address(this)) >= claimAmount, "Faucet empty");

        lastClaim[msg.sender] = block.timestamp;
        token.transfer(msg.sender, claimAmount);

        emit TokensClaimed(msg.sender, claimAmount);
    }

    function fundFaucet(uint256 amount) external onlyOwner {
        token.transferFrom(msg.sender, address(this), amount);
        emit FaucetFunded(msg.sender, amount);
    }
}
