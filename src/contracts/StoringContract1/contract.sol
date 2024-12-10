
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
    address public constant _zkpay = 0x25a5674f3D6Afb27e20820063B4fE2786bcB2e6D; // Replace with actual ZKPay address
    uint256 public constant PAYMENT_AMOUNT = 0.001 ether;
    bytes32 public _queryHash;

    event QuerySubmitted(bytes32 queryHash);

    constructor() {
        _owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Caller is not the owner");
        _;
    }

    function queryZKPay() external payable onlyOwner {
        DataTypes.QueryParameter[] memory queryParams;
        DataTypes.QueryData memory queryData = DataTypes.QueryData({
            query: abi.encode(
                "SELECT FROM_ADDRESS, COUNT(*) AS TRANSACTION_COUNT FROM ETHEREUM.TRANSACTIONS WHERE TO_ADDRESS = '0xae7ab96520de3a18e5e111b5eaab095312d7fe84' AND FROM_ADDRESS != '0x0000000000000000000000000000000000000000' GROUP BY FROM_ADDRESS ORDER BY TRANSACTION_COUNT DESC LIMIT 10;"
            ),
            queryType: DataTypes.QueryType.SQL,
            queryParameters: queryParams,
            timeout: uint64(block.timestamp + 30 minutes),
            callbackClientContractAddress: address(this),
            callbackGasLimit: 400_000,
            callbackData: abi.encode(PAYMENT_AMOUNT),  // Pass payment amount as callback data
            zkVerficiation: DataTypes.ZKVerification.External
        });
        
        uint256 totalPayment = PAYMENT_AMOUNT * 10; // Maximum possible recipients
        require(msg.value >= totalPayment, "Insufficient ETH sent for payments");
        
        _queryHash = IZKPay(_zkpay).queryWithNative{ value: msg.value - totalPayment }(queryData);
        emit QuerySubmitted(_queryHash);
    }

    function cancelQuery(bytes32 queryHash) external onlyOwner {
        IZKPay(_zkpay).cancelQueryPayment(queryHash);
    }

    function withdraw() external onlyOwner {
        (bool success,) = _owner.call{ value: address(this).balance }("");
        require(success, "Failed to send Ether");
    }

    receive() external payable { }
}
