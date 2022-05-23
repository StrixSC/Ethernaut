export const ethernaut_abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "player",
                type: "address",
            },
            {
                indexed: false,
                internalType: "contract Level",
                name: "level",
                type: "address",
            },
        ],
        name: "LevelCompletedLog",
        type: "event",
        signature:
            "0x9dfdf7e3e630f506a3dfe38cdbe34e196353364235df33e5a3b588488d9a1e78",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "player",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "instance",
                type: "address",
            },
        ],
        name: "LevelInstanceCreatedLog",
        type: "event",
        signature:
            "0x7bf7f1ed7f75e83b76de0ff139966989aff81cb85aac26469c18978d86aac1c2",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
        signature:
            "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0",
    },
    {
        inputs: [
            {
                internalType: "contract Level",
                name: "_level",
                type: "address",
            },
        ],
        name: "createLevelInstance",
        outputs: [],
        stateMutability: "payable",
        type: "function",
        payable: true,
        signature: "0xdfc86b17",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
        signature: "0x8da5cb5b",
    },
    {
        inputs: [
            {
                internalType: "contract Level",
                name: "_level",
                type: "address",
            },
        ],
        name: "registerLevel",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
        signature: "0x202023d4",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
        signature: "0x715018a6",
    },
    {
        inputs: [
            {
                internalType: "address payable",
                name: "_instance",
                type: "address",
            },
        ],
        name: "submitLevelInstance",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
        signature: "0xc882d7c2",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
        signature: "0xf2fde38b",
    },
];