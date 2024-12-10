
import React from 'react';
import { ethers } from 'ethers';

const ABI = [
  "function queryZKPay() external payable",
  "function cancelQuery(bytes32 queryHash) external",
  "function withdraw() external",
  "function _owner() public view returns (address)",
  "event QuerySubmitted(bytes32 queryHash)",
  "event PaymentCalculated(uint256 totalPayment, uint256 queryAmount)",
  "event QueryCancelled(bytes32 queryHash)",
  "event WithdrawExecuted(uint256 amount)",
  "event FundsReceived(address sender, uint256 amount)"
];

const AirdropClientInteraction: React.FC = () => {
  const [address, setAddress] = React.useState<string>('');
  const [isOwner, setIsOwner] = React.useState<boolean>(false);
  const [queryHash, setQueryHash] = React.useState<string>('');
  const [cancelQueryHash, setCancelQueryHash] = React.useState<string>('');
  const [contractBalance, setContractBalance] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
  const [logs, setLogs] = React.useState<string[]>([]);

  const contractAddress = '0x86a8fd42a544e2d6232A941EF359DE4b65fF74aD';
  const chainId = 11155111; // Sepolia testnet

  const addLog = (message: string) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toISOString()}: ${message}`]);
  };

  const connectWallet = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);

      const network = await provider.getNetwork();
      if (network.chainId !== chainId) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ethers.utils.hexValue(chainId) }],
        });
      }

      const contract = new ethers.Contract(contractAddress, ABI, signer);
      const owner = await contract._owner();
      setIsOwner(address.toLowerCase() === owner.toLowerCase());

      updateContractBalance(provider);
      addLog(`Connected wallet: ${address}`);
    } catch (err) {
      const errorMessage = 'Failed to connect wallet: ' + (err as Error).message;
      setError(errorMessage);
      addLog(`Error: ${errorMessage}`);
    }
  };

  const updateContractBalance = async (provider: ethers.providers.Web3Provider) => {
    const balance = await provider.getBalance(contractAddress);
    const formattedBalance = ethers.utils.formatEther(balance);
    setContractBalance(formattedBalance);
    addLog(`Contract balance updated: ${formattedBalance} ETH`);
  };

  const queryZKPay = async () => {
    try {
      if (!address) {
        await connectWallet();
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ABI, signer);

      addLog('Starting ZKPay query...');

      // Send 0.01 ETH for 10 payments of 0.001 ETH each
      const totalAmount = ethers.utils.parseEther("0.1");
      const tx = await contract.queryZKPay({ value: totalAmount });
      addLog(`Transaction sent: ${tx.hash}`);

      const receipt = await tx.wait();
      addLog(`Transaction confirmed in block: ${receipt.blockNumber}`);

      const event = receipt.events?.find((e: any) => e.event === 'QuerySubmitted');
      if (event) {
        const newQueryHash = event.args?.queryHash;
        setQueryHash(newQueryHash);
        addLog(`Query hash received: ${newQueryHash}`);
      }

      await updateContractBalance(provider);
    } catch (err) {
      const errorMessage = 'Failed to query ZKPay: ' + (err as Error).message;
      setError(errorMessage);
      addLog(`Error: ${errorMessage}`);
    }
  };

  const cancelQuery = async () => {
    try {
      if (!address) {
        await connectWallet();
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ABI, signer);

      addLog(`Attempting to cancel query: ${cancelQueryHash}`);
      const tx = await contract.cancelQuery(cancelQueryHash);
      addLog(`Cancel transaction sent: ${tx.hash}`);

      await tx.wait();
      addLog('Query cancelled successfully');

      setCancelQueryHash('');
      await updateContractBalance(provider);
    } catch (err) {
      const errorMessage = 'Failed to cancel query: ' + (err as Error).message;
      setError(errorMessage);
      addLog(`Error: ${errorMessage}`);
    }
  };

  const withdraw = async () => {
    try {
      if (!address) {
        await connectWallet();
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ABI, signer);

      addLog('Initiating withdrawal...');
      const tx = await contract.withdraw();
      addLog(`Withdrawal transaction sent: ${tx.hash}`);

      await tx.wait();
      addLog('Withdrawal successful');

      await updateContractBalance(provider);
    } catch (err) {
      const errorMessage = 'Failed to withdraw: ' + (err as Error).message;
      setError(errorMessage);
      addLog(`Error: ${errorMessage}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setError('');
  };

  return (
    <div className="bg-gradient-to-r from-purple-800 to-indigo-900 py-16 text-white min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">
          Airdrop Client Interaction
        </h1>
        <p className="text-xl mb-8 text-gray-300">
          Interact with the AirdropClient smart contract on Sepolia testnet.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-xl text-gray-800 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Wallet Connection</h2>
          {address ? (
            <p>Connected Address: {address} {isOwner && '(Owner)'}</p>
          ) : (
            <button onClick={connectWallet} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded">
              Connect Wallet
            </button>
          )}
        </div>

        {isOwner && (
          <div className="bg-white p-6 rounded-lg shadow-xl text-gray-800 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Owner Actions</h2>
            <button onClick={queryZKPay} className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded mr-4 mb-4">
              Query ZKPay (0.1 ETH)
            </button>
            <div className="mb-4">
              <input
                type="text"
                value={cancelQueryHash}
                onChange={(e) => setCancelQueryHash(e.target.value)}
                placeholder="Enter query hash to cancel"
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
              />
              <button onClick={cancelQuery} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                Cancel Query
              </button>
            </div>
            <button onClick={withdraw} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              Withdraw
            </button>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-xl text-gray-800 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contract Information</h2>
          <p>Contract Balance: {contractBalance} ETH</p>
          {queryHash && <p>Latest Query Hash: {queryHash}</p>}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-xl text-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Debug Logs</h2>
            <button onClick={clearLogs} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded text-sm">
              Clear Logs
            </button>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {log}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export { AirdropClientInteraction as component };
