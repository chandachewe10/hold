export const SAVINGS_LOCK_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "lockId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "unlockTime", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "targetAmount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "initialAmount", "type": "uint256" }
    ],
    "name": "LockCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "lockId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "totalAmount", "type": "uint256" }
    ],
    "name": "Deposited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "lockId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "Withdrawn",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_unlockTime", "type": "uint256" },
      { "internalType": "uint256", "name": "_targetAmount", "type": "uint256" }
    ],
    "name": "createLock",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_lockId", "type": "uint256" }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_lockId", "type": "uint256" }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_lockId", "type": "uint256" }
    ],
    "name": "getLock",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "uint256", "name": "unlockTime", "type": "uint256" },
          { "internalType": "uint256", "name": "targetAmount", "type": "uint256" },
          { "internalType": "bool", "name": "withdrawn", "type": "bool" },
          { "internalType": "address", "name": "owner", "type": "address" }
        ],
        "internalType": "struct SavingsLock.Lock",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_user", "type": "address" }
    ],
    "name": "getUserLocks",
    "outputs": [
      { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Address loaded from environment variables
export const SAVINGS_LOCK_ADDRESS = process.env.NEXT_PUBLIC_SAVINGS_LOCK_ADDRESS as `0x${string}`; 
