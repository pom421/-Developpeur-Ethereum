import Web3 from "web3";
import dotenv from "dotenv";
import HDWalletProvider from "@truffle/hdwallet-provider";

dotenv.config();

const provider = new HDWalletProvider(
  `${process.env.MNEMONIC}`, // Seed phrase of your wallet
  `https://goerli.infura.io/v3/${process.env.INFURA_ID}` // Infura ID token
);

const web3 = new Web3(provider);

// ABI for a simple storage contract
var abi = [
  {
    inputs: [],
    name: "number",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "retrieve",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "num",
        type: "uint256",
      },
    ],
    name: "store",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

// Address of the deployed contract
var addr = "0x9AC7f23499CB84B3F52A682B03AB2B2F557E0F13";

// Contract to interact with
var Contract = new web3.eth.Contract(abi, addr);

// Call the retrieve function
Contract.methods.retrieve().call().then(console.log);

// Call the store function
await Contract.methods
  .store(333)
  .send({ from: "0x242e5908Fe2DACdb90D99d5f4b311f9f64Cff51C" });

// Check the value of the retrieve function
Contract.methods.retrieve().call().then(console.log);
