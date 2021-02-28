const {Blockchain, Transaction} = require("./blockchain")
const EC = require('elliptic').ec
const ec = new EC('secp256k1')

const myKey = ec.keyFromPrivate('0ec9a551d3d3b500c46ed60fd79a03c40c8b31a5899e2dacab33bd3917e38adc')
const myWalletAddress = myKey.getPublic('hex')

const odicoin = new Blockchain()

const tx1 = new Transaction(myWalletAddress, 'Address', 10)
tx1.signTransaction(myKey)
odicoin.addTransaction(tx1)

console.log('\n starting miner...........')
odicoin.minePendingTransactions(myWalletAddress)

console.log('\n balance of odi-wall is ', odicoin.getBalanceOfAddress(myWalletAddress))

console.log()
console.log('Is this blockchain valid?', odicoin.isChainValid() ? 'Yes': 'No')