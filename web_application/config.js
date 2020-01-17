exports.contractAddress = '<blockchain address of the smart contract';
exports.web3ProviderAddress = "<URL of WEB3 HTTP provider";
exports.abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_endorsementsNeeded",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"components": [
					{
						"internalType": "enum RootCAs.State",
						"name": "proposedState",
						"type": "uint8"
					},
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "id",
								"type": "uint256"
							},
							{
								"internalType": "enum RootCAs.State",
								"name": "state",
								"type": "uint8"
							},
							{
								"internalType": "string",
								"name": "caCert",
								"type": "string"
							},
							{
								"internalType": "enum RootCAs.RevocationReason",
								"name": "revocationReason",
								"type": "uint8"
							}
						],
						"internalType": "struct RootCAs.RootCA",
						"name": "rootCA",
						"type": "tuple"
					}
				],
				"indexed": false,
				"internalType": "struct RootCAs.ProposalSimple",
				"name": "_proposal",
				"type": "tuple"
			}
		],
		"name": "NewProposal",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "enum RootCAs.State",
						"name": "state",
						"type": "uint8"
					},
					{
						"internalType": "string",
						"name": "caCert",
						"type": "string"
					},
					{
						"internalType": "enum RootCAs.RevocationReason",
						"name": "revocationReason",
						"type": "uint8"
					}
				],
				"indexed": false,
				"internalType": "struct RootCAs.RootCA",
				"name": "_rootCA",
				"type": "tuple"
			}
		],
		"name": "RootCAsChanged",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "addEndorser",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "addProposer",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_endorsementsNeeded",
				"type": "uint256"
			}
		],
		"name": "changeEndorsementsNeeded",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "changeOwner",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "deleteLatestAdditionProposal",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "deleteLatestRevocationProposal",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "destroy",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "endorseRevocation",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "endorseRootCAAddition",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getAdditionProposal",
		"outputs": [
			{
				"components": [
					{
						"internalType": "enum RootCAs.State",
						"name": "proposedState",
						"type": "uint8"
					},
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "id",
								"type": "uint256"
							},
							{
								"internalType": "enum RootCAs.State",
								"name": "state",
								"type": "uint8"
							},
							{
								"internalType": "string",
								"name": "caCert",
								"type": "string"
							},
							{
								"internalType": "enum RootCAs.RevocationReason",
								"name": "revocationReason",
								"type": "uint8"
							}
						],
						"internalType": "struct RootCAs.RootCA",
						"name": "rootCA",
						"type": "tuple"
					}
				],
				"internalType": "struct RootCAs.ProposalSimple",
				"name": "",
				"type": "tuple"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getEndorsers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getProposers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getRevocationProposals",
		"outputs": [
			{
				"components": [
					{
						"internalType": "enum RootCAs.State",
						"name": "proposedState",
						"type": "uint8"
					},
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "id",
								"type": "uint256"
							},
							{
								"internalType": "enum RootCAs.State",
								"name": "state",
								"type": "uint8"
							},
							{
								"internalType": "string",
								"name": "caCert",
								"type": "string"
							},
							{
								"internalType": "enum RootCAs.RevocationReason",
								"name": "revocationReason",
								"type": "uint8"
							}
						],
						"internalType": "struct RootCAs.RootCA",
						"name": "rootCA",
						"type": "tuple"
					}
				],
				"internalType": "struct RootCAs.ProposalSimple",
				"name": "",
				"type": "tuple"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getRootCAs",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "enum RootCAs.State",
						"name": "state",
						"type": "uint8"
					},
					{
						"internalType": "string",
						"name": "caCert",
						"type": "string"
					},
					{
						"internalType": "enum RootCAs.RevocationReason",
						"name": "revocationReason",
						"type": "uint8"
					}
				],
				"internalType": "struct RootCAs.RootCA[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "isEndorser",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "isProposer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "enum RootCAs.RevocationReason",
				"name": "_reason",
				"type": "uint8"
			}
		],
		"name": "proposeRevocation",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "_caCert",
				"type": "string"
			}
		],
		"name": "proposeRootCAAddition",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "removeEndorser",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "removeProposer",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
