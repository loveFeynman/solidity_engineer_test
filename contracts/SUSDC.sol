// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SUSDC is AccessControl, ERC20("sUSDC", "sUSDC") {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");

    constructor() {
        _setupRole(ADMIN_ROLE, msg.sender);
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Only admin");
        _;
    }

    function mint(address _recipient, uint256 _amount) external onlyAdmin {
        _mint(_recipient, _amount);
    }

    function burn(address _account, uint256 _amount) external onlyAdmin {
        _burn(_account, _amount);
    }
}
