
// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { IZKPayClient } from "@ZKPay/interfaces/IZKPayClient.sol";
import { IZKPay } from "@ZKPay/interfaces/IZKPay.sol";
import { DataTypes } from "@ZKPay/types/DataTypes.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract AirdropClient is IZKPayClient {
    using SafeERC20 for IERC20;

    event LogError(uint8 errorCode, string errorMessage);

    address public _owner;
    address public _zkpay;
    IERC20 public immutable _token;
    uint256 public constant AIRDROP_AMOUNT = 150 * 10 ** 18; // 150 tokens with 18 decimals
    bool public _airdropExecuted;
    bytes32 public _queryHash;

    constructor(address zkpay, address demoToken) {
        _owner = msg.sender;
        _zkpay = zkpay;
        _token = IERC20(demoToken);
        _airdropExecuted = false;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Caller is not the owner");
        _;
    }

    modifier onlyZKPay() {
        require(msg.sender == _zkpay, "Caller is not _zkpay");
        _;
    }

    modifier onlyOnce() {
        require(!_airdropExecuted, "Airdrop has already been executed");
        _;
        _airdropExecuted = true;
    }

    function queryZKPay() external payable onlyOwner {
        DataTypes.QueryParameter[] memory queryParams;

        DataTypes.QueryData memory queryData = DataTypes.QueryData({
            query: abi.encode(
                "SELECT FROM_ADDRESS, COUNT(*) AS TRANSACTION_COUNT FROM ETHEREUM.TRANSACTIONS WHERE TO_ADDRESS = '0xae7ab96520de3a18e5e111b5eaab095312d7fe84' AND FROM_ADDRESS != '0x0000000000000000000000000000000000000000' GROUP BY FROM_ADDRESS ORDER BY TRANSACTION_COUNT DESC LIMIT 400;"
            ),
            queryType: DataTypes.QueryType.SQL,
            queryParameters: queryParams,
            timeout: uint64(block.timestamp + 30 minutes),
            callbackClientContractAddress: address(this),
            callbackGasLimit: 400_000,
            callbackData: "",
            zkVerficiation: DataTypes.ZKVerification.External
        });

        _queryHash = IZKPay(_zkpay).queryWithNative{ value: msg.value }(queryData);
    }

    function sxtCallback(
        DataTypes.QueryResult calldata queryResult,
        bytes calldata callbackData,
        DataTypes.ZKVerification zkVerficiation
    )
        external
        override
        onlyZKPay
        onlyOnce
    {
        require(_queryHash != 0, "Invalid query hash");
        require(queryResult.queryHash == _queryHash, "Query hash does not match");

        for (uint256 i = 0; i < queryResult.columns[0].values.length; i++) {
            address recipient = abi.decode(queryResult.columns[0].values[i], (address));
            _token.safeTransfer(recipient, AIRDROP_AMOUNT);
        }
    }

    function sxtErrorCallback(
        DataTypes.ZKpayError calldata error,
        bytes calldata callbackData
    )
        external
        override
        onlyZKPay
    {
        emit LogError(error.code, error.message);
    }

    function withdraw() external onlyOwner {
        (bool success,) = _owner.call{ value: address(this).balance }("");
        require(success, "Failed to send Ether");
    }

    function cancelQuery(bytes32 queryHash) external onlyOwner {
        IZKPay(_zkpay).cancelQueryPayment(queryHash);
    }

    receive() external payable { }
}
