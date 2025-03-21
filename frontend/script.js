// Connect to Ethereum network
const web3 = new Web3(window.ethereum);
let contract;
let account;

// Addresses and ABI
const faucetAddress = '0x2Ad3955Fd5E27f43B2C0FB02B3096F59FD218285';  // Replace with your deployed contract address
const tokenAddress = '0x2Ad3955Fd5E27f43B2C0FB02B3096F59FD218285';  // Replace with the token contract address
const faucetABI = [ 
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "_token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_claimAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_cooldownTime",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "funder",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FaucetFunded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TokensClaimed",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "claimAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "cooldownTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "fundFaucet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "lastClaim",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}

];

// Initialize contract and web3
async function init() {
    if (window.ethereum) {
        await window.ethereum.enable();
        account = (await web3.eth.getAccounts())[0];
        contract = new web3.eth.Contract(faucetABI, faucetAddress);
        console.log(`Connected to account: ${account}`);
    } else {
        alert('Please install MetaMask!');
    }
}

// Claim Tokens
async function claimTokens() {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = 'Processing...';

    try {
        await contract.methods.claimTokens().send({ from: account });
        statusMessage.textContent = 'Tokens claimed successfully!';
    } catch (error) {
        statusMessage.textContent = 'Error claiming tokens. Try again later.';
    }
}

// Fund Faucet (Admin)
async function fundFaucet() {
    const amount = document.getElementById('amountInput').value;
    const fundStatusMessage = document.getElementById('fundStatusMessage');
    fundStatusMessage.textContent = 'Processing...';

    try {
        await contract.methods.fundFaucet(web3.utils.toWei(amount, 'ether')).send({ from: account });
        fundStatusMessage.textContent = 'Faucet funded successfully!';
    } catch (error) {
        fundStatusMessage.textContent = 'Error funding faucet. Try again later.';
    }
}

// Button event listeners
document.getElementById('claimButton').addEventListener('click', claimTokens);
document.getElementById('fundButton').addEventListener('click', fundFaucet);

// Initialize when the page loads
window.onload = init;
