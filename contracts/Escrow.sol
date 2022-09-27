// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "hardhat/console.sol";

contract Escrow is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");
    AggregatorV3Interface internal priceFeed;
    uint256 public depositAmount;
    bool betState;

    IERC20 public susdc;
    mapping(address => uint256) options;
    mapping (uint => address ) private holders;
    uint256 betBelowHolders;
    uint256 betAboveHolders;
    uint256 totalHolders;

    constructor(address susdcAddr) {
        _setupRole(ADMIN_ROLE, msg.sender);
        susdc = IERC20(susdcAddr);
        betState = false;
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Only admin");
        _;
    }

    function startBet(uint256 _depositAmount) external onlyAdmin {
        // Initialize the bet. After settling, the admin can restart the bet
        // The admin also sets the deposit amount
        betBelowHolders = 0;
        betAboveHolders = 0;
        totalHolders = 0;
        depositAmount = _depositAmount;
        betState = true;
    }

    function deposit(uint8 _option, uint256 amount) external {
        require(betState == true, "The bet has not started yet");
        require(_option == 1 || _option == 2, "wrong input");
        require(depositAmount == amount, "you should pay the exact amount");

        if (_option == 1) {
            betBelowHolders++;
        } else {
            betAboveHolders++;
        }

        options[msg.sender] = _option;
        holders[totalHolders] = msg.sender;
        totalHolders++;

        susdc.transferFrom(msg.sender, address(this), amount);
    }

    function settle() external onlyAdmin {
        // get Bitcoin price from Chainlink oracle
        priceFeed = AggregatorV3Interface(0xA39434A63A52E749F02807ae27335515BA4b07F7);
        ( , int256 price, , , ) = priceFeed.latestRoundData();

        uint8 resultOption;
        uint256 distributeAmount;
        uint256 totalAmount = susdc.balanceOf(address(this));

        // Determine the split amount based on the result of bet
        if ( price < 25000 ) {
            resultOption = 1;
            distributeAmount = totalAmount / betAboveHolders;
        } else {
            resultOption = 2;
            distributeAmount = totalAmount / betBelowHolders;
        }

        // Split the rewards to winners
        for (uint i = 0; i < totalHolders; i++) {
            if (resultOption == options[holders[i]]) {
                susdc.transfer(holders[i], distributeAmount);
            } 
        }

        betState = false;
    }
}
