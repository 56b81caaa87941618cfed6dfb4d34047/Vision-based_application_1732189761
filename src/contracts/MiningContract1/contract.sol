// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { IZKPayClient } from "@ZKPay/interfaces/IZKPayClient.sol";
import { IZKPay } from "@ZKPay/interfaces/IZKPay.sol";
import { DataTypes } from "@ZKPay/types/DataTypes.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract AirdropClient {
    using SafeERC20 for IERC20;

    address public _owner;
    address public constant _zkpay = 0x25a5674f3D6Afb27e20820063B4fE2786bcB2e6D;
    uint256 public constant PAYMENT_AMOUNT = 0.001 ether;
    bytes32 public _queryHash;

    event QuerySubmitted(bytes32 queryHash);
    event PaymentCalculated(uint256 totalPayment, uint256 queryAmount);
    event QueryCancelled(bytes32 queryHash);
    event WithdrawExecuted(uint256 amount);
    event FundsReceived(address sender, uint256 amount);
    event QueryPreFlight(uint256 msgValue, uint256 gasLimit, address caller);
    event DebugQuery(bytes encodedQuery);

    constructor() {
        _owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Caller is not the owner");
        _;
    }

    function queryZKPay() external payable onlyOwner {
        emit QueryPreFlight(msg.value, gasleft(), msg.sender);
        
        DataTypes.QueryParameter[] memory queryParams;
        bytes memory query = abi.encode(
            "SELECT FROM_ADDRESS, COUNT(*) AS TRANSACTION_COUNT FROM ETHEREUM.TRANSACTIONS WHERE TO_ADDRESS = '0xae7ab96520de3a18e5e111b5eaab095312d7fe84' AND FROM_ADDRESS != '0x0000000000000000000000000000000000000000' GROUP BY FROM_ADDRESS ORDER BY TRANSACTION_COUNT DESC LIMIT 10;"
        );
        emit DebugQuery(query);

        DataTypes.QueryData memory queryData = DataTypes.QueryData({
            query: query,
            queryType: DataTypes.QueryType.SQL,
            queryParameters: queryParams,
            timeout: uint64(block.timestamp + 30 minutes),
            callbackClientContractAddress: address(this),
            callbackGasLimit: 400_000,
            callbackData: abi.encode(PAYMENT_AMOUNT),
            zkVerficiation: DataTypes.ZKVerification.External
        });
        
        uint256 totalPayment = PAYMENT_AMOUNT * 10;
        require(msg.value > totalPayment, "Insufficient ETH sent for payments");
        
        uint256 queryAmount = msg.value - totalPayment;
        emit PaymentCalculated(totalPayment, queryAmount);
        
        try IZKPay(_zkpay).queryWithNative{value: queryAmount}(queryData) returns (bytes32 hash) {
            _queryHash = hash;
            emit QuerySubmitted(hash);
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("ZKPay query failed: ", reason)));
        } catch (bytes memory lowLevelData) {
            revert("ZKPay query failed with low level error");
        }
    }

    function cancelQuery(bytes32 queryHash) external onlyOwner {
        IZKPay(_zkpay).cancelQueryPayment(queryHash);
        emit QueryCancelled(queryHash);
    }

    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        (bool success,) = _owner.call{value: amount}("");
        require(success, "Failed to send Ether");
        emit WithdrawExecuted(amount);
    }

    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }
}