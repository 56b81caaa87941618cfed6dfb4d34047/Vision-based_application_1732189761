
import React from 'react';
import * as ethers from 'ethers';

const ABI = [
  "function queryZKPay() external payable",
  "function cancelQuery(bytes32 queryHash) external",
  "function withdraw() external",
  "function _owner() public view returns (address)",
  "event QuerySubmitted(bytes32 queryHash)"
];

const AirdropClientInteraction: React.FC = () => {
  const [address, setAddress] = React.useState<string>('');
  const [isOwner, setIsOwner] = React.useState<boolean>(false);
  const [queryHash, setQueryHash] = React.useState<string>('');
  const [cancelQueryHash, setCancelQueryHash] = React.useState<string>('');
  const [contractBalance, setContractBalance] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  const contractAddress = '0xF9D5135473783c1097D43E467739be426259827e';
  const chainId = 11155111; // Sepolia testnet

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
    } catch (err) {
      setError('Failed to connect wallet: ' + (err as Error).message);
    }
  };

  const updateContractBalance = async (provider: ethers.providers.Web3Provider) => {
    const balance = await provider.getBalance(contractAddress);
    setContractBalance(ethers.utils.formatEther(balance));
  };

  const queryZKPay = async () => {
    try {
      if (!address) {
        await connectWallet();
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ABI, signer);

      // 0.01 ETH (0.001 ETH * 10 recipients)
      const totalPayment = ethers.utils.parseEther("0.1");
      const tx = await contract.queryZKPay({ value: totalPayment });
      const receipt = await tx.wait();

      const event = receipt.events?.find((e: any) => e.event === 'QuerySubmitted');
      if (event) {
        setQueryHash(event.args?.queryHash);
      }

      updateContractBalance(provider);
    } catch (err) {
      setError('Failed to query ZKPay: ' + (err as Error).message);
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

      const tx = await contract.cancelQuery(cancelQueryHash);
      await tx.wait();

      setCancelQueryHash('');
      updateContractBalance(provider);
    } catch (err) {
      setError('Failed to cancel query: ' + (err as Error).message);
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

      const tx = await contract.withdraw();
      await tx.wait();

      updateContractBalance(provider);
    } catch (err) {
      setError('Failed to withdraw: ' + (err as Error).message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-800 to-indigo-900 py-16 text-white min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">Airdrop Client Interaction</h1>
        <p className="text-xl mb-8 text-gray-300">Interact with the AirdropClient smart contract on Sepolia testnet.</p>
        
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
              Query ZKPay (0.01 ETH)
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

        <div className="bg-white p-6 rounded-lg shadow-xl text-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Contract Information</h2>
          <p>Contract Balance: {contractBalance} ETH</p>
          {queryHash && <p>Latest Query Hash: {queryHash}</p>}
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
